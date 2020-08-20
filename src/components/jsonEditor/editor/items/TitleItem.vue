<style lang="scss">
.title-item {
  .poster {
    background-color: #9266f9;
  }
}
</style>

<template>
  <CommonItem :slug="item.slug" :type="item.type" class="title-item">
    <template slot="poster">
      <text class="iconfont ic-title" />
    </template>
    <template slot="content">
      <view>{{ item.text || '点击添加标题' }}</view>
    </template>
  </CommonItem>
</template>

<script>
import CommonItem from './CommonItem.vue'

export default {
  name: 'TitleItem',
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
