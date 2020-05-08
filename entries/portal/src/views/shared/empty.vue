
<template>
  <div class="empty">

    <div class="header">
      <div>
        <img src="@/assets/images/yslogo.png">
      </div>
    </div>

    <div class="emtpy__body">
      <!--<img src="@/assets/images/no-data2.png">-->

      <img src="@/assets/images/no-data-wt.png">
      <p>{{ $t('languages.common.noData') }}</p>
    </div>

  </div>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Button } from 'h3-antd-vue';

@Component({
  name: 'empty',
  components: {
    AButton: Button
  }
})
export default class Empty extends Vue {
  close() {
    window.opener = null;
    window.open('', '_self');
    window.close();
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/themes/default.less";

.header img{
  max-height: 30px !important;
}

.emtpy__body{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  color: @light-color-2;

  & > p{
    margin-top: 1em;
  }

}
</style>
