<template>
  <view class="publish-bar">
    <button
      class="btn primary-btn-plain"
      @tap="openPublishDrawer(false)"
    >
      存草稿
    </button>
    <button
      class="btn primary-btn"
      @tap="openPublishDrawer(true)"
    >
      发布
    </button>
    <Drawer
      v-model="state.showDrawer"
      size="80%"
    >
      <view class="publish-drawer">
        <view class="pub-title">
          标题
        </view>
        <input
          v-model="state.title"
          type="text"
          placeholder="取一个有趣的标题吧"
          adjustPosition=""
          maxlength="20"
          class="input"
        >
        <view class="pub-title">
          简介
        </view>
        <textarea
          v-model="state.desc"
          type="text"
          placeholder="请输入内容介绍"
          showConfirmBar=""
          class="textarea"
          maxlength="1000"
        />
        <button
          class="primary-btn"
          @tap="handlePublish"
        >
          {{ state.isPublish ? '发布' : '存草稿' }}
        </button>
      </view>
    </Drawer>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Drawer from '~/components/drawer'
import { useStore } from 'vuex'
import { reactive } from 'vue'
import toast from '~/utils/toast'
import http from '~/utils/http'

export default {
  components: {
    Drawer
  },
  setup() {
    const store = useStore()
    const state = reactive({
      isPublish: false,
      showDrawer: false,
      title: store.state.live.info.title,
      desc: store.state.live.info.desc,
      loading: false
    })

    const handlePublish = () => {
      if (state.isPublish) {
        if (!state.title) {
          toast.info('请先输入标题')
          return
        }

        if (!state.desc) {
          toast.info('请先输入简介')
          return
        }
      }

      if (state.loading) {
        return
      }

      state.loading = true
      const title = state.title || new Date().toLocaleDateString()
      http.post('live_room/publish', {
        id: store.state.live.editor.draftId,
        content: store.state.live.content,
        readers: store.state.live.readers,
        title: title,
        desc: state.desc,
        is_publish: state.isPublish
      })
        .then(liveId => {
          if (state.isPublish) {
            Taro.redirectTo({
              url: `/pages/room/live/index?id=${liveId}`
            })
          } else {
            toast.info('保存成功')
            state.showDrawer = false
            store.commit('live/SET_DRAFT_ID', liveId)
            store.commit('live/UPDATE_LIVE_INFO', {
              title,
              desc: state.desc
            })
            state.loading = false
          }
        })
        .catch(err => {
          toast.info(err.message)
          state.loading = false
        })
    }

    const openPublishDrawer = (isPublish) => {
      state.isPublish = isPublish
      state.showDrawer = true
    }

    return {
      state,
      handlePublish,
      openPublishDrawer
    }
  }
}
</script>

<style lang="scss">
.publish-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: $container-padding;

  .btn {
    flex: 1;

    &:first-child {
      margin-right: $container-padding / 2;
    }

    &:last-child {
      margin-left: $container-padding / 2;
    }
  }

  .publish-drawer {
    padding: $container-padding;
    height: 100%;
    background-color: #fff;

    .pub-title {
      font-size: 30px;
      margin-bottom: $container-padding;
    }

    .input,
    .textarea {
      background-color: #f9f9f9;
      padding: $container-padding;
      border-radius: $container-padding;
      margin-bottom: $container-padding;
      font-size: 28px;
    }

    .input {
      height: $container-padding * 4;
      line-height: $container-padding * 3;
    }
  }
}
</style>
