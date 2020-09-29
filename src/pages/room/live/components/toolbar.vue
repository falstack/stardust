<template>
  <view class="toolbar">
    <view class="comment">
      <input
        v-model="state.comment"
        type="text"
      >
    </view>
    <view class="control">
      <button>播放</button>
      <button>简介</button>
      <button>点赞</button>
      <button>投币</button>
      <button>收藏</button>
      <button>转发</button>
    </view>
  </view>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({
      comment: ''
    })

    return {
      state
    }
  }
}
</script>

<style lang="scss">
.toolbar {
  background-color: #f9f9f9;

  .comment {
    padding: 0 $container-padding;

    input {
      height: 80px;
      background-color: #fff;
      border-radius: 40px;
      padding: 0 40px;
      margin: $container-padding 0;
      line-height: 80px;
    }
  }

  .control {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>
