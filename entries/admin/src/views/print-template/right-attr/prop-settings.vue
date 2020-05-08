<template>
  <div class="left-attr">
    <template v-for="g in groups">
      <div class="left-item" 
        v-if="propsGroup[g.key]"
        :key="g.key"
      >
        <p>{{ g.title }}</p>

        <div class="select-input">
          <template v-for="p in propsGroup[g.key]">

            <color-dropdown
              v-if="isColor(p.type)"
              :key="p.key"
              :value="p.value"
              :icon="getColorIcon(g.key)"
              @change="e => setPropValue(p, e)"
            ></color-dropdown>
            
            <line-size-dropdown
              v-else-if="isLineSize(p.type)"
              :key="p.key"
              :value="p.value"
              @change="e => setPropValue(p, e)"
            ></line-size-dropdown>
            
            <line-style-dropdown
                v-else-if="isLineStyle(p.type)"
                :key="p.key"
                :value="p.value"
                @change="e => setPropValue(p, e)"
            ></line-style-dropdown>

            <size-dropdown 
                v-else-if="isFontSize(p.type)"
                :key="p.key"
                :value="p.value"
                @change="e => setPropValue(p, e)"
            ></size-dropdown>
            
            <font-style-group
                v-else-if="isFontStyle(p.type)"
                :key="p.key"
                :bold="p.value.bold"
                :italic="p.value.italic"
                :underline="p.value.underline"
                @change="e => setPropValue(p, e.value, e.key)"
            ></font-style-group>
            
            <text-align-group
                v-else-if="isTextAlign(p.type)"
                :key="p.key"
                :horizontal="p.value.horizontal"
                :vertical="p.value.vertical"
                @change="e => setPropValue(p, e.value, e.key)"
            ></text-align-group>

          </template>
        </div>
      </div>
    </template>
  </div>
</template>


<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import { schema } from "@cloudpivot/form";

import ColorDropdown from "./color-dropdown.vue";
import LineSizeDropdown from "./line-size-dropdown.vue";
import LineStyleDropdown from "./line-style-dropdown.vue";
import SizeDropdown from "./size-dropdown.vue";
import FontStyleGroup from "./font-style-group.vue";
import TextAlignGroup from "./text-align-group.vue";

@Component({
  name: "prop-settings",
  components: {
    ColorDropdown,
    LineStyleDropdown,
    LineSizeDropdown,
    SizeDropdown,
    FontStyleGroup,
    TextAlignGroup
  }
})
export default class PropSettings extends Vue {
  @Prop({
    default: () => []
  })
  props!: schema.ControlProperty[];

  groups = [
    {
      key: "fillColor",
      title: "填充色"
    },
    {
      key: "border",
      title: "边框"
    },
    {
      key: "font",
      title: "字体"
    },
    {
      key: "align",
      title: "对齐"
    }
  ];

  propsGroup: any = {};

  @Watch("props", {
    immediate: true
  })
  onPropsChange() {
    if (this.props.length === 0) {
      this.propsGroup = {};
    } else {
      const group: any = {};
      this.props
        .filter(p => !!p.tags)
        .forEach(p => {
          if (p.tags) {
            p.tags.forEach(tag => {
              if (group[tag]) {
                group[tag].push(p);
              } else {
                group[tag] = [p];
              }
            });
          }
        });

        this.propsGroup = group;
    }
  }

  getColorIcon(tag : string){
      if(tag === 'fillColor' || !tag){
          return '';
      }

      if(tag === 'border'){
          return 'h-icon-all-text-a';
      }

      if(tag === 'font'){
          return 'h-icon-all-text-a';
      }
  }

  isColor(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.Color;
  }
  
  isFontSize(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.FontSize;
  }
  
  isFontStyle(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.FontStyle;
  }
  
  isLineSize(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.LineSize;
  }
  
  isLineStyle(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.LineStyle;
  }
  
  isBorder(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.Border;
  }

  isTextAlign(type : schema.ControlPropertyType){
      return type === schema.ControlPropertyType.TextAlign;
  }

  setPropValue(p : schema.ControlProperty,value:any,key?:string){
    if(key){
      p.value[key] = value;
    }else{
      p.value = value;
    }
    this.$emit('propChange', p);
  }

  // setFontStyle(e : {
  //   key: string,
  //   value:boolean
  // },p : schema.ControlProperty){
  //   p.value[e.key] = e.value;
  //   this.$emit('propChange', p);
  // }

  // setTextAlign(e:{
  //   key:string,
  //   value:string
  // },p : schema.ControlProperty){
  //   p.value[e.key] = e.value;
  //   this.$emit('propChange', p);
  // }

}
</script>


<style lang="less" scoped>
</style>