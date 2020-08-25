<template>
  <view class="code-input">
    <input
      v-model="state.code"
      class="input"
      type="number"
      auto-focus="true"
      confirm-type="send"
      adjustPosition=""
      :maxlength="$props.length"
      :disabled="state.disabled"
      :style="`padding-left:${36 * state.count + 18}px`"
    >
    <view class="code-input__wrap">
      <view
        v-for="(item, index) in $props.length"
        :key="item"
        :class="{ 'is-active': state.count === index }"
        class="item"
      >
        {{ state.code[index] }}
      </view>
    </view>
  </view>
</template>

<script>
// TODO：code-input 只要在 375 宽的时候和外面的 input 等高。。
import { reactive, watch } from 'vue'

export default {
  name: 'CodeInput',
  props: {
    modelValue: {
      required: true,
      type: [String, Number]
    },
    length: {
      type: Number,
      default: 6
    }
  },
  setup(props, ctx) {
    const state = reactive({
      code: props.modelValue,
      loading: false,
      disabled: false,
      count: 0
    })

    watch(
      () => state.code,
      (val) => {
        state.count = val.length
        ctx.emit('update:modelValue', val)
        if (state.count === props.length) {
          ctx.emit('submit')
        }
      }
    )

    watch(
      () => props.modelValue,
      (val) => {
        state.code = val
      }
    )

    return {
      state
    }
  }
}
</script>

<style lang="scss">
$item-size: 80px;

.code-input {
  position: relative;
  width: 100%;
  height: $item-size;

  .input {
    opacity: 0;
    display: block;
    width: 100%;
    height: $item-size;
    line-height: $item-size;
    caret-color: $color-red;
    color: transparent;
    box-sizing: border-box;
    padding-left: $item-size / 2 - 2;
    margin: 0 auto;
  }

  &__wrap {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: $item-size;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    user-select: none;
    transform: translateX(-50%);

    .item {
      width: $item-size;
      height: $item-size;
      border-radius: 10px;
      text-align: center;
      border: 2px solid #CCD6DD;
      line-height: $item-size - 2;
      margin-right: 10px;
      flex-shrink: 0;
      transition: border-color 200ms;

      &.is-active {
        border-color: $color-red;
      }
    }
  }
}
</style>
