<template>
  <div class="application-define">
    <iframe class="application-define__page" :src="url"></iframe>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';
@Component({
  name: 'application-define',
})
export default class ApplicationDefine extends Vue {
  @Prop()
  url!: string
}
</script>
<style lang="less" scoped>
.application-define{
  .application-define__page{
    width: 100%;
    height: calc(100vh - 80px);
    overflow: auto;
    border: none;
  }
}
</style>
