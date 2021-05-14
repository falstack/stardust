<template>
  <view class="user-realname">
    <view class="input-wrap">
      <view class="label">
        介绍自己（200字以内）
      </view>
      <textarea
        v-model="state.aboutme"
        placeholder="好好介绍自己才能被别人重视"
        maxlength="200"
      />
    </view>
    <view class="input-wrap">
      <view class="label">
        希望TA（200字以内）
      </view>
      <textarea
        v-model="state.aboutyou"
        placeholder="认真填写此处能节省双方时间"
        maxlength="200"
      />
    </view>
    <button
      class="primary-btn"
      @tap="handleSubmit"
    >
      点击保存
    </button>
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
      aboutme: '',
      aboutyou: '',
      ...(store?.state?.userInfo?.aboutus || {})
    })

    const handleSubmit = () => {
      const aboutme = state.aboutme.trim()
      const aboutyou = state.aboutyou.trim()

      if (!aboutme) {
        toast.info('请介绍自己')
        return
      }

      if (aboutme.length < 20) {
        toast.info('自我介绍不能小于20字')
        return
      }

      if (!aboutyou) {
        toast.info('请输入对TA的期望')
        return
      }

      const aboutus = {
        aboutme,
        aboutyou
      }

      http.post('user/profile', { aboutus })
      .then(() => {
        toast.info('提交成功')
        const user = { ...store.state.userInfo }
        user.aboutus = aboutus
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
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    margin-bottom: 20px;
    font-size: 28px;

    .label {
      margin-left: 5px;
    }

    textarea {
      padding: 0;
      margin: 0;
      font-size: 28px;
    }
  }

  .primary-btn {
    display: block;
    margin: 30px 20px;
  }
}
</style>
