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
          v-if="user.meta && user.meta.sex !== null"
          class="sex"
        >
          <view
            v-if="user.meta.sex == 0"
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
      <view
        v-if="user.meta"
        class="nav-meta"
      >
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
      <view
        v-if="user?.aboutus?.aboutme"
        class="intro"
        v-html="user.aboutus.aboutme"
      />
      <view
        v-else
        class="intro-1"
      >
        未填写
      </view>
    </view>
    <view class="intro-block">
      <view class="title">
        希望你：
      </view>
      <view
        v-if="user?.aboutus?.aboutyou"
        class="intro"
        :class="`intro-${user.love_type}`"
      >
        {{ user.love_type ? 'TA现在不是单身，将隐藏择偶标准' : user.aboutus.aboutyou }}
      </view>
      <view
        v-else
        class="intro-1"
      >
        未填写
      </view>
    </view>
    <!--
    <view class="intro-block">
      <view class="title">
        实名信息：
      </view>
      <view v-if="user.idcard && !user.love_type" class="intro">
        <view><text>身份证：</text>{{ user.idcard }}</view>
        <view><text>姓名：</text>{{ user.realname }}</view>
      </view>
      <view v-else class="intro-1">
        {{ user.love_type ? '非单身用户不展示实名信息' : '未实名认证' }}
      </view>
    </view>
    -->
    <view class="footer">
      <view
        v-if="isMyBaby"
        @tap="openSingleDialog"
      >
        <text class="iconfont ic-jianshen-xinsui-xinshuai-xinzang-heart-he" />
        <text>
          分手
        </text>
      </view>
      <view
        v-else
        @tap="openTogetherDialog"
      >
        <text class="iconfont ic-lianai" />
        <text>
          与TA签约
        </text>
      </view>
      <text class="line" />
      <view @tap="openLinkDialog">
        <text class="iconfont ic-lianxi-A" />
        <text>
          联系方式
        </text>
      </view>
    </view>
    <Dialog v-model="state.showLinkDialog">
      <view class="link-drawer">
        <view>
          PS：只有同一家公司的人才能获取到彼此的联系方式，所以要珍惜机会呀~
        </view>
        <button
          v-if="user.email"
          @tap="copyData(user.email)"
        >
          <text class="iconfont ic-youjian" />
          <text>{{ user.email }}</text>
        </button>
        <button
          v-else
          hover-class="none"
        >
          <text class="iconfont ic-youjian" />
          <text>TA没有留下邮箱</text>
        </button>
        <button
          v-if="user.meta.wechat"
          @tap="copyData(user.meta.wechat)"
        >
          <text class="iconfont ic-weixin" />
          <text>{{ user.meta.wechat }}</text>
        </button>
        <button
          v-else
          hover-class="none"
        >
          <text class="iconfont ic-weixin" />
          <text>TA没有留下微信</text>
        </button>
      </view>
    </Dialog>
    <Dialog v-model="state.showTogetherDialog">
      <view class="together-drawer">
        <view>
          1. 点击下方「发起签约」按钮后，把消息分享给TA，同意后你们就会成为情侣~
        </view>
        <view>
          2. 签约的绑定和解绑都要双方操作并确认，请勿随意与别人签约~
        </view>
        <view>
          3. 签约即为"交往中"，所以同一时间只能与一个人签约~
        </view>
        <button
          class="primary-btn"
          open-type="share"
          :data-title="togetherData.title"
          :data-path="togetherData.path"
          :data-image-url="togetherData.imageUrl"
        >
          发起签约
        </button>
      </view>
    </Dialog>
    <Dialog v-model="state.showConfirmDialog">
      <view class="confirm-drawer">
        <view class="avatar-wrap">
          <image :src="$utils.resize(self.avatar, { width: 50 })" />
          <text class="iconfont ic-qingganganqing" />
          <image :src="$utils.resize(user.avatar, { width: 50 })" />
        </view>
        <view>
          1. 这是一份契约，接受后你的情感状态将变更为「交往中」
        </view>
        <view>
          2. 一个人同一时间只能与一个人签约，签约的绑定和解绑都要双方操作并确认，你无法独自更改状态~
        </view>
        <view>
          3. 如果你的心中早已有了答案，那么就勇敢的做决定吧！
        </view>
        <button
          class="primary-btn"
          @tap="sendConfirm"
        >
          确认签约
        </button>
      </view>
    </Dialog>
    <Dialog v-model="state.showSingleDialog">
      <view class="single-drawer">
        <view>
          1. 点击下方「发送」按钮后，把消息分享给TA，同意后你们就会解绑
        </view>
        <view>
          2. 解绑后你们就都变回单身状态，可继续下一段恋情
        </view>
        <view>
          3. 请做出一个充分考虑过的决定
        </view>
        <button
          class="primary-btn"
          open-type="share"
          :data-title="singleData.title"
          :data-path="singleData.path"
          :data-image-url="singleData.imageUrl"
        >
          发送
        </button>
      </view>
    </Dialog>
    <Dialog v-model="state.showCancelDialog">
      <view class="cancel-drawer">
        <view>
          1. 点击下方「同意分手」按钮后，你们就会解绑，各自恢复单身状态
        </view>
        <view>
          2. 你是你人生的主宰，未来有无数种可能性
        </view>
        <button
          class="primary-btn"
          @tap="sendCancel"
        >
          同意分手
        </button>
      </view>
    </Dialog>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Navbar from '~/components/navbar'
import Dialog from '~/components/dialog'
import toast from '~/utils/toast'
import http from '~/utils/http'
import { useStore } from 'vuex'
import { computed, reactive, onMounted, watch } from 'vue'
import { resize } from '~/utils'
import md5 from '~/utils/md5'

export default {
  name: '',
  components: {
    Navbar,
    Dialog
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showLinkDialog: false,
      showConfirmDialog: false,
      showSingleDialog: false,
      showTogetherDialog: false,
      showCancelDialog: false
    })
    const params = Taro.getCurrentInstance().router.params

    const user = computed(() => {
      return store.getters['model/current']({
        type: 'user',
        slug: params.slug,
        refresh: params.refresh
      })
    })

    const self = computed(() => store.state.userInfo)

    const togetherData = computed(() => {
      if (!self.value) {
        return {}
      }

      const time = Date.now()
      const token = md5(`${self.value.id}${user.value.slug}${self.value.slug}${time}`)

      return {
        title: `「${self.value.nickname}」向你发送了一份契约，请尽快查收~`,
        path: `/pages/user/public/index?slug=${self.value.slug}&from=share_together&target=${user.value.slug}&token=${token}&ts=${time}`,
        imageUrl: self.value.avatar
      }
    })

    const singleData = computed(() => {
      if (!self.value) {
        return {}
      }

      const time = Date.now()
      const token = md5(`${self.value.id}${user.value.slug}${self.value.slug}${time}`)

      return {
        title: `来自「${self.value.nickname}」的私信`,
        path: `/pages/user/public/index?slug=${self.value.slug}&from=share_single&target=${user.value.slug}&token=${token}&ts=${time}`,
        imageUrl: self.value.avatar
      }
    })

    const isSelf = computed(() => {
      if (!self.value || !self.value.email) {
        return false
      }

      if (!user.value || !user.value.email) {
        return false
      }

      return self.value.slug === user.value.slug
    })

    const isMyBaby = computed(() => {
      if (!self.value || !user.value) {
        return false
      }

      if (isSelf.value) {
        return false
      }

      if (!self.value.love_type || !user.value.love_type) {
        return false
      }

      return self.value.love_type === user.value.love_type &&
        user.value.love_user === self.value.id
    })

    const isSameCompany = computed(() => {
      if (!self.value || !self.value.email) {
        return false
      }

      if (!user.value || !user.value.email) {
        return false
      }

      return self.value.email.split('@')[1] === user.value.email.split('@')[1]
    })

    store.dispatch('model/getModelData', {
      type: 'user',
      slug: params.slug
    })

    /**
     * 1. 已登录
     * 2. 已实名
     * 3. 在同一个公司
     * 4. 自己是单身
     * 5. 对方是单身
     * 6. 如果对方填写了联系方式，自己也必须填写了才能查看
     */
    const openLinkDialog = () => {
      if (!self.value) {
        toast.info('请先登录')
        return
      }

      if (!self.value.providers.bind_idcard) {
        toast.info('请先完成实名认证')
        return
      }

      if (!isSameCompany.value) {
        toast.info('同一公司的人才能获取联系方式')
        return
      }

      if (self.value.love_type) {
        toast.info('你不是单身，无法查看TA的联系方式')
        return
      }

      if (user.value.love_type) {
        toast.info('TA不是单身，无法查看TA的联系方式')
        return
      }

      if (user.value.meta.wechat && !self.value.meta.wechat) {
        toast.info('请先完善自己的资料（微信号）~')
        return
      }

      if (user.value.email && !self.value.email) {
        toast.info('请先完善自己的资料（邮箱）~')
        return
      }

      state.showLinkDialog = true
    }

    /**
     * 1. 已登录
     * 2. 已实名
     * 3. 访问的不是自己
     * 4. 自己是单身
     * 5. 对方是单身
     */
    const openTogetherDialog = () => {
      if (!self.value) {
        toast.info('请先登录')
        return
      }

      if (!self.value.providers.bind_idcard) {
        toast.info('请先完成实名认证')
        return
      }

      if (isSelf.value) {
        toast.info('不能和自己签约')
        return
      }

      if (self.value.love_type) {
        toast.info('你已经不是单身了~')
        return
      }

      if (user.value.love_type) {
        toast.info('TA并不单身哦~')
        return
      }

      state.showTogetherDialog = true
    }

    const openSingleDialog = () => {
      state.showSingleDialog = true
    }

    const copyData = (data) => {
      Taro.setClipboardData({ data })
    }

    /**
     * 1. 是分享消息
     * 2. 用户已登录
     * 3. 接受者是自己
     * 4. 消息未超过24小时
     */
    const shareTogetherProcess = () => {
      if (params.from !== 'share_together') {
        return
      }

      if (!self.value) {
        toast.info('该分享携带了一条私密消息，请尝试登录后查看~')
        return
      }

      if (isSelf.value) {
        toast.info('私密消息发送成功，等待对方验收吧~')
        return
      }

      if (self.value.love_type) {
        return
      }

      if (self.value.slug !== params.target) {
        return
      }

      if (Date.now() - params.ts > 86400000) {
        toast.info('该分享携带的私密消息已超时~')
        return
      }

      state.showConfirmDialog = true
    }

    const shareSingleProcess = () => {
      if (params.from !== 'share_single') {
        return
      }

      if (!self.value) {
        toast.info('该分享携带了一条私密消息，请尝试登录后查看~')
        return
      }

      if (isSelf.value) {
        toast.info('私密消息发送成功')
        return
      }

      if (!self.value.love_type) {
        return
      }

      if (self.value.slug !== params.target) {
        return
      }

      if (Date.now() - params.ts > 86400000) {
        toast.info('该分享携带的私密消息已超时~')
        return
      }

      state.showCancelDialog = true
    }

    const sendConfirm = () => {
      Taro.showModal({
        title: '提示',
        content: '确认要签约吗？',
        cancelText: '拒绝',
        cancelColor: '#6d757a',
        confirmText: '接受',
        confirmColor: '#fb7299',
        success: function (res) {
          if (res.confirm) {
            http.post('user/sign_together', {
              target_slug: params.slug,
              time: params.ts,
              token: params.token
            })
            .then(() => {
              toast.info('签约成功，恭喜~')
              state.showConfirmDialog = false
              store.commit('UPDATE_USER_INFO', {
                ...self.value,
                love_type: 1,
                love_user: params.slug
              })
              store.getters['model/current']({
                type: 'user',
                slug: params.slug,
                refresh: true
              })
            })
            .catch((err) => {
              toast.info(err.message)
            })
          }
        }
      })
    }

    const sendCancel = () => {
      Taro.showModal({
        title: '提示',
        content: '确认要这么做吗？',
        cancelText: '取消',
        confirmText: '同意',
        success: function (res) {
          if (res.confirm) {
            http.post('user/sign_single', {
              target_slug: params.slug,
              time: params.ts,
              token: params.token
            })
              .then(() => {
                toast.info('状态已变更')
                state.showSingleDialog = false
                store.commit('UPDATE_USER_INFO', {
                  ...self.value,
                  love_type: 0,
                  love_user: 0
                })
                store.getters['model/current']({
                  type: 'user',
                  slug: params.slug,
                  refresh: true
                })
              })
              .catch((err) => {
                toast.info(err.message)
              })
          }
        }
      })
    }

    onMounted(() => {
      watch(user, (val) => {
        if (val) {
          shareTogetherProcess()
          shareSingleProcess()
        }
      }, {
        immediate: true
      })
    })

    return {
      state,
      self,
      user,
      isMyBaby,
      copyData,
      togetherData,
      singleData,
      sendConfirm,
      sendCancel,
      isSameCompany,
      openLinkDialog,
      openSingleDialog,
      openTogetherDialog
    }
  },
  onShareAppMessage(option) {
    let shareData
    if (option.from === 'button') {
      shareData = {
        title: option.target.dataset.title,
        path: option.target.dataset.path,
        imageUrl: option.target.dataset.imageUrl
      }
    } else {
      shareData = {
        title: `${this.user.nickname}的自我介绍`,
        path: `/pages/user/public/index?slug=${this.user.slug}`,
        imageUrl: this.user.avatar
      }
    }
    shareData.imageUrl = resize(shareData.imageUrl, { width: 500, height: 400, dpr: 1 })
    this.state.showSingleDialog = false
    this.state.showTogetherDialog = false
    return shareData
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

      text {
        display: inline-block;
        width: 150px;
      }
    }

    .intro-1,
    .intro-2 {
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 30px;
      color: #6d757a;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: content-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    view {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .line {
      display: block;
      height: 50px;
      width: 1px;
      background-color: darkgray;
    }

    .iconfont {
      font-weight: bold;
      margin-right: 10px;
      font-size: 40px;
    }
  }

  .link-drawer {
    padding: 20px 20px 0;

    view {
      font-size: 28px;
      color: #3D3D3D;
    }

    button {
      text-align: left;
      margin-top: 20px;
      padding-left: 20px;
      margin-left: -20px;
      margin-right: -20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .iconfont {
      padding-right: 10px;
    }

    .ic-weixin {
      color: limegreen;
    }

    .ic-youjian {
      color: #00a1d6;
    }
  }

  .together-drawer,
  .single-drawer,
  .cancel-drawer {
    padding: 20px;

    view {
      margin-bottom: 10px;
    }

    button {
      margin-top: 20px;
    }
  }

  .confirm-drawer {
    padding: 20px;

    .avatar-wrap {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid $color-avatar-border;
      }

      .iconfont {
        font-size: 50px;
        color: #fb7299;
      }
    }

    view {
      margin-bottom: 10px;
    }

    button {
      margin-top: 30px;
    }
  }
}
</style>
