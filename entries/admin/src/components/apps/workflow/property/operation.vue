<template>
  <div class="operation">
    <!-- 基本操作 -->
    <property-widget
      label="基本操作"
    >
      <template>
        <div slot="right" class="check-wrap">
          <div
            v-for="(i,index) in baseOperation"
            :key="index"
            class="check-item"
          >
            <a-checkbox
              v-model="i.selected"
              class="checkbox"
              @change="onSelectChange"
            ></a-checkbox>
            <span>{{ i.text }}</span>
          </div>
        </div>
      </template>
    </property-widget>
    <!-- 驳回操作 -->
    <property-widget
      label="驳回操作"
    >
      <template>
        <div slot="right" class="check-wrap">
          <div
            v-for="(item,index) in permittedOperation"
            :key="index"
            class="check-item"
          >
            <a-checkbox
              v-model="item.selected"
              class="checkbox"
              @change="onSelectChange"
            ></a-checkbox>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </template>
    </property-widget>
    <!-- 选择指定活动 -->
    <property-widget
      label="选择指定活动"
      v-show="isReject"
    >
      <template>
        <div slot="right" class="check-wrap">
          <a-select
            placeholder="请选择"
            mode="multiple"
            v-model="rejectToActivityCode"
            @change="rejectToActivityChange"
            class="input-select"
          >
            <a-select-option
              v-for="(select,index) in rejectList"
              :key="index"
              :value="select.activityCode"
            >{{ select.activityName }}</a-select-option>
          </a-select>
        </div>
      </template>
    </property-widget>
    <!-- 协办操作 -->
    <!--<property-widget-->
    <!--label="协办操作"-->
    <!--:tip="assistTip"-->
    <!--&gt;-->
    <!--<template>-->
    <!--<div slot="right" class="check-wrap">-->
    <!--<div-->
    <!--v-for="(a,index) in assistOperation"-->
    <!--:key="index"-->
    <!--class="check-item"-->
    <!--&gt;-->
    <!--<a-checkbox-->
    <!--v-model="a.selected"-->
    <!--class="checkbox"-->
    <!--@change="onSelectChange"-->
    <!--&gt;</a-checkbox>-->
    <!--<span>{{ a.text }}</span>-->
    <!--</div>-->
    <!--</div>-->
    <!--</template>-->
    <!--</property-widget>-->
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import Graph from '@/utils/rejectActivity/graph';
import AF from '@/utils/rejectActivity/af';
import PropertyWidget from '../base/propertyWidget.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'Operation',
  components: {
    PropertyWidget
  }
})

export default class Operation extends Vue {
  @WorkflowModule.State('activities') activities: any;

  @WorkflowModule.State('lines') lines: any;

  @WorkflowModule.State('currentActivity') currentActivity: any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  isReject:boolean = false;

  // 基本操作默认数据
  baseOperation:any = [{
    text: '转办',
    code: 'forward',
    selected: false
  }, {
    text: '撤回',
    code: 'retrieve',
    selected: false
  }, {
    text: '协办',
    code: 'assist',
    selected: false
  }, {
    text: '传阅',
    code: 'circulate',
    selected: false
  }, {
    text: '加签',
    code: 'adjustParticipant',
    selected: false
  }, {
    text: '结束流程',
    code: 'finishInstance',
    selected: false
  }];

  // 驳回操作默认数据
  permittedOperation:any = [{
    text: '驳回到开始',
    code: 'rejectToStart',
    selected: false
  }, {
    text: '驳回到上一步',
    code: 'reject',
    selected: false
  }, {
    text: '驳回到指定活动',
    code: 'rejectToFixded',
    selected: false
  }];

  // 协办操作默认数据
  // assistTip:string = `1.协办：允许用户在处理待办时请求他人协办，被协办的人会收到待办，拥有与处理人同样的编辑表单的权限
  // 2.传阅：允许用户收到待办后将表单信息传阅给其他人`;
  // assistOperation:any = [{
  //   text: '协办',
  //   code: 'assist',
  //   selected: false
  // }, {
  //   text: '传阅',
  //   code: 'circulate',
  //   selected: false
  // }];

  // assistTip:string = ``;
  // assistOperation:any = [];
  // 驳回到指定活动数据
  rejectList:any = [];

  // 驳回至指定活动code
  rejectToActivityCode:any = [];

  beforeMount() {
    this.dataMounted();
  }

  // 操作权限select改变
  onSelectChange() {
    const allArray = [...this.baseOperation, ...this.permittedOperation];
    if (Object.keys(this.curActivityProps.operation).length) {
      allArray.forEach((item: any) => {
        Object.keys(this.curActivityProps.operation).forEach((op: any) => {
          if (op === item.code) {
            this.curActivityProps.operation[op] = item.selected;
            if (op === 'rejectToFixded' && item.selected) {
              this.isReject = true;
              const start: number = 0; // 开始节点序号
              let end = -1;
              for (let i = 0, len = this.activities.length; i < len; i += 1) {
                if (this.activities[i].ID === this.currentActivity.ID) {
                  end = i;
                  break;
                }
              }
              // const end: number = this.activities.findIndex((activity:any) => {
              //   return activity.ID === this.currentActivity.ID;
              // }); // 当前节点序号
              if (end !== -1) {
                const graph: Graph = new Graph(this.activities, this.lines);
                const af = new AF(graph, start, end);
                const res = af.getResult();
                const rejectArr = res.filter((activityCode: string) => (activityCode !== this.currentActivity.activityCode));
                this.rejectList = this.activities.filter((a:any) => (rejectArr.includes(a.activityCode) && a.ID !== this.currentActivity.ID && a.activityType === 'PARTICIPANT'));
              }
              if (!this.curActivityProps.operation.rejectToActivityCode && this.rejectList.length) {
                this.setPropValue({ key: 'operation.rejectToActivityCode', value: this.rejectList[0].activityCode });
              }
              if (this.curActivityProps.operation.rejectToActivityCode) {
                this.rejectToActivityCode = this.curActivityProps.operation.rejectToActivityCode.split(',');
              }
            } else if (op === 'rejectToFixded' && !item.selected) {
              this.isReject = false;
            }
          }
        });
      });
    }
  }

  // 驳回至指定节点change
  rejectToActivityChange(v:any) {
    const str = v.join(',');
    this.setPropValue({ key: 'operation.rejectToActivityCode', value: str });
  }

  // 根据数据初始化视图
  dataMounted() {
    if (Object.keys(this.curActivityProps.operation).length) {
      const operationArray = Object.entries(this.curActivityProps.operation);
      operationArray.forEach((a: any) => {
        if (!a && !a[0] && !a[1]) {
          return;
        }
        const [key, value] = a;
        this.baseOperation.forEach((base: any) => {
          if (base.code === key) {
            base.selected = value;
          }
        });
        this.permittedOperation.forEach((base: any) => {
          if (base.code === key) {
            base.selected = value;
          }
        });
        // this.assistOperation.forEach((base: any) => {
        //   if (base.code === key) {
        //     base.selected = value;
        //   }
        // });
      });
      this.onSelectChange();
    }
  }

  @Watch('currentActivity')
  onActivityChange(v: string) {
    this.dataMounted();
  }
}
</script>

<style lang="less" scoped>
.operation{
  .check-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 8px;
    .check-item{
      width: 50%;
      font-size: 14px;
      margin: 5px 0px;
      line-height: 22px;
      .checkbox{
        font-size: 14px;
        margin-right: 6px;
      }
    }
    /deep/.input-select{
      width: 100%;
      border: none;
      /deep/.ant-select-selection{
        border: none;
        box-shadow: none;
      }
    }
  }
}
</style>
