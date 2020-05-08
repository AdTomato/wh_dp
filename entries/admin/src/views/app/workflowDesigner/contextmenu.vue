<template>
  <div class="contentmenu">
    <ul>
      <li
        v-if="nodetype === 'Activity'|| nodetype === 'mutilSelected'"
        class="contentmenu-item"
        @click="copy"
      >复制</li>
      <li
        v-if="nodetype === 'Workflow'"
        class="contentmenu-item"
        @click="paste"
      >粘贴</li>
      <li
        v-if="nodetype === 'Activity' || nodetype === 'Line'"
        class="contentmenu-item"
        @click="remove"
      >删除</li>
      <li
        v-if="nodetype === 'mutilSelected'"
        class="contentmenu-item"
        @click="removeAll"
      >全部删除</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: "contentmenu"
  })

export default class contextmenu extends Vue {
@Prop()
nodetype!: any;

copy() {
  this.$emit('copy');
}

paste() {
  this.$emit('paste');
}

remove() {
  this.$emit('remove');
}

removeAll() {
  this.$emit('removeAll');
}

@Watch('nodetype')
onNodetypeChange(val:string|undefined) {
  console.log(val);
  this.nodetype = val;
}
}
</script>


<style lang="less">
.contentmenu {
  width: 117px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 50px;
  left: 50px;
  z-index: 999;
  border-radius: 4px;
  .contentmenu-item {
    width: 117px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    &:hover {
      background: rgba(242, 252, 227, 1);
    }
  }
}
</style>

