<style lang="scss">
.create-btn-wrap {
  position: relative;
  padding: 20px 0;

  .btn {
    position: relative;
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #ccd0d7;
    background-color: #fff;
    line-height: 40px;
    font-size: 28px;
    font-weight: 500;
    text-align: center;
    margin: 0 auto;
    z-index: 1;
  }

  .box {
    position: absolute;
    left: 50%;
    top: 80px;
    margin-left: -220px;
    width: 440px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    animation: popup-enter 300ms;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    z-index: 2;

    .row {
      font-size: 0;
      padding-bottom: 10px;
      padding-top: 5px;

      view {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 33.3%;
        height: 100px;

        .text {
          font-size: 24px;
          display: block;
        }

        .iconfont {
          font-size: 40px;
        }
      }

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #f6f6f6;
      }
    }
  }

  @keyframes popup-enter {
    0% {
      transform: scale(1.1);
    }

    50% {
      transform: scale(0.9);
    }

    100% {
      transform: scale(1);
    }
  }
}
</style>

<template>
  <view class="create-btn-wrap">
    <view v-if="trigger" class="box">
      <view class="row">
        <view @tap="emitCreate('img')">
          <text class="iconfont ic-image" />
          <text class="text">图片</text>
        </view>
        <view @tap="emitCreate('txt')">
          <text class="iconfont ic-text" />
          <text class="text">段落</text>
        </view>
        <view @tap="emitCreate('use')">
          <text class="iconfont ic-use" />
          <text class="text">引用</text>
        </view>
      </view>
      <view class="row">
        <view @tap="emitCreate('list')">
          <text class="iconfont ic-list" />
          <text class="text">列表</text>
        </view>
        <view @tap="emitCreate('title')">
          <text class="iconfont ic-title" />
          <text class="text">标题</text>
        </view>
        <view @tap="emitCreate('divider')">
          <text class="iconfont ic-divider" />
          <text class="text">分割线</text>
        </view>
      </view>
    </view>
    <button class="btn" @tap="handleClick">+</button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

export default {
  name: 'CreateBtn',
  props: {
    slug: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      trigger: false
    }
  },
  created() {
    Taro.eventCenter.on('OPEN_CREATE_POPUP', ({ slug }) => {
      if (this.slug === slug) {
        this.trigger = !this.trigger
      } else {
        this.trigger = false
      }
    })
  },
  methods: {
    handleClick() {
      Taro.eventCenter.trigger('OPEN_CREATE_POPUP', {
        slug: this.slug
      })
    },
    emitCreate(type) {
      Taro.eventCenter.trigger('CREATE_NOTE_ITEM', {
        slug: this.slug,
        type
      })
      this.trigger = false
    }
  }
}
</script>
