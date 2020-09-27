<template>
  <view class="factory-room">
    <view class="header">
      <view class="display-header">
        <view class="shim" />
        <view class="avatar-list">
          <Avatar
            v-for="item in avatars"
            :key="item.id"
            :item="item"
          />
        </view>
        <view class="shim" />
      </view>
      <view class="tab-wrap">
        <view class="track-title">
          Time
        </view>
        <button
          v-for="item in tracks"
          :key="item.id"
          class="track-title"
          :class="{ 'is-active': item.id === focusId }"
          @tap="switchTrack(item)"
        >
          {{ convertTitle(item) }}
        </button>
      </view>
    </view>
    <view class="section">
      <Timeline />
      <Track
        v-for="track in content"
        :key="track.id"
        :item="track"
      />
      <view class="divider-line" />
      <button
        class="create-btn"
        @tap="openDrawer"
      >
        <text class="icon ic-add" />
      </button>
    </view>
    <view class="footer">
      <view class="footer-wrap">
        <text />
        <Control />
        <button
          v-if="avatars.length"
          class="play-btn primary-btn"
          @tap="handlePlay"
        >
          试播
        </button>
      </view>
      <view class="iphone-bottom-shim" />
    </view>
    <SearchDrawer />
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { computed } from 'vue'
import { useStore } from 'vuex'
import Track from './components/track'
import Avatar from './components/avatar'
import Control from './components/control'
import Timeline from './components/timeline'
import SearchDrawer from './components/search-drawer'
import toast from '~/utils/toast'

export default {
  components: {
    Track,
    Avatar,
    Control,
    Timeline,
    SearchDrawer
  },
  setup() {
    const store = useStore()

    const content = computed(() => {
      return store.state.live.content
    })

    const avatars = computed(() => {
      return store.state.live.editor.readers
    })

    const tracks = computed(() => {
      return store.state.live.content
    })

    const focusId = computed(() => {
      return store.state.live.editor.focusTrackId
    })

    const handlePlay = () => {
      Taro.navigateTo({
        url: '/pages/room/live/index'
      })
    }

    const openDrawer = () => {
      if (focusId.value === 8) {
        toast.info('暂未开放 BGM')
        return
      }
      store.commit('live/TOGGLE_SEARCH_DRAWER')
    }

    const switchTrack = (item) => {
      store.commit('live/UPDATE_FOCUS_TRACK', item)
    }

    const convertTitle = (item) => {
      if (item.type === 'bgm') {
        return 'BGM'
      }

      return (item.type === 'left' ? '左' : '右') + item.part
    }

    store.dispatch('live/initEditor')

    return {
      tracks,
      avatars,
      content,
      focusId,
      openDrawer,
      handlePlay,
      switchTrack,
      convertTitle
    }
  }
}
</script>

<style lang="scss">
.factory-room {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .header {
    position: relative;
    z-index: 1;
    width: 100%;
    flex-shrink: 0;
    padding-bottom: $container-padding;
    box-shadow: 0 2px 6px rgba(26,26,26,.1);

    .display-header {
      height: 100px;
      width: 100%;
      white-space: nowrap;
      overflow-x: auto;
      margin-bottom: $container-padding;

      .shim {
        display: inline-block;
        width: $container-padding;
        height: 100%;
        vertical-align: middle;
      }

      .avatar-list {
        vertical-align: middle;
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .avatar {
          flex-shrink: 0;
          margin-left: -$container-padding;
        }
      }

      .avatar:first-child {
        margin-left: 0;
      }
    }

    .tab-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      padding-top: $container-padding;
      border-top: 1PX solid #f6f6f6;

      .track-title {
        flex: 1;
        flex-shrink: 0;
        font-size: 24px;
        margin: 0 $container-padding;

        &.is-active {
          color: #ff6881;
          background-color: #F4F4F4;
        }
      }
    }
  }

  .section {
    position: relative;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    z-index: 0;

    .divider-line {
      position: fixed;
      left: 50%;
      top: 0;
      width: 0;
      bottom: 0;
      border-right: 1PX dashed #e7ecf2;
    }

    .create-btn {
      position: sticky;
      top: 0;
      left: 50%;
      transform: translate(-50%, -65px);
      width: 80px;
      height: 130px;
      line-height: 180px;
      background-color: #3D3D3D;
      border-radius: 40px;
      color: #fff;
    }
  }

  .footer {
    position: relative;
    z-index: 1;
    width: 100%;
    flex-shrink: 0;

    &-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      border-top: 1PX solid #f6f6f6;
      padding: 0 $container-padding;
      overflow: hidden;

      .control {
        position: relative;
        height: 100%;
        flex: 1;
      }

      .play-btn {
        height: 60px;
        line-height: 57px;
        font-size: 26px;
        flex-shrink: 0;
        width: 100px;
        margin-left: $container-padding;
      }
    }
  }
}
</style>
