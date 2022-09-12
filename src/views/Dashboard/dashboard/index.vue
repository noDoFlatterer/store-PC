<template>
  <div style="padding: 20px">
    <a-row :gutter="16" style="padding: 20px">
      <a-col :span="8">
        <a-card title="今日订单数" :bordered="false" class="da_card">
          <p>card content</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="今日日活" :bordered="false" class="da_card">
          <p>card content</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="转化率" :bordered="false" class="da_card">
          <p>card content</p>
        </a-card>
      </a-col>
    </a-row>
    <div id="main" class="canvars"></div>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  // import axios from 'axios'
  import { getDashboard } from '@/api/dashboard.js'
  import { onMounted, reactive } from '@vue/runtime-core'

  export default {
    setup() {
      let option = reactive({
        title: {
          text: '系统折线图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['新增注册', '付费用户', '活跃用户', '订单数', '当月总收入'],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '2021-03-11',
              '2021-03-12',
              '2021-03-13',
              '2021-03-14',
              '2021-03-15',
              '2021-03-16',
              '2021-03-17',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '新增注册',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '付费用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: '订单数',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: '当月总收入',
            type: 'line',
            stack: 'Total',
            label: {
              show: true,
              position: 'top',
            },
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      })

      onMounted(() => {
        var chartDom = document.getElementById('main')
        var myChart = echarts.init(chartDom)
        option && myChart.setOption(option)
        getDashboard()
          .then(function (response) {
            // 处理成功情况
            console.log(response)
          })
          .catch(function (error) {
            // 处理错误情况
            console.log(error)
          })
          .then(function () {
            // 总是会执行
          })
      })
    },
  }
</script>

<style>
  .canvars {
    width: 100%;
    height: 400px;
  }

  .da_card {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
</style>
