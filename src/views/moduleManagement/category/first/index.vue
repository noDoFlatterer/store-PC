<template>
  <div>
    <div>
      <a-button @click="showInput" type="primary">增加分类</a-button>

      <a-popconfirm
        title="你确定要删除这些分类吗?删除了可就找不回来了哦"
        ok-text="狠心删除"
        cancel-text="我再想想"
        @confirm="deleteAll()"
      >
        <a-button
          danger
          type="primary"
          :disabled="!hasSelected"
          :loading="loading"
          class="add"
        >
          批量删除
        </a-button>
      </a-popconfirm>

      <!-- 表单 -->
      <a-modal
        :footer="null"
        v-model:visible="formvisible"
        title="添加分类"
        @cancel="cancel"
      >
        <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="validateMessages"
          @finish="onFinish"
          ref="editUserFormRef"
        >
          <a-form-item
            label="分类名称"
            :name="['user', 'class_name']"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.class_name" />
          </a-form-item>

          <a-form-item
            label="排序值"
            :name="['user', 'sort_num']"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.sort_num" />
          </a-form-item>

          <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data.arr"
      :pagination="pagination"
      :row-key="(record) => record.Id"
      @change="changePag"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'done'">
          <div style="while-space: nowrap">
            <a-radio-group>
              <a-radio-button @click="change(record)" value="small">
                修改
              </a-radio-button>
              <a-radio-button @click="next(record)" value="small">
                下级分类
              </a-radio-button>
              <a-popconfirm
                title="你确定要删除吗?删除了可就找不回来了哦"
                ok-text="狠心删除"
                cancel-text="我再想想"
                @confirm="deleteOne(record)"
              >
                <a-button danger :size="size">删除</a-button>
              </a-popconfirm>
            </a-radio-group>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
  import { addData, find, deleteData, update } from '@/api/category'
  import { computed, defineComponent, ref, reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    setup() {
      const columns = [
        {
          title: '分类名称',
          dataIndex: 'ClassName',
          width: '25% ',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '排序值',
          dataIndex: 'SortNum',
          width: '15% ',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '添加时间',
          dataIndex: 'CreatedAt',
          width: '20% ',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'done',
          width: '40% ',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
      ]
      const data = reactive({
        arr: [],
      })
      // 页码
      let pages = reactive(1)
      // 请求函数
      // 请求数据
      const getData = (obj) => {
        find(obj).then((value) => {
          data.arr = value.data.Categories
          pagination.total = value.data.Number
        })
      }
      // 删除请求封装
      const deleteOther = (arr) => {
        deleteData(arr).then(() => {
          const firstObj1 = {
            Page: pages,
            PreName: '无',
            Size: 5,
            PreCategory: 0,
          }
          getData(firstObj1)
        })
      }

      const firstObj = {
        Page: 1,
        PreName: '无',
        Size: 5,
        PreCategory: 0,
      }
      getData(firstObj)

      const visible = ref(false)
      const formvisible = ref(false)
      const state = reactive({
        selectedRowKeys: [],
        loading: false,
      })
      // 表单信息
      const formState = {
        user: {
          class_name: '',
          sort_num: '',
        },
      }

      // 旧数据
      const oldData = {
        user: {
          class_name: '',
          sort_num: '',
        },
      }

      let addOrChange = ref(true) // 最好不要用 reactive，reactive里面尽量不写布尔值，会报警告
      // 呼出新增表单
      const showInput = () => {
        addOrChange.value = true
        formState.user.class_name = ''
        formState.user.sort_num = ''
        formvisible.value = true
      }

      // 修改
      const change = (record) => {
        addOrChange.value = false
        oldData.user.class_name = record.ClassName
        oldData.user.sort_num = record.SortNum
        formState.user.class_name = record.ClassName
        formState.user.sort_num = record.SortNum
        formvisible.value = true
      }

      // 表单
      const showModal = () => {
        visible.value = true
      }
      const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      }
      const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
      }
      const editUserFormRef = ref()
      const cancel = () => {
        editUserFormRef.value.resetFields()
      }

      // 完成提交
      const onFinish = (values) => {
        formvisible.value = false //收起来弹出框
        if (addOrChange.value) {
          // console.log('新增')
          const obj = {
            class_name: values.user.class_name,
            pre_name: '无',
            cur_category: 1,
            sort_num: Number(values.user.sort_num),
          }
          addData(obj).then(() => {
            // console.log('成功了', value)
            const firstObj1 = {
              Page: pages,
              PreName: '无',
              Size: 5,
              PreCategory: 0,
            }
            getData(firstObj1)
          })
        } else {
          // console.log('修改')
          const obj = {
            name: values.user.class_name,
            pre_name: oldData.user.class_name,
            cur_category: 1,
            sort_num: Number(values.user.sort_num),
          }
          update(obj).then(() => {
            // console.log('成功了', value)
            const firstObj1 = {
              Page: pages,
              PreName: '无',
              Size: 5,
              PreCategory: 0,
            }
            getData(firstObj1)
          })
        }
      }

      // 删除单个
      const deleteOne = (record) => {
        const arr = [record.Id]
        deleteOther(arr)
      }
      // 用来批量删除
      const deleteAll = () => {
        deleteOther(state.selectedRowKeys)
      }

      const hasSelected = computed(() => state.selectedRowKeys.length > 0)
      const rowSelection = {
        onChange: (selectedRowKeys) => {
          state.selectedRowKeys = selectedRowKeys
        },
      }

      // 分页
      const pagination = reactive({
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: false,
        defaultPageSize: 5,
        total: 20,
      })

      const changePag = (e) => {
        pages = e.current
        const obj = {
          Page: e.current,
          PreName: '无',
          Size: 5,
          PreCategory: 0,
        }
        find(obj, 5).then((value) => {
          data.arr = value.data.Categories
        })
      }

      // 路由跳转
      var router = useRouter()
      const next = (record) => {
        router.push({
          name: 'secondCategory',
          query: {
            name: record.ClassName,
          },
        })
      }

      return {
        data,
        columns,
        hasSelected,
        ...toRefs(state),
        visible,
        formvisible,
        showModal,
        change,
        // 表单
        layout,
        validateMessages,
        formState,
        onFinish,
        showInput,
        editUserFormRef,
        cancel,
        //  分页
        pagination,
        rowSelection,
        changePag,
        // 跳转
        next,
        // 删除
        deleteOne,
        deleteAll,
      }
    },
  })
</script>

<style>
  .add {
    margin-left: 5px;
  }
</style>
