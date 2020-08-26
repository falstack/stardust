<template>
  <view :class="`msg-box-${float}`" class="msg-box">
    <view class="msg-avatar">
      <UserAvatar :user="item.user" />
    </view>
    <view class="msg-body">
      <view :style="wrapperStyle" class="msg-bubble">
        <slot v-if="loading" name="loading">
          <MsgLoading />
        </slot>
        <text v-show="!loading">
          <slot />
          <text v-if="status" class="msg-status" :class="`msg-status-${status}`" />
        </text>
      </view>
    </view>
    <slot name="extra" />
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
    },
    color: {
      type: Object,
      required: true
    },
    float: {
      type: String,
      required: true,
      validator: val => ~['left', 'right'].indexOf(val)
    },
    loading: {
      type: Boolean,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const wrapperStyle = computed(() => {
      return {
        backgroundColor: props.color.bg,
        color: props.color.text
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
