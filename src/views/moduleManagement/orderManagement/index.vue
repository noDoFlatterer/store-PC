<template>
  <div>
    <a-space direction="horizontal">
      <a-input-search
        v-model:value="input_value"
        placeholder="输入完整id"
        style="width: 200px"
        @search="onSearch"
      />
      <a-select
        ref="select"
        v-model:value="select_value"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option
          v-for="(item, index) in order_kind"
          :value="item.status"
          :key="index"
        >
          {{ item.meaning }}
        </a-select-option>
      </a-select>
      <a-button type="primary" danger @click="PareGoods">
        <BankOutlined />
        配货完成
      </a-button>
      <a-button type="primary" @click="outStore">
        <BankOutlined />
        出库
      </a-button>
      <a-button type="primary" danger @click="click_ok">
        <DeleteOutlined />
        关闭订单
      </a-button>
      <a-modal title="Title" v-model:visible="visible" @ok="handleOk">
        <p>你确定要都关闭吗</p>
      </a-modal>
    </a-space>

    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="orderData"
      :pagination="pagination"
      :row-key="(record) => record.order_id"
      @change="changePage"
      style="margin-top: 10px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <span v-if="record.status === 0">待支付</span>
          <span v-if="record.status === 1">已支付</span>
          <span v-if="record.status === 2">配货完成</span>
          <span v-if="record.status === 3">出库成功</span>
          <span v-if="record.status === 4">交易成功</span>
          <span v-if="record.status === -1">手动关闭</span>
          <span v-if="record.status === -2">商家关闭</span>
        </template>
        <template v-if="column.title === '操作'">
          <span style="color: blue; cursor: pointer; white-space: nowrap">
            <span v-if="record.status === 0">
              <a-popconfirm
                title="你确定关闭此订单吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="closeOrder(record)"
              >
                <a href="#" style="color: red">&nbsp;关闭订单&nbsp;</a>
              </a-popconfirm>
              <span @click="openDetail(record)">&nbsp;详情&nbsp;</span>
            </span>
            <span v-if="record.status === 1">
              <span @click="simPareGoods(record)">&nbsp;配货完成&nbsp;</span>
              <a-popconfirm
                title="你确定关闭此订单吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="closeOrder(record)"
              >
                <a href="#" style="color: red">&nbsp;关闭订单&nbsp;</a>
              </a-popconfirm>
              <span @click="openDetail(record)">&nbsp;详情&nbsp;</span>
            </span>
            <span v-if="record.status === 2">
              <span @click="simOutStore(record)">&nbsp;出库&nbsp;</span>
              <a-popconfirm
                title="你确定关闭此订单吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="closeOrder(record)"
              >
                <a href="#" style="color: red">&nbsp;关闭订单&nbsp;</a>
              </a-popconfirm>
              <span @click="openDetail(record)">&nbsp;详情&nbsp;</span>
            </span>
            <span v-if="record.status === 3">
              <a-popconfirm
                title="你确定关闭此订单吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="closeOrder(record)"
              >
                <a href="#">&nbsp;关闭订单&nbsp;</a>
              </a-popconfirm>
              <span @click="openDetail(record)">&nbsp;详情&nbsp;</span>
            </span>
            <span v-if="record.status === 4" @click="openDetail(record)">
              &nbsp;详情&nbsp;
            </span>
            <span v-if="record.status === -1" @click="openDetail(record)">
              &nbsp;详情&nbsp;
            </span>
            <span v-if="record.status === -2" @click="openDetail(record)">
              &nbsp;详情&nbsp;
            </span>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
  import { BankOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import { defineComponent, reactive, ref } from 'vue'
  import {
    getOrders,
    closeOrders,
    sendGoods,
    perPareGoods,
    getOrderKind,
    getKindOrder,
    getOrderById,
  } from '@/api/order'
  import { changeDate } from '@/utils/date'
  import { useRouter } from 'vue-router'
  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_id',
      ellipsis: true,
    },
    {
      title: '订单总价',
      dataIndex: 'total_money',
      ellipsis: true,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      ellipsis: true,
    },
    {
      title: '支付方式',
      dataIndex: 'pay_method',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      ellipsis: true,
    },
    {
      title: '操作',
    },
  ]
  export default defineComponent({
    components: {
      BankOutlined,
      DeleteOutlined,
    },
    setup() {
      // 获取订单数据
      let orderData = ref([])
      let page = 1
      // 是否开启类别筛选
      let openKind = false
      let status_kind = 5
      // 分页配置项
      const pagination = reactive({
        showLessItems: false,
        showQuickJumper: false,
        showSizeChanger: false,
        defaultPageSize: 5,
      })
      //类别
      let order_kind = ref([])
      /**
       * 刷新当前页
       */
      function updataPage() {
        if (!openKind) {
          getOrders({ page }).then((res) => {
            pagination.total = res.data.size
            res.data.order_data.map((item) => {
              if(item.pay_method==0){
                item.pay_method = "未支付"
              }else{
                item.pay_method = item.pay_method == 1 ? '微信支付' :"支付宝支付"
              }
              // item.created_at = changeDate(item.created_at)
            })
            orderData.value = res.data.order_data
          })
        } else {
          // 根据类别筛选
          getKindOrder(status_kind, page, 5).then((res) => {
            console.log(res)
          })
        }
      }
      function getLei() {
        getOrderKind().then((res) => {
          order_kind.value = res.data
        })
      }
      // 初始化数据，请求第一页
      updataPage()
      getLei() // 获取类别
      /**
       * 切换页数
       */
      function changePage(e) {
        page = e.current
        updataPage()
      }

      // 勾选订单
      let data_order = ref([])
      // 勾选处理
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          data_order.value = []
          data_order.value = [...selectedRows]
          // console.log(data_order.value)
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          // Column configuration not to be checked
          name: record.name,
        }),
      }

      /**
       * 关闭单个订单
       */
      function closeOrder(record) {
        let order_data = {
          order_id: record.order_id,
          status: record.status,
        }
        let arr = []
        arr.push(order_data)
        //  关闭订单
        closeOrders(arr).then((res) => {
          if (res.code == 1000) {
            updataPage()
          }
        })
      }

      /**
       * 关闭所勾选的订单
       */
      function Disable() {
        if (data_order.value.length > 0) {
          let tempArr = []
          let length = data_order.value.length
          for (let i = 0; i < length; i++) {
            let item = data_order.value[i]
            if (
              item.status == 1 ||
              item.status == 2 ||
              item.status == 3 ||
              item.status == 0
            ) {
              let temp = {
                order_id: item.order_id,
                status: item.status,
              }
              tempArr.push(temp)
            }
          }
          closeOrders(tempArr)
          updataPage()
        }
      }

      /**
       * 单个出库
       */
      function simOutStore(record) {
        let temp = {
          order_id: record.order_id,
          status: record.status,
        }
        sendGoods([temp]).then((res) => {
          console.log(res)
        })
        updataPage()
      }

      /**
       * 批量出库
       */
      function outStore() {
        if (data_order.value.length > 0) {
          let tempArr = []
          let length = data_order.value.length
          for (let i = 0; i < length; i++) {
            let item = data_order.value[i]
            if (item.status === 2) {
              let temp = {
                order_id: item.order_id,
                status: item.status,
              }
              tempArr.push(temp)
              updataPage()
            }
          }
          sendGoods(tempArr).then((res) => {
            console.log(res)
          })
        }
      }

      /**
       * 单个配货
       */
      function simPareGoods(record) {
        let temp = {
          order_id: record.order_id,
          status: record.status,
        }
        perPareGoods([temp]).then((res) => {
          console.log(res)
        })
        updataPage()
      }

      /**
       * 批量配货完成
       */
      function PareGoods() {
        if (data_order.value.length > 0) {
          let tempArr = []
          let length = data_order.value.length
          for (let i = 0; i < length; i++) {
            let item = data_order.value[i]
            if (item.status === 1) {
              let temp = {
                order_id: item.order_id,
                status: item.status,
              }
              tempArr.push(temp)
            }
          }
          perPareGoods(tempArr).then((res) => {
            if (res.code == 1000) {
              updataPage()
            }
          })
        }
      }

      let input_value = ref('')

      function onSearch(e) {
        getOrderById(e).then((res) => {
          if (res.code === 1000) {
            pagination.total = 1
            res.data.order_data.map((item) => {
              if(item.pay_method==0){
                item.pay_method = "未支付"
              }else{
                item.pay_method = item.pay_method == 1 ? '微信支付' :"支付宝支付"
              }
              // item.created_at = changeDate(item.created_at)
            })
            orderData.value = res.data.order_data
          }
        })
      }

      // 选择框的值
      let select_value = ref('全部')
      /**
       * 选择类别筛选数据
       */
      function handleChange(e) {
        if (e == 5) {
          status_kind = e
          openKind = false
          page = 1
          updataPage()
        } else {
          openKind = true
          page = 1
          status_kind = e
          getKindOrder(e, page, 5).then((res) => {
            if (res.code === 1000) {
              pagination.total = res.data.size
              res.data.order_data.map((item) => {
                if(item.pay_method==0){
                item.pay_method = "未支付"
              }else{
                item.pay_method = item.pay_method == 1 ? '微信支付' :"支付宝支付"
              }
                // item.created_at = changeDate(item.created_at)
              })
              orderData.value = res.data.order_data
            }
          })
        }
      }
      const router = useRouter()
      /**
       * 路由跳转到路由详情
       */
      function openDetail(record) {
        router.push({
          path: '/modulemanagement/ordermanagement/detail',
          query: {
            order_id: record.order_id,
            status: record.status,
            created_at: record.created_at,
          },
        })
      }
      let visible = ref(false)
      function click_ok() {
        visible.value = true
      }
      function handleOk() {
        Disable()
        visible.value = false
      }
      return {
        handleOk,
        click_ok,
        visible,
        openDetail,
        columns,
        rowSelection,
        Disable,
        outStore,
        onSearch,
        input_value,
        select_value,
        handleChange,
        orderData,
        closeOrder,
        pagination,
        changePage,
        simOutStore,
        simPareGoods,
        PareGoods,
        order_kind,
      }
    },
  })
</script>
