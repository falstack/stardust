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
    content: [
      {
        id: 1,
        type: 'left',
        part: 1,
        value: [
          {
            id: 1,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 2,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '测试删除',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 3,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 4,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 5,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 6,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 7,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
          {
            id: 8,
            track_at: 0,
            src: 'https://file.calibur.tv/owner/voice/luffy.mp3',
            text: '我叫蒙奇·D·路飞，是要成为海贼王的男人！',
            duration: 10000,
            start_at: 1000,
            ended_at: 9000,
            color_bubble: '#ff8eb3',
            color_text: '#fff',
            sender: {
              id: 1
            },
            author: {
              id: 1
            }
          },
        ]
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
    ],
    editor: {
      focusTrackId: 0,
      focusVoiceId: 0,
      showVoiceDrawer: false,
      voiceEditType: ''
    }
  }),
  mutations: {
    TOGGLE_VOICE_DRAWER(store) {
      store.editor.showVoiceDrawer = !store.editor.showVoiceDrawer
    },
    UPDATE_FOCUS_VOICE(store, { id }) {
      store.editor.focusTrackId = 0
      store.editor.focusVoiceId = id
    },
    UPDATE_FOCUS_TRACK(store, { id }) {
      store.editor.focusVoiceId = 0
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
      const track = store.content[index]
      const subIndex = getIndex(track.value, store.editor.focusVoiceId)
      track.value.splice(subIndex, 1)
      if (subIndex) {
        store.editor.focusVoiceId = track.value[subIndex - 1].id
      }
      store.editor.voiceEditType = ''
    }
  },
  actions: {

  },
  getters: {

  }
}
