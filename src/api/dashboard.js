import request from '@/utils/request'

export function getDashboard(params) {
  return request({
    url: '47.92.163.212',
    method: 'get',
    params,
  })
}

// export function doEdit(data) {
//   return request({
//     url: '/table/doEdit',
//     method: 'post',
//     data,
//   })
// }

// export function doDelete(data) {
//   return request({
//     url: '/table/doDelete',
//     method: 'post',
//     data,
//   })
// }
