<template>
  <div class="left-item">
    <p>位置尺寸</p>
    <div class="xywh-position">
      <a-input
        v-model.lazy="xywh.left"
        size="small"
        :title="xywh.left"
        addonAfter="X"
        :disabled="leftOrRight.includes('right') && itemAttrs.eleType.includes('column')"
        @blur="onChange(parseInt($event.target.value, 10), 'x', getThis)"
        @keyup.enter="onChange(parseInt($event.target.value, 10), 'x', getThis)"
      />
      <a-input
        v-model.lazy="xywh.top"
        size="small"
        :title="xywh.top"
        addonAfter="Y"
        @blur="onChange(parseInt($event.target.value, 10), 'y', getThis)"
        @keyup.enter="onChange(parseInt($event.target.value, 10), 'y', getThis)"
      />

      <a-input
        v-model.lazy="xywh.heightValue"
        size="small"
        :title="xywh.heightValue"
        addonAfter="高"
        :disabled="itemAttrs.eleType.includes('topDrawerLine') && itemAttrs.lineDirection.includes('x')"
        @input="input = true"
        @blur="onHeightChange"
        @keyup.enter="onHeightChange"
        class="height"
      />
      
      <span>
        <i class="icon aufont lock" :class="[ locked ? 'icon-base-lock' : 'icon-base-unlock' ]" 
          @click="onLockClick"
        />
      </span>

      <a-input
        v-model.lazy="xywh.widthValue"
        size="small"
        :title="xywh.widthValue"
        addonAfter="宽"
        :disabled="itemAttrs.eleType.includes('topDrawerLine') && itemAttrs.lineDirection.includes('y')"
        @input="input = true"
        @blur="onWidthChange"
        @keyup.enter="onWidthChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line
  import { Component, Vue,Watch } from 'vue-property-decorator';
  import { onChange } from '@/utils/print-util';
  // eslint-disable-next-line
  import { namespace } from 'vuex-class';
  const PrintVuex = namespace('Print/Print');
  @Component({
    name: 'xywh-attr',
  })
  export default class Xywh extends Vue {
    @PrintVuex.State('xywh') xywh!: any;
    @PrintVuex.State('leftOrRight') leftOrRight!: string;
    @PrintVuex.State('itemAttrs') itemAttrs!: any;
    @PrintVuex.Mutation('changeXYWH') changeXYWH!: any;
    onChange: any = onChange;

    locked = false;

    ratio : number | null = null;

    input = false;

    get getThis() {
      return this;
    }

    @Watch('realtimeRatio',{
      immediate: true
    })
    onXywhChange(){
      if(this.locked && this.ratio){
        if(this.input){
          this.input = false;
          return;
        }
        const ratio = this.getRatio();
        console.log(ratio,this.ratio);
        if(this.ratio !== ratio){
          this.locked = false;
          this.ratio = null;
        }
      }
    }

    get realtimeRatio(){
      return this.getRatio();
    }

    getRatio(){
      return Math.floor(this.xywh.heightValue / this.xywh.widthValue * 100) / 100;
    }

    onLockClick(){
      this.locked = !this.locked;
      if(this.locked){
        this.ratio = this.getRatio();
      }else{
        this.ratio = null;
      }
    }

    onWidthChange(event : any){
      // onChange(parseInt($event.target.value, 10), 'w', getThis)
      const w = parseInt(event.target.value, 10);
      if(this.locked && this.ratio){
        const h = w * this.ratio;
        this.onChange(h, 'h', this);
      }
      this.onChange(w, 'w', this);
    }

    onHeightChange(event:any){
      // onChange(parseInt($event.target.value, 10), 'h', getThis)
      this.input = true;
      const h = parseInt(event.target.value, 10);
      if(this.locked && this.ratio){
        const w = h / this.ratio;
        this.onChange(w, 'w', this);
      }
      this.onChange(h, 'h', this);
    }
    
  }
</script>


<style lang="less" scoped>
  .lock{
    font-size:@font-size-10;
    cursor: pointer;
  }
  .height,.lock{
    margin-right:@base4-padding-base !important;
  }
</style>