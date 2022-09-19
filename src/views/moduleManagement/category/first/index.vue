<template>
  <div>
    <div>
      <a-button @click="showInput()" type="primary" href="javascript:;">
        增加商品
      </a-button>
      <a-button
        danger
        type="primary"
        :disabled="!hasSelected"
        :loading="loading"
        @click="deleteAll"
        class="add"
        href="javascript:;"
      >
        批量删除
      </a-button>
      <!-- 表单 -->
      <a-modal
        href="javascript:;"
        v-model:visible="formvisible"
        title="添加分类"
        class="add"
      >
        <a-form
          href="javascript:;"
          :model="formState"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="validateMessages"
          @finish="onFinish"
        >
          <a-form-item
            href="javascript:;"
            label="分类名称"
            :name="['user', 'class_name']"
            :rules="[{ required: true }]"
          >
            <a-input
              href="javascript:;"
              v-model:value="formState.user.class_name"
            />
          </a-form-item>

          <a-form-item
            href="javascript:;"
            label="排序值"
            :name="['user', 'sort_num']"
            :rules="[{ required: true }]"
          >
            <a-input
              href="javascript:;"
              v-model:value="formState.user.sort_num"
            />
          </a-form-item>

          <a-form-item
            href="javascript:;"
            :wrapper-col="{ offset: 8, span: 16 }"
          >
            <a-button type="primary" html-type="submit" href="javascript:;">
              提交
            </a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <a-table
      href="javascript:;"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data.arr"
      :pagination="pagination"
      :row-key="(record) => record.Id"
      @change="changePag"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'done'">
          <a-radio-group href="javascript:;">
            <a-radio-button
              @click="change(record)"
              value="small"
              href="javascript:;"
            >
              修改
            </a-radio-button>
            <a-radio-button
              @click="next(record)"
              value="small"
              href="javascript:;"
            >
              下级分类
            </a-radio-button>
            <a-radio-button
              @click="deleteOne(record)"
              value="small"
              href="javascript:;"
            >
              删除
            </a-radio-button>
          </a-radio-group>
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
          getData(firstObj)
        })
      }

      const firstObj = {
        Page: 1,
        PreName: '无',
        Size: 5,
        PreCategory: 0,
      }
      getData(firstObj)

      const columns = [
        {
          title: '分类名称',
          dataIndex: 'ClassName',
          width: '49% ',
        },
        {
          title: '排序值',
          dataIndex: 'SortNum',
          width: '15% ',
        },
        {
          title: '添加时间',
          dataIndex: 'CreatedAt',
          width: '15% ',
        },
        {
          title: '操作',
          dataIndex: 'done',
          width: '21% ',
        },
      ]
      const data = reactive({
        arr: [],
      })

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
        addOrChange = true
        formState.user.class_name = ''
        formState.user.sort_num = ''
        formvisible.value = true
      }

      // 修改
      const change = (record) => {
        addOrChange = false
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

      // 完成提交
      const onFinish = (values) => {
        formvisible.value = false //收起来弹出框
        if (addOrChange.value) {
          const obj = {
            class_name: values.user.class_name,
            pre_name: '无',
            cur_category: 1,
            sort_num: Number(values.user.sort_num),
          }
          addData(obj).then(() => {
            getData(firstObj)
          })
        } else {
          const obj = {
            name: values.user.class_name,
            pre_name: oldData.user.class_name,
            cur_category: 1,
            sort_num: Number(values.user.sort_num),
          }
          update(obj).then(() => {
            getData(firstObj)
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
        showSizeChanger: true,
        defaultPageSize: 5,
        total: 20,
      })
      const changePag = (e) => {
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
    margin-left: 10px;
  }
</style>
