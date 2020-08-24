<style lang="scss">
.signed-panel {
  .user-info {
    padding-left: $container-padding / 2;
    margin-bottom: $container-padding * 1.5;

    .avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      float: left;
      margin-right: $container-padding;
      background-color: $color-background-container;
    }

    .user-meta {
      height: 140px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;

      .nickname {
        font-size: 34px;
      }

      .pocket {
        font-size: 24px;
        color: $color-text-gray;
      }
    }

    .ic-setting {
      float: right;
      font-size: 40px;
      margin: 30px $container-padding / 2;
    }
  }

  .panel-wrap {
    background-color: #fff;
    box-shadow: 0 4px 14px rgba(0,0,0,.05);
    border-radius: $container-padding;
  }

  .user-social {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 30px 0;

    .panel-item {
      text-align: center;
      flex: 1;
      padding: 0 $container-padding;
      border-right: 1px solid rgba(0,0,0,.05);

      &:last-child {
        border-right-width: 0;
      }
    }

    .label {
      font-size: 28px;
      margin-bottom: 5px;
    }

    .value {
      font-size: 24px;
      margin-top: 5px;
      color: $color-text-gray;
    }
  }
}
</style>

<template>
  <view class="signed-panel">
    <view class="user-info">
      <image class="avatar" :src="$utils.resize(user.avatar, { width: 70 })" />
      <text class="icon ic-setting" @tap="toUserAbout" />
      <view class="user-meta">
        <view class="nickname">{{ user.nickname }}</view>
        <view class="pocket">
          <text>团子：{{ user.wallet_coin }}</text>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <text>光玉：{{ user.wallet_money }}</text>
        </view>
      </view>
    </view>
    <view class="user-social panel-wrap">
      <view class="panel-item">
        <view class="label">关注</view>
        <view class="value">0</view>
      </view>
      <view class="panel-item">
        <view class="label">粉丝</view>
        <view class="value">0</view>
      </view>
      <view class="panel-item">
        <view class="label">关注</view>
        <view class="value">0</view>
      </view>
      <view class="panel-item">
        <view class="label">粉丝</view>
        <view class="value">0</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'SignedPanel',
  setup() {
    const store = useStore()
    const user = computed(() => store.state.userInfo)

    const toUserAbout = () => {
      Taro.navigateTo({
        url: '/pages/user/about/index'
      })
    }

    return {
      user,
      toUserAbout
    }
  }
}
</script>
