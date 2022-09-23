<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button type="primary" :disabled="!hasSelected" @click="showModal">
        批量删除
      </a-button>
      <a-modal v-model:visible="visible" @ok="handleOk">
        <p>确定要删除吗</p>
      </a-modal>
      <a-button type="primary" class="add" @click="add">添加</a-button>

      <!-- 添加的表单 -->
      <a-modal
        v-model:visible="formvisible"
        :footer="null"
        title="添加商品"
        @cancel="flushForm"
      >
        <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="{ required: '${label}不能为空' }"
          @finish="onFinish"
          ref="editUserFormRef"
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
            v-if="isWrite"
          >
            <a-input
              v-model:value="formState.user.goods_id"
              :disabled="isWrite"
            />
          </a-form-item>
          <a-form-item
            :name="['user', 'goods_id']"
            label="商品编号"
            :rules="[{ required: true }]"
            v-else-if="!isWrite"
          >
            <a-input
              v-model:value="formState.user.goods_id"
              :disabled="isWrite"
            />
          </a-form-item>
          <a-form-item
            :name="['user', 'sort_num']"
            label="排序值"
            :rules="[{ required: true, validator: checksort }]"
          >
            <a-input v-model:value="formState.user.sort_num" />
          </a-form-item>
          <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <a-table
      :row-selection="{
        //列表项是否可选择
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange, //选中项发生变化时的回调
      }"
      :columns="columns"
      :data-source="data.arr"
      :pagination="pagination"
      :rowKey="(record) => record.goods_id"
      @change="changePage"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <div style="white-space: nowrap">
            <a-button type="primary" @click="change(record)">修改</a-button>
            <a-popconfirm
              title="确定是否删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="delOne(record)"
            >
              <a-button type="primary" danger class="del">删除</a-button>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {
    computed,
    defineComponent,
    reactive,
    toRefs,
    ref,
    onMounted,
  } from 'vue'
  import getNowtime from '@/utils/getNowtime'
  import {
    findNewGoods,
    addNewGoods,
    delNewGoods,
    updateNewGoods,
  } from '@/api/new.js'
  import { message } from 'ant-design-vue'
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      ellipsis: true,
    },
    {
      title: '排序值',
      dataIndex: 'sort_num',
      ellipsis: true,
    },
    {
      title: '商品编号',
      dataIndex: 'goods_id',
      ellipsis: true,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
    },
  ]

  export default defineComponent({
    setup() {
      //控制是否删除弹窗
      const visible = ref(false)

      let data = reactive({
        arr: [],
      })
      //控制添加弹窗
      const formvisible = ref(false)
      const isWrite = ref(true)
      const state = reactive({
        selectedRowKeys: [],
        selectedRowKey: [],
      })
      // 当前页面
      const nowPage = ref(1)
      // 表单信息
      const formState = reactive({
        user: {
          goods_id: '',
          goods_name: '',
          sort_num: '',
          created_at: '',
        },
      })
      // 分页
      const pagination = reactive({
        showLessItems: true,
        defaultPageSize: 5,
        total: 0,
      })
      let rule = [{ required: true, message: '不能为空!', trigger: 'change' }]

      //输入框校验
      let checksort = async (_rule, value) => {
        if (value > 10000) {
          return Promise.reject('输入的值不能大于10000')
        } else if (value == null) {
          return Promise.reject('输入的值不能为空')
        } else if (value <= 0) {
          return Promise.reject('输入的值不能小于等于零')
        } else if (value % 1 != 0) {
          return Promise.reject('输入的值只能为整数！')
        } else {
          return Promise.resolve()
        }
      }

      let checkname = async (_rule, value) => {
        if (value == null) {
          return Promise.reject('输入的值不能为空')
        } else if (value.length > 10) {
          return Promise.reject('输入商品名称长度不能大于10')
        } else {
          return Promise.resolve()
        }
      }
      //分页查询
      const changePage = (e) => {
        nowPage.value = e.current
        findNewGoods({ page: e.current, size: e.pageSize }).then(function (
          res
        ) {
          data.arr = res.data.kind_goods
        })
      }

      //展示受否删除框
      const showModal = () => {
        visible.value = true
      }
      // 用来删除
      const delOne = (record) => {
        let goods_id = record.goods_id
        state.selectedRowKey = [goods_id]
        delNewGoods({ goods_ids: state.selectedRowKey }).then(function () {
          message.info('删除成功')
          currentPage()
        })
        setTimeout(() => {
          state.selectedRowKey = []
        }, 1000)
      }
      // 用来批量删除
      const handleOk = () => {
        visible.value = false
        if (state.selectedRowKeys.length !== 0) {
          delNewGoods({ goods_ids: state.selectedRowKeys }).then(function () {
            message.info('删除成功')
            currentPage()
          })
        }
        setTimeout(() => {
          state.selectedRowKeys = []
        }, 1000)
      }

      //封装判断页数逻辑
      const currentPage = () => {
        if (nowPage.value == 1) {
          update()
        } else if (
          pagination.total % 5 == 1 &&
          Math.floor(pagination.total / 5) == nowPage.value - 1
        ) {
          updateOther(nowPage.value - 1)
        } else {
          updateOther(nowPage.value)
        }
      }
      // 添加推荐商品
      const add = () => {
        formvisible.value = true
        isWrite.value = false
        formState.user = {}
      }

      //控制批量删除是否可使用
      const hasSelected = computed(() => state.selectedRowKeys.length > 0)

      //选中删除的元素
      const onSelectChange = (selectedRowKeys) => {
        state.selectedRowKeys = selectedRowKeys
      }
      // 修改
      const change = (record) => {
        formvisible.value = true
        isWrite.value = true
        formState.user = { ...record }
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

      //退出表单时刷新
      const editUserFormRef = ref()
      const flushForm = () => {
        editUserFormRef.value.resetFields()
      }

      // 完成提交
      const onFinish = (values) => {
        formvisible.value = false
        formState.user.created_at = getNowtime()

        if (isWrite.value === false) {
          addNewGoods({
            goods_name: values.user.goods_name,
            goods_id: Number(values.user.goods_id),
            sort_num: Number(values.user.sort_num),
          }).then(function () {
            message.info('新增成功')
            if (nowPage.value == 1) {
              update()
            } else {
              updateOther(nowPage.value)
            }
          })
        } else {
          updateNewGoods({
            goods_name: values.user.goods_name,
            goods_id: Number(formState.user.goods_id),
            sort_num: Number(values.user.sort_num),
          }).then(function () {
            message.info('修改成功')
            if (nowPage.value == 1) {
              update()
            } else {
              updateOther(nowPage.value)
            }
          })
        }
        setTimeout(() => {
          state.selectedRowKeys = []
          formState.user = {}
        }, 1000)
      }

      //更新第一页数据
      const update = () => {
        findNewGoods({ page: 1, size: 5 }).then(function (res) {
          data.arr = res.data.kind_goods
          pagination.total = res.data.size
        })
      }
      //更新对应页数据
      function updateOther(current) {
        findNewGoods({ page: current, size: 5 }).then(function (res) {
          data.arr = res.data.kind_goods
          pagination.total = res.data.size
        })
      }
      onMounted(() => {
        update()
      })
      return {
        data,
        columns,
        hasSelected,
        ...toRefs(state),
        onSelectChange,
        visible,
        formvisible,
        isWrite,
        showModal,
        handleOk,
        change,
        formState,
        onFinish,
        layout,
        add,
        pagination,
        changePage,
        editUserFormRef,
        flushForm,
        rule,
        nowPage,
        delOne,
        checksort,
        checkname,
      }
    },
  })
</script>
<style>
  .del {
    margin-left: 10px;
  }

  .add {
    margin-left: 10px;
  }
</style>
