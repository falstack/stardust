<style lang="scss">
.guest-panel {
  width: 420px;
  margin: 0 auto;
  padding-bottom: 120px;

  .login-tips {
    font-size: 30px;
    text-align: center;
  }

  .btn-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;

    .primary-btn,
    .primary-btn-plain {
      border-radius: 10px;
      padding: 0 50px;
      height: 70px;
      line-height: 70px;
      font-size: 30px;
      font-weight: 500;
    }
  }

  .drawer-register-wrap {
    width: 500px;
    margin: 0 auto;

    .title {
      text-align: center;
      font-size: 44px;
      margin-bottom: 60px;
    }

    .message-wrap {
      padding: 12px 0 53px;
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

    .submit-btn {
      font-size: 32px;
    }
  }

  .register-bind-phone-dialog {
    padding-top: 100px;
    position: relative;

    .avatar {
      position: absolute;
      left: 50%;
      top: -105px;
      transform: translateX(-50%);
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 10px solid $bg-color;
    }
  }
}
</style>

<template>
  <view class="guest-panel">
    <view class="login-tips">
      你还没登录呢，喵 o(一︿一+)o
    </view>
    <view class="btn-wrap">
      <button class="primary-btn-plain" hover-class="none" @tap="handleTap">
        注册
      </button>
      <button class="primary-btn" open-type="getUserInfo" hover-class="none" @getUserInfo="startRegisterProcess">
        登录
      </button>
    </view>
    <Drawer v-model="state.showDrawer" size="100%">
      <view class="drawer-register-wrap">
        <view class="title">
          注册
        </view>
        <view v-if="state.showMessageBox" class="message-wrap">
          <CodeInput v-model="state.messageCode" @submit="handleSignUp" />
        </view>
        <view class="input-wrap" v-else>
          <view class="area">+ 86</view>
          <input
            v-model="state.phoneNumber"
            class="input"
            type="number"
            auto-focus="true"
            confirm-type="send"
            adjustPosition=""
            placeholder="请输入您的手机号"
          >
        </view>
        <button class="submit-btn primary-btn" @tap="getRegisterMessage">
          {{ state.sendMessageTimeout ? `${state.sendMessageTimeout}s后可重新获取` : '获取短信验证码' }}
        </button>
      </view>
    </Drawer>
    <Dialog v-model="state.showDialog">
      <view v-if="state.user" class="register-bind-phone-dialog">
        <image class="avatar" :src="state.user.avatar" />
        <view>需要绑定手机号才能注册成功</view>
        <button open-type="getPhoneNumber" hover-class="none" @getPhoneNumber={getUserPhone}>绑定当前微信号</button>
        <button hover-class="none">绑定其它手机号</button>
      </view>
    </Dialog>
  </view>
</template>

<script>
import { reactive } from 'vue'
import Drawer from '~/components/drawer'
import Dialog from '~/components/dialog'
import CodeInput from "./CodeInput";
import toast from '~/utils/toast'
import { oAuthLogin, sendPhoneMessage } from '~/utils/login'

export default {
  name: 'GuestPanel',
  setup() {
    const state = reactive({
      phoneNumber: '',
      messageCode: '',
      sendMessageTimeout: 0,
      showDrawer: false,
      showDialog: false,
      showMessageBox: false,
      user: null
    })

    const handleTap = () => {
      state.showDrawer = true
    }

    const overLoopTimeout = () => {
      if (state.sendMessageTimeout === 1) {
        state.sendMessageTimeout = 0
        return
      }
      setTimeout(() => {
        state.sendMessageTimeout--
        overLoopTimeout()
      }, 1000)
    }

    const startRegisterProcess = (evt) => {
      if (!evt.detail.userInfo) {
        toast.info('授权后才能注册')
        return
      }
      oAuthLogin()
        .then(user => {
          state.user = user
          state.showDialog = true
        })
        .catch(() => {
          toast.info('注册失败，请稍后再试~')
        })
    }

    const getUserPhone = (evt) => {
      console.log(evt)
    }

    const getRegisterMessage = () => {
      if (state.sendMessageTimeout) {
        return
      }
      if (
        !state.phoneNumber ||
        state.phoneNumber.length !== 11 ||
        !/^\d+$/.test(state.phoneNumber)
      ) {
        toast.info('请输入正确的手机号~')
        return
      }
      state.sendMessageTimeout = 60
      state.overLoopTimeout()
      sendPhoneMessage(state.phoneNumber)
        .then(() => {
          state.showMessageBox = true
        })
        .catch(err => {
          toast.info(err.message)
        })
    }

    const handleSignUp = () => {
      console.log('handleSignUp')
    }

    return {
      state,
      handleTap,
      overLoopTimeout,
      startRegisterProcess,
      getUserPhone,
      getRegisterMessage,
      handleSignUp
    }
  },
  components: {
    Drawer,
    Dialog,
    CodeInput
  }
}
</script>
