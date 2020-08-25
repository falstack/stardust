<template>
  <view class="editor-item-wrap">
    <CreateBtn :slug="slug" />
    <view class="editor-item">
      <view
        class="poster"
        @tap="emitEditPoster"
      >
        <slot name="poster">
          poster
        </slot>
      </view>
      <view class="control">
        <text
          class="icon icon ic-up"
          @tap="emitSortItem(true)"
        />
        <text
          class="icon iconfont ic-cancel"
          @tap="emitDeleteItem"
        />
        <text
          class="icon icon ic-down"
          @tap="emitSortItem(false)"
        />
      </view>
      <view
        class="content"
        @tap="emitEditText"
      >
        <slot name="content" />
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import CreateBtn from '../CreateBtn.vue'
import ENUM from '../enmu'

export default {
  name: 'CommonItem',
  components: {
    CreateBtn
  },
  props: {
    slug: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    }
  },
  methods: {
    emitSortItem(isUp) {
      Taro.eventCenter.trigger(ENUM.SORT_NOTE_ITEM, {
        slug: this.slug,
        isUp
      })
      Taro.eventCenter.trigger(ENUM.OPEN_CREATE_POPUP, {
        slug: -1
      })
    },
    emitDeleteItem() {
      Taro.eventCenter.trigger(ENUM.DELETE_NOTE_ITEM, {
        slug: this.slug
      })
      Taro.eventCenter.trigger(ENUM.OPEN_CREATE_POPUP, {
        slug: -1
      })
    },
    emitEditPoster() {
      if (this.type !== 'img') {
        return
      }
      Taro.eventCenter.trigger(ENUM.EDIT_NOTE_POSTER, {
        slug: this.slug,
        type: this.type
      })
    },
    emitEditText() {
      Taro.eventCenter.trigger(ENUM.EDIT_NOTE_CONTENT, {
        slug: this.slug,
        type: this.type
      })
    }
  }
}
</script>

<style lang="scss">
.editor-item-wrap {
  user-select: none;

  $editor-item-height: 156px;
  .editor-item {
    background-color: #fff;
    padding: $container-padding;
    height: $editor-item-height + 40px;

    .poster {
      width: $editor-item-height;
      height: $editor-item-height;
      line-height: $editor-item-height;
      margin-right: $container-padding;
      text-align: center;
      float: left;

      .iconfont {
        font-size: 50px;
        font-weight: bold;
        color: #fff;
      }
    }

    .control {
      height: $editor-item-height;
      margin-left: $container-padding;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      float: right;

      .icon {
        display: block;
        color: $color-text-light;
      }

      .iconfont {
        font-size: 26px;
      }
    }

    .content {
      height: $editor-item-height;
      font-size: 30px;
      margin: 15px 0;
      @include mutiline(42px, 3);
    }
  }
}
</style>
