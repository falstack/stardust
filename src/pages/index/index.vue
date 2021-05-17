<template>
  <view class="listview">
    <view
      v-if="!state.fetched && state.loading"
      class="loading-image"
    >
      <image :src="state.loadingImage" />
    </view>
    <view
      v-if="!state.result.length && state.error"
      class="loading-image"
    >
      <view>请求失败请重试</view>
      <button
        class="primary-btn"
        @tap="initData(true)"
      >
        重试
      </button>
    </view>
    <view class="list">
      <UserCard
        v-for="item in state.result"
        :key="item.slug"
        :item="item"
      />
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import http from '~/utils/http'
// import Navbar from '~/components/navbar'
import UserCard from '~/components/user/card'
import { reactive, onMounted } from 'vue'
import loadingImage from '../../assets/loading.gif'

export default {
  components: {
    // Navbar,
    UserCard
  },
  setup() {
    const state = reactive({
      result: [],
      noMore: false,
      nothing: false,
      loading: false,
      error: null,
      fetched: false,
      loadingImage
    })

    const initData = (refresh = false) => {
      if (state.loading) {
        return
      }

      state.error = null
      if (!refresh) {
        state.loading = true
      }

      http.get('user/about_flow')
        .then(res => {
          state.result = res.result
          state.noMore = res.result.length < 20
          state.nothing = !res.result.length
          state.fetched = true
        })
        .catch((err) => {
          state.error = err
        })
        .finally(() => {
          state.loading = false
          if (refresh) {
            Taro.stopPullDownRefresh()
          }
        })
    }

    const loadMore = () => {
      if (state.loading || state.noMore) {
        return
      }

      state.loading = true
      state.error = null

      http.get('user/about_flow', {
        seen_ids: state.result.map(_ => _.id).join(',')
      })
        .then(res => {
          state.result = state.result.concat(res.result)
          state.noMore = res.result.length < 20
        })
        .catch((err) => {
          state.error = err
        })
        .finally(() => {
          state.loading = false
        })
    }

    onMounted(() => {
      initData()
    })

    return {
      state,
      initData,
      loadMore
    }
  },
  onPullDownRefresh() {
    this.initData(true)
  },
  onReachBottom() {
    this.loadMore()
  },
  onShareAppMessage() {
    return {
      title: '测试分享',
      path: '/pages/index/index'
    }
  },
}
</script>

<style lang="scss">
.listview {
  background-color: #fff;

  .loading-image {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    image {
      display: block;
      width: 346px;
      height: 367px;
    }

    view {
      color: #6d757a;
    }

    button {
      margin-top: 20px;
      padding: 0 50px;
    }
  }

  .list {
    background-color: #f9f9f9;
  }
}
</style>
