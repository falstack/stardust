<style lang="scss">
</style>

<template>
  <input v-model="text" type="text">
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'TestInput',
  props: {
    modelValue: {
      required: true,
      type: String
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const text = ref(props.modelValue)

    watch(text, (val) => {
      ctx.emit('update:modelValue', val)
    })

    watch(() => props.modelValue, (val) => {
      text.value = val
    })

    return {
      text
    }
  }
}
</script>
