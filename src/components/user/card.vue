<template>
  <navigator
    class="user-card"
    :url="`/pages/user/public/index?slug=${item.slug}`"
    hover-class="none"
  >
    <view class="header">
      <view class="nickname">
        {{ item.nickname }}
      </view>
      <view
        v-if="item.meta.sex !== null"
        class="sex"
      >
        <view
          v-if="item.meta.sex === 0"
          class="iconfont ic-nv"
        />
        <view
          v-else
          class="iconfont ic-nan"
        />
      </view>
      <view
        v-if="item.realname"
        class="iconfont ic-shiming"
      />
    </view>
    <view class="body">
      <view class="left">
        {{ item.aboutus.aboutme }}
      </view>
      <view class="right">
        <image :src="item.avatar" />
      </view>
    </view>
    <view class="footer">
      <view class="item location">
        <view
          v-if="item.meta.location"
          class="iconfont ic-weizhi"
        />
        <view class="name">
          {{ item.meta.location }}
        </view>
      </view>
      <view
        v-if="item.meta.birthday"
        class="item age"
      >
        <view class="iconfont ic-nianling" />
        <view class="name">
          {{ convertBirthday(item.meta.birthday) }}
        </view>
      </view>
      <view
        v-if="item.meta.bodyHeight"
        class="item height"
      >
        <view class="iconfont ic-shengao" />
        <view class="name">
          {{ item.meta.bodyHeight }}cm
        </view>
      </view>
      <view
        v-if="item.meta.bodyWeight"
        class="item weight"
      >
        <view class="iconfont ic-weight" />
        <view class="name">
          {{ item.meta.bodyWeight }}kg
        </view>
      </view>
    </view>
  </navigator>
</template>

<script>
export default {
  name: 'UserCard',
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup() {
    const convertBirthday = (date) => {
      return `${date.split('-')[0].slice(2, 4)}年`
    }

    return {
      convertBirthday
    }
  }
}
</script>

<style lang="scss">
.user-card {
  display: block;
  background-color: #fff;
  padding: 15px;
  margin-bottom: 20px;
  margin-top: 20px;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0,0,0,.05);

    .nickname {
      @extend %oneline;
    }

    view {
      margin-right: 6px;
    }

    .ic-nv {
      color: #fb7299;
    }

    .ic-nan {
      color: #00a1d6;
    }

    .ic-shiming {
      color: goldenrod;
    }
  }

  .body {
    display: flex;
    flex-direction: row;
    height: 240px;
    margin: 15px 0;

    .left {
      flex: 1;
      padding-right: 15px;
      color: #999;
      @include mutiline(40px, 6);
      @extend %breakWord;
    }

    .right {
      flex-shrink: 0;

      image {
        width: 240px;
        height: 240px;
        border-radius: 10%;
        overflow: hidden;
      }
    }
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid rgba(0,0,0,.05);
    @extend %oneline;

    .item {
      margin-right: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .iconfont {
      margin-right: 4px;
    }
  }
}
</style>
