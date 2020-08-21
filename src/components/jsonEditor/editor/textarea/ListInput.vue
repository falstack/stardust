<style lang="scss">
</style>

<template>
  <textarea
    v-model="text"
    type="text"
    placeholder="请输入内容"
    autoFocus="true"
    showConfirmBar=""
    class="textarea"
    maxlength="5000"
  />
</template>

<script>
  export default {
    name: 'ListInput',
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
