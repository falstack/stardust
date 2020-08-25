import Taro from '@tarojs/taro'
import http from '~/utils/http'
import cache from '~/utils/cache'

const step_0_get_jwt_token_by_access = form => {
  return http.post(form.isRegister ? 'door/register' : 'door/login', form)
}

const step_2_get_token_or_user_by_code = code => {
  const url = process.env.TARO_ENV === 'weapp' ? 'door/wechat_mini_app_get_token' : 'door/qq_mini_app_get_token'
  return http.post(url, { code, app_name: 'moe_idol' })
}

const step_3_get_secret_data_from_wechat = () => {
  return new Promise((resolve, reject) => {
    Taro.getUserInfo({
      withCredentials: true,
      success(data) {
        resolve(data)
      },
      fail() {
        reject()
      }
    })
  })
}

const step_4_get_user = form => {
  const url = process.env.TARO_ENV === 'weapp' ? 'door/wechat_mini_app_login' : 'door/qq_mini_app_login'
  return http.post(url, form).then(resolve).catch(reject)
}

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

export const oAuthLogin = () => {
  return new Promise((resolve, reject) => {
    getAuthCode()
      .then(code => {
        step_2_get_token_or_user_by_code(code)
          .then(resp => {
            if (resp.type === 'token') {
              cache.set('JWT_TOKEN', resp.data)
              getUserInfo()
                .then(resolve)
                .catch(reject)
            } else {
              step_3_get_secret_data_from_wechat()
                .then(user => {
                  step_4_get_user({
                    user: user.userInfo,
                    signature: user.signature,
                    iv: user.iv,
                    encrypted_data: user.encryptedData,
                    session_key: resp.data,
                    app_name: 'moe_idol'
                  })
                    .then(token => {
                      cache.set('JWT_TOKEN', token)
                      getUserInfo()
                        .then(resolve)
                        .catch(reject)
                    })
                    .catch(reject)
                })
                .catch(reject)
            }
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

export const getWechatPhone = (form) => http.post('door/get_wechat_phone', {
  iv: form.iv,
  encrypted_data: form.encryptedData,
  code: form.code,
  app_name: 'moe_idol'
})

export const bindPhone = ({ phone, authCode }) => http.post('door/bind_phone', {
  phone,
  authCode
})

export const bindUser = (form) => http.post(`door/bind_${process.env.TARO_ENV}_user`, {
  ...form,
  app_name: 'moe_idol'
})

export const accessLogin = (form) => {
  return new Promise((resolve, reject) => {
    step_0_get_jwt_token_by_access(form)
      .then(token => {
        cache.set('JWT_TOKEN', token)
        getUserInfo().then(resolve).catch(reject)
      })
      .catch(reject)
  })
}

export const getUserInfo = () => http.post('door/get_user_info')

export const getUserRole = () => http.get('user/roles')

export const logoutAction = () => http.post('door/logout')

export const sendPhoneMessage = (phone_number, type) => http.post('door/message', {
  type,
  phone_number
})
