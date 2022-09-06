<template>
  <div>
    <a-button type="primary" danger @click="Disable">
      <PlusOutlined />
      解除禁用
    </a-button>
    <a-button type="primary" style="margin-left: 10px" @click="DisableAccount">
      <DeleteOutlined />
      禁用账户
    </a-button>
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      style="margin-top: 10px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'cancellation'">
          <span v-if="record.cancellation" style="color: green">
            {{ record.cancellation ? '正常' : '失败' }}
          </span>
          <span v-else style="color: red">
            {{ record.cancellation ? '正常' : '失败' }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span v-if="record.cancellation" style="color: green">
            {{ record.cancellation ? '正常' : '失败' }}
          </span>
          <span v-else style="color: red">
            {{ record.cancellation ? '正常' : '失败' }}
          </span>
        </template>
      </template>
    </a-table>
    <a-pagination
      v-model:current="current"
      @change="changePage"
      :total="50"
      show-less-items
    />
  </div>
</template>
<script>
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import { defineComponent, ref } from 'vue'
  const columns = [
    {
      title: '昵称',
      dataIndex: 'nick_name',
    },
    {
      title: '登录名',
      dataIndex: 'login_name',
    },
    {
      title: '身份状态',
      dataIndex: 'status',
    },
    {
      title: '是否注销',
      dataIndex: 'cancellation',
    },
    {
      title: '注册时间',
      dataIndex: 'registration_time',
    },
  ]
  const data = [
    {
      key: '1',
      nick_name: 'John Brown',
      status: true,
      login_name: '15090313702',
      cancellation: true,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '2',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '3',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '4',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '5',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '6',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '7',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
    {
      key: '8',
      nick_name: 'John Brown',
      login_name: '15090313702',
      status: false,
      cancellation: false,
      registration_time: '2022-05-31 15:52:54',
    },
  ]
  export default defineComponent({
    components: {
      DeleteOutlined,
      PlusOutlined,
    },
    setup() {
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          )
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          // Column configuration not to be checked
          name: record.name,
        }),
      }
      // 当前页数
      let current = ref(0)
      /**
       * 页面改变
       */
      function changePage(page, pageSize) {
        console.log(page, pageSize)
      }
      /**
       * 解除禁用触发函数
       */
      function Disable() {
        console.log('Disable')
      }
      function DisableAccount() {
        console.log('DisableAccount')
      }
      return {
        data,
        columns,
        rowSelection,
        current,
        changePage,
        Disable,
        DisableAccount,
      }
    },
  })
</script>
