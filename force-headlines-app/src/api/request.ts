import { http } from './http'

// 用户登录
const login = (data: string) =>
  http.post('/v1_0/authorizations', data, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })

export { login }
