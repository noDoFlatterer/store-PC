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
        placeholder="Please select"
        change-on-select
        @change="changeChangeChange"
      />
    </a-form-item>

    <a-form-item has-feedback label="商品名称">
      <a-input v-model:value="formState.user.goods_name" />
    </a-form-item>

    <a-form-item :name="['user', 'introduce']" label="商品简介">
      <a-textarea v-model:value="formState.user.introduce" />
    </a-form-item>

    <a-form-item
      :name="['user', 'oldPrice']"
      label="商品价格"
      :rules="[{ type: 'number', min: 0, max: 99 }]"
    >
      <a-input-number v-model:value="formState.user.oldPrice" />
    </a-form-item>

    <a-form-item
      :name="['user', 'price']"
      label="商品售卖价价格"
      :rules="[{ type: 'number', min: 0, max: 99 }]"
    >
      <a-input-number v-model:value="formState.user.price" />
    </a-form-item>

    <a-form-item
      :name="['user', 'count']"
      label="商品库存"
      :rules="[{ type: 'number', min: 0, max: 99 }]"
    >
      <a-input-number v-model:value="formState.user.count" />
    </a-form-item>

    <a-form-item has-feedback label="商品标签" name="pass">
      <a-input
        v-model:value="formState.user.tag"
        type="text"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item has-feedback label="上架状态" name="pass">
      <a-radio-group v-model:value="formState.user.state">
        <a-radio value="1">上架1</a-radio>
        <a-radio value="0">下架0</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item has-feedback label="商品主图" name="f1">
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
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 100%" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-form-item>

    <a-form-item :name="['user', 'moreIntroduction']" label="详细信息">
      <a-textarea v-model:value="formState.user.moreIntroduction" />
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
  import { addGoods, uploadImg, getClassInfo } from '@/api/goods'
  import store from '@/store'

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
      const formRef = ref()
      const formState = reactive({
        user: {
          category: '', // 种类
          goods_name: '', //名称
          introduce: '', //介绍
          moreIntroduction: '', //详细信息
          original_price: '', //原价
          price: '', //售价
          count: '', // 库存
          tag: '', //标签
          state: '', // 上架状态
          image: '', //主图
          ID: '', //ID
          goods_id: '', //商品id
        },
      })

      if (store.getters['goods/getData'] != false) {
        formState.user = store.getters['goods/getData']
      }
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
        console.log(formState, 'formState')
        const proxyObj = formState.user.category
        console.log(proxyObj, 'proxyObj')
        let objString = ''
        for (let i in proxyObj) {
          console.log(proxyObj[i], '1111111')
          objString = objString + proxyObj[i] + '/'
        }
        console.log(objString, '迭代之后')
        formState.user.category = objString
        addGoods(formState.user).then((value) => {
          console.log(value, '提交成功')
        })
      }

      const resetForm = () => {
        formRef.value.resetFields()
      }

      // 添加图片
      const fileList = ref([])
      const loading = ref(false)
      const imageUrl = ref('')

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
        console.log(data)
        const formData = new FormData()
        formData.append('f1', data.file)
        uploadImg(formData).then((res) => {
          formState.user.image = res.data
        })
      }

      // 树形结构
      const options = reactive([])

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
            options.push(obj)
          }
        })
      }
      getFirstData()

      const changeChangeChange = (e) => {
        if (e.length == 1 || e.length == 2) {
          getClassInfo(e[e.length - 1], e.length + 1).then((value) => {
            let newData = e[e.length - 1]
            let res = value.data.ClassificationName
            for (let i in res) {
              const obj = {
                value: res[i],
                label: res[i],
                children: [],
              }
              for (let i in options) {
                if (e.length + 1 == 2) {
                  if (options[i].value == newData) {
                    options[i].children.push(obj)
                  }
                } else {
                  if (options[i].children[0] !== undefined) {
                    for (let j in options[i].children) {
                      if (options[i].children[j].value == newData) {
                        options[i].children[j].children.push(obj)
                      }
                    }
                  }
                }
              }
            }
          })
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
