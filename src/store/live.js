const getIndex = (array, id, key = 'id') => {
  let result = 0

  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === id) {
      result = i
      break
    }
  }

  return result
}

export default {
  namespaced: true,
  state: () => ({
    content: [],
    editor: {
      focusTrackId: 0,
      focusVoiceId: 0,
      showVoiceDrawer: false,
      voiceEditType: '',
      readers: []
    }
  }),
  mutations: {
    SET_CONTENT(store, data) {
      store.content = data
    },
    TOGGLE_VOICE_DRAWER(store) {
      store.editor.showVoiceDrawer = !store.editor.showVoiceDrawer
    },
    UPDATE_FOCUS_VOICE(store, { id }) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const sameTrack = track.map(_ => _.id).filter(_ => _ === id).length
      if (!sameTrack) {
        let result
        for (let i = 0; i < store.content.length; i++) {
          if (result) {
            break
          }
          for (let j = 0; j < store.content[i].value.length; j++) {
            if (store.content[i].value[j].id === id) {
              result = store.content[i].id
              break
            }
          }
        }
        store.editor.focusTrackId = result
      }
      store.editor.focusVoiceId = id
    },
    UPDATE_FOCUS_TRACK(store, { id }) {
      const index = getIndex(store.content, id)
      const track = store.content[index].value
      store.editor.focusVoiceId = track.length ? track[0].id : 0
      store.editor.focusTrackId = id
    },
    ADD_TRACK(store) {
      const index = getIndex(store.content, store.editor.focusTrackId)
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
      const index = getIndex(store.content, store.editor.focusTrackId)
      const type = store.content[index].type
      if (store.content.map(_ => _.type).filter(_ => _ === type).length <= 1) {
        return
      }
      store.editor.focusTrackId = store.content[index - 1].id
      store.content.splice(index, 1)
    },
    ADD_VOICE(store, data) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      store.content[index].value.push(data)
    },
    CHANGE_VOICE_EDIT_TYPE(store, type) {
      store.editor.voiceEditType = type
    },
    DELETE_VOICE_ITEM(store) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
      track.splice(subIndex, 1)
      if (subIndex) {
        store.editor.focusVoiceId = track[subIndex - 1].id
      }
      store.editor.voiceEditType = ''
    },
    UPDATE_VOICE_VOLUME(store, { volume }) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
      track[subIndex].volume = volume
    },
    CLIP_VOICE_DURATION(store, data) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
      Object.keys(data).forEach(key => {
        track[subIndex][key] = data[key]
      })
    },
    CHANGE_VOICE_TRACK(store, { isUp }) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      if (isUp && !index) {
        return
      }
      /**
       * TODO：最后一条是 BGM 不能变轨到那边
       */
      if (!isUp && index === store.content.length - 1) {
        return
      }
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
      const voice = track[subIndex]
      const targetIndex = isUp ? index - 1 : index + 1
      const targetTrack = store.content[targetIndex]
      const voiceStartAt = voice.begin_at
      const voiceTimeout = (voice.ended_at || voice.duration) - voice.start_at
      const voiceEndedAt = voice.begin_at + voiceTimeout

      const deleteOldVoice = () => {
        if (track[subIndex + 1]) {
          track[subIndex + 1].margin_left += (voiceTimeout / 100 + voice.margin_left)
        }
        track.splice(subIndex, 1)
      }

      const addNewVoice = (nextTrack, insertIndex = -1) => {
        if (insertIndex !== -1) {
          const prevVoice = nextTrack.value[insertIndex - 1]
          if (
            prevVoice &&
            (prevVoice.begin_at + (prevVoice.ended_at || prevVoice.duration) - prevVoice.start_at) > (voiceStartAt - voice.margin_left * 100)
          ) {
            voice.margin_left -= (prevVoice.begin_at + (prevVoice.ended_at || prevVoice.duration) - prevVoice.start_at) / 100
          }
          nextTrack.value[insertIndex].margin_left -= (voiceTimeout / 100 + voice.margin_left)
          nextTrack.value.splice(insertIndex, 0, voice)
        } else {
          voice.margin_left = voice.begin_at / 100
          nextTrack.value.push(voice)
        }
        store.editor.focusTrackId = nextTrack.id
      }

      let noMatched = true
      if (!targetTrack.value.length) {
        noMatched = false
        deleteOldVoice()
        addNewVoice(targetTrack)
      } else {
        for (let i = 0; i < targetTrack.value.length; i++) {
          if (targetTrack.value[i].begin_at >= voiceEndedAt) {
            const prevVoice = targetTrack.value[i - 1]
            if (
              !prevVoice ||
              (prevVoice.begin_at + (prevVoice.ended_at || prevVoice.duration) - prevVoice.start_at) <= voiceStartAt
            ) {
              noMatched = false
              deleteOldVoice()
              addNewVoice(targetTrack, i)
            }
          }
        }
      }

      if (noMatched) {
        // TODO：Auto create track
      }
    },
    UPDATE_VOICE_TEXT(store, { value }) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
      track[subIndex].text = value
    },
    UPDATE_VOICE_COLOR(store, { bg, text }) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
      track[subIndex].color_bubble = bg
      track[subIndex].color_text = text
    },
    UPDATE_VOICE_MARGIN(store, { value }) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = getIndex(track, store.editor.focusVoiceId)
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
        return
      }

      curVoice.margin_left += delta
      curVoice.begin_at += delta * 100

      if (!nextVoice) {
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
    },
    ADD_VOICE_ITEM(store, data) {
      const index = getIndex(store.content, store.editor.focusTrackId)
      const track = store.content[index].value
      const subIndex = store.editor.focusVoiceId ? getIndex(track, store.editor.focusVoiceId) : -1
      track.splice(subIndex + 1, 0, data)
      const readerIds = store.editor.readers.map(_ => _.id)
      const curRenderId = data.reader.id
      if (readerIds.indexOf(curRenderId) === -1) {
        store.editor.readers.push(data.reader)
      }
      store.editor.focusVoiceId = curRenderId
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
          type: 'right',
          part: 1,
          value: []
        },
        {
          id: 3,
          type: 'bgm',
          part: 1,
          value: []
        }
      ]
      commit('SET_CONTENT', data)
      commit('UPDATE_FOCUS_TRACK', data[0])
    }
  },
  getters: {
    currentTrack: (state) => {
      if (!state.editor.focusTrackId) {
        return null
      }
      const index = getIndex(state.content, state.editor.focusTrackId)
      return state.content[index]
    },
    currentVoice: (state) => {
      if (!state.editor.focusTrackId || !state.editor.focusVoiceId) {
        return null
      }

      const index = getIndex(state.content, state.editor.focusTrackId)
      const track = state.content[index].value
      const subIndex = getIndex(track, state.editor.focusVoiceId)

      return track[subIndex]
    }
  }
}
