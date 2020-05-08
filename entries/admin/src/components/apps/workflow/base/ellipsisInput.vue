<template>
  <p class="toggle-bar" @click="$emit('click')">
    <span>{{ value }}</span>
    <i class="icon aufontAll h-icon-all-ellipsis-o"/>
  </p>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

@Component({
  name: 'EllipsisInput'
  })
export default class EllipsisInput extends Vue {
  @Prop() value !: any;
}
</script>
<style lang="less" scoped>
.toggle-bar {
  display: flex;
  padding: 0 8px;
  margin: 0;
  width: 100%;
  cursor: pointer;
  span {
    flex: 1;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  i {
    flex: none;
    color: #BFBFBF;
    font-size: 14px;
  }
}
</style>
