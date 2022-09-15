<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { ref } from 'vue'
  import { getOrderDetail } from '@/api/order'
  import { ArrowLeftOutlined } from '@ant-design/icons-vue'
  const columns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'img',
    },
    {
      title: '商品编号',
      dataIndex: 'goods_id',
      key: 'id',
    },
    {
      title: '商品名',
      dataIndex: 'goods_name',
      key: 'name',
    },
    {
      title: '商品数量',
      dataIndex: 'goods_count',
      key: 'num',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
  ]
  // 获取id
  const route = useRoute()
  const router = useRouter()
  let order_id = route.query.order_id
  let status = route.query.status
  let created_at = route.query.created_at
  let order_data = ref([])
  getOrderDetail(Number(order_id)).then((res) => {
    order_data.value = res.data
  })
  function goback() {
    router.back()
  }
</script>

<template>
  <div style="padding: 20px">
    <div style="padding: 20px 0">
      <ArrowLeftOutlined @click="goback" style="fontSize:18px;border-" />
    </div>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="订单状态" :bordered="true" class="card_shadow">
          <p v-if="status == 0">待支付</p>
          <p v-else-if="status == 1">已支付</p>
          <p v-else-if="status == 2">配货完成</p>
          <p v-else-if="status == 3">出库完成</p>
          <p v-else-if="status == 4">交易成功</p>
          <p v-else-if="status == -1">手动关闭</p>
          <p v-else-if="status == -2">商家关闭</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="创建时间" :bordered="true" class="card_shadow">
          <p>{{ created_at }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="订单号" :bordered="true" class="card_shadow">
          <p>{{ order_id }}</p>
        </a-card>
      </a-col>
    </a-row>

    <div style="margin-top: 50px">
      <a-card title="订单状态" :bordered="true">
        <a-table :columns="columns" :data-source="order_data">
          <template #bodyCell="{ column }">
            <img
              v-if="column.dataIndex == 'image'"
              style="height: 100px"
              src="https://www.surely.cool/surely-vue-logo.png"
              alt=""
            />
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .card_shadow:hover {
    box-shadow: 0px 0px 16px 2px grey;
    transition: all 0.5s linear;
  }
</style>
