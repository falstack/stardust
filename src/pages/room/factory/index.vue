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
        <button
          v-for="item in tracks"
          :key="item.id"
          class="track-title"
          :class="{ 'is-active': item.id === focusId }"
          @tap="switchTrack(item)"
        >
          {{ (item.type === 'left' ? '左' : '右') + item.part }}
        </button>
      </view>
    </view>
    <view class="section">
      <Track
        v-for="track in content"
        :key="track.id"
        :item="track"
      />
      <CreateBtn />
    </view>
    <view class="footer">
      <view class="footer-wrap">
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
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { computed } from 'vue'
import { useStore } from 'vuex'
import Track from './components/track'
import Avatar from './components/avatar'
import Control from './components/control'
import CreateBtn from './components/create-btn'

export default {
  components: {
    Track,
    Avatar,
    Control,
    CreateBtn
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

    const switchTrack = (item) => {
      store.commit('live/UPDATE_FOCUS_TRACK', item)
    }

    store.dispatch('live/initEditor')

    return {
      tracks,
      avatars,
      content,
      focusId,
      handlePlay,
      switchTrack
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

      .control {
        flex: 1;
      }

      .play-btn {
        text-align: center;
        width: 100px;
        height: 60px;
        line-height: 57px;
        font-size: 26px;
      }
    }
  }
}
</style>
