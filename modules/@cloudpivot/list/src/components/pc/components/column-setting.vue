<template>
  <a-modal
    v-model="showModal"
    :maskClosable="false"
    :width="600"
    @cancel="closeModal"
  >
    <div slot="title">
      <span>{{ $t('cloudpivot.list.pc.SetDisplayItems') }}</span>
      <span class="tip">{{ $t('cloudpivot.list.pc.dragToSort') }}</span>
    </div>
    <div class="column-setting">
      <div class="select-all">
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkedAll"
          @change="onCheckAll"
        >
        </a-checkbox>
        <span>{{ $t('cloudpivot.list.pc.checkAll') }}</span>
      </div>
      <Draggable
        :list="cusColumns"
        :options="dragOptions"
      >
        <transition-group>
          <li
            v-for="(item, index) in cusColumns"
            :key="item.id"
            class="drag-item"
          >
            <span class="index">{{ index + 1 }}</span>
            <a-checkbox
              v-model="item.isShow"
              class="checkbox"
              @change="itemChange"
            ></a-checkbox>
            <span class="name" :title="isChinese ? item.vcTitle : item.name_i18n[$i18n.locale]">{{ isChinese ? item.vcTitle : item.name_i18n[$i18n.locale] }}</span>
            <i class="icon aufontAll  h-icon-all-drag"></i>
          </li>
        </transition-group>

      </Draggable>
    </div>
    <div slot="footer" class="model-footer">
      <a-button type="default" @click="closeModal">{{ $t('cloudpivot.list.pc.Cancel') }}</a-button>
      <!-- <a-button type="default" @click="recovery">{{ $t('cloudpivot.list.pc.recovery') }}</a-button> -->
      <a-button type="primary" @click="confirm">{{ $t('cloudpivot.list.pc.OK') }}</a-button>
    </div>
  </a-modal>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import {
  Modal, Checkbox, Icon, Button
} from 'h3-antd-vue';

import Draggable from 'vuedraggable';

@Component({
  name: "ColumnSetting",
  components: {
    AModal: Modal,
    AButton: Button,
    ACheckbox: Checkbox,
    Draggable
  }
})
export default class ColumnSetting extends Vue {
  @Prop() value !: boolean; 

  @Prop() columns !: Array<any>;

  cusColumns:any = [];

  showModal:boolean = false;

  indeterminate:boolean = false; // 非全选

  checkedAll:boolean = false; // 全选

  // 拖拽排序配置
  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 50
  };

  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  mounted () {
    document.body.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
  }

  closeModal(){
    this.$emit('input', false);
  }

  confirm(){
    this.$emit('confirm', this.cusColumns);
    this.closeModal();
  }

  recovery(){
    this.$emit('recovery');
    this.closeModal();
  }

  itemChange(){
    this.caculateStatus();
  }

  onCheckAll(v:any){
    const allItems:number = this.cusColumns.length;
    const checkedItems:number = this.cusColumns.filter((col:any) => col.isShow).length as number;
    if (checkedItems < allItems) {
      this.cusColumns.forEach((col:any) => { col.isShow = true });
    } else {
      this.cusColumns.forEach((col:any) => { col.isShow = false });
    }
    this.caculateStatus();
  }

  caculateStatus(){
    const allItems:number = this.cusColumns.length;
    const checkedItems:number = this.cusColumns.filter((col:any) => col.isShow).length as number;
    this.indeterminate = checkedItems === 0 ? false : allItems > checkedItems;
    this.checkedAll = allItems === checkedItems;
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showModal = v;
    if (v) {
      this.cusColumns = JSON.parse(JSON.stringify(this.columns));
      this.caculateStatus();
    } 
  }
}
</script>
<style lang="less">
  .column-setting {
    max-height: 340px;
    overflow: auto;
    .drag-item {
      display: inline-block;
      width: 33.3333%;
      padding: 5px;
      vertical-align: middle;
      background: white;
      transition: all ease .3s;
      border: 1px solid white;
      border-radius: 4px;
      white-space: nowrap;
      cursor: move;
      >span,>label {
        vertical-align: middle;
      }
      >span.name {
        padding-right: 0px;
        display: inline-block;
        max-width: 7em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .index {
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        // height: 22px;
        margin-right: 8px;
        text-align: center;
        font-size: 14px;
        color:rgba(0,0,0,0.45);
        // line-height:22px;
        overflow: hidden;
      }
      .icon {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        line-height: 21px;
        float: right;
        display: none;
      }
      &:hover {
        background: #F0F7FF;
        & .icon {
          display: block;
        }
      }
    }
    .ghostClass {
      opacity: 1;
      background-color:white;
      border: 1px dashed #2970FF;
      border-radius: 4px;
      * {
        opacity: 0;
      }
    }
    .dragClass {
      .index {
        display: none;
      }
    }
    .select-all {
      // margin-left: 5px;
      margin-left: 38px;
      margin-bottom: 5px;
    }
  }
  .model-footer {
    text-align: right;
  }
  .tip {
    margin-left: 8px;
    font-size:12px;
    color:rgba(0,0,0,0.45);
    line-height:22px;
  }
</style>
