<template>
  <view class="json-content">
    <Component
      :is="`${item.type}-parser`"
      v-for="(item, index) in content"
      :key="index"
      :item="item"
    />
  </view>
</template>

<script>
import TxtParser from './TxtParser'
import ImgParser from './ImgParser'
import UseParser from './UseParser'
import ListParser from './ListParser'
import TitleParser from './TitleParser'

export default {
  name: 'JsonContent',
  components: {
    TxtParser,
    ImgParser,
    UseParser,
    ListParser,
    TitleParser
  },
  props: {
    content: {
      required: true,
      type: Array
    }
  }
}
</script>
