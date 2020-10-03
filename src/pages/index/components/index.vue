<template>
  <view class="index">
    <ListView
      ref="listRef"
      func="getActivityLiveRoom"
    >
      <template #default="{ list }">
        <LiveItem
          v-for="item in list"
          :key="item.id"
          :item="item"
        />
      </template>
    </ListView>
  </view>
</template>

<script>
import LiveItem from '~/components/live/item'
import { ref } from 'vue'

export default {
  components: {
    LiveItem
  },
  setup() {
    const listRef = ref(null)

    return {
      listRef
    }
  }
}
</script>
