<template>
  <view class="toolbar">
    <view class="comment">
      <input
        v-model="state.comment"
        type="text"
      >
    </view>
    <view class="control">
      <button
        hover-class="none"
        class="iconfont ic-playing"
      />
      <button
        hover-class="none"
        class="avatar-wrap"
      >
        <image
          class="avatar"
          :src="$utils.resize(author.avatar, { width: 60 })"
        />
      </button>
      <button
        hover-class="none"
        class="iconfont ic-good_fill"
      />
      <button
        hover-class="none"
        class="iconfont ic-reward_fill"
      />
      <button
        hover-class="none"
        class="iconfont ic-mark_fill"
      />
      <button
        hover-class="none"
        class="iconfont ic-share"
      />
    </view>
  </view>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const state = reactive({
      comment: ''
    })

    const author = computed(() => {
      return store.state.live.info.author
    })

    return {
      state,
      author
    }
  }
}
</script>

<style lang="scss">
.toolbar {
  background-color: #f9f9f9;

  .comment {
    padding: 0 $container-padding;
    margin-bottom: -$container-padding;

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

    button {
      padding-left: 10px;
      padding-right: 10px;
      flex-shrink: 0;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .iconfont {
      font-size: 46px;
    }
  }
}
</style>
