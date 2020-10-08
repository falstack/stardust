<template>
  <view
    v-if="user"
    class="user-public"
  >
    <Navbar :background="user.banner" :title="user.nickname">
      <view>123</view>
      <view>123</view>
      <view>123</view>
      <view>123</view>
      <view>123</view>
      <view>123</view>
      <view>123</view>
    </Navbar>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Navbar from '~/components/navbar'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: '',
  components: {
    Navbar
  },
  setup() {
    const store = useStore()
    const params = Taro.getCurrentInstance().router.params

    const user = computed(() => {
      return store.getters['model/current']({
        type: 'user',
        id: params.id
      })
    })

    store.dispatch('model/getModelData', {
      type: 'user',
      id: params.id
    })

    return {
      user
    }
  }
}
</script>

<style lang="scss">
</style>
