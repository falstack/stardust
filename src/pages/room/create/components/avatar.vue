<template>
  <view class="avatar">
    <image class="avatar" :src="$utils.resize('https://m1.calibur.tv/cc-19f/1562950958417-r9m.jpeg', { width: 80 })" />
  </view>
</template>

<script>
export default {
  components: {},
  props: {},
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
.avatar {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 2px solid #f5f5f7;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: -20px;
}
</style>
