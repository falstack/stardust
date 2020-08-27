<template>
  <view class="chat-room">
    <view v-for="item in state.list" :key="item.id">
      <component :is="item.type" :message="item" />
    </view>
  </view>
</template>

<script>
import { reactive } from 'vue'
import BubbleMsg from './bubble'

export default {
  name: 'MsgRoom',
  components: {
    BubbleMsg
  },
  setup() {
    const state = reactive({
      list: [],
      resolver: null,
      last_pending_id: 0
    })

    const _setResolve = () => {
      setTimeout(() => {
        if (!state.last_pending_id) {
          return
        }
        state.list.forEach((item, index) => {
          if (item.id === state.last_pending_id) {
            state.list[index].next = new Promise(resolve => {
              state.resolver = resolve
            })
          }
        })
      }, 0)
    }

    const _handleResolve = (data) => {
      if (!state.last_pending_id) {
        return
      }
      state.resolver(data)
      _setResolve()
    }

    const _handleMsgLoaded = (index) => {
      state.list[index].loading = false
      if (state.list[index].next) {
        return
      }
      _handleResolve(state.list[index].item)
    }

    const _handleMsgResolve = (id) => {
      if (state.last_pending_id !== id) {
        return
      }
      state.last_pending_id = 0
      state.resolver = null
    }

    const clearMessage = () => {
      state.list = []
      state.last_pending_id = 0
      state.resolver = null
    }

    const addMessage = (message) => {
      message.next = null

      state.list.push(message)

      const isPromise = message.async || false
      if (isPromise) {
        state.last_pending_id = message.id
        _setResolve()
      } else {
        _handleResolve(message)
      }
    }

    const addWidget = (widget) => {
      state.list.push(widget)
    }

    const updateMessage = (id, obj) => {
      for (let i = state.list.length - 1; i >= 0; i--) {
        if (state.list[i].id === id) {
          Object.keys(obj).forEach(key => {
            state.list[i][key] = obj[key]
          })
          break
        }
      }
    }

    return {
      state,
      clearMessage,
      addMessage,
      addWidget,
      updateMessage,
      _handleMsgLoaded,
      _handleMsgResolve
    }
  }
}
</script>
