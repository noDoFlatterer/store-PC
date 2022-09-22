import request from '@/utils/request'

// 获取下一页数据
export function nextPage(page, nums) {
  return request({
    url: `/api/api/v1/goods/query?page=${page}&nums=${nums}`,
    method: 'get',
  })
}

// query 参数
// 获取第一页数据
export function firstPage(nums) {
  return request({
    url: `/api/api/v1/goods/firstPage?nums=${nums}`,
    method: 'get',
  })
}

// 对象参数
// 修改上架下架
export function alterStatus(data) {
  return request({
    url: `/api/api/v1/goods/alterStatus`,
    method: 'post',
    data,
  })
}

// 添加商品
export function addGoods(data) {
  return request({
    url: `/api/api/v1/goods/addGoods`,
    method: 'post',
    data,
  })
}

// 修改商品
export function updateGoods(data) {
  return request({
    url: `/api/api/v1/goods/updateGoods`,
    method: 'put',
    data,
  })
}

// 上传图片
export function uploadImg(data) {
  return request({
    url: `/api/api/v1/goods/uploadImg`,
    method: 'post',
    data,
  })
}

// 获取分级信息
export function getClassInfo(preName, curLevel) {
  return request({
    url: `/api/api/v1/goods/getClassInfo?preName=${preName}&curLevel=${curLevel}`,
    method: 'get',
  })
}
