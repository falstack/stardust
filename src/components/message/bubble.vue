<template>
  <view
    :class="`msg-box-${message.float || 'left'}`"
    class="msg-box"
  >
    <view class="msg-avatar">
      <UserAvatar :user="message.user" />
    </view>
    <view class="msg-body">
      <view class="msg-header">
        <UserNickname :user="message.user" />
      </view>
      <view
        :style="wrapperStyle"
        class="msg-bubble"
      >
        <LoadingMsg v-if="message.loading" />
        <view v-else>
          <ContentMsg :content="message.content" />
          <text
            v-if="message.status"
            class="msg-status"
            :class="`msg-status-${message.status}`"
          />
        </view>
      </view>
    </view>
    <view class="msg-extra">
      <slot name="extra" />
    </view>
  </view>
</template>

<script>
import { computed } from 'vue'
import ContentMsg from '~/components/content'
import UserAvatar from '~/components/user/avatar'
import UserNickname from '~/components/user/nickname'
import LoadingMsg from './loading'

export default {
  name: 'MsgBubble',
  components: {
    ContentMsg,
    LoadingMsg,
    UserAvatar,
    UserNickname
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const _computeBubbleColor = (msg) => {
      if (msg.color) {
        return msg.color
      }

      const colorEnums = [
        { bg: '#12b7f5', text: '#fff' },
        { bg: '#ff8eb3', text: '#fff' }
      ]

      return colorEnums[msg.user.id % colorEnums.length]
    }

    const wrapperStyle = computed(() => {
      const color = _computeBubbleColor(props.message)

      return {
        backgroundColor: color.bg,
        color: color.text
      }
    })

    return {
      wrapperStyle
    }
  }
}
</script>

<style lang="scss">
.msg-box {
  margin: 0 $container-padding;
  padding: 30px 0;

  &:after,
  &:before {
    content: '';
    clear: both;
    display: table;
  }

  &-left {
    .msg-avatar {
      float: left;
      margin-right: 10px;
    }

    .msg-body {
      text-align: left;
    }

    .msg-status {
      right: -40px;
    }
  }

  &-right {
    .msg-avatar {
      float: right;
      margin-left: 10px;
    }

    .msg-body {
      text-align: right;
    }

    .msg-status {
      left: -40px;
    }
  }

  .msg-body {
    .msg-header {
      font-size: 24px;
      margin-bottom: 10px;
      color: $color-text-gray;
    }

    .msg-bubble {
      position: relative;
      padding: 14px 26px;
      border-radius: 30px;
      max-width: 560px;
      display: inline-block;
      text-align: left;
      font-size: 28px;
      line-height: 1.6;

      .msg-status {
        position: absolute;
        top: 22px;
      }
    }
  }
}
</style>
