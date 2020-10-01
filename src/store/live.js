import { colors } from '~/utils'
import http from '~/utils/http'

const getIndex = (array, id, key) => {
  let result = 0

  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === id) {
      result = i
      break
    }
  }

  return result
}

const getTrackIndex = (array, id) => {
  return getIndex(array, id, 'id')
}

const getVoiceIndex = (array, id) => {
  return getIndex(array, id, 'local_id')
}

const logTrack = (content) => {
  const arr = content.map(_ => _.value)
  const result = []
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i].map(_ => {
      return {
        begin_at: _.begin_at,
        ended_at: _.begin_at + _.duration
      }
    })
  }

  console.log(result)
}

export default {
  namespaced: true,
  state: () => ({
    content: [],
    readers: [],
    editor: {
      draftId: 0,
      focusTrackId: 0,
      focusVoiceId: 0,
      voiceEditType: '',
      showSearchDrawer: false
    },
    voices: {
      0: [],
      1: []
    },
    info: {
      id: 0,
      title: '',
      desc: '',
      author: {}
    }
  }),
  mutations: {
    SET_CONTENT(store, data) {
      store.content = data
    },
    SET_READERS(store, data) {
      store.readers = data
    },
    SET_LIVE_INFO(store, data) {
      store.info.id = data.id
      store.info.desc = data.desc
      store.info.title = data.title
      store.info.author = data.author
    },
    UPDATE_LIVE_INFO(store, obj) {
      Object.keys(obj).forEach(key => {
        store.info[key] = obj[key]
      })
    },
    SET_DRAFT_ID(store, id) {
      store.editor.draftId = id
    },
    ADD_SELF_VOICE(store, data) {
      store.voices[1].unshift(data)
    },
    UPDATE_SELF_VOICE(store, { id, text }) {
      store.voices[1].forEach((item, index) => {
        if (item.id === id) {
          store.voices[1][index].text = text
        }
      })
    },
    DELETE_SELF_VOICE(store, { id }) {
      store.voices[1].forEach((item, index) => {
        if (item.id === id) {
          store.voices[1].splice(index, 1)
        }
      })
    },
    TOGGLE_SEARCH_DRAWER(store) {
      store.editor.showSearchDrawer = !store.editor.showSearchDrawer
    },
    UPDATE_FOCUS_VOICE(store, { local_id }) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const sameTrack = track.map(_ => _.local_id).filter(_ => _ === local_id).length
      if (!sameTrack) {
        let result
        for (let i = 0; i < store.content.length; i++) {
          if (result) {
            break
          }
          for (let j = 0; j < store.content[i].value.length; j++) {
            if (store.content[i].value[j].local_id === local_id) {
              result = store.content[i].id
              break
            }
          }
        }
        store.editor.focusTrackId = result
      }
      store.editor.focusVoiceId = local_id
    },
    UPDATE_FOCUS_TRACK(store, { id }) {
      const index = getTrackIndex(store.content, id)
      const track = store.content[index].value
      store.editor.focusVoiceId = track.length ? track[0].local_id : 0
      store.editor.focusTrackId = id
    },
    ADD_TRACK(store) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const type = store.content[index].type
      if (type === 'bgm') {
        return
      }
      const newId = store.content.length + 1
      const newVal = {
        id: newId,
        type,
        part: store.content[index].part + 1,
        value: []
      }
      store.content.splice(index + 1, 0, newVal)
      store.editor.focusTrackId = newId
      store.editor.focusVoiceId = 0
    },
    DEL_TRACK(store) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const type = store.content[index].type
      if (store.content.map(_ => _.type).filter(_ => _ === type).length <= 1) {
        return
      }
      if (store.content[index].value.length) {
        return
      }
      store.editor.focusTrackId = store.content[index - 1].id
      store.content.splice(index, 1)
    },
    CHANGE_VOICE_EDIT_TYPE(store, type) {
      store.editor.voiceEditType = type
    },
    DELETE_VOICE_ITEM(store) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getVoiceIndex(track, store.editor.focusVoiceId)
      const deleteItem = track[subIndex]

      if (track[subIndex + 1]) {
        track[subIndex + 1].margin_left += deleteItem.margin_left + deleteItem.duration  / 100
      }

      store.readers.forEach((item, index) => {
        if (item.id === deleteItem.reader_id) {
          if (item.voice_count === 1) {
            store.readers.splice(index, 1)
          } else {
            store.readers[index].voice_count--
          }
        }
      })

      track.splice(subIndex, 1)
      if (subIndex) {
        store.editor.focusVoiceId = track[subIndex - 1].local_id
      }
      store.editor.voiceEditType = ''
      logTrack(store.content)
    },
    UPDATE_VOICE_VOLUME(store, { volume }) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getVoiceIndex(track, store.editor.focusVoiceId)
      track[subIndex].volume = volume
    },
    CLIP_VOICE_DURATION(store, data) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getVoiceIndex(track, store.editor.focusVoiceId)
      Object.keys(data).forEach(key => {
        track[subIndex][key] = data[key]
      })
    },
    CHANGE_VOICE_TRACK(store, { isUp }) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      if (isUp && !index) {
        return
      }

      // 不能移入 BGM
      if (!isUp && index >= store.content.length - 2) {
        return
      }

      // BGM
      if (index === store.content.length - 1) {
        return
      }

      const track = store.content[index].value
      const subIndex = getVoiceIndex(track, store.editor.focusVoiceId)
      const voice = track[subIndex]
      const targetIndex = isUp ? index - 1 : index + 1
      const targetTrack = store.content[targetIndex].value

      const deleteOldVoice = () => {
        if (track[subIndex + 1]) {
          track[subIndex + 1].margin_left += (voice.duration / 100 + voice.margin_left)
        }
        track.splice(subIndex, 1)
      }

      let change = false

      if (!targetTrack.length) {
        change = true
        deleteOldVoice()
        voice.margin_left = voice.begin_at / 100
        targetTrack.push(voice)
      } else {
        for (let i = 0; i < targetTrack.length; i++) {
          const prevVoice = targetTrack[i - 1]
          const nextVoice = targetTrack[i + 1]
          const currVoice = targetTrack[i]
          /**
           * 是最后一个，并且最后一个的截止时间小于当前的开始时间
           * 删除老的
           * 改变当前的 margin-left
           */
          if (
            !nextVoice &&
            currVoice.begin_at + currVoice.duration <= voice.begin_at
          ) {
            deleteOldVoice()
            voice.margin_left = (voice.begin_at - currVoice.begin_at - currVoice.duration) / 100
            targetTrack.splice(i + 1, 0, voice)
            change = true
            break
          }
          /**
           * 是第一个，并且第一个的开始时间大于当前的结束时间
           * 删除老的
           * 第一个的 margin-left 减去当前音源的长度
           * 当前音源的 margin-left 为开始时间的长度
           */
          if (
            !prevVoice &&
            currVoice.begin_at >= voice.begin_at + voice.duration
          ) {
            deleteOldVoice()
            currVoice.margin_left -= (voice.begin_at + voice.duration) / 100
            voice.margin_left = voice.begin_at / 100
            targetTrack.splice(i, 0, voice)
            change = true
            break
          }
          /**
           * 在中间，
           * 上一个元素的结束时间小于当前的开始时间
           * 且
           * 当前元素的开始时间大于当前的结束时间
           */
          if (
            prevVoice &&
            prevVoice.begin_at + prevVoice.duration <= voice.begin_at &&
            voice.begin_at + voice.duration <= currVoice.begin_at
          ) {
            deleteOldVoice()
            voice.margin_left = (voice.begin_at - prevVoice.begin_at - prevVoice.duration) / 100
            currVoice.margin_left -= (voice.begin_at + voice.duration - prevVoice.begin_at - prevVoice.duration) / 100
            targetTrack.splice(i, 0, voice)
            change = true
            break
          }
        }
      }

      if (change) {
        store.editor.focusTrackId = store.content[targetIndex].id
      }

      logTrack(store.content)
    },
    UPDATE_VOICE_TEXT(store, { value }) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getVoiceIndex(track, store.editor.focusVoiceId)
      track[subIndex].text = value
    },
    UPDATE_VOICE_COLOR(store, { color, reader_id }) {
      const users = store.readers
      const indexOf = users.map(_ => _.id).indexOf(reader_id)
      users[indexOf].color = color
    },
    UPDATE_VOICE_MARGIN(store, { value }) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getVoiceIndex(track, store.editor.focusVoiceId)
      let delta
      const curVoice = track[subIndex]
      const nextVoice = track[subIndex + 1]
      if (curVoice.margin_left + value < 0) {
        /**
         * 当 value 小于 0，即向左偏移的时候
         * 设置 margin-left 最小为 0
         */
        delta = -curVoice.margin_left
      } else if (nextVoice && nextVoice.margin_left && nextVoice.margin_left < value) {
        /**
         * 当 value 大于 0，且下一个元素有 margin-left 的时候
         * 当前元素的 margin-left 加，下一个元素的 margin-left 减
         * 保证在这个 case 下，后面的元素不会动
         * 所以 delta 最大为下一个元素的 margin_left
         */
        delta = nextVoice.margin_left
      } else {
        delta = value
      }

      if (!delta) {
        logTrack(store.content)
        return
      }

      curVoice.margin_left += delta
      curVoice.begin_at += delta * 100

      if (!nextVoice) {
        logTrack(store.content)
        return
      }
      /**
       * 向左偏移了，并且还有后面一个元素
       * 那么后面一个元素就补上当前元素的偏移量
       * 保证向左的时候，只有当前元素会移动
       */
      if (delta < 0) {
        nextVoice.margin_left -= delta
      } else if (nextVoice.margin_left) {
        /**
         * 下一个元素的 margin-left 减少
         */
        nextVoice.margin_left -= delta
      } else {
        /**
         * 向右偏移了，那么右边的所以元素都要在时间轴上偏移
         */
        for (let i = subIndex + 1; i < track.length; i++) {
          track[i].begin_at += delta * 100
        }
      }
      logTrack(store.content)
    },
    ADD_VOICE_ITEM(store, { data, user }) {
      const index = getTrackIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = store.editor.focusVoiceId ? getVoiceIndex(track, store.editor.focusVoiceId) : track.length - 1
      const prevItem = track[subIndex]
      if (prevItem) {
        data.begin_at = prevItem.begin_at + prevItem.duration
      }
      track.splice(subIndex + 1, 0, data)
      const readerIds = store.readers.map(_ => _.id)
      const curRenderId = user.id
      const indexOf = readerIds.indexOf(curRenderId)
      if (indexOf === -1) {
        store.readers.push({
          ...user,
          color: colors[curRenderId % colors.length],
          voice_count: 1
        })
      } else {
        store.readers[indexOf].voice_count++
      }
      store.editor.focusVoiceId = data.local_id
      logTrack(store.content)
    },
    SET_VOICES(store, { type, list }) {
      store.voices[type] = list
    }
  },
  actions: {
    initEditor({ commit }) {
      const data = [
        {
          id: 1,
          type: 'left',
          part: 1,
          value: []
        },
        {
          id: 2,
          type: 'left',
          part: 2,
          value: []
        },
        {
          id: 3,
          type: 'left',
          part: 3,
          value: []
        },
        {
          id: 5,
          type: 'right',
          part: 1,
          value: []
        },
        {
          id: 6,
          type: 'right',
          part: 2,
          value: []
        },
        {
          id: 7,
          type: 'right',
          part: 3,
          value: []
        },
        {
          id: 8,
          type: 'bgm',
          part: 4,
          value: []
        }
      ]
      commit('SET_CONTENT', data)
      commit('UPDATE_FOCUS_TRACK', data[0])
    },
    loadData({ commit }, { id }) {
      return new Promise((resolve, reject) => {
        http.get('live_room/show', { id })
          .then(res => {
            commit('SET_CONTENT', res.content)
            commit('SET_READERS', res.readers)
            commit('SET_LIVE_INFO', res)
            commit('SET_DRAFT_ID', id)
            resolve()
          })
          .catch(reject)
      })
    },
    getVoices({ commit }, query) {
      http.get('live_room/voice/all', query)
        .then(res => {
          commit('SET_VOICES', { type: query.type, list: res })
        })
    }
  },
  getters: {
    currentTrack: (state) => {
      if (!state.editor.focusTrackId) {
        return null
      }
      const index = getTrackIndex(state.content, state.editor.focusTrackId)
      return state.content[index]
    },
    currentVoice: (state) => {
      if (!state.editor.focusTrackId || !state.editor.focusVoiceId) {
        return null
      }

      const index = getTrackIndex(state.content, state.editor.focusTrackId)
      const track = state.content[index].value
      const subIndex = getVoiceIndex(track, state.editor.focusVoiceId)

      return track[subIndex]
    },
    readerColor: (state) => (id) => {
      const users = state.readers
      const indexOf = users.map(_ => _.id).indexOf(id)
      if (indexOf !== -1 && users[indexOf].color) {
        return users[indexOf].color
      }
      return colors[id % colors.length]
    }
  }
}
