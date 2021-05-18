<template>
  <view class="guest-panel">
    <view class="login-tips">
      你还没登录呢，喵 o(一︿一+)o
    </view>
    <view class="buttons">
      <button
        class="btn primary-btn-plain"
        open-type="getPhoneNumber"
        hover-class="none"
        @getphonenumber="getUserPhone"
      >
        注册
      </button>
      <view class="divider" />
      <button
        class="btn primary-btn"
        open-type="getPhoneNumber"
        hover-class="none"
        @getphonenumber="getUserPhone"
      >
        登录
      </button>
    </view>
    <Drawer
      v-model="state.showBindOAuth"
      size="100%"
    >
      <view class="bind-auth-drawer">
        <view class="title">
          继续操作前请先绑定邮箱
        </view>
        <view class="input-wrap">
          <input
            v-model="state.emailAddress"
            class="input"
            type="text"
            auto-focus="true"
            adjustPosition=""
            placeholder="邮箱账号"
          >
        </view>
        <view class="input-wrap">
          <input
            v-model="state.emailCode"
            class="input"
            type="number"
            adjustPosition=""
            placeholder="收到的邮件验证码"
          >
        </view>
        <view class="tips">
          <view>
            1. 为了过滤虚假信息，只有邮箱后缀相同的用户能看到彼此
          </view>
          <view>
            2. 目前只支持 @bilibili（内测）、@tencent（审核） 邮箱后缀注册
          </view>
        </view>
        <view class="buttons">
          <button
            class="btn primary-btn-plain"
            @tap="sendMessage"
          >
            {{ state.sendMessageTimeout ? `${state.sendMessageTimeout}s后可重新获取` : '发送邮箱验证码' }}
          </button>
          <view class="divider" />
          <button
            class="btn primary-btn"
            hover-class="none"
            @tap="verifyEmail"
          >
            完成认证
          </button>
        </view>
      </view>
    </Drawer>
  </view>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { sendEmailMessage, wechatLogin, getAuthCode, bindEmail, getUserInfo } from '~/utils/login'
import cache from '~/utils/cache'
import toast from '~/utils/toast'
import Drawer from '~/components/drawer'

export default {
  name: 'PhoneCodeBox',
  components: {
    Drawer
  },
  setup() {
    const store = useStore()
    const state = reactive({
      phoneNumber: '',
      messageCode: '',
      emailAddress: '',
      emailCode: '',
      sendMessageTimeout: 0,
      submitting: false,
      showBindOAuth: false
    })

    const refreshCode = async () => {
      const code = await getAuthCode()
      store.commit('SET_AUTH_CODE', code)
    }

    const overLoopTimeout = () => {
      if (state.sendMessageTimeout <= 1) {
        state.sendMessageTimeout = 0
        return
      }
      setTimeout(() => {
        state.sendMessageTimeout--
        overLoopTimeout()
      }, 1000)
    }

    const getUserPhone = (evt) => {
      if (!evt.detail.iv) {
        toast.info('请先授权')
        return
      }

      wechatLogin({
        code: store.state.authCode,
        encrypted_data: evt.detail.encryptedData,
        iv: evt.detail.iv
      })
        .then(async (token) => {
          cache.set('JWT_TOKEN', token)
          const user = await getUserInfo()
          store.commit('UPDATE_USER_INFO', user)
          state.showBindOAuth = store.getters.isGuest
        })
        .catch((err) => {
          toast.info(err.message)
        })
        .finally(() => {
          refreshCode()
        })
    }

    const sendMessage = () => {
      if (state.sendMessageTimeout || state.submitting) {
        return
      }

      if (
        !state.emailAddress ||
        !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(state.emailAddress)
      ) {
        toast.info('请输入正确的邮箱账号~')
        return
      }

      state.submitting = true
      sendEmailMessage(state.emailAddress, 'bind_email')
        .then(() => {
          state.sendMessageTimeout = 60
          overLoopTimeout()
        })
        .catch(err => {
          toast.info(err.message)
        })
        .finally(() => {
          state.submitting = false
        })
    }

    const verifyEmail = () => {
      if (
        !state.emailAddress ||
        !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(state.emailAddress)
      ) {
        toast.info('请输入正确的邮箱账号~')
        return
      }

      if (
        !state.emailAddress.endsWith('@bilibili.com') &&
        !state.emailAddress.endsWith('@tencent.com')
      ) {
        toast.info('目前只支持部分邮箱后缀认证~')
        return
      }

      if (
        !state.emailCode ||
        !/^\d{6}$/.test(state.emailCode)
      ) {
        toast.info('请输入正确的验证码~')
        return
      }

      bindEmail(state.emailAddress, state.emailCode)
        .then(() => {
          const user = { ...store.state.userInfo }
          user.providers.bind_email = true
          store.commit('UPDATE_USER_INFO', user)
          toast.info('邮箱绑定成功~')
        })
        .catch(err => {
          toast.info(err.message)
        })
    }

    onMounted(() => {
      refreshCode()
    })

    return {
      state,
      verifyEmail,
      sendMessage,
      getUserPhone
    }
  }
}
</script>

<style lang="scss">
.guest-panel {
  width: 500px;
  margin: 0 auto;
  padding-top: 100px;

  .login-tips {
    font-size: 30px;
    padding-bottom: 120px;
    text-align: center;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .btn {
      flex: 1;
    }

    .divider {
      flex-shrink: 0;
      width: $container-padding;
    }
  }

  .bind-auth-drawer {
    padding: $container-padding;

    .title {
      text-align: center;
      padding-bottom: $container-padding * 2;
    }

    .input-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: #F5F5F5;
      padding: 30px 20px;
      border-radius: 20px;
      margin-bottom: 40px;

      .area {
        border-right: 1PX solid #3D3D3D;
        padding-right: 10px;
        margin-right: 10px;
        font-size: 30px;
        line-height: 30px;
        height: 30px;
      }

      .input {
        flex: 1;
        font-size: 30px;
      }
    }

    .tips {
      padding: $container-padding 0;

      view {
        margin: $container-padding / 2 0;
        font-size: 28px;
        color: $color-text-gray;
      }
    }
  }
}
</style>
