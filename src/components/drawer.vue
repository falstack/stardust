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
    background-color: #fff;
    animation: scroll-enter 300ms;
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

<template>
  <view v-if="visible" class="drawer">
    <view class="drawer__mask" />
    <view class="drawer__wrap" :style="{ height: size }">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  name: 'VDrawer',
  components: {},
  props: {
    value: {
      required: true,
      type: Boolean
    },
    size: {
      type: String,
      default: '60%'
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
  created() {},
  mounted() {},
  methods: {}
}
</script>
