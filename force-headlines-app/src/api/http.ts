import axios from 'axios'
import { setToken, getToken } from '@/utils/login-token'
import { Toast } from '@/utils/package-components'
import { useNavigate } from 'react-router-dom'
export const http = axios.create({
  baseURL: 'http://www.liulongbin.top:8000',
  timeout: 50000,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const loginToken = getToken()
    if (loginToken) {
      config.headers!.Authorization = `Bearer ${loginToken.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 配置响应拦截
http.interceptors.response.use(
  (response: any) => {
    return response
  },
  async (error) => {
    if (error.response && error.response.status === 400) {
      // 校验是否有 refresh_token
      const loginToken = getToken()
      if (loginToken !='' || loginToken.refresh_token !='') {
        return Promise.reject(error)
      }

      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://toutiao-app.itheima.net/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${loginToken.refresh_token}`,
          },
        })

        // 如果获取成功，则把新的 token 更新到容器中
        console.log('刷新 token  成功', res)

        setToken({
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: loginToken.refresh_token, // 还是原来的 refresh_token
        })
        return http(error.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log('请求刷线 token 失败', err)
        window.location.href='/login'
      }
    }

    return Promise.reject(error)
  }
)
