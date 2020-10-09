<template>
  <view class="tabbar">
    <view class="tabbar__wrap">
      <view class="tabbar__mask" />
      <view class="tabbar__text">
        <view
          class="tab"
          @tap="handleClick(0)"
        >
          首页
        </view>
        <view class="tab">
          <view class="create-btn" @tap="handleCreate">
            <view class="right" />
            <view class="left" />
          </view>
        </view>
        <view
          class="tab"
          @tap="handleClick(1)"
        >
          我的
        </view>
      </view>
    </view>
    <view class="tabbar__shim" />
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import toast from '~/utils/toast'

export default {
  props: {
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props, ctx) {
    const store = useStore()

    const handleClick = (index) => {
      ctx.emit('switch', index)
    }

    const handleCreate = () => {
      if (store.getters.isGuest) {
        toast.info('请先登录')
        return
      }

      Taro.navigateTo({
        url: '/pages/room/factory/index'
      })
    }

    return {
      handleClick,
      handleCreate
    }
  }
}
</script>

<style lang="scss">
.tabbar {
  &__shim,
  &__wrap {
    height: 100px;
    box-sizing: content-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }

  &__wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 888;
    border-top: 1PX solid #e7e7e7;
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255,255,255,0.72);
    backdrop-filter: saturate(180%) blur(20px);
    z-index: 0;
  }

  &__text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .tab {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #3D3D3D;
      font-size: 22px;
      height: 100%;
    }

    .create-btn {
      position: relative;
      width: 88px;
      height: 62px;
      background-color: $color-red;
      border-radius: 12px;
      margin: 0 auto;

      .right,
      .left {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 5px;
        border-radius: 5px;
        width: 40%;
        background-color: #fff;
      }

      .left {
        transform: translate(-50%, -50%);
      }

      .right {
        transform: translate(-50%, -50%) rotate(90deg);
      }
    }

    .badge {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(25%);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      height: 34px;
      min-width: 34px;
      background-color: $color-red;
      color: #fff;
      padding: 0 10px;
      border-radius: 34px;
      border: 2px solid #fff;
    }
  }
}
</style>
