<template>
  <view class="room-create">
    <ScrollView class="display-header" scroll-x="true">
      <view class="shim" />
      <view class="avatar-list">
        <view class="avatar create-btn">
          <text class="icon ic-add" />
        </view>
      </view>
      <view class="shim" />
    </ScrollView>
  </view>
</template>

<script>
import { ScrollView } from '@tarojs/components'

export default {
  name: '',
  components: {
    ScrollView
  },
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
.room-create {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #272822;
  color: #f5f5f7;

  .display-header {
    background-color: #3C3F41;
    height: 200px;
    width: 100%;
    white-space: nowrap;

    .shim {
      display: inline-block;
      width: 40px;
      height: 100%;
      vertical-align: middle;
    }

    .avatar-list {
      vertical-align: middle;
      display: inline-flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .avatar {
      display: inline-block;
      width: 100px;
      height: 100px;
      border: 2px solid #f5f5f7;
      border-radius: 50%;
      flex-shrink: 0;
      margin-left: -20px;

      &:first-child {
        margin-left: 0;
      }
    }

    .create-btn {
      background-color: #f5f5f7;
      line-height: 100px;
      text-align: center;

      .ic-add {
        font-size: 50px;
        color: #3C3F41;
      }
    }
  }
}
</style>
