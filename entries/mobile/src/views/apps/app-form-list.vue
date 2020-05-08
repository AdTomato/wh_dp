<template>
  <apps-list @setTitle="setApplicationTitle"/>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// import { setTitle } from '@/utils/dingtalk';

import * as platform from '@cloudpivot/platform';

import * as applicationList from '@cloudpivot/list'


@Component({
  name: 'FormList',
  components: {
   AppsList: applicationList.components.mobile.ApplicationList
  }
})

export default class FormList extends Vue {
  setApplicationTitle(title:string) {
    // setTitle(title);
    platform.service.setTitle(title);
  }
  
}
</script>

<style lang="less" scoped>

</style>
