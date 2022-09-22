<template>
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
  >
    <a-form-item :name="['user', 'category']" label="商品种类">
      <a-cascader
        v-model:value="formState.user.category"
        :options="options"
        expand-trigger="hover"
        placeholder="Please select"
        change-on-select
        :open="open"
        @click="changeOpen"
        @change="changeChangeChange"
      />
    </a-form-item>

    <a-form-item label="商品名称" :name="['user', 'goods_name']">
      <a-input v-model:value="formState.user.goods_name" />
    </a-form-item>

    <a-form-item :name="['user', 'introduce']" label="商品简介">
      <a-textarea v-model:value="formState.user.introduce" />
    </a-form-item>

    <a-form-item
      :name="['user', 'original_price']"
      label="商品价格"
      :rules="[{ type: 'number', min: 0, max: 9999 }]"
    >
      <a-input-number v-model:value="formState.user.original_price" />
    </a-form-item>

    <a-form-item
      :name="['user', 'price']"
      label="商品售卖价价格"
      :rules="[{ type: 'number', min: 0, max: 99999 }]"
    >
      <a-input-number v-model:value="formState.user.price" />
    </a-form-item>

    <a-form-item
      :name="['user', 'count']"
      label="商品库存"
      :rules="[{ type: 'number', min: 0, max: 99999 }]"
    >
      <a-input-number v-model:value="formState.user.count" />
    </a-form-item>

    <a-form-item label="商品标签" :name="['user', 'tag']">
      <a-input
        v-model:value="formState.user.tag"
        type="text"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item label="上架状态" :name="['user', 'status']">
      <a-radio-group v-model:value="formState.user.status">
        <a-radio :value="1">上架</a-radio>
        <a-radio :value="0">下架</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="商品主图" :name="['fileList']">
      <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        :customRequest="customRequest"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="avatar"
          style="
             {
              width: 100%;
              height: 100%;
            }
          "
        />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-form-item>

    <a-form-item :name="['user', 'detail_goods']" label="详细信息">
      <a-textarea v-model:value="formState.user.detail_goods" />
    </a-form-item>

    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <a-button type="primary" html-type="submit">立刻创建</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { defineComponent, reactive, ref } from 'vue'
  import { addGoods, uploadImg, getClassInfo, updateGoods } from '@/api/goods'
  import store from '@/store'
  import { useRoute } from 'vue-router'

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  export default defineComponent({
    components: {
      LoadingOutlined,
      PlusOutlined,
    },
    setup() {
      // 路由传来的数据
      const route = useRoute()
      const formRef = ref()
      const user = {
        category: '', // 种类
        goods_name: '', //名称
        introduce: '', //介绍
        detail_goods: '', //详细信息
        original_price: '', //原价
        price: '', //售价
        count: '', // 库存
        tag: '', //标签
        state: '', // 上架状态
        image: '', //主图
        goods_id: '', //商品id
      }
      const formState = reactive({
        user: {
          category: '', // 种类
          goods_name: '', //名称
          introduce: '', //介绍
          detail_goods: '', //详细信息
          original_price: '', //原价
          price: '', //售价
          count: '', // 库存
          tag: '', //标签
          status: '', // 上架状态
          image: '', //主图
          goods_id: '', //商品id
        },
      })

      formState.user = store.getters['goods/getData']
      console.log(formState.user, '传到add组件里面的数据')

      let checkAge = async (_rule, value) => {
        if (!value) {
          return Promise.reject('Please input the age')
        }

        if (!Number.isInteger(value)) {
          return Promise.reject('Please input digits')
        } else {
          if (value < 18) {
            return Promise.reject('Age must be greater than 18')
          } else {
            return Promise.resolve()
          }
        }
      }

      let validatePass = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('Please input the password')
        } else {
          if (formState.checkPass !== '') {
            formRef.value.validateFields('checkPass')
          }

          return Promise.resolve()
        }
      }

      let validatePass2 = async (_rule, value) => {
        if (value === '') {
          return Promise.reject('Please input the password again')
        } else if (value !== formState.pass) {
          return Promise.reject("Two inputs don't match!")
        } else {
          return Promise.resolve()
        }
      }

      const rules = {
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: 'change',
          },
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: 'change',
          },
        ],
        age: [
          {
            validator: checkAge,
            trigger: 'change',
          },
        ],
      }
      const layout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      }

      const handleFinish = () => {
        console.log(route.query.state)
        if (Array.isArray(formState.user.category)) {
          const arr = formState.user.category
          formState.user.category = arr[arr.length - 1]
        }
        if (route.query.state == 1) {
          console.log(route.query.state, '222222222222')
          // console.log(formState.user, '传入请求的数据    category')
          console.log(formState.user, '传入请求的数据')
          addGoods(formState.user).then((value) => {
            console.log(value, '提交成功')
            message.info('添加成功')
          })
        } else {
          // console.log(formState.user, '传入请求的数据  category')
          console.log(formState.user, '传入请求的数据')
          updateGoods(formState.user).then((value) => {
            console.log(value, '修改成功')
            message.info('修改成功')
          })
        }
        formState.user = user
        imageUrl.value = ''
      }

      const resetForm = () => {
        formRef.value.resetFields()
      }

      // 添加图片
      const fileList = ref([])
      const loading = ref(false)
      const imageUrl = ref('')
      // console.log(formState.user.image, 'formState.user.image')
      if (formState.user.image) {
        imageUrl.value = formState.user.image
      }

      const handleChange = (info) => {
        info.file.status = 'done'
        if (info.file.status === 'uploading') {
          loading.value = true
          return
        }
        if (info.file.status === 'done') {
          getBase64(info.file.originFileObj, (base64Url) => {
            imageUrl.value = base64Url
            // console.log(imageUrl.value, '.value.value')
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
        // console.log(data)
        const formData = new FormData()
        formData.append('f1', data.file)
        uploadImg(formData).then((res) => {
          formState.user.image = res.data
        })
      }

      // 树形结构
      const options = reactive([])
      const open = ref(false)
      const changeOpen = () => {
        open.value = !open.value
      }

      // 封装请求函数
      const dataDataData = async (preName, curLevel) => {
        let res = await getClassInfo(preName, curLevel)
        return res.data.ClassificationName
      }
      // 初始化数据
      const getFirstData = () => {
        dataDataData('无', 1).then((res) => {
          for (let i in res) {
            const obj = {
              value: res[i],
              label: res[i],
              children: [],
            }
            options[i] = obj
          }
        })
      }
      getFirstData()

      const changeChangeChange = (e) => {
        if (e.length == 1 || e.length == 2) {
          open.value = true
          getClassInfo(e[e.length - 1], e.length + 1).then((value) => {
            let newData = e[e.length - 1]
            let res = value.data.ClassificationName
            for (let i in options) {
              if (e.length + 1 == 2) {
                // 第二层
                if (options[i].value == newData) {
                  for (let k in res) {
                    const obj = {
                      value: res[k],
                      label: res[k],
                      children: [],
                    }
                    options[i].children[k] = obj
                  }
                }
              } else {
                open.value = true
                // 第三层
                if (options[i].children[0] !== undefined) {
                  for (let j in options[i].children) {
                    if (options[i].children[j].value == newData) {
                      for (let k in res) {
                        const obj = {
                          value: res[k],
                          label: res[k],
                          children: [],
                        }
                        options[i].children[j].children[k] = obj
                      }
                    }
                  }
                }
              }
            }
          })
        } else {
          open.value = false
        }
      }
      return {
        formState,
        formRef,
        rules,
        layout,
        handleFinish,
        resetForm,

        //   图片
        fileList,
        loading,
        imageUrl,
        handleChange,
        beforeUpload,
        customRequest,

        // 树结构
        value: ref([]),
        options,
        open,
        changeOpen,
        changeChangeChange,
      }
    },
  })
</script>
<style scoped>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
