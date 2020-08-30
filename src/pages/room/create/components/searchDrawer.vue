<template>
  <Drawer
    v-model="state.showDrawer"
    :show-mask="false"
    size="calc(100% - 200rpx)"
  >
    <view class="search-drawer">
      <Search v-model="state.keyword" />
    </view>
    <view class="flow-wrap">
      <text @tap="handleAddVoice">吉良吉影</text>
    </view>
  </Drawer>
</template>

<script>
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'
import Search from '~/components/search'
import Drawer from '~/components/drawer'

export default {
  components: {
    Drawer,
    Search
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDrawer: false,
      keyword: ''
    })

    watch(
      () => store.state.live.editor.showVoiceDrawer,
      (val) => {
        state.showDrawer = val
      }
    )

    const handleAddVoice = () => {

    }

    return {
      state,
      handleAddVoice
    }
  }
}
</script>

<style lang="scss">
.drawer__wrap {
  background-color: #3C3F41;
}
</style>
