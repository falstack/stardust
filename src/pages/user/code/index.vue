<template>
  <view class="user-code">
    <canvas
      class="canvas"
      canvasId="myQrcode"
    />
    <view class="name">
      <text>
        {{ user.realname }}
      </text>
      <text
        v-if="user.realname"
        class="iconfont ic-shiming"
      />
    </view>
    <view class="idcard">
      {{ user.idcard }}
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import drawQrcode from 'weapp-qrcode'
import { onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { resize } from '~/utils'

export default {
  name: '',
  setup() {
    const store = useStore()
    const user = computed(() => store.state.userInfo)

    const renderCanvas = () => {
      watch(user, (val) => {
        if (val) {
          Taro.getImageInfo({
            src: resize(user.value.avatar, { width: 100, dpr: 1 }),
            success: res => {
              drawImage({
                imageResource: res.path,
                dx: 85,
                dy: 85,
                dWidth: 50,
                dHeight: 50
              })
            },
            fail: () => {
              drawImage()
            }
          })
        }
      }, {
        immediate: true
      })

      const drawImage = (image) => {
        const color = ['#3eaf7c', '#e7c000', '#c00'][user.value.love_type]
        drawQrcode({
          width: 200,
          height: 200,
          x: 10,
          y: 10,
          canvasId: 'myQrcode',
          foreground: color,
          image,
          text: 'https://m.bilibili.com'
        })
      }
    }

    onMounted(() => {
      renderCanvas()
    })

    return {
      user
    }
  }
}
</script>

<style lang="scss">
.user-code {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .canvas {
    display: block;
    width: 220PX;
    height: 220PX;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 10px;
  }

  .name {
    margin-top: 30px;
    color: $color-text-gray;

    .iconfont {
      margin-left: 10px;
      color: gold;
    }
  }

  .idcard {
    margin-top: 10px;
    color: $color-text-gray;
  }
}
</style>
