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

<template>
  <view v-if="visible" class="dialog">
    <view class="dialog__mask" @tap="handleClose" />
    <view class="dialog__wrap">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  name: 'VDialog',
  components: {},
  props: {
    value: {
      required: true,
      type: Boolean
    },
    maskClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: this.value
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleClose() {
      if (!this.maskClose) {
        return
      }
      this.visible = false
    }
  }
}
</script>
