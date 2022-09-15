import request from '@/utils/request'
// 会员管理的接口
/**
 * 按页数获取用户
 * @returns
 */
export const getUsers = (page) => {
  return request({
    url: `/api/api/v1/users/${page}`,
    method: 'GET',
  })
}
/**
 * 批量禁用
 * @param {*} arr
 * @returns
 */
export const updatestatus1 = (arr) => {
  return request({
    url: '/api/api/v1/users/updatestatus/1',
    method: 'PUT',
    data: {
      id: arr,
    },
  })
}
/**
 * 批量解除禁用
 * @returns
 */
export const updatestatus0 = (arr) => {
  return request({
    url: '/api/api/v1/users/updatestatus/0',
    method: 'PUT',
    data: {
      id: arr,
    },
  })
}
