import request from '@/utils/request'
// import { tokenName } from '@/config'
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data,
  })
}
