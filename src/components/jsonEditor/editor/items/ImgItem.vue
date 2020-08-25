<template>
  <CommonItem
    :slug="item.slug"
    :type="item.type"
    class="img-item"
  >
    <template slot="poster">
      <image
        v-if="item.local_url || item.url"
        mode="aspectFill"
        class="image"
        :src="item.local_url || item.url"
      />
      <text
        v-else
        class="iconfont ic-image"
      />
    </template>
    <template slot="content">
      {{ item.text || '点击添加图片描述' }}
    </template>
  </CommonItem>
</template>

<script>
import CommonItem from './CommonItem.vue'

export default {
  name: 'ImgItem',
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

<style lang="scss">
.img-item {
  .poster {
    position: relative;
    background-color: #67c23a;

    .image {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>
