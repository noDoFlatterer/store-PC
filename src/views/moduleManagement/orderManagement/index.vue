<template>
  <div>
    <a-space direction="horizontal">
      <a-input-search
        v-model:value="input_value"
        placeholder="input search text"
        style="width: 200px"
        @search="onSearch"
      />
      <a-select
        ref="select"
        v-model:value="select_value"
        style="width: 120px"
        @focus="focus"
        @change="handleChange"
      >
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
        <a-select-option value="disabled" disabled>Disabled</a-select-option>
        <a-select-option value="Yiminghe">yiminghe</a-select-option>
      </a-select>
      <a-button type="primary" danger @click="Disable">
        <BankOutlined />
        配货完成
      </a-button>
      <a-button type="primary" @click="DisableAccount">
        <BankOutlined />
        出库
      </a-button>
      <a-button type="primary" danger @click="Disable">
        <DeleteOutlined />
        关闭订单
      </a-button>
    </a-space>

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
  import { BankOutlined, DeleteOutlined } from '@ant-design/icons-vue'
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
      BankOutlined,
      DeleteOutlined,
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
      let input_value = ref('')
      function onSearch() {
        console.log('asd')
      }
      // 选择框的值
      let select_value = ref('全部')
      function handleChange() {
        console.log('asda')
      }
      return {
        data,
        columns,
        rowSelection,
        current,
        changePage,
        Disable,
        DisableAccount,
        onSearch,
        input_value,
        select_value,
        handleChange,
      }
    },
  })
</script>
