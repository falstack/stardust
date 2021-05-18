<template>
  <view class="user-profile">
    <view class="input-wrap">
      <view class="label">
        头像
      </view>
      <Uploader v-model="state.avatar">
        <image
          class="avatar"
          :src="$utils.resize(state.avatar, { width: 70 })"
        />
      </Uploader>
    </view>
    <view class="input-wrap">
      <view class="label">
        名字
      </view>
      <input
        v-model="state.nickname"
        type="text"
        maxlength="14"
        placeholder="你的名字"
      >
    </view>
    <view class="input-wrap">
      <view class="label">
        性别
      </view>
      <radio-group @change="onSexChange">
        <label
          v-for="item in sexList"
          :key="item.value"
          class="checkbox-list__label"
        >
          <radio
            color="#fb7299"
            :checked="state.meta.sex === item.value"
            class="checkbox-list__checkbox"
            :value="item.value"
          >{{ item.text }}</radio>
        </label>
      </radio-group>
    </view>
    <view class="input-wrap">
      <view class="label">
        生日
      </view>
      <picker
        :value="state.meta.birthday"
        mode="date"
        start="1980-01-01"
        end="2002-12-31"
        @change="onBirthdayChange"
      >
        <view class="picker">
          {{ state.meta.birthday || '点击选择' }}
        </view>
      </picker>
    </view>
    <view class="input-wrap">
      <view class="label">
        身高（cm）
      </view>
      <view class="slide-wrap">
        <slider
          block-size="20"
          active-color="#fb7299"
          step="1"
          :value="state.meta.bodyHeight"
          show-value="true"
          min="100"
          max="200"
          @change="onBodyHeightChange"
        />
      </view>
    </view>
    <view class="input-wrap">
      <view class="label">
        体重（kg）
      </view>
      <view class="slide-wrap">
        <slider
          block-size="20"
          active-color="#fb7299"
          step="1"
          :value="state.meta.bodyWeight"
          show-value="true"
          min="30"
          max="130"
          @change="onBodyWeightChange"
        />
      </view>
    </view>
    <view class="input-wrap">
      <view class="label">
        职业
      </view>
      <picker
        mode="selector"
        :range="workList"
        @change="onWorkChange"
      >
        <view class="picker">
          {{ state.meta.work || '点击选择' }}
        </view>
      </picker>
    </view>
    <view class="input-wrap">
      <view class="label">
        学历
      </view>
      <picker
        mode="selector"
        :range="studyList"
        @change="onStudyChange"
      >
        <view class="picker">
          {{ state.meta.study || '点击选择' }}
        </view>
      </picker>
    </view>
    <view class="input-wrap">
      <view class="label">
        坐标
      </view>
      <picker
        mode="selector"
        :range="locationList"
        @change="onLocationChange"
      >
        <view class="picker">
          {{ state.meta.location || '点击选择' }}
        </view>
      </picker>
    </view>
    <view class="input-wrap">
      <view class="label">
        微信号
      </view>
      <input
        v-model="state.meta.wechat"
        type="text"
        placeholder="填写你的微信号"
      >
    </view>
    <button
      class="primary-btn"
      @tap="handleSubmit"
    >
      点击保存
    </button>
  </view>
</template>

<script>
import Uploader from '~/components/uploader'
import http from '~/utils/http'
import toast from '~/utils/toast'
import { useStore } from 'vuex'
import { reactive } from 'vue'

export default {
  name: 'UserProfile',
  components: {
    Uploader
  },
  setup() {
    const store = useStore()
    const state = reactive({
      nickname: store?.state?.userInfo?.nickname,
      avatar: store?.state?.userInfo?.avatar,
      meta: {
        sex: null,
        birthday: null,
        bodyHeight: 0,
        bodyWeight: 0,
        link: '',
        work: '',
        wechat: '',
        location: '',
        ...(store?.state?.userInfo?.meta || {})
      }
    })

    const sexList = [
      {
        value: '0',
        text: '女'
      },
      {
        value: '1',
        text: '男'
      }
    ]

    const locationList = ['上海', '北京', '南京', '杭州', '武汉', '芜湖', '重庆']

    const workList = ['程序员', '设计师', '产品经理', '商务', '运营', '审核', '项目管理', '其它']

    const studyList = ['初中', '高中', '专科', '本科', '硕士', '博士']

    const onSexChange = (evt) => {
      state.meta.sex = evt.detail.value
    }

    const onWorkChange = (evt) => {
      state.meta.work = workList[evt.detail.value]
    }

    const onStudyChange = (evt) => {
      state.meta.study = studyList[evt.detail.value]
    }

    const onLocationChange = (evt) => {
      state.meta.location = locationList[evt.detail.value]
    }

    const onBodyHeightChange = (evt) => {
      state.meta.bodyHeight = evt.detail.value
    }

    const onBodyWeightChange = (evt) => {
      state.meta.bodyWeight = evt.detail.value
    }

    const onBirthdayChange = (evt) => {
      state.meta.birthday = evt.detail.value
    }

    const handleSubmit = () => {
      state.nickname = state.nickname.trim()
      state.meta.wechat = state.meta.wechat.trim()
      http.post('user/profile', state)
      .then(() => {
        toast.info('保存成功')
        store.commit('UPDATE_USER_INFO', {
          ...store.state.userInfo,
          ...state
        })
      })
      .catch((err) => {
        toast.info(err.message)
      })
    }

    return {
      state,
      sexList,
      workList,
      locationList,
      studyList,
      onSexChange,
      onWorkChange,
      onStudyChange,
      onLocationChange,
      onBodyHeightChange,
      onBodyWeightChange,
      onBirthdayChange,
      handleSubmit
    }
  }
}
</script>

<style lang="scss">
.user-profile {
  .input-wrap {
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;
    min-height: 100px;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 10%;
      border: 1px solid #fafafa;
    }

    input {
      text-align: right;
    }

    radio {
      margin-left: 10px;
    }

    slider {
      margin-right: 0;
    }

    .slide-wrap {
      width: 60%;
      min-width: 200px;
    }
  }

  .primary-btn {
    display: block;
    margin: 30px 20px;
  }
}
</style>
