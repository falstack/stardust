<style lang="scss">
.user-home {
  padding-top: 120px;

  .user-panel {
    padding: $container-padding;
  }
}
</style>

<template>
  <view class="user-home">
    <view class="iphone-x-shim" />
    <view class="user-panel">
      <GuestPanel />
      <SignedPanel />
    </view>
  </view>
</template>

<script>
import GuestPanel from "./components/GuestPanel";
import SignedPanel from "./components/SignedPanel";

export default {
  name: 'UserHome',
  components: {
    GuestPanel,
    SignedPanel
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
