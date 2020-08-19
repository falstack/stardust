<style lang="scss">
.editor-item-wrap {
  user-select: none;

  $editor-item-height: 152px;
  .editor-item {
    background-color: #fff;
    padding: $container-padding;
    @extend %clearfix;

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
      float: right;
      margin-left: $container-padding;

      .iconfont {
        display: block;
        color: $color-text-light;
        margin-bottom: 15px;
      }
    }

    .content {
      height: $editor-item-height;
      @include mutiline($editor-item-height / 4, 4);

      .three-line {
        @include mutiline(19px, 3);
      }
    }
  }
}
</style>

<template>
  <view class="editor-item-wrap">
    <CreateBtn :slug="slug" />
    <view class="editor-item">
      <view class="poster" @tap="emitEditPoster">
        <slot name="poster"> poster </slot>
      </view>
      <view class="control">
        <text class="iconfont ic-cancel" @tap="emitDeleteItem" />
        <text class="iconfont ic-sort" />
      </view>
      <view class="content" @tap="emitEditText">
        <slot name="content"></slot>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import CreateBtn from '../CreateBtn.vue'

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
    emitDeleteItem() {
      Taro.eventCenter.trigger('DELETE_NOTE_ITEM', {
        slug: this.slug
      })
      Taro.eventCenter.trigger('OPEN_CREATE_POPUP', {
        slug: -1
      })
    },
    emitEditPoster() {
      if (this.type !== 'img') {
        return
      }
      Taro.eventCenter.trigger('EDIT_NOTE_POSTER', {
        slug: this.slug,
        type: this.type
      })
    },
    emitEditText() {
      Taro.eventCenter.trigger('EDIT_NOTE_CONTENT', {
        slug: this.slug,
        type: this.type
      })
    }
  }
}
</script>
