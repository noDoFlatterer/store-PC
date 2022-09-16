import request from '@/utils/request'

export function getDashboard() {
  return request({
    url: '/api/api/v1/getDashboard',
    method: 'get',
  })
}
