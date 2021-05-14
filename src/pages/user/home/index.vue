<template>
  <view class-name="user-home">
    <Navbar />
    <view class-name="user-panel">
      <GuestPanel v-if="isGuest" />
      <SignedPanel v-else />
    </view>
  </view>
</template>

<script>
import Navbar from '~/components/navbar'
import GuestPanel from './components/GuestPanel'
import SignedPanel from './components/SignedPanel'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserHome',
  components: {
    Navbar,
    GuestPanel,
    SignedPanel
  },
  setup() {
    const store = useStore()
    const isGuest = computed(() => store.getters.isGuest)

    return {
      isGuest
    }
  }
}
</script>

<style lang="scss">
.user-home {
  .user-panel {
    padding: $container-padding;
  }
}
</style>
