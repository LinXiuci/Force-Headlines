import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/request'
import { Button, NavBar, Form, Input, Toast } from '@/utils/package-components'
import { setToken, getToken } from '@/utils/login-token'
import '@/assets/styles/Login.css'

/***
 * 登录页面
 *
 *  */
function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState<boolean>(true) // 是否禁用Button
  // 导航跳转
  const onNavigate = (url: string, query?: any) => {
    switch (url) {
      case '/':
        return navigate(`/`)

      default:
        return navigate('/')
    }
  }

  // 字段更新时触发button按钮的显示
  const onFieldsChange = () => {
    try {
      let isMobile: boolean | undefined =
        parseInt(form.getFieldsValue().mobile.length) >= 11
      let isCode: boolean | undefined =
        parseInt(form.getFieldsValue().code.length) >= 6

      if (isMobile && isCode) {
        setDisabled(false)
      } else {
        setDisabled(true)
      }
    } catch (error) {}
  }

  return (
    <section className="Login">
      <header className="Login-header">
        <NavBar onBack={() => onNavigate('/')}>登录</NavBar>
      </header>
      <main className="Login-main">
        <img className="Login-logo" src="/src/assets/LOGO1.jpg" alt="LoGO" />
        <Form
          form={form}
          layout="horizontal"
          footer={<RenderButton disabled={disabled} form={form} onNavigate={onNavigate}/>}
          onFieldsChange={onFieldsChange}>
          {/* 手机号 */}
          <Form.Item
            name="mobile"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式错误',
              },
            ]}>
            <Input maxLength={11} placeholder="请输入手机号" />
          </Form.Item>
          {/* 短信验证码 */}
          <Form.Item
            name="code"
            label="验证码"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
              {
                pattern: /^\d{6}$/,
                message: '验证码不少于6位',
              },
            ]}
            extra={<RenderCode />}>
            <Input maxLength={6} placeholder="请输入验证码" />
          </Form.Item>
        </Form>
      </main>
    </section>
  )
}

// 渲染登录Button
const RenderButton = (props: any) => {
  const { form, disabled,onNavigate } = props
  // 登录
  const onSubmit = async () => {
    const values = form.getFieldsValue()
    try {
      // 提交登录
      const result = await login(JSON.stringify(values))
      // 如果账号与密码正确,则设置token
      setToken(result.data)
      const loginToken = getToken()
      if (loginToken != '') {
        Toast.show({
          icon: 'success',
          content: '登录成功',
          duration: 1500,
        })
        onNavigate('/')
      }
    } catch (error: any) {
      // 如果账号或密码的情况下,则反馈给用户
      if (error.response.status === 400) {
        Toast.show({
          content: '手机号或' + error.response.data?.message,
          duration: 1500,
        })
      } else {
        Toast.show({
          content: '登录失败，请稍后重试',
          duration: 1500,
        })
      }
    }
  }
  return (
    <Button
      block
      disabled={disabled}
      onClick={onSubmit}
      style={{
        '--background-color': '#f04142',
        '--border-color': '#f04142',
        '--text-color': '#ffffff',
      }}
      type="submit"
      size="large">
      登录
    </Button>
  )
}

// 渲染验证码Button
const RenderCode = () => {
  const [countDown, setCountDown] = useState<number>(0) // 倒计时间
  const deleteCountDown = useRef(-1) // 重置倒计时间
  const onGetCode = async () => {
    // 默认手机号与验证码
    let data = JSON.stringify({
      mobile: '13911111111',
      code: '246810',
    })
    const result = await login(data)

    // 账号与密码
    console.log(result)

    setCountDown(5) // 设置倒计时间
    // 每一秒进行倒计时
    deleteCountDown.current = setInterval(() => {
      setCountDown((countDown) => countDown - 1)
    }, 1000)
  }
  // 倒计时为0时就清理定时器
  useEffect(() => {
    if (countDown === 0) {
      clearInterval(deleteCountDown.current)
    }
  }, [countDown])
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      clearInterval(deleteCountDown.current)
    }
  }, [])
  return (
    <a
      className={countDown === 0 ? 'Login-code' : 'Login-code-active'}
      onClick={countDown === 0 ? onGetCode : undefined}>
      {countDown === 0 ? ' 发送验证码' : `${countDown}s后重新获取`}
    </a>
  )
}

export default Login
