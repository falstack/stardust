<template>
  <view
    class="live-item"
    @tap="linkToLive"
  >
    <view
      v-if="showUser"
      class="aside"
    >
      <Avatar
        :user="item.author"
        @tap.native="linkToUser"
      />
    </view>
    <view class="section">
      <Nickname
        v-if="showUser"
        :user="item.author"
        @tap.native="linkToUser"
      />
      <view class="title">
        {{ item.title }}
      </view>
      <view class="desc">
        {{ item.desc }}
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Avatar from '~/components/user/avatar'
import Nickname from '~/components/user/nickname'

export default {
  name: '',
  components: {
    Avatar,
    Nickname
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    showUser: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const linkToLive = () => {
      Taro.navigateTo({
        url: `/pages/room/live/index?id=${props.item.id}`
      })
    }

    const linkToUser = () => {
      Taro.navigateTo({
        url: `/pages/user/public/index?id=${props.item.author.id}`
      })
    }

    return {
      linkToLive,
      linkToUser
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
