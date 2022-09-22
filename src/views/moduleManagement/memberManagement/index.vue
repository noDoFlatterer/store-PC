<script setup>
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import { reactive, ref } from 'vue'
  import { getUsers, updatestatus1, updatestatus0 } from '@/api/vip'
  import { changeDate } from '@/utils/date.js'
  const columns = [
    {
      title: '昵称',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
    },
    {
      title: '登录名',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true,
    },
    {
      title: '身份状态',
      dataIndex: 'idstatus',
      key: 'idstatus',
      ellipsis: true,
    },
    {
      title: '是否注销',
      dataIndex: 'iscancel',
      key: 'iscancel',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
    },
  ]
  let visible = ref(false)
  let page = 1
  // 分页配置项
  const pagination = reactive({
    showLessItems: false,
    showQuickJumper: false,
    showSizeChanger: false,
    // defaultPageSize: 5,
  })
  let check_vip_data = ref([])
  let selectedRowKeys = ref([])
  function onSelectChange(RowKeys, Rows) {
    selectedRowKeys.value = RowKeys
    check_vip_data.value = Rows
  }
  let vip_data = ref([])
  // 请求初始数据
  function updatePage() {
    getUsers(page).then((res) => {
      pagination.total = Number(res.data.count)
      res.data.users.map((item) => {
        item.createdAt = changeDate(item.createdAt)
      })
      vip_data.value = res.data.users
    })
  }

  // 初始化操作
  updatePage()
  /**
   * 页面改变
   */
  function changePage({ current }) {
    page = current
    updatePage()
  }
  /**
   * 解除禁用触发函数
   */
  function Disable() {
    //处理参数
    let arr_id = []
    check_vip_data.value.map((item) => {
      if (item.idstatus == 1) {
        arr_id.push(item.id)
      }
    })
    updatestatus0(arr_id).then((res) => {
      if (res) {
        selectedRowKeys.value = []
        check_vip_data.value = []
        updatePage()
      }
    })
  }
  function DisableAccount() {
    //处理参数
    let arr_id = []
    check_vip_data.value.map((item) => {
      if (item.idstatus == 0) {
        arr_id.push(item.id)
      }
    })
    updatestatus1(arr_id).then((res) => {
      if (res) {
        selectedRowKeys.value = []
        check_vip_data.value = []
        updatePage()
      }
    })
    visible.value = false
  }

  function click_ok() {
    visible.value = true
  }
</script>

<template>
  <div>
    <a-button type="primary" danger @click="Disable">
      <PlusOutlined />
      解除禁用
    </a-button>
    <a-button type="primary" style="margin-left: 10px" @click="click_ok">
      <DeleteOutlined />
      禁用账户
    </a-button>
    <a-modal title="Title" v-model:visible="visible" @ok="DisableAccount">
      <p>你确定要都关闭吗</p>
    </a-modal>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="vip_data"
      :pagination="pagination"
      :row-key="(record) => record.id"
      @change="changePage"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'idstatus'">
          <p v-if="record.idstatus == 0" style="color: green">正常</p>
          <p v-else style="color: red">禁用</p>
        </template>
        <template v-if="column.dataIndex == 'iscancel'">
          <p v-if="record.iscancel == 0" style="color: green">正常</p>
          <p v-else style="color: red">正常</p>
        </template>
      </template>
    </a-table>
  </div>
</template>
