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
          name="login_name"
          :rules="[
            { required: true, message: 'Please input your login_name!' },
          ]"
        >
          <a-input v-model:value="formState.login_name" disabled />
        </a-form-item>
        <a-form-item
          label="昵称"
          name="nickname"
          :rules="[{ required: true, message: 'Please input your nickname!' }]"
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
          name="old_pwd"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="password.old_pwd" />
        </a-form-item>
        <a-form-item
          label="新密码"
          name="new_pwd"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input v-model:value="password.new_pwd" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">确认修改</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
  import { defineComponent, onMounted, reactive } from 'vue'
  import { changeAccount, changePassword, getAccount } from '@/api/password'
  import store from '@/store'
  import { useRouter } from 'vue-router'
  import { message } from 'ant-design-vue'
  export default defineComponent({
    setup() {
      const formState = reactive({
        login_name: '',
        nickname: '',
      })
      const password = reactive({
        old_pwd: '',
        new_pwd: '',
      })
      const router = useRouter()
      const onFinish = () => {
        console.log(formState)
        changeAccount(formState).then(() => {
          message.info('修改成功请重新登录')
          store.commit('user/removeAccessToken')
          router.push('/login')
        })
      }
      const onFinishPasswords = () => {
        console.log(password)
        changePassword(password).then(() => {
          message.info('修改成功请重新登录')
          store.commit('user/removeAccessToken')
          router.push('/login')
        })
      }
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
      }
      const onFinishPasswordsFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
      }
      onMounted(() => {
        getAccount().then((res) => {
          let { login_name, nickname } = res.data
          formState.login_name = login_name
          formState.nickname = nickname
        })
      })
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
