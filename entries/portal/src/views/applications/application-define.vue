<template>
  <application-custom :url="url" />
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';

import * as  applicationList from '@cloudpivot/list';

@Component({
  name: 'application-define',
  components: {
    applicationCustom: applicationList.components.pc.ApplicationCustomIframe
  }
})
export default class ApplicationDefine extends Vue {
  
  get url() {
    return this.$route.params.url;
  }

}
</script>
<style lang="less" scoped>

</style>
