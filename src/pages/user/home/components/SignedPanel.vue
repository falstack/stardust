<template>
  <view class="signed-panel">
    <navigator
      class="user-info"
      :url="`/pages/user/public/index?slug=${user.slug}`"
      hover-class="none"
    >
      <image
        class="avatar"
        :src="$utils.resize(user.avatar, { width: 70 })"
      />
      <view class="user-meta">
        <view class="nickname">
          {{ user.nickname }}
        </view>
        <!--
        <view class="pocket">
          <text>团子：{{ user.wallet_coin }}</text>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <text>光玉：{{ user.wallet_money }}</text>
        </view>
        -->
      </view>
      <view class="iconfont ic-forward" />
    </navigator>
    <!--
    <view class="user-social panel-wrap">
      <view class="panel-item">
        <view class="label">
          关注
        </view>
        <view class="value">
          0
        </view>
      </view>
      <view class="panel-item">
        <view class="label">
          粉丝
        </view>
        <view class="value">
          0
        </view>
      </view>
      <view class="panel-item">
        <view class="label">
          关注
        </view>
        <view class="value">
          0
        </view>
      </view>
      <view class="panel-item">
        <view class="label">
          粉丝
        </view>
        <view class="value">
          0
        </view>
      </view>
    </view>
    -->
    <view class="hr" />
    <view class="menu-panel">
      <navigator url="/pages/user/profile/index">
        <view class="iconfont ic-gerenziliao" />
        <view class="text">
          个人资料
        </view>
      </navigator>
      <navigator url="/pages/user/realname/index">
        <view class="iconfont ic-shiming" />
        <view class="text">
          实名认证
        </view>
      </navigator>
      <navigator url="/pages/user/readme/index">
        <view class="iconfont ic-duixiang" />
        <view class="text">
          择偶标准
        </view>
      </navigator>
      <navigator url="/pages/user/readme/index">
        <view class="iconfont ic-ico" />
        <view class="text">
          单身码
        </view>
      </navigator>
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'SignedPanel',
  setup() {
    const store = useStore()
    const user = computed(() => store.state.userInfo)

    return {
      user
    }
  }
}
</script>

<style lang="scss">
.signed-panel {
  .user-info {
    position: relative;
    padding-left: $container-padding;
    margin-bottom: $container-padding * 1.5;
    padding-right: 100px;

    .avatar {
      width: 140px;
      height: 140px;
      border-radius: 10%;
      float: left;
      margin-right: $container-padding;
      background-color: $color-background-container;
      border: 1px solid #fafafa;
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
        width: 100%;
        @extend %oneline;
      }

      .pocket {
        font-size: 24px;
        color: $color-text-gray;
      }
    }

    .ic-forward {
      position: absolute;
      right: 30px;
      top: 50px;
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

  .hr {
    height: 30px;
    background-color: #f9f9f9;
  }

  .menu-panel {
    navigator {
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: $container-padding;
      border-bottom: 1px solid rgba(0,0,0,.05);
    }

    .iconfont {
      margin-right: 10px;
      font-size: 40px;
    }

    .ic-gerenziliao {
      color: #fb7299;
    }

    .ic-shiming {
      color: goldenrod;
    }

    .ic-duixiang {
      color: #00a1d6;
    }

    .ic-ico {
      color: limegreen;
    }
  }
}
</style>
