<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
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
          <a-form-item :name="['user', 'email']" label="图片">
            <a-upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item
            :name="['user', 'link']"
            label="跳转链接"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="formState.user.link" />
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
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { computed, defineComponent, reactive, toRefs, ref } from 'vue'
  import getNowtime from '@/utils/getNowtime'
  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  const columns = [
    {
      title: '轮播图',
      dataIndex: 'img',
      key: 'img',
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
      key: '1',
      action: '',
      addtime: 32,
      sort: 1,
      link: 'www.baidu.com',
      img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F23%2F20210623123213_08677.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664963048&t=512152f373d6bbb705c2db486a95d550https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F23%2F20210623123213_08677.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664963048&t=512152f373d6bbb705c2db486a95d550',
    },
    {
      key: '2',
      action: '',
      addtime: 42,
      sort: 2,
      link: 'www.baidu.com',
      img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F23%2F20210623123213_08677.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664963048&t=512152f373d6bbb705c2db486a95d550https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F23%2F20210623123213_08677.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664963048&t=512152f373d6bbb705c2db486a95d550',
    },
  ])

  export default defineComponent({
    components: {
      LoadingOutlined,
      PlusOutlined,
    },
    setup() {
      const visible = ref(false)
      const formvisible = ref(false)
      const addorchange = ref(true)
      const state = reactive({
        selectedRowKeys: [],
        // Check here to configure the default column
        loading: false,
      })
      // 表单信息
      const formState = reactive({
        user: {
          img: '',
          link: '',
          sort: 1,
          addtime: '',
        },
      })
      // 添加图片
      const fileList = ref([])
      const loading = ref(false)
      const imageUrl = ref('')
      const showModal = () => {
        visible.value = true
      }
      // 分页
      const pagination = reactive({
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 5,
      })
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
        addorchange.value = true
      }

      const hasSelected = computed(() => state.selectedRowKeys.length > 0)

      const onSelectChange = (selectedRowKeys) => {
        console.log('选中了', selectedRowKeys)

        state.selectedRowKeys = selectedRowKeys
      }
      // 修改
      const change = (record) => {
        formvisible.value = true
        addorchange.value = false
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
      // 提交表单
      const onFinish = (values) => {
        var time = getNowtime()
        console.log(values)
        if (addorchange.value) {
          console.log('Success:', values)
          formvisible.value = false
          state.loading = true // ajax request after empty completing
          formState.user.addtime = time
          // 这里需要进行深拷贝
        } else {
          formState.user = { ...values.user, addtime: time }
          data.push({ ...formState.user })

          formvisible.value = false
          state.loading = true // ajax request after empty completing
        }

        setTimeout(() => {
          state.loading = false
          state.selectedRowKeys = []
        }, 1000)
      }

      // 添加图片
      const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          loading.value = true
          return
        }

        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, (base64Url) => {
            imageUrl.value = base64Url
            loading.value = false
          })
        }

        if (info.file.status === 'error') {
          loading.value = false
          message.error('upload error')
        }
      }

      const beforeUpload = (file) => {
        const isJpgOrPng =
          file.type === 'image/jpeg' || file.type === 'image/png'

        if (!isJpgOrPng) {
          message.error('You can only upload JPG file!')
        }

        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isLt2M) {
          message.error('Image must smaller than 2MB!')
        }

        return isJpgOrPng && isLt2M
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
        //   图片
        fileList,
        loading,
        imageUrl,
        handleChange,
        beforeUpload,
        pagination,
        addorchange,
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
