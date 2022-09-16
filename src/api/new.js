import request from '@/utils/request'

export function findNewGoods(data) {
  return request({
    url: '/api/api/v1/newGoods/findNewGoods',
    method: 'post',
    data,
  })
}

//添加商品
export function addNewGoods(data) {
  return request({
    url: '/api/api/v1/newGoods/addNewGoods',
    method: 'post',
    data,
  })
}

//批量删除
export function delNewGoods(data) {
  return request({
    url: '/api/api/v1/newGoods/delNewGoods',
    method: 'delete',
    data,
  })
}

//修改商品
export function updateNewGoods(data) {
  return request({
    url: '/api/api/v1/newGoods/updateNewGoods',
    method: 'put',
    data,
  })
}
