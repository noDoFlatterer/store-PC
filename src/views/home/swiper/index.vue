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
          <a-form-item
            :name="['fileList']"
            label="图片"
            :rules="[{ required: true, message: '图片不能为空!' }]"
          >
            <a-upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :customRequest="customRequest"
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
            :name="['user', 'sort_num']"
            label="排序值"
            :rules="[
              { required: true, message: '排序值不能为空!', trigger: 'change' },
            ]"
          >
            <a-input-number v-model:value="formState.user.sort_num" />
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
      :data-source="tableData.data"
      :pagination="pagination"
      :row-key="(record) => record.id"
      @change="changePage"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'img'">
          <img :src="record.image" alt="" srcset="" />
        </template>
        <template v-else-if="column.key === 'addtime'">
          <a>
            {{ record.addtime }}
          </a>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="primary" @click="change(record)">修改</a-button>
          <a-button type="primary" danger class="del" @click="delOne(record)">
            删除
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { computed, defineComponent, reactive, toRefs, ref } from 'vue'
  import {
    getFirstPage,
    upPhotos,
    updateSwiper,
    delPhotos,
    addSwiper,
    getPages,
  } from '@/api/swiper.js'
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
      title: '排序值',
      dataIndex: 'sort_num',
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
  ]
  let tableData = reactive({
    data: [],
  })
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
          image: '',
          sort_num: 1,
          created_at: '',
        },
        fileList: {},
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
        showSizeChanger: false,
        defaultPageSize: 5,
        total: 10,
      })
      // 当前页面
      const nowPage = ref(1)
      // 切换页面
      const changePage = (page) => {
        console.log(page)
        nowPage.value = page.current
        if (page.current == 1) {
          update()
        } else {
          updateOther(page.pageSize, page.current)
        }
      }
      // 用来批量删除
      const handleOk = () => {
        visible.value = false
        state.loading = true
        delPhotos([...state.selectedRowKeys]).then((res) => {
          message.info(res.data)
          state.loading = false
          state.selectedRowKeys = []
          if (nowPage.value == 1) {
            update()
            // 解决最后一页删除完页面不会跳转问题
          } else if (
            pagination.total % 5 == state.selectedRowKeys.length &&
            pagination.total / 5 == nowPage.value
          ) {
            updateOther(5, nowPage.value - 1)
          } else {
            updateOther(5, nowPage.value)
          }
        })
      }
      // 删除一个
      const delOne = (record) => {
        console.log(record.id)
        delPhotos([record.id]).then((res) => {
          message.info(res.data)
          if (nowPage.value == 1) {
            update()
          } else if (
            pagination.total % 5 == 1 &&
            Math.floor(pagination.total / 5) == nowPage.value - 1
          ) {
            updateOther(5, nowPage.value - 1)
          } else {
            updateOther(5, nowPage.value)
          }
        })
      }
      // 添加
      const add = () => {
        formvisible.value = true
        addorchange.value = true
        // 清空表单
        formState.user = {}
        imageUrl.value = ''
      }
      // 判断选中
      const hasSelected = computed(() => state.selectedRowKeys.length > 0)
      const onSelectChange = (selectedRowKeys) => {
        state.selectedRowKeys = selectedRowKeys
      }
      // 修改按钮
      const change = (record) => {
        formvisible.value = true
        addorchange.value = false
        formState.user = record
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
      const onFinish = () => {
        if (addorchange.value) {
          // 添加
          formvisible.value = false
          state.loading = true // ajax request after empty completing
          // 这里需要进行深拷贝
          const test = {
            image: formState.user.image,
            sort_number: formState.user.sort_num,
          }
          addSwiper(test).then((res) => {
            message.info(res.data)
            if (nowPage.value == 1) {
              update()
            } else {
              updateOther(5, nowPage.value)
            }
          })
        } else {
          // 修改
          updateSwiper(formState.user).then((res) => {
            message.info(res.data)
          })
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
        info.file.status = 'done'
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
      // 自定义文件上传
      const customRequest = (data) => {
        const formData = new FormData()
        formData.append('f1', data.file)
        upPhotos(formData).then((res) => {
          formState.user.image = res.data
        })
      }
      // 更新第一页数据
      function update() {
        getFirstPage(5).then((res) => {
          tableData.data = res.data.img_infos
          pagination.total = res.data.total_num
        })
      }
      function updateOther(pagesize, current) {
        getPages(pagesize, current).then((res) => {
          tableData.data = res.data.img_infos
          pagination.total = res.data.total_num
        })
      }
      // 初始化数据
      update()
      return {
        tableData,
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
        customRequest,
        delOne,
        update,
        changePage,
        nowPage,
        updateOther,
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
