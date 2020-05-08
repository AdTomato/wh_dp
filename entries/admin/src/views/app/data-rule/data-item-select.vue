

<template>
  <div class="data-item-selected">
    <a-select
      style="width: 240px"
      v-model="value"
      :disabled="disabled"
      @change="change"
      placeholder="请选择"
      :class="!value ? 'show-placeholder':''"
      :getPopupContainer="getPopupContainer"
    >
      <a-select-opt-group label="业务数据项">
        <a-select-option
          v-for="(item, index) in list"
          :value="item.code"
          :key="index"
          :propertyType="item.propertyType"
          :relativeCode="item.relativeCode"
          :index="item.code"
          modelType="target"
          dataType="filter"
          v-if="!item.defaultProperty&&dataItemIsShow(item, false)"
        >{{ item.name }}[{{ item.code }}]</a-select-option>
      </a-select-opt-group>
      <a-select-opt-group label="系统数据项" v-if="!fliterSystem">
        <a-select-option
          v-for="(item, index) in list"
          :value="item.code"
          :key="index"
          :propertyType="item.propertyType"
          :relativeCode="item.relativeCode"
          :index="item.code"
          modelType="target"
          dataType="filter"
          v-if="item.defaultProperty&&dataItemIsShow(item, true)"
        >{{ item.name }}[{{ item.code }}]</a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Model} from "vue-property-decorator";

@Component({
  name: "data-item-selected",
  components: {}
})
export default class DataItemSelect extends Vue {
  @Prop({
    default : []
  })
  list!: any;

  @Prop({
    default : false
  })
  disabled!: boolean;

  @Prop({
    default : {}
  })
  systemFilterCtl!: any;

  @Prop({
    default : {}
  })
  bizFilterCtl!: any;

  @Prop({
    default : false
  })
  fliterSystem!: boolean

  @Prop()
  getPopupContainer!:Function

  @Model('change')
  val!: string;

  sysTemCtl:any = {
    publish: true,
    type: [],
    code: []
  }

  bizCtl:any = {
    publish: true,
    type: [],
    code: []
  }

  value = '';

  filter = {};

  change(val:any, vNode:any) {
    this.$emit('change', val, vNode);
  }

  dataItemIsShow(item:any,isSystem:boolean) {

    const filterObj = isSystem ? this.sysTemCtl : this.bizCtl;

    const filterType = filterObj.type;

    const filterCode = filterObj.code;

    return !filterType.includes(item.propertyType) && !filterCode.includes(item.code);
  }

  @Watch('val',{
    immediate: true
  })
  onValChange(val:any) {
    this.value = val;
  }

  @Watch('systemFilterCtl',{
    immediate: true
  })
  onSystemFilterCtlChange(val:any) {
    this.sysTemCtl = Object.assign(this.sysTemCtl, val);
  }

  @Watch('bizFilterCtl',{
    immediate: true
  })
  onBizFilterCtlChange(val:any) {
    this.bizCtl = Object.assign(this.bizCtl, val);
  }

}
</script>


<style lang="less" scoped>

</style>
