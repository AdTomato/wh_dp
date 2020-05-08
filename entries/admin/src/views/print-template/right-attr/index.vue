<template>
  <div class="right-attr">
    <a-tabs :activeKey="activeLeft" @change="changeKey">
      <a-tab-pane tab="控件属性" key="1">

        <prop-settings v-if="props && props.length > 0" :props="props"
          @propChange="onPropChange"  
        ></prop-settings>
        
        <sheet-settings v-else-if="itemAttrs.eleType === 'sheet' || itemAttrs.parentId"></sheet-settings>

        <template v-else-if="itemAttrs.eleType">

          <columnAttribute v-if="Object.keys(itemAttrs).length && itemAttrs.eleType.includes('column')"/>
          <textAttribute v-if="Object.keys(itemAttrs).length && itemAttrs.eleType.includes('text')"/>
          <picAttribute v-if="Object.keys(itemAttrs).length && itemAttrs.eleType.includes('Pic')"/>
          <RectLine v-if="Object.keys(itemAttrs).length && itemAttrs.eleType.includes('Drawer')"/>
          
        </template>
        
        <div v-else class="no-data">
          <img src="~@/assets/images/click.png" />
          <p>请在左侧画布选中控件</p>
        </div>

      </a-tab-pane>
      <a-tab-pane tab="表单属性" key="2">
        <RightForm/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import columnAttribute from './column-attribute.vue';
import textAttribute from './text-attribute.vue';
import picAttribute from './pic-attribute.vue';
import RightForm from './fo-attribute.vue';
import RectLine from './rect-line.vue';
// eslint-disable-next-line
import { namespace } from 'vuex-class';

import { schema } from '@cloudpivot/form';


const PrintVuex = namespace('Print/Print');

@Component({
  name: 'right-attr',
  components: {
    columnAttribute,
    textAttribute,
    picAttribute,
    RightForm,
    RectLine,
    SheetSettings : () => import('./sheet-settings.vue'),
    PropSettings : () => import('./prop-settings.vue'),
  }
})
export default class RightAttr extends Vue {
  @PrintVuex.State('activeLeft') activeLeft!:string;

  @PrintVuex.State('itemAttrs') itemAttrs!:object;

  @PrintVuex.Mutation('changeKey') changeKey!: any;

  @Prop({
    default : () => []
  })
  selecteds!: any[];

  props : schema.ControlProperty[] = [];

  @Watch('selecteds',{
    immediate: true
  })
  onSelectedsChange(){
    
    this.props = [];

    if(!this.selecteds || this.selecteds.length === 0){
      return;
    }

    const obj : any = {};
    this.selecteds.forEach((node:any) => obj[node.eleType] = 1);
    const types : string[] = ['column','text','topDrawerLine','topDrawerRect'];
    if(Object.keys(obj).some(k => types.indexOf(k) === -1)){
      return;
    }

    const includes : boolean[] = types.map(t => obj[t]);
    
    if(includes.every(x => !x)){
      return;
    }

    if(includes[2]){
      this.setBorderProps(false);
    }else if(includes[3]){
      this.setBorderProps(false);
      this.setFillColorProps();
    }else{
      this.setFillColorProps();
      this.setBorderProps(true);
      this.setFontProps();
      this.setAlignProps();
    }

  }
  
  setFillColorProps(){
    const tags = ['fillColor'];

    this.props.push({
      key : 'fillColor',
      value: '',
      type: schema.ControlPropertyType.Color,
      tags
    });
  }

  setBorderProps(hasType : boolean){
    const tags = ['border'];

    this.props.push({
      value: '',
      key: 'borderWidth',
      type : schema.ControlPropertyType.LineSize,
      tags,
    });

    if(hasType){
      this.props.push({
        value: '',
        key: 'borderType',
        type : schema.ControlPropertyType.LineStyle,
        tags,
      });
    }
    
    this.props.push({
      value: '',
      key: 'borderColor',
      type : schema.ControlPropertyType.Color,
      tags,
    });
  }
  
  setFontProps(){
    const tags = ['font'];

    this.props.push({
      value: '',
      key: 'fontSize',
      type : schema.ControlPropertyType.FontSize,
      tags,
    });
    
    this.props.push({
      value: '',
      key: 'fontColor',
      type : schema.ControlPropertyType.Color,
      tags,
    });

    this.props.push({
      value: {},
      key: 'fontStyle',
      type : schema.ControlPropertyType.FontStyle,
      tags,
    });
  }

  setAlignProps(){
    const tags = ['align'];

    this.props.push({
      value: {},
      key: 'textAlign',
      type : schema.ControlPropertyType.TextAlign,
      tags,
    });
  }

  
  onPropChange(p : schema.ControlProperty){
    const idx = this.props.findIndex(x => x.key === p.key);
    
    if(idx === -1){
      return;
    }

    this.props.splice(idx,1,p);

    if(p.type === schema.ControlPropertyType.TextAlign){
      this.setTextAlign(p);
      
    }else if(p.type === schema.ControlPropertyType.FontStyle){
      this.setFontStyle(p);
    // }else if(p.type === schema.ControlPropertyType.FontSize){
    //   this.setPropValue(p,'fontSizeValue');

    }else if(p.type === schema.ControlPropertyType.Color
     || p.type === schema.ControlPropertyType.FontSize){
      this.setPropValue(p, p.key + 'Value');

    }else if(p.type === schema.ControlPropertyType.LineStyle){

      const items = this.selecteds.filter(x => x.eleType.indexOf('Drawer') === -1);
      this.setItemsValue(items,p.key + 'Value',p.value);

    }else if(p.type === schema.ControlPropertyType.LineSize){

      let items = this.selecteds.filter(x => x.eleType !== 'topDrawerLine');
      this.setItemsValue(items,p.key + 'Value',p.value);
      
      items = this.selecteds.filter(x => x.eleType === 'topDrawerLine');
      this.setItemsValue(items.filter(x => x.lineDirection === 'x'),'heightValue',p.value);
      this.setItemsValue(items.filter(x => x.lineDirection === 'y'),'widthValue',p.value);
    }

  }

  setTextAlign(p : schema.ControlProperty){
    for(const item of this.selecteds){
      const isColumn = item.eleType === 'column';

      const align = p.value;

      if(align.vertical){
        if(isColumn){
          item.leftKey.fontTCBNeat = align.vertical;
          item.rightValue.fontTCBNeat = align.vertical;
        }else{
          item.fontTCBNeat = align.vertical;
        }
      }

      if(align.horizontal){
        if(isColumn){
          item.leftKey.fontLCRNeat = align.horizontal;
          item.rightValue.fontLCRNeat = align.horizontal;
        }else{
          item.fontLCRNeat = align.horizontal;
        }
      }
    }
  }

  setFontStyle(p : schema.ControlProperty){
    for(const item of this.selecteds){
      const isColumn = item.eleType === 'column';

      const style = p.value;

      if(typeof style.bold === 'boolean'){
        if(isColumn){
          item.leftKey.fontIsWeight = style.bold;
          item.rightValue.fontIsWeight = style.bold;
        }else{
          item.fontIsWeight = style.bold;
        }
      }

      if(typeof style.italic === 'boolean'){
        if(isColumn){
          item.leftKey.fontIsItalic = style.italic;
          item.rightValue.fontIsItalic = style.italic;
        }else{
          item.fontIsItalic = style.italic;
        }
      }
      
      if(typeof style.underline === 'boolean'){
        if(isColumn){
          item.leftKey.fontIsUnderline = style.underline;
          item.rightValue.fontIsUnderline = style.underline;
        }else{
          item.fontIsUnderline = style.underline;
        }
      }
    }
  }
  
  setPropValue(p : schema.ControlProperty,key:string){
    this.setItemsValue(this.selecteds, key, p.value);
  }

  setItemsValue(items : any[],key:string,value:any){
    for(const item of items){
      const isColumn = item.eleType === 'column';

      if(isColumn){
          item.leftKey[key] = value;
          item.rightValue[key] = value;
        }else{
          item[key] = value;
        }
    }
  }

}
</script>

<style lang="less">
  .left-attr {
    text-align: left;
    margin: 0 10px;

    .left-item {
      margin-top: @base4-padding-md;
      padding-bottom: @base4-padding-md;
      border-bottom: 1px solid #E8E8E8;
      p {
        font-size: 14px;
        font-weight: bold;
        color: rgba(0,0,0,0.85);
        margin-bottom: @base10-padding-sm;
      }
      .left-radio-group {
        margin: 5px 0 10px 0px;
        label:nth-child(1) {
          margin-right: 20px;
        }
      }
      .input-text, .input-select, .xywh-position, .select-input, .color-select, .font-setting, .font-neat {
        // margin: 0px 10px 0 0px;

        .ant-select {
          width: 100%;
          color: rgba(0,0,0,0.85);
        }

        & > .ant-btn-group{
          vertical-align: top;

          & > button:first-child{
            // width: 46px;
          }

        }

      }
      .xywh-position {
        display: flex;
        .ant-input-group-wrapper {
          margin-right: 10px;
        }
        .ant-input-group-wrapper:last-child {
          margin-right: 0;
        }
      }
      .select-input {

        & > *{
          margin-right: 10px;
        }

        .ant-dropdown-trigger {
          margin-right: 10px;
        }
        .line-color {
          margin-right: 10px;
        }
      }
      .color-select {
        // width: 70px;
        display:inline-block;
      }
      .font-setting {
        & > .ant-btn {
          margin-right: 10px;
        }

        .font-select {
          width: 50px;
          height: 27px;
        }
        .ant-btn-group {
          vertical-align: top;
          button {
            width: 35px;
          }
          .i {
            font-style: italic;
          }
        }
        .fonts-color {
          margin: 0 10px;
        }
      }
      .font-neat {
        .ant-btn-group {
          vertical-align: top;
          margin-right: 10px;
          button {
            width: 35px;
          }
        }
      }
    }
    .left-item:nth-child(1) {
      margin-top: 0;
      // height: 105px;
    }
    .left-item:last-child {
      border-bottom: none;
    }
  }
  // .box-side {
  //   width: 79px;
  //   height: 79px;
  //   display: flex;
  //   flex-flow: column;
  //   justify-content: space-between;
  //   .top-div, .right-div, .bottom-div, .left-div {
  //     position: relative;
  //     background: rgba(118, 156, 249, 1);
  //     &:hover {
  //       cursor: pointer;
  //     }
  //   }
  //   .left-div, .right-div {
  //     width: 11px;
  //     height: 50px;
  //   }
  //   .top-div, .bottom-div {
  //     height: 11px;
  //     width: 50px;
  //     margin: 0 auto;
  //   }
  //   .left-div {
  //     left: -6px;
  //   }
  //   .right-div {
  //     right: -6px;
  //   }
  //   .top-div {
  //     top: -6px;
  //   }
  //   .bottom-div {
  //     bottom: -6px;
  //   }
  // }
  // .boxSideClass {
  //   border: 1px solid #ccc;
  // }
  .is-border {
    color: @primary-color;
  }
  .right-attr{
    min-width: 360px;
    .ant-tabs-nav-scroll {
      height: 45px;
    }
    .no-data {
      text-align: center;
      color: @light-color-3;
      margin-top: 250px;

      & > p{
        margin-top: @base4-padding-md; 
      }

    }
  }
  .ant-input-group-wrapper {
    margin-right: 10px;
    input {
      width: 50px;
    }
    .ant-input-group-addon {
      font-size: 12px;
      padding: 0 5px;
      color: @light-color-3;
    }
  }

.dropdown-botton{
  padding:0;

  .icon-left{
      width: 46px;
      text-align:center;
      display: inline-block;
      height: 100%;
      font-size: 12px;
      color: @light-color-1;
      border-radius: 4px 0 0 4px;

      i.icon{
        font-size: 12px;
        color: @light-color-1;
      }
  }

  .icon-right{
      height: 100%;
      display: inline-block;
      font-size: 12px;
      border-left: 1px solid #d9d9d9;
      vertical-align: top;
      width: 24px;
      padding-top:2px;
      
      i{
        font-size: 12px;
        transform: none;
      }
  }

}

.ant-tabs-bar{
  margin-bottom: @base4-padding-md;
}
</style>
