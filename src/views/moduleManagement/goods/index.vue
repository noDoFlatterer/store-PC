<template>
  <div>
    <a-button @click="toAddUp()" type="primary" danger href="javascript:;">
      增加商品
    </a-button>
    <a-table
      href="javascript:;"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data.arr"
      :pagination="pagination"
      :row-key="(record) => record.ID"
      @change="changePag"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'image'">
          <img :src="record.image" class="image , pic" />
        </template>
        <template v-if="column.dataIndex === 'status'">
          <div v-if="record.status === 1">
            <span>{{ '销售中' }}</span>
          </div>
          <div v-else>
            <span style="color: red">{{ '已下架' }}</span>
          </div>
        </template>

        <template v-if="column.dataIndex === 'done'">
          <div style="while-space: nowrap">
            <a-radio-group href="javascript:;">
              <a-radio-button
                href="javascript:;"
                v-if="record.status === 1"
                @click="changeState(record.goods_id, record.status)"
                value="small"
              >
                下架
              </a-radio-button>
              <a-radio-button
                href="javascript:;"
                v-else
                @click="changeState(record.goods_id, record.status)"
                value="small"
              >
                上架
              </a-radio-button>
              <a-radio-button
                @click="toAdd(record)"
                value="small"
                href="javascript:;"
              >
                修改
              </a-radio-button>
            </a-radio-group>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
  import { alterStatus, firstPage, nextPage } from '@/api/goods'
  import { defineComponent, reactive, toRaw } from 'vue'
  import { useRouter } from 'vue-router'
  import store from '@/store'

  export default defineComponent({
    setup() {
      // 表单配置
      const rowSelection = {
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          name: record.name,
        }),
      }

      let pages = 0

      // 表单每行的表头
      const columns = [
        {
          title: '商品编号',
          dataIndex: 'goods_id',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '商品名',
          dataIndex: 'goods_name',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '商品简介',
          dataIndex: 'introduce',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '商品图片',
          dataIndex: 'image',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '商品库存',
          dataIndex: 'count',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '商品售价',
          dataIndex: 'price',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '上架状态',
          dataIndex: 'status',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'done',
          width: '20% ',
          customCell: () => {
            return {
              style: {
                'min-width': '150px',
                'max-width': '200px',
              },
            }
          },
          ellipsis: true,
        },
      ]
      // 动态数据
      const data = reactive({
        arr: [],
      })
      // 请求函数  (刷新页面就调用)
      const getData = () => {
        firstPage(5).then((value) => {
          data.arr = value.data.page
          pagination.total = value.data.numsOfAllData
        })
      }
      getData()

      const getNextPageData = (page) => {
        nextPage(page, 5).then((value) => {
          data.arr = value.data.page
        })
      }

      // 修改商品状态(上架下架)
      const changeState = (key, status) => {
        const goods_id = '' + key
        const obj = {
          goods_id: goods_id,
          status: status,
        }
        alterStatus(obj).then(() => {
          getNextPageData(pages)
        })
      }
      var router = useRouter()

      // 修改商品  (跳转带数据)
      const toAdd = (record) => {
        const obj = toRaw(record)
        store.commit('goods/changeUser', obj)
        router.push({
          name: 'add',
          query: {
            state: 0,
          },
        })
      }
      // 添加商品  (跳转不带数据)
      const toAddUp = () => {
        store.commit('goods/changeUser', '')
        router.push({
          name: 'add',
          query: {
            state: 1,
          },
        })
      }

      // 分页配置项
      const pagination = reactive({
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: false,
        defaultPageSize: 5,
        total: 0,
      })

      // 下一页调接口
      const changePag = (e) => {
        pages = e.current
        getNextPageData(pages)
      }

      return {
        columns,
        changePag,
        data,
        rowSelection,
        pagination,
        // fun
        changeState,
        toAdd,
        toAddUp,
      }
    },
  })
</script>

<style>
  .pic {
    widows: 100px;
    height: 100px;
  }
</style>
