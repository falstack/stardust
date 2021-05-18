<template>
  <view class="user-realname">
    <view class="input-wrap">
      <view class="label">
        真实姓名
      </view>
      <input
        v-model="state.realname"
        type="text"
        maxlength="14"
        placeholder="请输入你的姓名"
      >
    </view>
    <view class="input-wrap">
      <view class="label">
        身份证号
      </view>
      <input
        v-model="state.idcard"
        type="text"
        placeholder="请输入你的身份证"
      >
    </view>
    <button
      class="primary-btn"
      @tap="handleSubmit"
    >
      点击保存
    </button>
    <view class="tips">
      <view>
        PS：实名认证是为了防止一个用户有多个微信号
      </view>
    </view>
  </view>
</template>

<script>
import http from '~/utils/http'
import toast from '~/utils/toast'
import { useStore } from 'vuex'
import { reactive } from 'vue'

export default {
  name: 'UserRealname',
  setup() {
    const store = useStore()
    const state = reactive({
      realname: '',
      idcard: ''
    })

    const handleSubmit = () => {
      const realname = state.realname.trim()
      const idcard = state.idcard.trim()

      if (!realname) {
        toast.info('请输入姓名')
        return
      }

      if (
        !idcard ||
        !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(idcard)
      ) {
        toast.info('请输入有效身份证')
        return
      }

      http.post('sign/verify_realname', {
        realname,
        idcard
      })
      .then(() => {
        toast.info('实名认证成功')
        const user = { ...store.state.userInfo }
        user.providers.bind_idcard = true
        store.commit('UPDATE_USER_INFO', user)
      })
      .catch((err) => {
        toast.info(err.message)
      })
    }

    return {
      state,
      handleSubmit
    }
  }
}
</script>

<style lang="scss">
.user-realname {
  .input-wrap {
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;
    min-height: 100px;

    input {
      text-align: right;
    }
  }

  .primary-btn {
    display: block;
    margin: 30px 20px;
  }

  .tips {
    padding: 0 $container-padding;

    view {
      margin: $container-padding / 2 0;
      font-size: 28px;
      color: $color-text-gray;
    }
  }
}
</style>
