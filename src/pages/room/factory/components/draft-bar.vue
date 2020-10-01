<template>
  <view class="draft-bar">
    <button class="btn" @tap="openDraftDrawer">
      草稿箱
    </button>
    <Drawer v-model="state.showDraftDrawer">
      <view class="draft-drawer">
        <view
          v-if="!drafts.length"
          class="nothing"
        >
          还没有创建草稿
        </view>
        <button
          v-for="item in drafts"
          :key="item.id"
          class="draft-item"
          @tap="switchDraft(item)"
        >
          <view class="edit">
            <text
              class="iconfont ic-delete"
              @tap.stop="handleDelete(item)"
            />
          </view>
          <view class="content">
            <view class="title">
              {{ item.title }}
            </view>
            <view class="desc">
              {{ item.desc || '暂无简介' }}
            </view>
            <view class="updated_at">
              {{ $utils.timeAgo(item.updated_at) }}
            </view>
          </view>
        </button>
      </view>
    </Drawer>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Drawer from '~/components/drawer'
import { useStore } from 'vuex'
import { reactive, computed } from 'vue'
import toast from '~/utils/toast'

export default {
  name: '',
  components: {
    Drawer
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDraftDrawer: false
    })

    const drafts = computed(() => {
      return store.state.list.userLiveDraft
    })

    const openDraftDrawer = () => {
      state.showDraftDrawer = true
      store.dispatch('list/getUserLiveDraft')
    }

    const switchDraft = (item) => {
      store.dispatch('live/loadData', item)
        .then(() => {
          state.showDraftDrawer = false
        })
        .catch(err => {
          toast.info(err.message)
        })
    }

    const handleDelete = (item) => {
      Taro.showModal({
        title: '确认要删除吗?',
        content: '删除后无法恢复',
        cancelText: '取消',
        confirmText: '删除',
        confirmColor: '#FB7299'
      })
        .then(res => {
          if (res.cancel) {
            return
          }
          store.dispatch('list/delUserLiveDraft', item)
            .then(() => {
              toast.info('删除成功')
            })
            .catch(err => {
              toast.info(err.message)
            })
        })
    }

    return {
      openDraftDrawer,
      handleDelete,
      switchDraft,
      drafts,
      state
    }
  }
}
</script>

<style lang="scss">
.draft-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;

  .btn {
    padding-left: $container-padding / 2;
    padding-right: $container-padding / 2;
  }

  .draft-drawer {
    height: 100%;
    overflow-y: auto;

    .nothing {
      font-size: 30px;
      text-align: center;
      padding: $container-padding;
    }

    .draft-item {
      padding: $container-padding;
      border-bottom: 1PX solid #e7ecf2;
      border-radius: 0;
      text-align: left;
      line-height: 1.4;

      .content {
        overflow: hidden;

        .title {
          font-size: 32px;
          font-weight: bold;
          @extend %oneline;
        }

        .desc {
          font-size: 28px;
          padding: $container-padding 0;
        }

        .updated_at {
          font-size: 28px;
        }
      }

      .edit {
        float: right;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-left: $container-padding;
      }
    }
  }
}
</style>
