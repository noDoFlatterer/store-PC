<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
        :disabled="!hasSelected"
        :loading="loading"
        @click="showModal"
      >
        批量删除
      </a-button>
      <!-- 确定是否删除 弹出框-->
      <a-modal v-model:visible="visible" @ok="handleOk">
        <p>确定要删除吗</p>
      </a-modal>
      <a-button type="primary" class="add" @click="add">添加</a-button>

      <!-- 添加的表单 -->
      <a-modal
        v-model:visible="formvisible"
        :footer="null"
        title="添加轮播图"
        @cancel="cancel"
      >
        <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="validateMessages"
          @finish="onFinish"
          ref="formRef"
        >
          <a-form-item
            :name="['user', 'goods_name']"
            label="商品名称"
            :rules="[{ required: true, validator: checkname }]"
          >
            <a-input v-model:value="formState.user.goods_name" />
          </a-form-item>

          <a-form-item
            :name="['user', 'goods_id']"
            label="商品编号"
            :rules="[{ required: true }]"
          >
            <a-input-number
              class="goodsid"
              v-model:value="formState.user.goods_id"
            />
          </a-form-item>
          <a-form-item
            :name="['user', 'sort_num']"
            label="排序值"
            :rules="[{ required: true, validator: checksort }]"
          >
            <a-input-number v-model:value="formState.user.sort_num" />
          </a-form-item>
          <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data.nowdata"
      :pagination="pagination"
      :row-key="(record) => record.goods_id"
      @change="changePage"
      style="word-break: break-all"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="primary" @click="change(record)">修改</a-button>

          <a-popconfirm
            title="确定是否删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="delOne(record)"
          >
            <a-button type="primary" danger class="del">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs, ref } from 'vue'
  import { getHot, addHot, changeHot, delHots } from '@/api/hot.js'
  import { message } from 'ant-design-vue'

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        }
      },
    },
    {
      title: '排序值',
      dataIndex: 'sort_num',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        }
      },
    },
    {
      title: '商品编号',
      dataIndex: 'goods_id',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        }
      },
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      customCell: () => {
        return {
          style: {
            'min-width': '100px',
          },
        }
      },
    },
  ]

  const data = reactive({
    nowdata: [],
  })

  export default defineComponent({
    setup() {
      const formRef = ref()
      const visible = ref(false)
      const formvisible = ref(false)
      const addorchange = ref(true)
      const state = reactive({
        selectedRowKeys: [],
        // Check here to configure the default column
        loading: false,
      })

      // 表单信息
      const formState = reactive({
        user: {
          goods_name: '',
          goods_id: '',
          sort_num: '',
          Kind: 0,
        },
      })
      // 分页
      const pagination = reactive({
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: false,
        defaultPageSize: 5,
        total: 10,
      })
      // 当前页面
      const nowPage = ref(1)
      // 改变页数
      const changePage = (page) => {
        nowPage.value = page.current
        update(page.current)
        console.log(page)
      }
      const showModal = () => {
        visible.value = true
      }
      // 删除一个
      const delone = (record) => {
        delHots([record.goods_id]).then((res) => {
          message.info(res.msg)
          state.loading = false
          state.selectedRowKeys = []
          // 解决最后一页删除完页面不会跳转问题
          if (
            pagination.total % 5 == 1 &&
            Math.floor(pagination.total / 5) == nowPage.value - 1
          ) {
            update(nowPage.value - 1)
          } else {
            update(nowPage.value)
          }
        })
      }
      // 用来批量删除
      const handleOk = () => {
        visible.value = false
        state.loading = true // ajax request after empty completing
        delHots(state.selectedRowKeys).then((res) => {
          message.info(res.msg)
          // 解决最后一页删除完页面不会跳转问题
          if (
            pagination.total % 5 == state.selectedRowKeys.length &&
            pagination.total / 5 == nowPage.value
          ) {
            update(nowPage.value - 2)
          } else {
            update(nowPage.value)
          }
          state.selectedRowKeys = []
        })
        setTimeout(() => {
          state.loading = false
          state.selectedRowKeys = []
        }, 1000)
      }
      // 添加
      const add = () => {
        formvisible.value = true
        addorchange.value = true
        // 清空表单
        formState.user = {}
      }

      const hasSelected = computed(() => state.selectedRowKeys.length > 0)
      const rowSelection = {
        onChange: (selectedRowKeys) => {
          state.selectedRowKeys = selectedRowKeys
        },
      }
      // 修改
      const change = (record) => {
        formvisible.value = true
        addorchange.value = false
        formState.user = {
          goods_name: record.goods_name,
          goods_id: record.goods_id,
          sort_num: record.sort_num,
          kind: 0,
        }
      }
      // 表单
      const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      }
      let checksort = async (_rule, value) => {
        if (value > 100) {
          return Promise.reject('输入的值不能大于100')
        } else if (value == null) {
          return Promise.reject('输入的值不能为空')
        } else if (value < 0) {
          return Promise.reject('输入的值不能小于零')
        } else {
          return Promise.resolve()
        }
      }

      let checkname = async (_rule, value) => {
        if (value.length > 10) {
          return Promise.reject('输入商品名称长度不能大于10')
        } else {
          return Promise.resolve()
        }
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
      const onFinish = () => {
        if (addorchange.value) {
          // 添加
          formvisible.value = false
          state.loading = true // ajax request after empty completing

          addHot(formState.user).then((res) => {
            message.info(res.msg)
            update(nowPage.value)
          })
          // formRef.value.resetFields
        } else {
          // 修改
          changeHot(formState.user).then((res) => {
            message.info(res.msg)

            update(nowPage.value)
          })
          formvisible.value = false

          state.loading = true // ajax request after empty completing
        }
        setTimeout(() => {
          state.loading = false
          state.selectedRowKeys = []
        }, 1000)
      }
      const cancel = () => {
        formRef.value.resetFields()
      }
      // 更新数据
      function update(page) {
        getHot({
          PageNum: page,
          PageSize: 5,
          Kind: 0,
        }).then((res) => {
          data.nowdata = res.data.HotGoods
          pagination.total = res.data.Number
          console.log(res)
        })
      }
      // 初始化数据
      update(1)
      return {
        data,
        columns,
        hasSelected,
        ...toRefs(state),
        // onSelectChange,
        visible,
        formvisible,
        showModal,
        handleOk,
        change,
        //表单
        formState,
        onFinish,
        layout,
        validateMessages,
        add,
        // 分页
        pagination,
        rowSelection,
        changePage,
        update,
        nowPage,
        formRef,
        cancel,
        delone,
        checksort,
        checkname,
      }
    },
  })
</script>
<style>
  img {
    height: 100px;
    width: 100px;
  }

  .del {
    margin-left: 10px;
  }
  .ant-btn {
    margin-left: 10px;
  }

  .goodsid {
    width: 150px;
  }
</style>
