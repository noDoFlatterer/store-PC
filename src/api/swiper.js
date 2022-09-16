import request from '@/utils/request'
/**
 * 获取第一页数据及所有记录数量
 * @param {*} params
 * @returns
 */
export function getFirstPage(data) {
  return request({
    url: `api/api/v1/img/getImgFirstPage?nums=${data}`,
    method: 'get',
  })
}
/**
 * 获取分页数据
 * @param {*} params
 * @returns
 */
export function getPages(nums, page) {
  return request({
    url: `/api/api/v1/img/getOnePageImg?nums=${nums}&page=${page}`,
    method: 'get',
  })
}
/**
 * 批量删除图片信息
 * @param {*} params
 * @returns
 */
export function delPhotos(data) {
  return request({
    url: `/api/api/v1/img/deleteImages`,
    method: 'delete',
    data: { ids: [...data] },
  })
}
/**
 * 上传图片
 * @param {*} params
 * @returns
 */
export function upPhotos(data) {
  return request({
    url: `/api/api/v1/goods/uploadImg`,
    method: 'post',
    data,
  })
}
/**
 * 修改轮播图信息
 * @param {*} params
 * @returns
 */
export function updateSwiper(data) {
  return request({
    url: `/api/api/v1/img/updateRotImg`,
    method: 'put',
    data,
  })
}
/**
 * 添加轮播图信息
 * @param {*} params
 * @returns
 */
export function addSwiper(data) {
  return request({
    url: `/api/api/v1/img/addImg`,
    method: 'post',
    data,
  })
}
