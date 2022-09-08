<template>
  <div>
    <a-card style="width: 100%">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="form"
      >
        <a-form-item
          label="登录名"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>
        <a-form-item
          label="昵称"
          name="nickname"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input v-model:value="formState.nickname" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">确认修改</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <br />
    <a-card style="width: 100%">
      <a-form
        :model="password"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinishPasswords"
        @finishFailed="onFinishFailed"
        class="form"
      >
        <a-form-item
          label="原密码"
          name="oldpassword"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="password.oldpassword" />
        </a-form-item>
        <a-form-item
          label="新密码"
          name="newpassword"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input v-model:value="password.newpassword" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">确认修改</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue'
  export default defineComponent({
    setup() {
      const formState = reactive({
        username: '',
        nickname: '',
      })
      const password = reactive({
        oldpassword: '',
        newpassword: '',
      })

      const onFinish = (values) => {
        console.log('Success:', values)
      }
      const onFinishPasswords = (values) => {
        console.log('Success:', values)
      }

      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
      }
      const onFinishPasswordsFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
      }

      return {
        formState,
        onFinish,
        onFinishFailed,
        onFinishPasswords,
        onFinishPasswordsFailed,
        password,
      }
    },
  })
</script>

<style>
  .form {
    /* margin-left: -100px;   */
    width: 300px;
  }
</style>
