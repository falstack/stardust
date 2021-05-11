<template>
  <view class="index">
    <Navbar />
    <LaunchPage
      v-if="state.tabIndex === 0"
      ref="refPage0"
    />
    <HomePage
      v-else-if="state.tabIndex === 1"
      ref="refPage1"
    />
    <Tabbar @switch="handleTabSwitch" />
  </view>
</template>

<script>
import { ref, reactive } from 'vue'
import LaunchPage from '~/pages/index/components//index'
import HomePage from '~/pages/user/home/components/index'
import Navbar from '~/components/navbar'
import Tabbar from '~/components/tabbar'

export default {
  components: {
    Navbar,
    Tabbar,
    HomePage,
    LaunchPage
  },
  setup() {
    const refPage0 = ref(null)
    const refPage1 = ref(null)
    const state = reactive({
      tabIndex: 0
    })

    const handleTabSwitch = (index) => {
      state.tabIndex = index
    }

    return {
      state,
      refPage0,
      refPage1,
      handleTabSwitch
    }
  },
  onShareAppMessage() {
    return {
      title: '测试分享',
      path: '/pages/index/index'
    }
  },
  onReachBottom() {
    switch (this.state.tabIndex) {
      case 0:
        this.refPage0.listRef.loadMore()
        break
    }
  }
}
</script>
