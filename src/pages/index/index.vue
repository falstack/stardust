<template>
  <view class="index">
    <LaunchPage v-if="state.tabIndex === 0" />
    <HomePage v-else-if="state.tabIndex === 1" />
    <Tabbar @switch="handleTabSwitch" />
  </view>
</template>

<script>
import { reactive } from 'vue'
import LaunchPage from '~/pages/index/components//index'
import HomePage from '~/pages/user/home/components/index'
import Tabbar from '~/components/tabbar'

export default {
  components: {
    Tabbar,
    HomePage,
    LaunchPage
  },
  setup() {
    const state = reactive({
      tabIndex: 0
    })

    const handleTabSwitch = (index) => {
      state.tabIndex = index
    }

    return {
      state,
      handleTabSwitch
    }
  }
}
</script>
