<template>
  <view class="room-create">
    <ScrollView class="display-header" scroll-x="true">
      <view class="shim" />
      <view class="avatar-list">
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <view class="avatar select-btn">
          <text class="icon ic-add" @tap="toggleSearchDrawer" />
        </view>
      </view>
      <view class="shim" />
    </ScrollView>
    <SearchDrawer v-model="state.showDrawer" />
  </view>
</template>

<script>
import { reactive } from 'vue'
import { ScrollView } from '@tarojs/components'
import Avatar from './components/avatar'
import SearchDrawer from './components/searchDrawer'

export default {
  components: {
    Avatar,
    ScrollView,
    SearchDrawer
  },
  setup() {
    const state = reactive({
      showDrawer: false
    })

    const toggleSearchDrawer = () => {
      state.showDrawer = !state.showDrawer
    }

    return {
      state,
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
}
</style>
