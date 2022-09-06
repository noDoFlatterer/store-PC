import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '首页',
      icon: 'home-4-line',
      affix: true,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index'),
        meta: {
          title: '首页',
          icon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/vab',
    component: Layout,
    redirect: '/vab/table',
    alwaysShow: true,
    meta: {
      title: '组件',
      icon: 'apps-line',
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/vab/table'),
        meta: {
          title: '表格',
          icon: 'table-2',
        },
      },
      {
        path: 'icon',
        name: 'Icon',
        component: () => import('@/views/vab/icon'),
        meta: {
          title: '图标',
          icon: 'remixicon-line',
        },
      },
    ],
  },
  {
<<<<<<< HEAD
    path: '/home',
    component: Layout,
    redirect: '/home/swiper',
    alwaysShow: true,
    meta: {
      title: '首页配置',
=======
    path: '/modulemanagement',
    component: Layout,
    redirect: '/modulemanagement/membermanagement',
    alwaysShow: true,
    meta: {
      title: '模块管理',
>>>>>>> 68fb9cac3130d5b5de5b7a593e3ea54a5635e354
      icon: 'apps-line',
    },
    children: [
      {
<<<<<<< HEAD
        path: 'swiper',
        name: 'Swiper',
        component: () => import('@/views/home/swiper'),
        meta: {
          title: '轮播图配置',
=======
        path: 'membermanagement',
        name: 'MemberManagement',
        component: () => import('@/views/moduleManagement/memberManagement'),
        meta: {
          title: '会员管理',
>>>>>>> 68fb9cac3130d5b5de5b7a593e3ea54a5635e354
          icon: 'table-2',
        },
      },
      {
<<<<<<< HEAD
        path: 'hot',
        name: 'Hot',
        component: () => import('@/views//home/hot'),
        meta: {
          title: '热销商品配置',
          icon: 'remixicon-line',
=======
        path: 'ordermanagement',
        name: 'OrderManagement',
        component: () => import('@/views/moduleManagement/orderManagement'),
        meta: {
          title: '订单管理',
          icon: 'table-2',
>>>>>>> 68fb9cac3130d5b5de5b7a593e3ea54a5635e354
        },
      },
    ],
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/test',
    meta: {
      title: '动态路由测试',
      icon: 'test-tube-line',
    },
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test'),
        meta: {
          title: '动态路由测试',
          icon: 'test-tube-line',
        },
      },
    ],
  },
  {
    path: '/error',
    name: 'Error',
    component: Layout,
    redirect: '/error/403',
    meta: {
      title: '错误页',
      icon: 'error-warning-line',
    },
    children: [
      {
        path: '403',
        name: 'Error403',
        component: () => import('@/views/403'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
    ],
  },
  {
    path: '/*',
    redirect: '/404',
    hidden: true,
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
