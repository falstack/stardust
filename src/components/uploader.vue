<template>
  <view @tap="selectImage">
    <slot />
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import http from '~/utils/http'
import { reactive, onMounted } from 'vue'

export default {
  name: 'Uploader',
  setup() {
    const state = reactive({
      action: '',
      formData: {}
    })

    const getToken = () => {
      http.get('desk/upload_token').then(token => {
        state.formData.key = token.dir + '${filename}'
        state.formData.policy = token.policy
        state.formData.OSSAccessKeyId = token.accessid
        state.formData.success_action_status = 200
        state.formData.callback = token.callback
        state.formData.signature = token.signature
        state.action = token.host
      })
    }

    onMounted(() => {
      getToken()
    })

    const selectImage = () => {
      Taro.chooseImage({
        count: 1,
        sourceType: ['album'],
        sizeType: 'compressed',
        success: res => {
          Taro.uploadFile({
            url: state.action,
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: state.formData,
            success (res) {
              const data = JSON.parse(res.data)
              if (data.code) {
                return
              }
              console.log(data.data.link)
            }
          })
        }
      })
    }

    return {
      selectImage
    }
  }
}
</script>

<style lang="scss">
</style>
