<template>
  <view class="user-home">
    <view class="iphone-x-shim" />
    <view class="user-panel">
      <GuestPanel v-if="isGuest" />
      <SignedPanel v-else />
    </view>
  </view>
</template>

<script>
import GuestPanel from './components/GuestPanel'
import SignedPanel from './components/SignedPanel'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserHome',
  components: {
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
  padding-top: 120px;

  .user-panel {
    padding: $container-padding;
  }
}
</style>
