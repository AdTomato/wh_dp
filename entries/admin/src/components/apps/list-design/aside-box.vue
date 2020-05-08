<template>
  <section class="aside-box">
    <section class="aside-box-title section-bar" @click="collapsible = !collapsible">
      <span class="bar-title title-3">{{ title }}</span>
      <Dialog
        v-if="fieldBlock !== 3"
        :propDataList="propDataList"
        :fieldBlock="fieldBlock"
        @addcomfirm="addcomfirm"
      >
      </Dialog>
      <i class="collaps icon aufontAll h-icon-all-right-o" :class="{ expanded : collapsible }"></i>
    </section>
    <!-- li列表 -->
    <transition name="list-fade">
      <SideBoxDraggerList
        v-show="collapsible"
        :propDataList="propDataList"
        :fieldBlock="fieldBlock"
        :canShowDatas="canShowDatas"
        @setTargetSortList="setTargetSortList"
      >
      </SideBoxDraggerList>
    </transition>
  </section>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import Draggable from 'vuedraggable';
import TableSetting from '@/components/apps/list-design/modals/popover/table-setting/table-index.vue';

import Dialog from './aside-addDialog.vue';
import SideBoxDraggerList from './aside-draggerList.vue';
// import Operation from './aside-operation.vue';

// import appsApi from '@/apis/apps';
import { getDataItems } from '@/apis/list';


const ListdesignModule = namespace('Apps/Listdesign');
// import ListDesignHeader from '@/components/apps/list-design/listDesign-header.vue';


@Component({
  name: 'SideBox',
  components: {
    Draggable,
    TableSetting,
    Dialog,
    SideBoxDraggerList
  }
})
export default class SideBox extends Vue {
  @ListdesignModule.State('payloadOptions') payloadOptions: any;

  @ListdesignModule.State('thefieldBlock') thefieldBlock: any;

  @ListdesignModule.Mutation('setPayloadOptions') mutationPayloadOptions: any;

  @ListdesignModule.Mutation('setFieldBlock') mutationFieldBlock: any;

  /* 展示字段 */
  @ListdesignModule.Mutation('setShowFieldArray') mutationShowFieldArray: any;


  @Prop() title !: string

  @Prop() fieldBlock !: number

  // @Prop() dialogData !: Array<any[]>
  @Prop() propDataList !: Array<any[]>

  wrapStyle = { left: '624px' }

  index:number = 0;
  // /* 服务器获取的原始数据 */
  // originDatas:any[] = [];

  poperList:any[] = [];
  /* 查询条件list */
  // queryCriteriaList:any[] = [];

  canShowDatas:any[] = [];

  popoverVisible:boolean = false;

  visible = false;

  fblock: number = -1;

  collapsible:boolean = true;

  /*
  * 新增选项兼容多语言版本
  */
  compatibleOldData(data:any) {
    const localeList:Array<string> = ['en']; // 语言列表
    localeList.forEach((local:string) => {
      if (!data.name_i18n) {
        data.name_i18n = {};
        data.name_i18n[local] = data.name || '';
      } else if (data.name_i18n[local] === '') {
        data.name_i18n[local] = data.name || '';
      }
    });
    return data;
  }

  setTargetSortList(data:any) {
    this.$emit('setTargetSortList', data);
  }


  // /* add弹窗-确定-改变canShowDatas数据 */
  addcomfirm(felBlock:any, data:any) {
    this.collapsible = true;
    data.forEach((d:any) => {
      if (d.data.name_i18n && typeof d.data.name_i18n === 'string') {
        d.data.name_i18n = JSON.parse(d.data.name_i18n);
      } else if (!d.data.name_i18n) {
        d.data = this.compatibleOldData(d.data);
      }
    });
    this.canShowDatas = [...data].filter((el:any) => el.checked === true);
  }

  mounted() {
    document.body.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
  }

  /**
   * 当前checked 为true 的数据
   * 查询条件-发生改变时更新store
   */
  @Watch('canShowDatas')
  linsteningCanShowDatas(v:any) {
    if (this.fieldBlock === 0) {
      // debugger;
      this.mutationPayloadOptions(v);
    } else if (this.fieldBlock === 1) {
      this.mutationShowFieldArray(v);
    } else if (this.fieldBlock === 2) {
      // this.mutationShowFieldArray(v);
    } else if (this.fieldBlock === 3) {
      // this.mutationShowFieldArray(v);
    }
  }

  created() {
    this.fblock = this.fieldBlock;
  }
}
</script>

<style lang="less" scoped>
.aside-box{
  padding-left: 8px;
  padding-right: 13px;
  .aside-box-title{
    cursor: pointer;
  }
  .collaps{
    margin-left: 10px;
    margin-right: 4px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 10px;
    float: right;
    transition: transform 0.24s;
    &.expanded{
      transform: rotate(90deg);
    }
  }
}
.icon-checked{
  color: @primary-color;
}
.ant-popover-inner-content {
  .bottom-bolck{
    .btn{
      float: right;
      margin-right: 12px;
    }
  }
  min-width: 360px;
  position: relative;
    a{
      color: rgba(0, 0, 0, 0.85);
    }
    a:hover{
      color: rgba(0, 0, 0, 0.85);
    }
  }
.design-wrapper{
  .each-title{
    font-size: 14px;
  }
  .smart-form{
    width:auto;
  }
}

</style>
<style lang="less" scoped>
  .ant-popover-inner-content {
    padding-bottom: 50px;
    max-height: 392px;
    overflow-y: auto;
  }
</style>
