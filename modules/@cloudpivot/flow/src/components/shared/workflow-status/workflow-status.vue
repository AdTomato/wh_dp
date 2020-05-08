
<template>
  <div v-if="lang === 'zh'" class="workflow-status">
    <img src="./images/draft.png" v-if="draft">
    <img src="./images/pending.png" v-else-if="processing">
    <img src="./images/completed.png" v-else-if="completed">
    <img src="./images/canceled.png" v-else-if="canceled">
    <img src="./images/exception.png" v-else-if="exception">
  </div>

  <div v-else class="workflow-status">
    <img src="./images/draft-en.png" v-if="draft">
    <img src="./images/pending-en.png" v-else-if="processing">
    <img src="./images/completed-en.png" v-else-if="completed">
    <img src="./images/canceled-en.png" v-else-if="canceled">
    <img src="./images/exception-en.png" v-else-if="exception">
  </div>
<!-- 
  <template v-else>
    
  </template> -->
  
  <!-- <img src="./images/timeout.png" v-else-if="timeout"> -->
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { lang } from 'moment';

@Component({
  name: 'workflow-status'
})
export default class WorkflowStatus extends Vue {
  @Prop()
  status !: string

  lang: string = localStorage.getItem('locale') || 'zh';

  get draft() {
    return this.status === 'DRAFT';
  }

  get processing() {
    return this.status === 'PROCESSING';
  }

  get completed() {
    return this.status === 'COMPLETED';
  }

  get canceled() {
    return this.status === 'CANCELED';
  }

  get exception() {
    return this.status === 'EXCEPTION';
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.lang = localStorage.getItem('locale') || 'zh';
  }


}


</script>

<style lang="less" scoped>
.workflow-status{
  img{
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>

