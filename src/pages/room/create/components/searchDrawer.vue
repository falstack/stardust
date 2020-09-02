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
      <view
        v-for="item in state.source"
        :key="item.id"
        class="voice-item"
        @tap="handleAddVoice(item)"
      >
        {{ item.reader.nickname }}
      </view>
    </view>
  </Drawer>
</template>

<script>
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'
import Search from '~/components/search'
import Drawer from '~/components/drawer'
import source from '../voice.json'
import { colors } from './utils'

export default {
  components: {
    Drawer,
    Search
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDrawer: false,
      keyword: '',
      source
    })

    watch(
      () => store.state.live.editor.showVoiceDrawer,
      (val) => {
        state.showDrawer = val
      }
    )

    const handleAddVoice = (item) => {
      const color = colors[item.reader.id % colors.length]
      const data = {
        ...item,
        margin_left: 0,
        begin_at: 0,
        start_at: 0,
        ended_at: 0,
        volume: 100,
        color_bubble: color.bg,
        color_text: color.text,
        author_id: store.state.userInfo ? store.state.userInfo.id : 0
      }

      store.commit('live/ADD_VOICE_ITEM', data)
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

  .flow-wrap {
    .voice-item {
      display: block;
      padding: 20px;
    }
  }
}
</style>
