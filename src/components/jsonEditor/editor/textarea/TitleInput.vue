<template>
  <input
    v-model="text"
    type="text"
    placeholder="请输入标题"
    autoFocus="true"
    adjustPosition=""
  >
</template>

<script>
export default {
  name: 'TitleInput',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      text: this.value
    }
  },
  watch: {
    text(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.text = val
    }
  }
}
</script>

<style lang="scss">
</style>
