<template>
  <div
    ref="group"
    class="workflow-group-wrap"
    @click="showGroup"
  >
    <div class="workflow-group-content">
      <div class="iconbg" :class="curIconBg">
        <i class="icon aufontAll" :class="curIcon"></i>
      </div>
      <h4>{{ $i18n.locale === 'zh' ? data.name : data.name_i18n[$i18n.locale] }}</h4>
      <p>{{ `${data.size} ${$t('cloudpivot.flowCenter.pc.flowItems')}` }}</p>
    </div>
    <pop-model
      :width="popWidth"
      :arrowLeft="popArrowLeft"
      :top="popTop"
      :left="popLeft"
      :right="popRight"
      :show="showWorkflowGroup"
      @visibleChange="visibleChange"
    >
      <template slot="content" v-for="(data,index) in workflowData">
        <workflow
          :key="index"
          :pop="true"
          :appCode="appCode"
          :data="data"
          @calcPopTop="calcPopTop"
        />
      </template>
    </pop-model>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Workflow from './workflow.vue';
import PopModel from './pop-model.vue';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import { workflowCenterApi, workflowCenter as workflowCenterParams, workflowApi }  from '@cloudpivot/api';

@Component({
  name: 'workflow-group',
  components: {
    Workflow,
    PopModel
  }
})
export default class WorkflowGroup extends Vue {
  @Prop() data!:any;

  @Prop() curNum!:number;

  @Prop() appCode!: string;

  showWorkflowGroup:boolean = false; // 是否显示浮窗

  popWidth:string = ''; // 浮窗宽度

  popTop:string = ''; // 浮窗纵向定位位置

  popLeft:string = ''; // 浮窗横向定位位置-左

  popRight:string = ''; // 浮窗横向定位位置-右

  popArrowLeft:string = ''; // 浮窗小箭头位置

  iconBgArray:Array<string> = ['icon-a', 'icon-b', 'icon-c', 'icon-d']; // 应用分组图标背景色

  iconArray:Array<string> = ['h-icon-all-package', 'h-icon-all-renamebox', 'h-icon-all-star-circle', 'h-icon-all-tag-heart', 'h-icon-all-ic_favorite', 'h-icon-all-ic_shopping_cart', 'h-icon-all-ic_shopping_basket', 'h-icon-all-ic_event_note', 'h-icon-all-account-box', 'h-icon-all-book', 'h-icon-all-description', 'h-icon-all-insert-chart', 'h-icon-all-folder', 'h-icon-all-restaurant-menu', 'h-icon-all-business-center']; // 应用分组图标(可随机从数组中取任意图标作为分组图标)

  curIconBg:string = 'icon-a'; // 应用分组当前背景色

  curIcon:string = 'h-icon-all-folder'; // 应用分组当前图标

  workflowData:any = [];

  curDom:any = {}; // 当前分组DOM对象

  beforeMount() {
    this.curIconBg = this.workflowIconRandom(this.iconBgArray);
    this.curIcon = this.workflowIconRandom(this.iconArray);
  }

  /*
  * 展示应用分组浮窗
  */
  showGroup() {
    this.getMyWorkflowFolderList();
  }

  /*
  * 重新计算应用分组浮窗位置
  */
  calcPopTop() {
    if (!this.curDom) {
      return;
    }
    this.popTop = `${this.curDom.offsetTop + 82}px`;
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
  * 请求目录下可发起的流程列表数据
  */
  async getMyWorkflowFolderList() {
    const params:workflowCenterParams.WorkflowFolderParams = {
      id: this.data.id
    };
    const res = await workflowCenterApi.getMyWorkflowFolderList(params);
    if (!res.errcode) {
      this.workflowData = this.clearDuplicate(res.data);
      this.data.size = this.workflowData.length; // 更新目录上的流程数字
      res.data.forEach((item:any) => {
        item = utils.compatible(item, 'name');
      })
      const workflowDom = document.getElementById('start-workflow');
      this.curDom = this.$refs.group as HTMLElement;
      if (!workflowDom || !this.curDom) {
        return;
      }

      if (this.curNum <= this.workflowData.length) {
        this.popWidth = `${workflowDom.clientWidth - 7}px`;
        this.popLeft = '0px';
        this.popArrowLeft = `${this.curDom.offsetLeft + 105}px`;
      } else {
        const width = this.workflowData.length * 222 + 20;
        const left = this.curDom.offsetLeft - 16;
        this.popWidth = `${width}px`;
        if (left + width > workflowDom.clientWidth) {
          this.popRight = '0px';
          this.popArrowLeft = `${left - (workflowDom.clientWidth - width) + 105}px`;
          this.popLeft = '';
        } else {
          this.popLeft = `${this.curDom.offsetLeft - 16}px`;
          this.popArrowLeft = '105px';
        }
      }
      this.popTop = `${this.curDom.offsetTop + 82}px`;
      this.showWorkflowGroup = true;
    }
  }

  /*
  * 应用分组浮窗显示状态改变事件
  */
  visibleChange(visible:boolean) {
    this.showWorkflowGroup = visible;
  }

  /*
  * 随机生成应用分组图标
  */
  workflowIconRandom(arr:Array<string>) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
</script>

<style lang="less" scoped>
.workflow-group-wrap{
  width: 210px;
  height: 72px;
  float: left;
  padding: 14px;
  margin: 0 6px @base4-padding-md 6px;
  border-radius: @border-radius-lg;
  background: @main-background;
  cursor: pointer;
  &:hover{
    border: 1px solid #B1BBC5;
  }
  .workflow-group-content{
    position: relative;
    .iconbg{
      width: 44px;
      height: 44px;
      text-align: center;
      border-radius: 50%;
      background: linear-gradient(180deg,#FAD961 0%,#FF955A 100%);
      i{
        line-height: 44px;
        font-size: @font-size-20;
        color: @white-background;
      }
    }
    div.icon-a{
      background: linear-gradient(180deg,#FAD961 0%,#FF955A 100%);
    }
    div.icon-b{
      background:linear-gradient(180deg,#FF8D5C 0%,#FE2493 100%);
    }
    div.icon-c{
      background:linear-gradient(180deg,#08AEEA 0%,#2AF598 100%);
    }
    div.icon-d{
      background:linear-gradient(180deg,#00C6FB 0%,#005BEA 100%);
    }
    h4{
      font-size: @font-size-14;
      position: absolute;
      left: 52px;
      top: 0;
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p{
      font-size: @font-size-12;
      position: absolute;
      left: 52px;
      top: 24px;
    }
  }
}
</style>
