<template>
  <div class="error-box">
    <div class="error">
      <img src="@/assets/images/error.png" alt="">
      <p>{{ $t('languages.common.errTips') }}</p>
      <a-button type="primary" @click="back">{{ $t('languages.common.goBack') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Button } from 'h3-antd-vue';

@Component({
  name: 'error',
  components: {
    AButton: Button
  }
})

export default class Error extends Vue {
  back() {
    this.$router.replace({ name: 'workflowCenter' });
  }

  

}
</script>


<style lang="less" scoped>
  @import '../../styles/themes/default.less';
  .error-box {
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
        color: @light-color-3;
        margin-bottom: @base4-padding-md;
      }
    }
  }
</style>
