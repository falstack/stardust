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

  .register-drawer {
    width: 500px;
    margin: 0 auto;

    .title {
      text-align: center;
      font-size: 44px;
      margin-bottom: 60px;
    }
  }

  .bind-phone-dialog {
    padding: $container-padding;

    .tip {
      text-align: center;
      padding-bottom: $container-padding;
    }
  }
}
</style>

<template>
  <view class="guest-panel">
    <view class="login-tips">你还没登录呢，喵 o(一︿一+)o</view>
    <view class="btn-wrap">
      <button class="primary-btn-plain" hover-class="none" @tap="handleTap">
        注册
      </button>
      <button class="primary-btn" open-type="getUserInfo" hover-class="none" @getUserInfo="startLoginProcess">
        登录
      </button>
    </view>
    <Drawer v-model="state.showDrawer" size="100%">
      <view class="register-drawer">
        <view class="title">
          注册
        </view>
        <PhoneCodeBox type="sign_up" @submit="handleSignUp" />
      </view>
    </Drawer>
    <Dialog v-model="state.showDialog">
      <view class="bind-phone-dialog">
        <view class="tip">继续操作前请先绑定手机号</view>
        <PhoneCodeBox type="bind" @submit="handleBindPhone" />
      </view>
    </Dialog>
  </view>
</template>

<script>
import { reactive } from 'vue'
import Drawer from '~/components/drawer'
import Dialog from '~/components/dialog'
import toast from '~/utils/toast'
import { useStore } from 'vuex'
import PhoneCodeBox from './PhoneCodeBox'

export default {
  name: 'GuestPanel',
  components: {
    Drawer,
    Dialog,
    PhoneCodeBox
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDrawer: false,
      showDialog: false,
    })

    const handleTap = () => {
      state.showDrawer = true
    }

    const startLoginProcess = async (evt) => {
      if (!evt.detail.userInfo) {
        toast.info('授权后才能登录')
        return
      }
      await store.dispatch('userLogin')
      if (store.getters.isGuest) {
        state.showDialog = true
      }
    }

    const getUserPhone = (evt) => {
      console.log(evt)
    }

    const handleSignUp = () => {
      console.log('handleSignUp')
    }

    const handleBindPhone = () => {
      console.log('handleBindPhone')
    }

    return {
      state,
      handleTap,
      startLoginProcess,
      getUserPhone,
      handleSignUp,
      handleBindPhone
    }
  }
}
</script>
