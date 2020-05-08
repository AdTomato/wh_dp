<template>
  <div class="attr-rows">
    <div
      class="attr-row"
      v-for="(attr, i) in controlAttribute"
      :key="i"
      v-show="attr.display !== false"
    >
      <label class="attr-lab">
        <a-tooltip>
          <span slot="title" v-html="attr.label"></span>
          <span v-html="attr.label"></span>
        </a-tooltip>
        <a-tooltip v-if="attr.tip">
          <span slot="title" v-html="attr.tip.content"></span>
          <a-icon :type="attr.tip.icon"/>
        </a-tooltip>
      </label>
      <div class="attr-val">
        <FormAttributeValue
          :dataItem="attr.dataItem"
          :label="attr.label"
          :dom="attr.dom"
          :value="attr.value"
          :field="attr.field"
          :type="attr.type"
          :attrType="attr.attrType"
          :attributes="controlAttribute"
          :options="attr.options"
          @change="change"
          @callback="callback"
        ></FormAttributeValue>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';
import FormAttributeValue from './form-attribute-value.vue';
@Component({
  name: 'form-control-attribute',
  components: { FormAttributeValue }
})
export default class FormControlAttribute extends Vue {
  @Prop() attrKey !: string;// 控件ID
  @Prop() controlAttribute!: any;// 控件的属性集合

  @Inject()
  updateAttribute?:Function;
  @Inject()
  attrCallback?:Function;

  /**
   * 属性修改的回调
   * @param field
   * @param value
   */
  change(field: string, value:any) {
    
    // 表单属性中 控制布局与边框模式互斥设置
    if(field === 'layoutType') {
      localStorage.setItem('layoutType',value);
      this.controlAttribute.forEach(c => {
        if(c.field === 'borderMode'){
          if(value === 'vertical'){
            this.$set(c.options, 'selectorDisabled', true)
          }else{
            this.$set(c.options, 'selectorDisabled', false)
          }
          
        }
      })
    }else if(field === 'borderMode'){
      this.controlAttribute.forEach(c => {
        if(c.field === 'layoutType'){
          if(value === 'open'){
            this.$set(c.options, 'selectorDisabled', true)
          }else{
            this.$set(c.options, 'selectorDisabled', false)
          }
          
        }
      })
    }

    if (this.updateAttribute) {
      this.updateAttribute(this.attrKey, field, value);
    }
  }
  /**
   * 属性修改的回调
   * @param field
   * @param fun
   */
  callback(field: string, fun:Function) {
    if (this.attrCallback) {
      this.attrCallback(this.attrKey, field, fun);
    }
  }

  @Watch("controlAttribute")
  watchControlAttribute() {
    this.initDataType()
  }

  initDataType() {
    //初始化表单属性中 控制布局与边框模式
    this.controlAttribute.forEach(c => {
      if(c.field === 'layoutType' && c.value === 'vertical'){
        this.controlAttribute.forEach(f => {
          if(f.field === 'borderMode'){
            this.$set(f.options, 'selectorDisabled', true)
          }
        })
      }
      if(c.field === 'borderMode' && c.value === 'open'){
        this.controlAttribute.forEach(f => {
          if(f.field === 'layoutType'){
            this.$set(f.options, 'selectorDisabled', true)
          }
        })
      }
    })
  }
}
</script>

<style scoped>
</style>
