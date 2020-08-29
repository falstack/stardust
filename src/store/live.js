export default {
  namespaced: true,
  state: () => ({
    content: [
      {
        type: 'left',
        name: '左1',
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
        type: 'right',
        name: '右1',
        created_at: 2,
        value: []
      },
      {
        type: 'bgm',
        name: 'BGM',
        created_at: 3,
        value: []
      }
    ],
    editor: {
      focusVoiceId: 0,
      focusTrackId: ''
    }
  }),
  mutations: {
    UPDATE_FOCUS_VOICE(store, { id }) {
      store.editor.focusTrackId = ''
      store.editor.focusVoiceId = id
    },
    UPDATE_FOCUS_TRACK(store, { name }) {
      store.editor.focusVoiceId = 0
      store.editor.focusTrackId = name
    }
  },
  actions: {

  },
  getters: {

  }
}
