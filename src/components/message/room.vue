<template>
  <view v-if="false" />
  <ScrollView
    v-else
    scroll-y="true"
    show-scrollbar=""
    scroll-with-animation="true"
    :scroll-into-view="`id-${state.last_message_id}`"
    class="chat-room"
  >
    <BubbleMsg
      v-for="item in state.list"
      :id="`id-${item.id}`"
      :key="item.id"
      :message="item"
    />
  </ScrollView>
</template>

<script>
import { reactive } from 'vue'
import { ScrollView } from '@tarojs/components'
import BubbleMsg from './bubble'

export default {
  name: 'MsgRoom',
  components: {
    BubbleMsg,
    ScrollView
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const state = reactive({
      list: [],
      resolver: null,
      last_pending_id: 0,
      last_message_id: 0
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

    const handleMsgLoaded = (index) => {
      state.list[index].loading = false
      if (state.list[index].next) {
        return
      }
      _handleResolve(state.list[index].item)
    }

    const handleMsgResolve = (id) => {
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
      state.last_message_id = message.id

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
      state.last_message_id = widget.id
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
      handleMsgLoaded,
      handleMsgResolve
    }
  }
}
</script>

<style lang="scss">
.chat-room {
  width: 100%;
  height: 100%;
}
</style>
