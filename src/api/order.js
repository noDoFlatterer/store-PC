import request from '@/utils/request'
/**
 * 获取page页数据
 * @param {*} param0
 * @returns
 */
export const getOrders = ({ page }) => {
  return request({
    url: '/api/api/v1/order/pcGetAllOrder',
    method: 'post',
    data: { page, size: 5 },
  })
}
/**
 * 单个或批量关闭订单
 * @param {*} order_data 数组
 * @returns
 */
export const closeOrders = (order_data) => {
  return request({
    url: '/api/api/v1/order/pcCloseOrder',
    method: 'PUT',
    data: {
      order_data,
    },
  })
}
/**
 * 查看订单所有类别
 * @returns 返回订单所有类别
 */
export const getOrderKind = () => {
  return request({
    url: '/api/api/v1/order/pcFindOrderKind',
    method: 'POST',
  })
}
/**
 * 批量出库
 * @param {*} order_data 数组
 * @returns
 */
export const sendGoods = (order_data) => {
  return request({
    url: '/api/api/v1/order/pcSendGoods',
    method: 'PUT',
    data: {
      order_data,
    },
  })
}
/**
 * 批量配货
 * @param {*} order_data 数组
 * @returns
 */
export const perPareGoods = (order_data) => {
  return request({
    url: '/api/api/v1/order/pcPrePareGoods',
    method: 'PUT',
    data: {
      order_data,
    },
  })
}
/**
 * 根据类别去查询
 * @param {} status
 * @param {*} page
 * @param {*} size
 * @returns
 */
export const getKindOrder = (status, page, size) => {
  return request({
    url: '/api/api/v1/order/pcGetKindOrder',
    method: 'POST',
    data: {
      status,
      page,
      size,
    },
  })
}
/**
 * 根据ID查询数据数据
 * @param {*} order_id
 * @returns
 */
export const getOrderById = (order_id) => {
  return request({
    url: '/api/api/v1/order/pcGetOrderById',
    method: 'POST',
    data: {
      order_id,
    },
  })
}
/**
 * 根据订单id获取订单详情
 * @param {} order_id
 * @returns
 */
export const getOrderDetail = (order_id) => {
  return request({
    url: '/api/api/v1/order/pcGetOrderDetail',
    method: 'POST',
    data: {
      order_id,
    },
  })
}
