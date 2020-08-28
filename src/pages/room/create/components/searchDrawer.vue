<template>
  <Drawer
    v-model="state.showDrawer"
    :show-mask="false"
    size="calc(100% - 200rpx)"
  >
    <view class="search-drawer">
      <Search v-model="state.keyword" />
    </view>
  </Drawer>
</template>

<script>
import { reactive, watch } from 'vue'
import Search from '~/components/search'
import Drawer from '~/components/drawer'

export default {
  components: {
    Drawer,
    Search
  },
  props: {
    modelValue: {
      required: true,
      type: Boolean
    },
  },
  setup(props, ctx) {
    const state = reactive({
      showDrawer: props.modelValue,
      keyword: ''
    })

    watch(
      () => state.showDrawer,
      (val) => {
        ctx.emit('update:modelValue', val)
      }
    )

    watch(
      () => props.modelValue,
      (val) => {
        state.showDrawer = val
      }
    )

    return {
      state
    }
  }
}
</script>

<style lang="scss">
.drawer__wrap {
  background-color: #3C3F41;
}

.search-drawer {
  padding: 0 $container-padding;
}
</style>
