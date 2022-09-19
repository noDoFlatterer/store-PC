import request from '@/utils/request'

// query 参数
export function firstPage(nums) {
  return request({
    url: `/api/api/v1/goods/firstPage?nums=${nums}`,
    method: 'get',
  })
}

// 对象参数
// 返回列表数据
export function find(data) {
  return request({
    url: `/api/api/v1/category/find`,
    method: 'post',
    data,
  })
}

// 添加分级
export function addData(data) {
  return request({
    url: `/api/api/v1/category/add`,
    method: 'post',
    data,
  })
}

// 修改分级
export function update(data) {
  return request({
    url: `/api/api/v1/category/update`,
    method: 'put',
    data,
  })
}

// 批量删除，删除，传入数组
export function deleteData(data) {
  return request({
    url: `/api/api/v1/category/delete`,
    method: 'post',
    data,
  })
}
