<template>
  <div class="workflow-item-wrap">
    <div class="workflow-item-head" v-if="type==='favorite'">
      <div class="mark"></div>
      <span class="workflow-item-head-title">{{ $t('cloudpivot.flowCenter.pc.commonFlow') }}</span>
      <span class="workflow-item-head-num">{{ $t('cloudpivot.flowCenter.pc.setSevenFlows') }}</span>
    </div>
    <div class="workflow-item-head" v-else>
      <div class="mark"></div>
      <span 
        v-if="$i18n.locale === 'zh'" 
        class="workflow-item-head-title" 
        v-html="item.appName"
      ></span>
      <span 
        v-else 
        class="workflow-item-head-title" 
        v-html="item.name_i18n[$i18n.locale]"
      ></span>
      <span class="workflow-item-head-num" v-show="item.size">{{ `${item.size} ${$t('cloudpivot.flowCenter.pc.flowItems')}` }}</span>
      <span
        class="drop-down"
        v-show="showDropListButton&&!showDropList"
        @click="switchList"
      >
        {{ $t('cloudpivot.flowCenter.pc.more') }}<i class="icon aufontAll h-icon-all-down-o"></i>
      </span>
      <span
        class="drop-down"
        v-show="showDropListButton&&showDropList"
        @click="switchList"
      >
        {{ $t('cloudpivot.flowCenter.pc.collapse') }}<i class="icon aufontAll h-icon-all-up-o"></i>
      </span>
    </div>
    <div class="workflow-item-content" :class="{'drop-hide':!showDropList&&type!=='favorite'}">
      <template v-for="(data,index) in dataArray">
        <workflow
          :key="index"
          :data="data"
          :appCode="item.appCode"
          v-if="data.type === 'BizModel'"
        />
        <workflow-group
          :key="index"
          :data="data"
          :appCode="item.appCode"
          :curNum="curNum"
          v-else
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import Workflow from './base/workflow.vue';
import WorkflowGroup from './base/workflow-group.vue';

@Component({
  name: 'workflow-item',
  components: {
    Workflow,
    WorkflowGroup
  }
})
export default class WorkflowItem extends Vue {
  @Prop() item!:any;

  @Prop() type!:string;

  @Prop() curNum!:number;

  dataArray:any = []; // 数据数组

  showDropListButton:boolean = false; // 是否展示下拉按钮

  showDropList:boolean = false; // 是否展示下拉内容

  beforeMount() {
    if (this.item) {
      if (this.type === 'favorite') {
        this.dataArray = this.clearDuplicate(this.item);
      } else {
        this.showDrop(this.curNum);
        this.dataArray = this.clearDuplicate(this.item.dataList);
      }
    }
  }

  /**
   * 清理重复的流程条目
   */
  clearDuplicate(arr: Array<any>) {
    const list: Array<any> = [];
    arr.forEach((item: any) => {
      if (item.type === 'BizModel') {
        if (!list.some((li:any) => li.id === item.id)) {
          list.push(item);
        }
      } else {
        list.push(item);
      }
    });
    return list;
  }

  /*
  * 应用是否展示下拉按钮
  */
  showDrop(v:number) {
    if (v && this.type === 'workflow' && this.item.dataList) {
      if (this.item.dataList.length > v) {
        this.showDropListButton = true;
      } else {
        this.showDropListButton = false;
      }
    }
  }

  /*
  * 展示收缩列表
  */
  switchList() {
    this.showDropList = !this.showDropList;
  }

  @Watch('item', { deep: true })
  onItemDataChange(v:any) {
    if (v) {
      if (this.type === 'favorite') {
        this.dataArray = v;
      } else {
        this.dataArray = v.dataList;
        this.showDrop(this.curNum);
      }
    }
  }

  @Watch('curNum')
  onCurNumChange(v:number) {
    this.showDrop(v);
  }
}
</script>

<style lang="less">
.workflow-item-wrap{
  .workflow-item-head{
    margin-left: 6px;
    margin-bottom: @base4-padding-xs;
    .mark{
      width: 4px;
      height: 14px;
      float: left;
      margin-top: @base4-padding-base;
      margin-right: @base4-padding-xs;
      background: @primary-color;
      border-radius: @border-radius-base;
    }
    .workflow-item-head-title{
      font-size: @font-size-14;
      color: @light-color-2;
      margin-right: @base4-padding-xs;
    }
    .workflow-item-head-num{
      font-size: @font-size-12;
      color: @light-color-3;
    }
    .drop-down{
      font-size: 12px;
      color: @light-color-3;
      float: right;
      margin-right: @base4-padding-md;
      cursor: pointer;
      i{
        font-size: 12px;
        margin-left: 3px;
      }
    }
  }
  .workflow-item-content{
    overflow: hidden;
  }
  .drop-hide{
    max-height: 88px;
  }
}
</style>
