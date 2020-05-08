<template>
  <div>
    
  </div>
</template>
<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
@Component({
  name: 'external-link'
})
export default class ExternalLink extends Vue {
  
  created() {
    // debugger
    let url: string = '';
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent)) {
      url = `${window.location.protocol}//${window.location.host}/mobile/externalLink.html?formId=${this.formId}`;
    } else {
      url = `${window.location.protocol}//${window.location.host}/externalLink.html?formId=${this.formId}`;
    }

    window.location.href = url;
    
  }

  get formId() {
    let formId:string = '';
    formId = this.$route.params.formid;
    return formId;
  }
}
</script>
