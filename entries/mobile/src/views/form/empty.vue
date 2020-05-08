
<template>
  <div class="empty">

    <div class="empty__body">
      <img src="@/assets/images/success.png">
      <p><h3-button @click="back()" type="primary">返回</h3-button></p>
    </div>

  </div>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { H3Button } from 'h3-mobile-vue';

import * as platform from '@cloudpivot/platform';

// import { isDingtalk } from '@/utils/common';

// import { closeWindow } from '@/utils/dingtalk';

@Component({
  name: 'empty',
  components: {
    H3Button
  }
})
export default class Empty extends Vue {
  back() {
    const url = this.$route.query.return as string;
    if (url) {
      this.$router.replace({
        path: url
      });
    } else {
      if(platform.IS_DINGTALK){
        platform.service.close();
        // closeWindow();
      }else{
        this.$router.replace('/');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.empty{
  height: 100%;
  display: flex;

  &__body{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

  }

  .h3-button{
    width: 5em;
    margin-top: 2em;
  }

}
</style>
