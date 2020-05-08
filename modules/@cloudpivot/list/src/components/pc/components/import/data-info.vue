<template>
  <div class="data-info">
    <span>
      {{ name }}
    </span>
    <span>
      {{ size }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'data-info'
})
export default class DataInfo extends Vue {
  @Prop({
    type: String
  }) name!: string;

  @Prop({
    type: Number
  }) size!: number;

  get formatSize() { //  todo
    return this.size / 1024;
  }
}

</script>
<style lang='less' scoped>
</style>
