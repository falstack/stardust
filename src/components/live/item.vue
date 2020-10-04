<template>
  <Navigator
    class="live-item"
    :url="`/pages/room/live/index?id=${item.id}`"
  >
    <view class="aside">
      <Avatar :user="item.author" />
    </view>
    <view class="section">
      <Nickname :user="item.author" />
      <view class="title">
        {{ item.title }}
      </view>
      <view class="desc">
        {{ item.desc }}
      </view>
    </view>
  </Navigator>
</template>

<script>
import { Navigator } from '@tarojs/components'
import Avatar from '~/components/user/avatar'
import Nickname from '~/components/user/nickname'

export default {
  name: '',
  components: {
    Navigator,
    Avatar,
    Nickname
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {

    }
  }
}
</script>

<style lang="scss">
.live-item {
  padding: $container-padding;
  border-bottom: 1px solid #e7e7e7;

  .aside {
    float: left;
    margin-right: $container-padding;
  }

  .section {
    overflow: hidden;

    .title {
      margin-top: $container-padding / 2;
      margin-bottom: $container-padding / 2;
    }

    .desc {
      padding: $container-padding;
      border-radius: 10px;
      background-color: $color-background-container;
      font-size: 24px;
      @include mutiline(35px, 6);
    }
  }
}
</style>
