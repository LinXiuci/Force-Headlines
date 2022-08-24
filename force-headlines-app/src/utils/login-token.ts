const FORCE_HEADLINES_KEY: string = 'force-headlines-login-token'

interface Token {
  token: string
  refresh_token: string
}

// 创建 获取 token
export const getToken = () =>
  JSON.parse(
    localStorage.getItem(FORCE_HEADLINES_KEY) ??
      '{ "token": "", "refresh_token": "" }'
  )

// 创建 设置 token
export const setToken = (token: Token) =>
  localStorage.setItem(FORCE_HEADLINES_KEY, JSON.stringify(token))

// 创建 清除 token
export const clearToken = () => localStorage.removeItem(FORCE_HEADLINES_KEY)

// 创建 根据 token 判断是否登录
export const isAuth = () => !!getToken()
