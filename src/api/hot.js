import request from '@/utils/request'
/**
 * 添加热销商品
 * @param {*} data
 * @returns
 */
export function addHot(data) {
  return request({
    url: '/api/api/v1/goods/hot/add',
    method: 'post',
    data,
  })
}
/**
 * 获取热销商品
 * @param {*}
 * @returns
 */
export function getHot(data) {
  return request({
    url: '/api/api/v1/goods/hot/find',
    method: 'post',
    data,
  })
}
/**
 * 修改热销商品配置
 * @param {*} data
 * @returns
 */
export function changeHot(data) {
  return request({
    url: '/api/api/v1/goods/hot/update',
    method: 'put',
    data,
  })
}
/**
 * 批量删除数据
 * @param {*} data
 * @returns
 */
export function delHots(data) {
  return request({
    url: '/api/api/v1/goods/hot/delete',
    method: 'post',
    data,
  })
}
