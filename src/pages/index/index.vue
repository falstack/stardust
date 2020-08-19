<template>
  <view class="index">
    <text>{{ msg }}</text>
    <JsonEditor v-model="mockData" />
  </view>
</template>

<script>
import JsonEditor from '../../components/jsonEditor/editor/index'
import mockData from './editor-v1.json'

export default {
  components: {
    JsonEditor
  },
  data() {
    return {
      msg: 'Hello world!',
      mockData: mockData.content
    }
  },
  methods: {}
}
</script>
