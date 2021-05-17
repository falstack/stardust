<template>
  <view>
    <Navbar />
    <view class="listview">
      <UserCard
        v-for="item in state.result"
        :key="item.slug"
        :item="item"
      />
    </view>
  </view>
</template>

<script>
import http from '~/utils/http'
import Navbar from '~/components/navbar'
import UserCard from '~/components/user/card'
import { reactive, onMounted } from 'vue'

export default {
  components: {
    Navbar,
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
    })

    const initData = (refresh = false) => {
      if (state.loading) {
        return
      }

      if (!refresh) {
        state.loading = true
        state.error = null
      }

      http.get('user/about_flow')
        .then(res => {
          state.result = res.result
          state.noMore = res.result.length < 20
          state.fetched = true
        })
        .catch((err) => {
          state.error = err
        })
        .finally(() => {
          state.loading = false
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
          state.result = res.result
          state.noMore = res.result.length < 20
          state.fetched = true
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
      loadMore
    }
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
</style>
