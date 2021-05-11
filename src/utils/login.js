import Taro from '@tarojs/taro'
import http from '~/utils/http'

export const getAuthCode = () => {
  return new Promise((resolve, reject) => {
    Taro.login({
      success(data) {
        if (data.code) {
          resolve(data.code)
        } else {
          reject()
        }
      },
      fail() {
        reject('')
      }
    })
  })
}

export const wechatLogin = (form) => http.post('sign/login_wechat', {
  ...form,
  app_name: 'sign_love'
})

export const getUserInfo = () => http.post('sign/get_user_info')

export const getUserRole = () => http.get('user/roles')

export const logoutAction = () => http.post('sign/logout')

export const sendEmailMessage = (email_address, type) => http.post('sign/email', {
  type,
  email_address
})

export const bindEmail = (email_address, email_code) => http.post('sign/bind_email', {
  email_code,
  email_address
})
