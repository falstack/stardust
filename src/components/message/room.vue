<template>
  <view class="chat-room">
    <view v-for="item in state.list" :key="item.id">
      <component :is="item.type" :message="item" />
    </view>
  </view>
</template>

<script>
import { reactive } from 'vue'
import Bubble from './bubble'

export default {
  name: 'MsgRoom',
  components: {
    Bubble
  },
  props: {
    colors: {
      type: Array,
      default: () => [
        { bg: '#12b7f5', text: '#fff' },
        { bg: '#ff8eb3', text: '#fff' }
      ]
    }
  },
  setup(props) {
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

    const _computeBubbleColor = (item) => {
      if (item.color) {
        return item.color
      }
      return props.colors[item.data.user.id % props.colors.length]
    }

    const clearMessage = () => {
      state.list = []
      state.last_pending_id = 0
      state.resolver = null
    }

    const addMessage = (params) => {
      const id = params.data && params.data.id || Math.random().toString(10).substring(3, 6)
      const loading = params.loading || false
      const isPromise = params.async || false

      const data = {
        id,
        loading,
        type: 'bubble',
        item: params.data,
        next: null
      }

      state.list.push(data)

      if (!loading && !isPromise) {
        _handleResolve(params.data)
      }

      if (isPromise) {
        state.last_pending_id = id
        _setResolve()
      }
    }

    const addWidget = (params) => {
      state.list.push({
        id: params.data && params.data.id || Math.random().toString(10).substring(3, 6),
        data: params.data,
        type: params.type
      })
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
