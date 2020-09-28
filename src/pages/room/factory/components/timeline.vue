<template>
  <view
    v-if="timeline"
    class="timeline"
    :style="{ height: `${timeline - 20}px` }"
  >
    <view
      v-for="(item, index) in timeline / 20"
      :key="item"
      :class="{ 'long': !(index % 10) }"
      class="item"
    >
      <text
        v-if="!(index % 10)"
        class="text"
      >
        {{ index }}
      </text>
    </view>
  </view>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const timeline = computed(() => {
      const times = store.state.live.content.map(_ => {
        const list = _.value
        if (!list.length) {
          return 0
        }

        const last = list[list.length - 1]
        return last.duration + last.begin_at
      })

      return Math.ceil(Math.max(...times) / 1000) * 20
    })

    return {
      timeline
    }
  }
}
</script>

<style lang="scss">
.timeline {
  position: absolute;
  width: 10%;
  top: $container-padding;
  left: $container-padding;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 1PX solid #3D3D3D;

  .item {
    height: 1PX;
    background-color: #3D3D3D;
    width: 15px;

    &.long {
      position: relative;
      width: 30px;

      .text {
        position: absolute;
        left: 110%;
        top: 0;
        font-size: 24px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
