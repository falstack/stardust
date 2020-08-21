<style lang="scss">
#json-editor-container {
  width: 100%;
  overflow-x: hidden;
  background-color: #f5f5f7;

  .last-create-btn {
    padding-bottom: 300px;
  }

  .edit-drawer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .header,
    .toolbar {
      width: 100%;
      flex-shrink: 0;
    }

    input,
    textarea {
      width: 100%;
    }

    textarea {
      flex-grow: 1;
      padding: 20px;
    }

    .header {
      padding: 20px 30px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e7ecf2;
    }

    .toolbar {
      padding: 20px 30px;
      background-color: #f5f5f7;
      color: #515154;
    }
  }
}
</style>

<template>
  <view id="json-editor-container">
    <Component
      :is="`${item.type}-item`"
      v-for="(item, index) in content"
      :key="index + '-' + item.slug"
      :index="index"
      :item="item"
      class="flip-list-item"
    />
    <CreateBtn class="last-create-btn"/>
    <Drawer v-model="showDrawer" size="100%">
      <view class="edit-drawer" v-if="currentSelectedItem">
        <view class="header">
          <text @tap="closeEditDrawer">取消</text>
          <text @tap="saveEditData">更新</text>
        </view>
        <Component
          :is="`${currentSelectedItem.type}-bar`"
        />
        <Component
          :is="`${currentSelectedItem.type}-input`"
          v-model="currentSelectedItem.text"
        />
      </view>
    </Drawer>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import TxtItem from './items/TxtItem.vue'
import ImgItem from './items/ImgItem.vue'
import UseItem from './items/UseItem.vue'
import ListItem from './items/ListItem.vue'
import TitleItem from './items/TitleItem.vue'
import CreateBtn from './CreateBtn.vue'
import ImgInput from './textarea/ImgInput'
import ListInput from './textarea/ListInput'
import TitleInput from './textarea/TitleInput'
import TxtInput from './textarea/TxtInput'
import UseInput from './textarea/UseInput'
import ImgBar from './toolbar/ImgBar'
import ListBar from './toolbar/ListBar'
import TitleBar from './toolbar/TitleBar'
import TxtBar from './toolbar/TxtBar'
import UseBar from './toolbar/UseBar'
import Drawer from '../../drawer'
import ENUM from './enmu'

export default {
  name: 'JsonEditor',
  components: {
    Drawer,
    CreateBtn,
    TitleItem,
    TxtItem,
    ImgItem,
    UseItem,
    ListItem,
    ImgInput,
    ListInput,
    TitleInput,
    TxtInput,
    UseInput,
    ImgBar,
    ListBar,
    TitleBar,
    TxtBar,
    UseBar
  },
  props: {
    value: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      content: this.value.map(_ => {
        return {
          ..._,
          slug: Math.random().toString(36).substring(3, 6)
        }
      }),
      showDrawer: false,
      currentSelectedSlug: '',
      currentSelectedType: '',
      currentSelectedIndex: 0,
      currentSelectedItem: null
    }
  },
  created() {
    Taro.eventCenter.on(ENUM.CREATE_NOTE_ITEM, this.handleCreateNoteItem)
    Taro.eventCenter.on(ENUM.DELETE_NOTE_ITEM, this.handleDeleteNoteItem)
    Taro.eventCenter.on(ENUM.SORT_NOTE_ITEM, this.handleSortNoteItem)
    Taro.eventCenter.on(ENUM.EDIT_NOTE_POSTER, this.handleEditNotePoster)
    Taro.eventCenter.on(ENUM.EDIT_NOTE_CONTENT, this.handleEditNoteContent)
  },
  methods: {
    closeEditDrawer() {
      this.showDrawer = false
    },
    handleCreateNoteItem(data) {
      this._updateCurrentState(data, true)
      if (data.type === 'img') {
        this.getImageFromAlbum()
      } else {
        this.showDrawer = true
      }
    },
    getImageFromAlbum() {
      Taro.chooseImage({
        sourceType: ['album'],
        success: res => {
          const { tempFilePaths } = res
          if (!tempFilePaths || !tempFilePaths.length) {
            return
          }
          const data = tempFilePaths.map(local_url => {
            return {
              type: 'img',
              width: 0,
              height: 0,
              size: 0,
              mime: 0,
              text: '',
              url: '',
              slug: Math.random().toString(36).substring(3, 6),
              local_url
            }
          })
          this.content.splice(this.currentSelectedIndex, 0, ...data)
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    handleDeleteNoteItem({ slug }) {
      Taro.showModal({
        title: '是否删除当前文章段落？',
        cancelText: '取消',
        confirmText: '删除',
        confirmColor: '#FB7299'
      })
        .then(res => {
          if (res.cancel) {
            return
          }
          this.content.forEach((item, index) => {
            if (item.slug === slug) {
              this.content.splice(index, 1)
            }
          })
        })
    },
    handleEditNotePoster(data) {
      this._updateCurrentState(data)
      Taro.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: res => {
          const { tempFilePaths } = res
          if (!tempFilePaths || !tempFilePaths.length) {
            return
          }
          const data = {
            type: 'img',
            width: 0,
            height: 0,
            size: 0,
            mime: 0,
            url: '',
            text: this.content[this.currentSelectedIndex].text,
            slug: Math.random().toString(36).substring(3, 6),
            local_url: tempFilePaths[0]
          }
          this.content.splice(this.currentSelectedIndex, 1, data)
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    handleEditNoteContent(data) {
      this._updateCurrentState(data)
      this.showDrawer = true
    },
    _updateCurrentState(data, isCreate = false) {
      this.currentSelectedSlug = data.slug
      this.currentSelectedType = data.type || ''
      this.currentSelectedIndex = data.slug
        ? this.content.map(_ => _.slug).indexOf(data.slug)
        : this.content.length
      this.currentSelectedItem = isCreate ? {
        type: data.type,
        slug: Math.random().toString(36).substring(3, 6),
        text: ''
      } : this.content[this.currentSelectedIndex]
    },
    saveEditData() {
      this.$set(this.content, this.currentSelectedIndex, this.currentSelectedItem)
      this.showDrawer = false
    },
    handleSortNoteItem({ slug, isUp }) {
      const index = this.content.map(_ => _.slug).indexOf(slug)
      if (index === 0 && isUp) {
        return
      }
      if (index === this.content.length - 1 && !isUp) {
        return
      }
      const targetIndex = isUp ? index - 1 : index + 1
      const targetItem = this.content[targetIndex]
      this.content.splice(targetIndex, 1)
      this.content.splice(index, 0, targetItem)
    }
  }
}
</script>
