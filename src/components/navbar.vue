<template>
  <view class="navbar">
    <view class="navbar__header">
      <view
        :style="wrapStyle"
        class="navbar__wrap"
      >
        <view
          :style="coreStyle"
          :class="{ 'has-bg': state.hasBg }"
          class="navbar__core"
        >
          <slot name="title">
            <view
              v-if="showBack"
              class="iconfont ic-back"
              @tap="goBack"
            />
            <view
              v-else
              class="iconfont"
            />
            <view class="title">
              {{ title }}
            </view>
          </slot>
        </view>
      </view>
      <view
        :style="shimStyle"
        :class="{ 'has-bg': state.hasBg }"
        class="navbar__shim"
      >
        <template v-if="state.hasBg">
          <view class="navbar__bg">
            <image
              mode="aspectFill"
              :src="$utils.resize(background, { mode: 0, width: 375 })"
            />
          </view>
          <view class="navbar__mask" />
        </template>
        <slot />
      </view>
    </view>
  </view>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { getMenuRect, back } from '~/utils'
import cache from '~/utils/cache'

export default {
  props: {
    background: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const state = reactive({
      rect: cache.get('MENU-RECT', null),
      hasBg: !!props.background
    })

    const systemInfo = cache.get('SYSTEM_INFO')

    const wrapStyle = computed(() => {
      return {
        height: `${state.rect ? state.rect.height + state.rect.margin * 2 : '50'}px`,
        paddingTop: `${systemInfo.statusBarHeight}px`
      }
    })

    const shimStyle = computed(() => {
      return {
        paddingTop: `${(state.rect ? state.rect.height + state.rect.margin * 2 : 50) + systemInfo.statusBarHeight}px`
      }
    })

    const coreStyle = computed(() => {
      if (!state.rect) {
        return null
      }

      return {
        width: `${state.rect.width}px`,
        height: `${state.rect.height}px`,
        marginBottom: `${state.rect.margin}px`
      }
    })

    const calcMenuRect = () => {
      if (state.rect) {
        return
      }

      setTimeout(() => {
        state.rect = getMenuRect()
      }, 5000)
    }

    const goBack = () => {
      back()
    }

    onMounted(() => {
      calcMenuRect()
    })

    return {
      state,
      goBack,
      shimStyle,
      wrapStyle,
      coreStyle
    }
  }
}
</script>

<style lang="scss">
.navbar {
  &__wrap,
  &__shim {
    box-sizing: content-box;
  }

  &__wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 888;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
  }

  &__shim {
    background-color: transparent;
    height: 0;

    &.has-bg {
      position: relative;
      height: auto !important;
      overflow: hidden;
    }
  }

  &__core {
    width: 400px;
    height: 88px;
    padding-right: $container-padding;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    &.has-bg {
      color: #fff;
    }

    .iconfont {
      height: 88px;
      width: 88px;
      line-height: 88px;
      text-align: center;
      font-size: 46px;
      flex-shrink: 0;
    }

    .title {
      flex: 1;
      @extend %oneline;
    }
  }

  &__bg {
    position: absolute;
    left: -12.5%;
    top: -12.5%;
    width: 125%;
    height: 125%;
    z-index: -1;
    // @include filter-blur(20);

    image {
      position: relative;
      left: 10%;
      top: 10%;
      width: 80%;
      height: 80%;
    }
  }

  &__mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #000;
    opacity: 0.3;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(47,47,47,0) 100%);
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(47,47,47,0) 100%);
    }
  }
}
</style>
