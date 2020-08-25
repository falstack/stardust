<template>
  <view
    v-if="visible"
    class="drawer"
  >
    <view
      class="drawer__mask"
      @tap="clickMask"
    />
    <view
      class="drawer__wrap"
      :style="{ height: size }"
    >
      <template v-if="size === '100%'">
        <view class="drawer__close">
          <text
            class="iconfont ic-cancel"
            @tap="closeDrawer"
          />
        </view>
        <view class="iphone-x-shim" />
      </template>
      <slot />
    </view>
  </view>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'VDrawer',
  props: {
    modelValue: {
      required: true,
      type: Boolean
    },
    size: {
      type: String,
      default: '60%'
    },
    maskClose: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const visible = ref(props.modelValue)

    watch(
      visible,
      (val) => {
        ctx.emit('update:modelValue', val)
      }
    )

    watch(
      () => props.modelValue,
      (val) => {
        visible.value = val
      }
    )

    const closeDrawer = () => {
      visible.value = false
    }

    const clickMask = () => {
      if (!props.maskClose) {
        return
      }
      closeDrawer()
    }

    return {
      visible,
      clickMask,
      closeDrawer
    }
  }
}
</script>

<style lang="scss">
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  &__wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $bg-color;
    animation: scroll-enter 300ms;

    .drawer__close {
      padding-top: 110px;
      padding-left: $container-padding;

      .iconfont {
        font-size: 50px;
        font-weight: bold;
      }
    }
  }

  @keyframes scroll-enter {
    0% {
      transform: translateY(100%);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
