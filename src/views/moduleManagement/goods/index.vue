<template>
  <div>
    <a-button @click="toAddUp()" type="primary" danger>+增加商品</a-button>
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'state'">
          <div v-if="record.state">
            <a>{{ '销售中' }}</a>
          </div>
          <div v-else>
            <a style="color: red">{{ '已下架' }}</a>
          </div>
        </template>
        <template v-if="column.dataIndex === 'done'">
          <a-radio-group>
            <a-radio-button
              v-if="record.state"
              @click="changeState(record.key)"
              value="small"
            >
              下架
            </a-radio-button>
            <a-radio-button
              v-else
              @click="changeState(record.key)"
              value="small"
            >
              上架
            </a-radio-button>
            <a-radio-button @click="toAdd(record)" value="small">
              修改
            </a-radio-button>
          </a-radio-group>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'
  const columns = [
    {
      title: '商品编号',
      dataIndex: 'id',
    },
    {
      title: '商品名',
      dataIndex: 'name',
    },
    {
      title: '商品简介',
      dataIndex: 'introduction',
    },
    {
      title: '商品图片',
      dataIndex: 'pic',
    },
    {
      title: '商品库存',
      dataIndex: 'inventory',
    },
    {
      title: '商品售价',
      dataIndex: 'price',
    },
    {
      title: '上架状态',
      dataIndex: 'state',
    },
    {
      title: '操作',
      dataIndex: 'done',
    },
  ]
  const data = ref([
    {
      key: '1',
      id: '123456',
      name: '哈哈哈',
      introduction: '贩卖快乐',
      pic: 32,
      inventory: '100',
      price: '10',
      state: true,
    },
    {
      key: '2',
      id: '123456',
      name: '哈哈哈',
      introduction: '贩卖快乐',
      pic: 32,
      inventory: '100',
      price: '10',
      state: false,
    },
  ])
  export default defineComponent({
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
      const changeState = (key) => {
        let date = data.value.filter((item) => item.key === key)
        date[0].state = !date[0].state
      }
      var router = useRouter()
      const toAdd = (record) => {
        router.push({
          name: 'add',
          query: {
            record,
          },
        })
      }
      const toAddUp = () => {
        router.push({
          name: 'add',
        })
      }
      return {
        data,
        columns,
        rowSelection,

        // fun
        changeState,
        toAdd,
        toAddUp,
      }
    },
  })
</script>
