import request from '@/utils/request'

export function findRecommendGoods(data) {
  return request({
    url: '/api/api/v1/recommend/findRecommendGoods',
    method: 'post',
    data,
  })
}

//添加商品
export function addRecommendGoods(data) {
  return request({
    url: '/api/api/v1/recommend/addRecommendGoods',
    method: 'post',
    data,
  })
}

//批量删除
export function delRecommendGoods(data) {
  return request({
    url: '/api/api/v1/recommend/delRecommendGoods',
    method: 'delete',
    data,
  })
}

//修改商品
export function updateRecommendGoods(data) {
  return request({
    url: '/api/api/v1/recommend/updateRecommendGoods',
    method: 'put',
    data,
  })
}
