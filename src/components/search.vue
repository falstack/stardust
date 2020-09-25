<template>
  <view class="search-wrap">
    <view class="input-wrap">
      <text class="iconfont ic-search" />
      <input
        v-model="value"
        class="input"
        type="text"
        :auto-focus="autofocus ? 'true' : ''"
        confirm-type="search"
        adjustPosition=""
        :placeholder="placeholder"
      >
      <text
        v-if="value"
        class="iconfont ic-cancel"
      />
    </view>
    <button
      v-if="showCancel"
      class="close-btn"
      hover-class="none"
      @tap="handleClose"
    >
      取消
    </button>
  </view>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    modelValue: {
      required: true,
      type: String
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '输入要搜索的内容'
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const store = useStore()
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

    const handleClose = () => {
      ctx.emit('close')
    }

    return {
      value,
      handleClose
    }
  }
}
</script>

<style lang="scss">
.search-wrap {
  padding: 14px 24px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .input-wrap {
    border-radius: 30px;
    background-color: #f4f4f4;
    height: 60px;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .input {
      flex: 1;
      display: block;
      height: 60px;
      line-height: 60px;
      font-size: 26px;
      color: #212121;
    }

    .iconfont {
      display: block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #999;
      flex-shrink: 0;
    }
  }

  .close-btn {
    font-size: 30px;
    color: #ff6881;
    margin-left: 20px;
    flex-shrink: 0;
  }
}
</style>
