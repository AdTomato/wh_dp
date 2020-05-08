<template>
  <div class="error-box">
    <div class="error">
      <img src="@/assets/images/error.png" alt="">
      <p>服务器开了个小差</p>
      <a-button type="primary" @click="back">手动返回</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Button } from 'h3-antd-vue';

@Component({
  name: 'error',
  components: {
    AButton: Button
  }
})

export default class Error extends Vue {
  back() {
    this.$router.replace({ path: '/' });
  }
}
</script>


<style lang="less" scoped>
  .error-box {
    // todo: header独立
    position: fixed!important;
    top: 0!important;
    left: 0!important;
    width: 100%!important;
    height: 100%!important;
    background: white!important;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    & > .error {
      text-align: center;
      & > img {
        width: 304px;
      }
      & > p {
        color: rgba(0,0,0,.45);
        margin-bottom: 16px;
      }
    }
  }
</style>
