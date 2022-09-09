<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
        danger
        :disabled="!hasSelected"
        :loading="loading"
        @click="showModal"
      >
        批量删除
      </a-button>
      <!-- 确定是否删除 弹出框-->
      <a-modal v-model:visible="visible" @ok="handleOk">
        <p>确定要删除吗</p>
      </a-modal>
      <a-button type="primary" class="add" @click="add">添加</a-button>

      <!-- 添加的表单 -->
      <a-modal v-model:visible="formvisible" :footer="null" title="添加轮播图">
        <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="validateMessages"
          @finish="onFinish"
        >
          <a-form-item
            :name="['user', 'goodsname']"
            label="商品名称"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.goodsname" />
          </a-form-item>

          <a-form-item
            :name="['user', 'link']"
            label="跳转链接"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.link" />
          </a-form-item>

          <a-form-item
            :name="['user', 'goodsnumber']"
            label="商品编号"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.goodsnumber" />
          </a-form-item>

          <a-form-item
            :name="['user', 'sort']"
            label="排序值"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.sort" />
          </a-form-item>

          <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'img'">
          <img :src="record.img" alt="" srcset="" />
        </template>
        <template v-else-if="column.key === 'link'">
          <a>
            {{ record.link }}
          </a>
        </template>
        <template v-else-if="column.key === 'addtime'">
          <a>
            {{ record.addtime }}
          </a>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="primary" @click="change(record)">修改</a-button>
          <a-button type="primary" danger class="del">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs, ref } from 'vue'
  import getNowtime from '@/utils/getNowtime'
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goodsname',
      key: 'goodsname',
    },
    {
      title: '跳转连接',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: '排序值',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '商品编号',
      dataIndex: 'goodsnumber',
      key: 'goodsnumber',
    },
    {
      title: '添加时间',
      dataIndex: 'addtime',
      key: 'addtime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
  ]

  const data = reactive([
    {
      goodsnumber: 12345,
      key: '1',
      action: '',
      addtime: 32,
      sort: 1,
      link: 'www.baidu.com',
      goodsname: '大别墅',
    },
    {
      goodsnumber: 12345,
      key: '1',
      action: '',
      addtime: 32,
      sort: 1,
      link: 'www.baidu.com',
      goodsname: '大别墅',
    },
    {
      goodsnumber: 12345,
      key: '1',
      action: '',
      addtime: 32,
      sort: 1,
      link: 'www.baidu.com',
      goodsname: '大别墅',
    },
  ])

  export default defineComponent({
    setup() {
      const visible = ref(false)
      const formvisible = ref(false)
      const state = reactive({
        selectedRowKeys: [],
        // Check here to configure the default column
        loading: false,
      })
      // 表单信息
      const formState = {
        user: {
          goodsnumber: '',
          goodsname: '',
          link: '',
          sort: 1,
          addtime: '',
        },
      }
      // 分页
      const pagination = reactive({
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 5,
      })
      const showModal = () => {
        visible.value = true
      }
      // 用来批量删除
      const handleOk = (e) => {
        console.log(e)
        visible.value = false
        state.loading = true // ajax request after empty completing

        setTimeout(() => {
          state.loading = false
          state.selectedRowKeys = []
        }, 1000)
      }
      // 添加
      const add = () => {
        formvisible.value = true
      }

      const hasSelected = computed(() => state.selectedRowKeys.length > 0)

      const onSelectChange = (selectedRowKeys) => {
        console.log('选中了', selectedRowKeys)

        state.selectedRowKeys = selectedRowKeys
      }
      // 修改
      const change = (record) => {
        formvisible.value = true
        console.log(record)
        formState.user = record
        console.log(formState.user)
      }

      // 表单
      const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      }
      const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
      }

      // 完成提交
      const onFinish = (values) => {
        console.log('Success:', values)
        formvisible.value = false
        state.loading = true // ajax request after empty completing
        formState.user.addtime = getNowtime()
        // 这里需要进行深拷贝
        data.push({ ...formState.user })
        setTimeout(() => {
          state.loading = false
          state.selectedRowKeys = []
        }, 1000)
      }
      return {
        data,
        columns,
        hasSelected,
        ...toRefs(state),
        // func

        onSelectChange,
        visible,
        formvisible,
        showModal,
        handleOk,
        change,
        //表单
        formState,
        onFinish,
        layout,
        validateMessages,
        add,
        //  分页
        pagination,
      }
    },
  })
</script>
<style>
  img {
    height: 100px;
    width: 100px;
  }
  .del {
    margin-left: 10px;
  }
  .add {
    margin-left: 10px;
  }
</style>
