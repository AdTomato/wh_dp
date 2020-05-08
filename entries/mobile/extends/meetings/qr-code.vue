<template>
  <div :class="prefixCls">
    <div :class="[prefixCls + 'content']">
      <img :src="qrCode">
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import env  from '../../src/config/env';

import {
  H3Avatar
} from 'h3-mobile-vue';

const prefixCls = 'meetings-qr-code';
@Component({
  name: 'meetings-qr-code',
  components: {
    H3Avatar
  },
})
export default class MeetingsQRCode extends Vue {
  prefixCls = prefixCls;

  qrCode = `${env.apiHost}/api/qrcode/generate_qrcode`;
}

</script>
<style lang="less" scoped>
@import "~@/styles/mixins.less";
@import "~@/styles/mixins/hairline.less";
.meetings-qr-code{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f9;
}
</style>
