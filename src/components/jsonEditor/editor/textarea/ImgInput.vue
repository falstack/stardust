<style lang="scss">
</style>

<template>
  <input
    v-model="text"
    type="text"
    placeholder="请输入图片简介"
    autoFocus="true"
    adjustPosition=""
  >
</template>

<script>
export default {
  name: 'ImgInput',
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
