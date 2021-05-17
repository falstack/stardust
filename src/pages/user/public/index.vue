<template>
  <view
    v-if="user"
    class="user-public"
  >
    <Navbar
      :show-back="true"
      :background="user.avatar"
    >
      <view class="nav-nickname">
        <view class="nickname">
          {{ user.nickname }}
        </view>
        <view
          v-if="user.meta.sex !== null"
          class="sex"
        >
          <view
            v-if="user.meta.sex === 0"
            class="iconfont ic-nv"
          />
          <view
            v-else
            class="iconfont ic-nan"
          />
        </view>
        <view
          v-if="user.providers.bind_idcard"
          class="iconfont ic-shiming"
        />
      </view>
      <view class="nav-meta">
        <view class="item location">
          <view
            v-if="user.meta.location"
            class="iconfont ic-weizhi"
          />
          <view class="name">
            {{ user.meta.location }}
          </view>
        </view>
        <view
          v-if="user.meta.birthday"
          class="item age"
        >
          <view class="iconfont ic-nianling" />
          <view class="name">
            {{ user.meta.birthday }}
          </view>
        </view>
        <view
          v-if="user.meta.bodyHeight"
          class="item height"
        >
          <view class="iconfont ic-shengao" />
          <view class="name">
            {{ user.meta.bodyHeight }}cm
          </view>
        </view>
        <view
          v-if="user.meta.bodyWeight"
          class="item weight"
        >
          <view class="iconfont ic-weight" />
          <view class="name">
            {{ user.meta.bodyWeight }}kg
          </view>
        </view>
        <view
          v-if="user.meta.study"
          class="item study"
        >
          <view class="iconfont ic-xueli" />
          <view class="name">
            {{ user.meta.study }}
          </view>
        </view>
        <view
          v-if="user.meta.work"
          class="item work"
        >
          <view class="iconfont ic-gongzuo" />
          <view class="name">
            {{ user.meta.work }}
          </view>
        </view>
      </view>
    </Navbar>
    <view class="intro-block">
      <view class="title">
        关于我：
      </view>
      <view class="intro">
        {{ user.aboutus.aboutme }}
      </view>
    </view>
    <view class="intro-block">
      <view class="title">
        希望你：
      </view>
      <view class="intro">
        {{ user.aboutus.aboutyou }}
      </view>
    </view>
    <view class="footer">
      footer
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Navbar from '~/components/navbar'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: '',
  components: {
    Navbar
  },
  setup() {
    const store = useStore()
    const params = Taro.getCurrentInstance().router.params

    const user = computed(() => {
      return store.getters['model/current']({
        type: 'user',
        slug: params.slug
      })
    })

    store.dispatch('model/getModelData', {
      type: 'user',
      slug: params.slug
    })

    return {
      user
    }
  }
}
</script>

<style lang="scss">
.user-public {
  padding-bottom: 100px;

  .nav-nickname {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
    font-size: 45px;

    .nickname {
      @extend %oneline;
      color: #fff;
    }

    .ic-nv {
      color: #fb7299;
    }

    .ic-nan {
      color: #00a1d6;
    }

    .ic-shiming {
      color: gold;
    }
  }

  .nav-meta {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    padding: 50px;
    color: #fff;

    .item {
      margin-right: 15px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .iconfont {
      margin-right: 4px;
    }
  }

  .intro-block {
    background-color: #fff;
    border-radius: 40px;
    padding: 30px;
    margin: 30px $container-padding;

    .title {
      padding-bottom: 30px;
      font-weight: bold;
    }

    .intro {
      color: #3D3D3D;
      @extend %breakWord;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
    background-color: #fff;
  }
}
</style>
