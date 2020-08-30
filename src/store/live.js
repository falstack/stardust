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
      focusVoiceId: 0,
      focusTrackId: 0
    }
  }),
  mutations: {
    UPDATE_FOCUS_VOICE(store, { id }) {
      store.editor.focusTrackId = 0
      store.editor.focusVoiceId = id
    },
    UPDATE_FOCUS_TRACK(store, { id }) {
      store.editor.focusVoiceId = 0
      store.editor.focusTrackId = id
    },
    ADD_TRACK(store) {
      for (let i = 0; i < store.content.length; i++) {
        if (store.content[i].id === store.editor.focusTrackId) {
          const type = store.content[i].type
          if (type === 'bgm') {
            return
          }
          const newId = store.content.length + 1
          const newVal = {
            id: newId,
            type,
            part: store.content[i].part + 1,
            value: []
          }
          store.content.splice(i + 1, 0, newVal)
          store.editor.focusTrackId = newId
          break
        }
      }
    },
    DEL_TRACK(store) {
      for (let i = 0; i < store.content.length; i++) {
        if (store.content[i].id === store.editor.focusTrackId) {
          const type = store.content[i].type
          if (store.content.map(_ => _.type).filter(_ => _ === type).length <= 1) {
            return
          }
          store.editor.focusTrackId = store.content[i - 1].id
          store.content.splice(i, 1)
          break
        }
      }
    }
  },
  actions: {

  },
  getters: {

  }
}
