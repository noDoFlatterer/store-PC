<template>
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
  >
    <!-- <a-form-item has-feedback label="商品种类" name="pass">
      <a-input v-model:value="formState.user.lei" type="text" autocomplete="off" />
    </a-form-item> -->

    <a-form-item
      :name="['user', 'lei']"
      label="商品种类"
      :rules="[{ required: true, message: 'Missing area' }]"
    >
      <!-- <a-select v-model:value="formState.user.lei" :options="lei" /> -->
      <a-select v-model:value="formState.user.lei" placeholder="选择商品种类">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item has-feedback label="商品名称" name="pass">
      <a-input
        v-model:value="formState.user.name"
        type="text"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item :name="['user', 'introduction']" label="商品简介">
      <a-textarea v-model:value="formState.user.introduction" />
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
      :name="['user', 'inventory']"
      label="商品库存"
      :rules="[{ type: 'number', min: 0, max: 99 }]"
    >
      <a-input-number v-model:value="formState.user.inventory" />
    </a-form-item>

    <a-form-item has-feedback label="商品标签" name="pass">
      <a-input
        v-model:value="formState.user.goodsLabel"
        type="text"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item has-feedback label="上架状态" name="pass">
      <a-radio-group v-model:value="formState.user.state">
        <a-radio value="true">上架</a-radio>
        <a-radio value="false">下架</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item has-feedback label="商品主图" name="pass">
      <a-input
        v-model:value="formState.user.pic"
        type="image"
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item has-feedback label="商品简介" name="pass">
      <a-input
        v-model:value="formState.user.introduction"
        type="text"
        autocomplete="off"
      />
    </a-form-item>
  </a-form>
</template>
<script>
  import { defineComponent, reactive, ref } from 'vue'
  export default defineComponent({
    setup() {
      const formRef = ref()
      const formState = reactive({
        user: {
          lei: '',
          name: '',
          introduction: '',
          oldPrice: '',
          price: '',
          inventory: '',
          goodsLabel: '',
          state: true,
          pic: '',
          key: '',
          id: '',
        },
      })

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

      const handleFinish = (values) => {
        console.log(values, formState)
      }

      const handleFinishFailed = (errors) => {
        console.log(errors)
      }

      const resetForm = () => {
        formRef.value.resetFields()
      }

      const handleValidate = (...args) => {
        console.log(args)
      }

      return {
        formState,
        formRef,
        rules,
        layout,
        handleFinishFailed,
        handleFinish,
        resetForm,
        handleValidate,
      }
    },
  })
</script>
