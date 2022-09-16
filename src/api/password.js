import request from '@/utils/request'
/**
 * 修改账户名和昵称
 * @param {*} data
 * @returns
 */
export function changeAccount(data) {
  return request({
    url: '/api/api/v1/goods/modifyAcc',
    method: 'put',
    data,
  })
}
/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export function changePassword(data) {
  return request({
    url: '/api/api/v1/goods/modifyPwd',
    method: 'put',
    data,
  })
}
/**
 * 获取登录账号昵称
 * @param {*} data
 * @returns
 */
export function getAccount() {
  return request({
    url: '/api/api/v1/goods/getCurrentAcc',
    method: 'get',
  })
}
