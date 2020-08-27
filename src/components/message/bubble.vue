<template>
  <view :class="`msg-box-${message.float || 'left'}`" class="msg-box">
    <view class="msg-avatar">
      <UserAvatar :user="message.user" />
    </view>
    <view class="msg-body">
      <view :style="wrapperStyle" class="msg-bubble">
        <MsgLoading v-if="message.loading" />
        <view v-else>
          <slot />
          <text v-if="message.status" class="msg-status" :class="`msg-status-${message.status}`" />
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
import MsgLoading from './loading'
import UserAvatar from '../avatar'

export default {
  name: 'MsgBubble',
  components: {
    MsgLoading,
    UserAvatar
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
  min-height: 60px;
  margin: 20px 0;

  &:after,
  &:before {
    content: '';
    clear: both;
    display: table;
  }

  &-left {
    .msg-avatar {
      float: left;
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
    }

    .msg-body {
      text-align: right;
    }

    .msg-status {
      left: -40px;
    }
  }

  .msg-body {
    overflow: hidden;

    .msg-bubble {
      position: relative;
      padding: 14px 26px;
      border-radius: 30px;
      max-width: 55%;
      display: inline-block;
      text-align: left;
      word-break: break-word !important;
      word-break: break-all;
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
