<template>
  <view class="navbar">
    <view class="navbar__header">
      <view
        :style="shimStyle"
        class="navbar__wrap"
      >
        <view
          :style="headerStyle"
          class="navbar__core"
        >
          <slot />
        </view>
      </view>
      <view
        :style="shimStyle"
        class="navbar__shim"
      />
    </view>
  </view>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { getMenuRect } from '~/utils'
import cache from '~/utils/cache'

export default {
  setup() {
    const state = reactive({
      rect: cache.get('MENU-RECT', null)
    })

    const systemInfo = cache.get('SYSTEM_INFO')

    const shimStyle = computed(() => {
      return {
        height: `${state.rect ? state.rect.height + state.rect.margin * 2 : '50'}px`,
        paddingTop: `${systemInfo.statusBarHeight}px`
      }
    })

    const headerStyle = computed(() => {
      if (!state.rect) {
        return null
      }

      return {
        width: `${state.rect.width}px`,
        height: `${state.rect.height}px`,
        marginBottom: `${state.rect.margin}px`
      }
    })

    const calcMenuRect = () => {
      if (state.rect) {
        return
      }

      setTimeout(() => {
        state.rect = getMenuRect()
      }, 5000)
    }

    onMounted(() => {
      calcMenuRect()
    })

    return {
      shimStyle,
      headerStyle
    }
  }
}
</script>

<style lang="scss">
.navbar {
  &__wrap,
  &__shim {
    box-sizing: content-box;
  }

  &__wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 888;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
  }

  &__shim {
    background-color: transparent;
  }

  &__core {
    width: 400px;
    height: 88px;
    padding: 0 $container-padding;
  }
}
</style>
