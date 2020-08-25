<template>
  <view
    v-if="visible"
    class="dialog"
  >
    <view
      class="dialog__mask"
      @tap="closeDialog"
    />
    <view class="dialog__wrap">
      <slot />
    </view>
  </view>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'VDialog',
  props: {
    modelValue: {
      required: true,
      type: Boolean
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

    const closeDialog = () => {
      visible.value = false
    }

    const clickMask = () => {
      if (!props.maskClose) {
        return
      }
      closeDialog()
    }

    return {
      visible,
      clickMask,
      closeDialog
    }
  }
}
</script>

<style lang="scss">
.dialog {
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 580px;
    height: auto;
    background-color: $bg-color;
    padding: $container-padding;
    border-radius: $container-padding;
  }
}
</style>
