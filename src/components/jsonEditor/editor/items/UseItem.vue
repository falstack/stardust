<style lang="scss">
.use-item {
  .poster {
    background-color: #f25d8e;
  }

  .blockquote {
    border-left: 4px solid #ccd0d7;
    padding-left: 10px;
  }
}
</style>

<template>
  <CommonItem :slug="item.slug" :type="item.type" class="use-item">
    <template slot="poster">
      <text class="iconfont ic-use" />
    </template>
    <template slot="content">
      <view class="blockquote">
        {{ item.text || '点击添加引用内容' }}
      </view>
    </template>
  </CommonItem>
</template>

<script>
import CommonItem from './CommonItem.vue'

export default {
  name: 'UseItem',
  components: {
    CommonItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
