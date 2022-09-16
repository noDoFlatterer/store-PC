<template>
  <div>
    <div>
      <a-button @click="add(), showModal()" type="primary" danger>
        +增加商品
      </a-button>
      <a-button @click="deleteAll()" type="primary" danger>批量删除</a-button>
      <!-- 表单 -->
      <a-modal v-model:visible="visible" title="添加分类" @ok="onFinish">
        <a-form :model="formState" name="basic" autocomplete="off">
          <a-form-item
            label="分类名称"
            :name="['name']"
            :rules="[{ required: true, message: '不能为空!' }]"
          >
            <a-input v-model:value="formState.name" />
          </a-form-item>

          <a-form-item
            label="排序值"
            :name="['indexId']"
            :rules="[{ required: true, message: '不能为空!' }]"
          >
            <a-input v-model:value="formState.indexId" />
          </a-form-item>

          <!-- <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-form-item> -->
        </a-form>
      </a-modal>
    </div>

    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <!-- <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template> -->
        <template v-if="column.dataIndex === 'done'">
          <a-radio-group>
            <a-radio-button @click="change(record.key)" value="small">
              修改
            </a-radio-button>
            <a-radio-button @click="next(record.key)" value="small">
              下级分类
            </a-radio-button>
            <a-radio-button @click="deleteOne(record.key)" value="small">
              删除
            </a-radio-button>
          </a-radio-group>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
  import { nanoid } from 'nanoid'
  import { defineComponent, ref, reactive } from 'vue'
  import getNowtime from '@/utils/getNowtime'
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: '55% ',
    },
    {
      title: '排序值',
      dataIndex: 'indexId',
      width: '10% ',
    },
    {
      title: '添加时间',
      dataIndex: 'timer',
      width: '15% ',
    },
    {
      title: '操作',
      dataIndex: 'done',
      width: '20% ',
    },
  ]
  const data = reactive([
    {
      key: '1',
      name: '澎湖湾',
      indexId: 32,
      timer: '2022.09.05',
    },
    {
      key: '2',
      name: '外婆桥',
      indexId: 42,
      timer: '2022.09.05',
    },
    {
      key: '3',
      name: '大西瓜',
      indexId: 32,
      timer: '2022.09.05',
    },
    {
      key: '4',
      name: '郭德纲',
      indexId: 99,
      timer: '2022.09.05',
    },
  ])
  export default defineComponent({
    // components: {
    //   DownOutlined,
    // },

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

      // 新增
      const state = reactive({
        selectedRowKeys: [],
        loading: false,
      })
      const formState = {
        key: '',
        name: '',
        indexId: '',
        timer: '',
      }
      const onFinish = (values) => {
        console.log('Success:', values)
        // console.log(formState.key);
        formState.timer = getNowtime()
        // if (formState.key) {
        //   // formState.timer = getNowtime()

        //   console.log(formState);
        //   // const dataValue = data.filter(item => item.key === values)
        // }else{
        //   formState.key = nanoid()
        //   console.log(formState.key);
        //   // data.push({ ...formState })
        // }
        formState.key = nanoid()

        // 这里需要进行深拷贝
        data.push({ ...formState })
        setTimeout(() => {
          state.loading = false
          state.selectedRowKeys = []
        }, 1000)
        // console.log(data)
        visible.value = false
      }

      // 修改
      const change = (values) => {
        console.log(values)
        const dataValue = data.filter((item) => item.key === values)
        console.log('这里是修改111111', dataValue)

        formState.key = dataValue[0].key
        formState.name = dataValue[0].name
        formState.indexId = dataValue[0].indexId
        formState.timer = getNowtime()

        console.log('这里是修改', formState)
        visible.value = true

        // console.log('这里是修改22222', formState)
      }

      // 删除
      let deleteOne = (key) => {
        // data = data.filter(item => item.key !== key)
        console.log(key)
      }

      const add = () => {}
      const deleteAll = () => {}

      const visible = ref(false)
      const showModal = () => {
        visible.value = true
      }

      // 下级分类
      // const next=()=>{

      // }
      return {
        data,
        columns,
        rowSelection,
        deleteOne,
        add,
        deleteAll,
        visible,
        showModal,
        change,
        formState,
        onFinish,
      }
    },
  })
</script>
