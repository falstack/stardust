<style lang="scss">
.phone-code-box {
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

  .buttons {
    margin-top: $container-padding;
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
}
</style>

<template>
  <view class="phone-code-box">
    <view v-if="state.showMessageBox" class="message-wrap">
      <CodeInput v-model="state.messageCode" @submit="handleSubmit" />
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
    <view class="buttons">
      <template v-if="$env === 'weapp' && !state.showMessageBox">
        <button
          class="btn primary-btn-plain"
          open-type="getPhoneNumber"
          hover-class="none"
          @getPhoneNumber={getUserPhone}
        >
          一键授权手机号
        </button>
        <view class="divider" />
      </template>
      <button class="btn primary-btn" @tap="sendMessage">
        {{ state.sendMessageTimeout ? `${state.sendMessageTimeout}s后可重新获取` : '获取短信验证码' }}
      </button>
    </view>
  </view>
</template>

<script>
import { reactive } from 'vue'
import { sendPhoneMessage } from '~/utils/login'
import toast from '~/utils/toast'
import CodeInput from './CodeInput'

export default {
  name: 'PhoneCodeBox',
  components: {
    CodeInput
  },
  props: {
    type: {
      required: true,
      type: String
    }
  },
  setup(props, ctx) {
    const state = reactive({
      phoneNumber: '',
      messageCode: '',
      sendMessageTimeout: 0,
      showMessageBox: false,
    })

    const handleSubmit = () => {
      console.log(state.messageCode)
      console.log(state.phoneNumber)
      // TODO：isNew 则为注册，否则为绑定
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

    const getUserPhone = (evt) => {
      console.log(evt)
    }

    const sendMessage = () => {
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
      overLoopTimeout()

      sendPhoneMessage(state.phoneNumber, props.type)
        .then(() => {
          state.showMessageBox = true
        })
        .catch(err => {
          toast.info(err.message)
        })
    }

    return {
      state,
      sendMessage,
      getUserPhone,
      handleSubmit
    }
  }
}
</script>
