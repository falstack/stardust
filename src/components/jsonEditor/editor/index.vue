<style lang="scss">
#json-editor-container {
  width: 100%;
  overflow-x: hidden;
  background-color: RGB(241, 243, 244);

  .last-create-btn {
    padding-bottom: 300px;
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
    <CreateBtn
      slug="0"
      class="last-create-btn"
    />
    <Drawer v-model="showDrawer" size="100%">
      <view>
        <text @tap="closeEditDrawer">取消</text>
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
import Drawer from '../../drawer'

export default {
  name: 'JsonEditor',
  components: {
    Drawer,
    CreateBtn,
    TitleItem,
    TxtItem,
    ImgItem,
    UseItem,
    ListItem
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
      currentSelectedIndex: 0
    }
  },
  created() {
    Taro.eventCenter.on('CREATE_NOTE_ITEM', this.handleCreateNoteItem)
    Taro.eventCenter.on('DELETE_NOTE_ITEM', this.handleDeleteNoteItem)
    Taro.eventCenter.on('EDIT_NOTE_POSTER', this.handleEditNotePoster)
    Taro.eventCenter.on('EDIT_NOTE_CONTENT', this.handleEditNoteContent)
  },
  methods: {
    closeEditDrawer() {
      this.showDrawer = false
    },
    handleCreateNoteItem(data) {
      this._updateCurrentState(data)
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
    handleEditNoteContent({ slug }) {

    },
    _updateCurrentState(data) {
      this.currentSelectedSlug = data.slug
      this.currentSelectedType = data.type || ''
      this.currentSelectedIndex = this.content.map(_ => _.slug).indexOf(data.slug)
    }
  }
}
</script>
