
<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/images/yslogo.png">
    </div>
  </div>
</template>


<script lang="ts">

import {
  Component, Vue
} from 'vue-property-decorator';


@Component({
  name: 'empty-header'
})
export default class EmptyHeader extends Vue {
}

</script>


<style lang="less" scoped>
  @import "../../../styles/themes/default.less";
  
.logo img{
  max-height: 30px !important;
}
</style>
