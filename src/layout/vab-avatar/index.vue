<template>
  <div class="vab-avatar">
    <a-dropdown>
      <span class="ant-dropdown-link">
        <a-avatar :src="avatar" />
        {{ nickName }}
        <DownOutlined />
      </span>
      <template v-slot:overlay>
        <a-menu>
          <a-menu-item class="name">登录名:{{ loginName }}</a-menu-item>
          <a-menu-item class="name">昵称:{{ nickName }}</a-menu-item>
          <a-menu-item>
            <a-button @click="logout" type="primary" class="btn">
              退出登录
            </a-button>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
  import { recordRoute } from '@/config'
  import { DownOutlined } from '@ant-design/icons-vue'
  import { useStore } from 'vuex'
  import { computed, onMounted, reactive, toRefs } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getAccount } from '@/api/password'
  export default {
    name: 'VabAvatar',
    components: { DownOutlined },
    setup() {
      const store = useStore()
      const router = useRouter()
      const route = useRoute()
      const data = reactive({
        loginName: '',
        nickName: '',
      })
      const logout = async () => {
        await store.dispatch('user/logout')
        if (recordRoute) {
          const fullPath = route.fullPath
          router.push(`/login?redirect=${fullPath}`)
        } else {
          router.push('/login')
        }
      }
      onMounted(() => {
        getAccount().then((res) => {
          console.log(res)
          data.loginName = res.data.login_name
          data.nickName = res.data.nickname
        })
      })
      return {
        avatar: computed(() => store.getters['user/avatar']),
        username: computed(() => store.getters['user/username']),
        logout,
        ...toRefs(data),
      }
    },
  }
</script>
<style lang="less">
  .vab-avatar {
    .ant-dropdown-link {
      display: block;
      min-height: 64px;
      cursor: pointer;
    }
  }
  .name {
    font-size: 10px;
  }
  .btn {
    font-size: 10px;
  }
</style>
