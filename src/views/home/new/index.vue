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
            :rules="[{ required: true }]"
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
            :rules="[{ required: true }]"
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
        <template v-if="column.dataIndex === 'created_at'">
          <a>
            {{ record.created_at }}
          </a>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="primary" @click="change(record)">修改</a-button>
          <a-button type="primary" danger class="del" @click="showModal">
            删除
          </a-button>
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
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goods_name',
    },
    {
      title: '排序值',
      dataIndex: 'sort_num',
    },
    {
      title: '商品编号',
      dataIndex: 'goods_id',
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
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
      })
      // 表单信息
      const formState = {
        user: {
          goods_id: '',
          goods_name: '',
          sort_num: '',
          created_at: '',
        },
        cobyUser: {
          goods_id: '',
          goods_name: '',
          sort_num: '',
          created_at: '',
        },
      }
      // 分页
      const pagination = reactive({
        showLessItems: true,
        defaultPageSize: 5,
        total: 0,
      })
      //分页查询
      const changePage = (e) => {
        findNewGoods({ page: e.current, size: e.pageSize })
          .then(function (res) {
            data.arr = res.data.kind_goods
          })
          .catch(function (error) {
            console.log(error)
          })
          .then(function () {})
      }

      //展示受否删除框
      const showModal = () => {
        visible.value = true
      }
      // 用来批量删除
      const handleOk = () => {
        visible.value = false
        delNewGoods({ goods_ids: state.selectedRowKeys })
          .then(function (res) {
            console.log(res)
          })
          .catch(function (error) {
            console.log(error)
          })
          .then(function () {
            finddata()
          })
        console.log(state.selectedRowKeys)
        setTimeout(() => {
          state.selectedRowKeys = []
        }, 1000)
      }
      // 添加推荐商品
      const add = () => {
        formvisible.value = true
        isWrite.value = false
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
        formState.cobyUser = record
        isWrite.value = true
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
        //拷贝值
        let nowData = { ...formState.cobyUser }
        if (isWrite.value === false) {
          addNewGoods({
            goods_name: values.user.goods_name,
            goods_id: Number(values.user.goods_id),
            sort_num: Number(values.user.sort_num),
          })
            .then(function (res) {
              console.log(res)
            })
            .catch(function (error) {
              console.log(error)
            })
            .then(function () {
              finddata()
            })
        } else {
          updateNewGoods({
            goods_name: values.user.goods_name,
            goods_id: Number(nowData.goods_id),
            sort_num: Number(values.user.sort_num),
          })
            .then(function (res) {
              console.log(res)
            })
            .catch(function (error) {
              console.log(error)
            })
            .then(function () {
              finddata()
            })
        }
        setTimeout(() => {
          state.selectedRowKeys = []
          formState.user = {}
        }, 1000)
      }

      //请求数据方法
      const finddata = () => {
        findNewGoods({ page: 1, size: pagination.defaultPageSize })
          .then(function (res) {
            data.arr = res.data.kind_goods
            pagination.total = res.data.size
            console.log(res)
          })
          .catch(function (error) {
            console.log(error)
          })
          .then(function () {})
      }
      onMounted(() => {
        finddata()
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
