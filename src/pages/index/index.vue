<template>
  <view
    v-if="user && user.email"
    class="listview"
  >
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
    <view
      v-if="state.nothing"
      class="nothing-state"
    >
      <image :src="state.nothingImage" />
      <view class="tips">
        <view>还没有数据，你可以：</view>
        <view>1. 完善自己的资料让自己展示在首页</view>
        <view>2. 把小程序分享给更多的同事，一起加入我们</view>
        <view>PS：你只能看到邮箱为 @{{ user.email.split('@').pop() }} 后缀的用户</view>
      </view>
    </view>
    <view
      v-if="state.result.length"
      class="list"
    >
      <view class="filter">
        仅为您展示邮箱为 @{{ user.email.split('@').pop() }} 后缀的用户
      </view>
      <UserCard
        v-for="item in state.result"
        :key="item.slug"
        :item="item"
      />
    </view>
  </view>
  <view
    v-else
    class="summary-tip"
  >
    <image :src="state.BannerImage" />
    <view>
      1. 签约幸福是一个追求"真善美"的恋爱圈子
    </view>
    <view>
      2. 在这里，只有拥有同一个邮箱后缀的人才能看到彼此，既保留互联网的便利性又隔离了虚假信息
    </view>
    <view>
      3. 一旦你找到了合适的交往对象，彼此的"单身码"就会改变颜色，有助于识别海王，亦是为了约束己身
    </view>
    <view>
      4. 目前仅在「哔哩哔哩」内部试用，希望能够帮到大家，更多功能以及更完善的体验期待你的反馈
    </view>
    <button
      class="primary-btn"
      @tap="toHome"
    >
      前往注册
    </button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import http from '~/utils/http'
// import Navbar from '~/components/navbar'
import UserCard from '~/components/user/card'
import { useStore } from 'vuex'
import { reactive, onMounted, watch, computed } from 'vue'
import { resize } from '~/utils'
import loadingImage from '../../assets/loading.gif'
import nothingImage from '../../assets/nothing.png'
import BannerImage from '../../assets/banner.jpeg'

export default {
  components: {
    // Navbar,
    UserCard
  },
  setup() {
    const store = useStore()
    const state = reactive({
      result: [],
      noMore: false,
      nothing: false,
      loading: false,
      error: null,
      fetched: false,
      nothingImage,
      loadingImage,
      BannerImage
    })

    const user = computed(() => store.state.userInfo)

    const initData = (refresh = false) => {
      if (!user.value) {
        Taro.stopPullDownRefresh()
        return
      }

      if (state.loading) {
        return
      }

      state.error = null
      if (!refresh) {
        state.loading = true
      }

      http.get('user/about_flow', {
        org: user.value.email.split('@').pop()
      })
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
        org: user.value.email.split('@').pop(),
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

    const toHome = () => {
      Taro.switchTab({
        url: '/pages/user/home/index'
      })
    }

    onMounted(() => {
      watch(user, (val) => {
        if (val && val.email) {
          initData()
        }
      }, {
        immediate: true
      })
    })

    return {
      user,
      state,
      toHome,
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
      title: '爱情就在在你身边',
      path: '/pages/index/index',
      imageUrl: resize('https://web.calibur.tv/owner/icon.png', { width: 500, height: 400, dpr: 1 })
    }
  },
}
</script>

<style lang="scss">
.listview {
  background-color: #fff;

  .filter {
    background-color: #fff;
    padding: $container-padding;
    color: $color-text-gray;
  }

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

.nothing-state {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .tips {
    padding: 0 $container-padding;

    view {
      margin: $container-padding / 2 0;
      font-size: 28px;
      color: $color-text-gray;
    }
  }
}

.summary-tip {
  padding: 0 50px;
  background-color: #fff;
  min-height: 100vh;

  image {
    width: 400px;
    height: 400px;
    display: block;
    margin: 0 auto -40px;
  }

  view {
    margin-bottom: 20px;
  }

  button {
    margin-top: 40px;
  }
}
</style>
