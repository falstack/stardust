<style lang="scss">
.list-item {
  .poster {
    background-color: #00a1d6;
  }
}
</style>

<template>
  <CommonItem :slug="item.slug" :type="item.type" class="list-item">
    <template slot="poster">
      <text class="iconfont ic-list" />
    </template>
    <template slot="content">
      <template v-if="item.text">
        <view v-if="item.sort === '1'">
          <view v-for="(li, index) in computeList(item.text)" :key="index">
            <text class="oneline">{{ li }}</text>
          </view>
        </view>
        <view v-else>
          <view v-for="(li, index) in computeList(item.text)" :key="index">
            <text class="oneline">{{ li }}</text>
          </view>
        </view>
      </template>
      <template v-else>
        点击添加列表内容
      </template>
    </template>
  </CommonItem>
</template>

<script>
import CommonItem from './CommonItem.vue'

export default {
  name: 'ListItem',
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
  methods: {
    computeList(text) {
      let list = text
      while (/\n\n/.test(list)) {
        list = list.replace(/\n\n/g, '\n')
      }
      return list.split('\n').slice(0, 3)
    }
  }
}
</script>
