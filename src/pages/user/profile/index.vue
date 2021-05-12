<template>
  <view class="user-profile">
    <view class="input-wrap">
      <view class="label">昵称</view>
      <input
        v-model="state.nickname"
        type="text"
        maxlength="14"
      >
    </view>
    <view class="input-wrap">
      <view class="label">头像</view>
      <Uploader>
        点击选择头像
      </Uploader>
    </view>
    <view class="input-wrap">
      <view class="label">性别</view>
      <radio-group @change="onSexChange">
        <label v-for="item in sexList" :key="item.value" class="checkbox-list__label">
          <radio class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</radio>
        </label>
      </radio-group>
    </view>
    <view class="input-wrap">
      <view class="label">生日</view>
      <picker mode="date" start="1980-01-01" end="2002-12-31" @change="onBirthdayChange">
        <view class="picker">
          当前选择：{{state.birthday}}
        </view>
      </picker>
    </view>
    <view class="input-wrap">
      <view class="label">身高（cm）</view>
      <slider step="1" :value="state.bodyHeight" show-value="true" min="100" max="200" @change="onBodyHeightChange" />
    </view>
    <view class="input-wrap">
      <view class="label">体重（kg）</view>
      <slider step="1" :value="state.bodyWeight" show-value="true" min="30" max="130" @change="onBodyWeightChange" />
    </view>
    <view class="input-wrap">
      <view class="label">职业</view>
      <input type="text">
    </view>
  </view>
</template>

<script>
import Uploader from '~/components/uploader'
import { reactive } from 'vue'

export default {
  name: 'UserProfile',
  components: {
    Uploader
  },
  setup() {
    const state = reactive({
      nickname: '',
      bodyHeight: 150,
      bodyWeight: 50,
      messageCode: '',
      emailAddress: '',
      emailCode: '',
      sendMessageTimeout: 0,
      submitting: false,
      showBindOAuth: false
    })

    const sexList = [
      {
        value: 0,
        text: '女',
        checked: false
      },
      {
        value: 1,
        text: '男',
        checked: false
      }
    ]

    const onSexChange = (evt) => {
      console.log('onSexChange', evt)
    }

    const onBodyHeightChange = (evt) => {
      console.log('onBodyHeightChange', evt)
    }

    const onBodyWeightChange = (evt) => {
      console.log('onBodyWeightChange', evt)
    }

    const onBirthdayChange = (evt) => {
      console.log('onBirthdayChange', evt)
    }

    return {
      state,
      sexList,
      onSexChange,
      onBodyHeightChange,
      onBodyWeightChange,
      onBirthdayChange
    }
  }
}
</script>

<style lang="scss">
.user-profile {
  padding: $container-padding;
}
</style>
