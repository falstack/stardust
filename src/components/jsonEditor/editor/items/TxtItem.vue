<style lang="scss">
.txt-item {
  .poster {
    background-color: gold;
  }
}
</style>

<template>
  <CommonItem :slug="item.slug" :type="item.type" class="txt-item">
    <template slot="poster">
      <text class="iconfont ic-text" />
    </template>
    <template slot="content">
      <view>{{ item.title || '点击添加段落' }}</view>
    </template>
  </CommonItem>
</template>

<script>
import CommonItem from './CommonItem.vue'

export default {
  name: 'TxtItem',
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
