<template>
  <view class="room-create">
    <ScrollView class="display-header" scroll-x="true">
      <view class="shim" />
      <view class="avatar-list">
        <Avatar />
        <view class="avatar select-btn">
          <text class="icon ic-add" @tap="toggleSearchDrawer" />
        </view>
      </view>
      <view class="shim" />
    </ScrollView>
    <view v-if="false" />
    <view v-else class="track-wrap" scroll-x="true">
      <Track
        v-for="track in content"
        :key="track.id"
        :item="track"
      />
    </view>
    <Control />
    <SearchDrawer v-model="state.showDrawer" />
  </view>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { ScrollView } from '@tarojs/components'
import SearchDrawer from './components/searchDrawer'
import Avatar from './components/avatar'
import Track from './components/track'
import Control from './components/control'

export default {
  components: {
    Track,
    Avatar,
    Control,
    ScrollView,
    SearchDrawer
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDrawer: false
    })

    const toggleSearchDrawer = () => {
      state.showDrawer = !state.showDrawer
    }

    const content = computed(() => {
      return store.state.live.content
    })

    return {
      state,
      content,
      toggleSearchDrawer
    }
  }
}
</script>

<style lang="scss">
.room-create {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #272822;
  color: #f5f5f7;

  .display-header {
    background-color: #3C3F41;
    height: 200px;
    width: 100%;
    white-space: nowrap;

    .shim {
      display: inline-block;
      width: 40px;
      height: 100%;
      vertical-align: middle;
    }

    .avatar-list {
      vertical-align: middle;
      display: inline-flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .avatar:first-child {
      margin-left: 0;
    }

    .select-btn {
      background-color: #f5f5f7;

      .ic-add {
        font-size: 50px;
        color: #3C3F41;
        display: block;
        width: 100%;
        height: 100%;
        line-height: 100px;
        text-align: center;
      }
    }
  }

  .track-wrap {
    margin-top: 100px;
    overflow-x: auto;
  }
}
</style>
