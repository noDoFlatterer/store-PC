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
    path: '/Dashboard',
    component: Layout,
    redirect: '/Dashboard/add',
    alwaysShow: true,
    meta: {
      title: 'Dashboard',
      icon: 'apps-line',
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/dashboard'),
        meta: {
          title: 'Dashboard',
          icon: 'remixicon-line',
        },
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/Dashboard/add'),
        meta: {
          title: '添加商品',
          icon: 'table-2',
        },
      },
    ],
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/swiper',
    alwaysShow: true,
    meta: {
      title: '首页配置',
      icon: 'remixicon-line',
    },
    children: [
      {
        path: 'swiper',
        name: 'Swiper',
        component: () => import('@/views/home/swiper'),
        meta: {
          title: '轮播图配置',
          icon: 'remixicon-line',
        },
      },
      {
        path: 'hot',
        name: 'Hot',
        component: () => import('@/views//home/hot'),
        meta: {
          title: '热销商品配置',
          icon: 'remixicon-line',
        },
      },
      {
        path: 'new',
        name: 'New',
        component: () => import('@/views//home/new'),
        meta: {
          title: '新品上线配置',
          icon: 'add-fill',
        },
      },
      {
        path: 'recommend',
        name: 'Recommend',
        component: () => import('@/views//home/recommend'),
        meta: {
          title: '为你推荐配置',
          icon: 'hand-heart-line',
        },
      },
    ],
  },
  {
    path: '/modulemanagement',
    component: Layout,
    redirect: '/modulemanagement/membermanagement',
    alwaysShow: true,
    meta: {
      title: '模块管理',
      icon: 'apps-line',
    },
    children: [
      {
        path: 'category',
        name: 'category',
        meta: {
          title: '分类管理',
          icon: 'table-2',
        },
        children: [
          {
            path: '',
            name: 'firstCategory',
            hidden: true,
            component: () => import('@/views/moduleManagement/category/first'),
            meta: {
              title: '分类管理',
              icon: 'table-2',
            },
          },
          {
            path: 'second',
            name: 'secondCategory',
            hidden: true,
            component: () => import('@/views/moduleManagement/category/second'),
            meta: {
              title: '分类二级管理',
              icon: 'table-2',
            },
          },
          {
            path: 'third',
            name: 'thirdCategory',
            hidden: true,
            component: () => import('@/views/moduleManagement/category/third'),
            meta: {
              title: '分类三级管理',
              icon: 'table-2',
              tagHidden: true,
            },
          },
        ],
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/moduleManagement/goods'),
        meta: {
          title: '商品管理',
          icon: 'remixicon-line',
        },
      },
      {
        path: 'membermanagement',
        name: 'MemberManagement',
        component: () => import('@/views/moduleManagement/memberManagement'),
        meta: {
          title: '会员管理',
          icon: 'table-2',
        },
      },
      {
        path: 'ordermanagement',
        name: 'OrderManagement',
        meta: {
          title: '订单管理',
          icon: 'table-2',
        },
        children: [
          {
            path: '',
            name: 'OrderManagement1',
            hidden: true,
            component: () => import('@/views/moduleManagement/orderManagement'),
            meta: {
              title: '订单管理',
              icon: 'table-2',
            },
          },
          {
            path: 'detail',
            name: 'OrderManagement2',
            hidden: true,
            component: () =>
              import('@/views/moduleManagement/orderManagement/detail'),
            meta: {
              title: '订单详情',
              icon: 'table-2',
              tagHidden: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/index',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'home-4-line',
      affix: true,
    },
    children: [
      {
        path: 'change',
        name: 'change',
        component: () => import('@/views/account'),
        meta: {
          title: '修改密码',
          icon: 'home-4-line',
          affix: false,
        },
      },
    ],
  },
  {
    path: '/error',
    name: 'Error',
    component: Layout,
    redirect: '/error/403',
    hidden: true,
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
