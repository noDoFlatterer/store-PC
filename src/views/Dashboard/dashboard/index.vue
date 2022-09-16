<template>
  <div style="padding: 20px">
    <a-row :gutter="16" style="padding: 20px">
      <a-col :span="8">
        <a-card title="今日订单数" :bordered="false" class="da_card">
          <p>{{ option.series[3].data[6] }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="今日日活" :bordered="false" class="da_card">
          <p>{{ option.series[2].data[6] }}</p>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="转化率" :bordered="false" class="da_card">
          <p>{{ ConversionRate }}</p>
        </a-card>
      </a-col>
    </a-row>
    <div id="main" class="canvars"></div>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  import { getDashboard } from '@/api/dashboard.js'
  import { onMounted, reactive, computed } from '@vue/runtime-core'

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
            data: [],
          },
          {
            name: '付费用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
          {
            name: '订单数',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [],
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
            data: [],
          },
        ],
      })
      let ConversionRate = computed(() => {
        let Rate = Math.trunc(
          (option.series[1].data[6] / option.series[2].data[6]) * 100
        )
        if (!Rate) {
          return 0
        }
        return Rate
      })

      onMounted(() => {
        var chartDom = document.getElementById('main')
        var myChart = echarts.init(chartDom)
        getDashboard()
          .then(function (response) {
            option.series[0].data = response.data.registers
            option.series[1].data = response.data.pay_users
            option.series[2].data = response.data.login_user
            option.series[3].data = response.data.orders
            option.series[4].data = response.data.incomes
          })
          .catch(function (error) {
            console.log(error)
          })
          .then(function () {
            option && myChart.setOption(option)
          })
      })
      return {
        option,
        ConversionRate,
      }
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
