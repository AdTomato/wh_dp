<style lang="less">
#moda-container {
  position:fixed; top:0; left:0; width:100%; height:100%;
  pointer-events:none;
}
</style>
<template>
  <div id="modal-container">
    <div
      :is="c"
      v-for="(c,i) in queue"
      :key="`modal-${i}`"
      :style="{'z-index':i, 'pointer-events':c.visible?'all':'none'}"
    >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from 'vue-property-decorator';


@Component({
  name: 'modal-constructor',
})
export default class ModalConstructor extends Vue {

  queue = []

  load(path) {
    return import (path)
  }

  async open(path, options={}) {

    let item, itemIdx;
    let key = this.generateKey();


    if ( this.queue.some((item,i)=>item.path===path?(itemIdx=i,true):false) ) {
      item = this.queue[itemIdx];
      item.key = key;
      item.visible = true;
      this.queue.splice(itemIdx,1,item);
    }

    else {
      item = {
        comp: await this.load(path),
        visible:true,
        key,
        path,
        options,
      };

      this.queue.push( item );
    }

    return item;
  }

  close(key) {
    let item, itemIdx;
    if ( this.queue.some((item,i)=>item.key===key?(itemIdx=i,true):false) ) {
      item = this.queue[itemIdx];
      item.visible = true;
      this.queue.splice(itemIdx,1,item);
    }
    if ( !key ) {
      throw `component:${key} not found!`
    }
  }

  generateKey() {
    let ts = String(Date.now());
    let k  = ts;
    let c  = 0;
    while ( !!this.queue.find(item=>item.key===k) ) {
      k = `${ts}_${++c}`;
    }
    return k;
  }

}
</script>
