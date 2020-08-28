<template>
  <view class="search-wrap">
    <input
      v-model="value"
      class="input"
      type="text"
      auto-focus="true"
      confirm-type="search"
      adjustPosition=""
      :placeholder="placeholder"
    >
  </view>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    modelValue: {
      required: true,
      type: String
    },
    placeholder: {
      type: String,
      default: '输入要搜索的内容'
    }
  },
  setup(props, ctx) {
    const value = ref(props.modelValue)

    watch(
      value,
      (val) => {
        ctx.emit('update:modelValue', val)
      }
    )

    watch(
      () => props.modelValue,
      (val) => {
        value.value = val
      }
    )

    return {
      value
    }
  }
}
</script>

<style lang="scss">
</style>
