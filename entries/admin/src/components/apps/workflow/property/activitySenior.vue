<template>
  <div class="data-item">
    <!-- 限时时间、超时预警 -->
    <template v-for="(item,key) in timeData">
      <property-widget
        :key="key"
        :label="item.label"
        :tip="item.tip"
      >
        <ellipsis-input
          slot="right"
          :value="item.value"
          @click="showModal = true"
        />
      </property-widget>
    </template>
    <!-- 超时后策略 -->
    <property-widget
      label="超时后策略"
    >
      <template>
        <div slot="right" class="over-time-policy">
          <a-select
            placeholder="请选择"
            v-model="timeoutStrategy"
            class="input-select"
            @select="selectChange"
          >
            <a-select-option
              v-for="(item,index) in selectData"
              :key="index"
              :value="item.type"
            >{{ item.name }}</a-select-option>
          </a-select>
        </div>
      </template>
    </property-widget>
    <!-- 限时时间设置弹窗 -->
    <limited-time
      v-model="showModal"
      :timeItem="timeItem"
      @close="showModal = false"
      @submit="limitedTimeSubmit"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import PropertyWidget from '../base/propertyWidget.vue';
import EllipsisInput from '../base/ellipsisInput.vue';
import LimitedTime from '../modals/limitedTime.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'ActivitySenior',
  components: {
    PropertyWidget,
    EllipsisInput,
    LimitedTime
  }
})

export default class ActivitySenior extends Vue {
  @WorkflowModule.State('currentActivity') currentActivity: any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  showModal:boolean = false;

  timeoutStrategy:string = 'NOTIFY_HANDLER';

  timeItem:any = {
    allowedTime: '',
    timeoutWarning1: '',
    timeoutWarning2: ''
  };

  timeData:any = [{
    label: '限时时间',
    type: 'allowedTime',
    value: '',
    tip: '设定当前任务的许可时间，超过该时间系统即认为该任务超时'
  }, {
    label: '超时预警1',
    type: 'timeoutWarning1',
    value: '',
    tip: '设置第一次即将超时提醒的时间，即将到达超时时间前的4小时，待办列表要显示为黄色'
  }, {
    label: '超时预警2',
    type: 'timeoutWarning2',
    value: '',
    tip: '设置第二次提醒的时间，即将到达超时时间前的2小时，待办列表要显示为橙色'
  }];

  selectData:any = [{
    name: '钉钉消息通知处理人',
    type: 'NOTIFY_HANDLER'
  }, {
    name: '直接进入下一节点',
    type: 'APPROVE'
  }, {
    name: '传阅上级主管',
    type: 'CIRCULATE_MANAGER'
  },
  // 20191204 迭代26需求
  // {
  //   name: '转办上级主管',
  //   type: 'FORWARD_MANAGER'
  // }
  ];

  beforeMount() {
    this.dataMounted();
  }

  // 限时弹窗提交事件
  limitedTimeSubmit(time: any) {
    const objLength = Object.keys(this.curActivityProps.activitySenior).length;
    this.timeData.forEach((a: any, i: string) => {
      if (a.type === 'allowedTime') {
        this.timeItem.allowedTime = `${time.allowedTime}`;
        a.value = this.msecToTimeSpan(time.allowedTime);
        if (objLength) {
          this.setPropValue({ key: 'activitySenior.allowedTime', value: time.allowedTime });
        }
      } else if (a.type === 'timeoutWarning1') {
        this.timeItem.timeoutWarning1 = `${time.timeoutWarning1}`;
        a.value = this.msecToTimeSpan(time.timeoutWarning1);
        if (objLength) {
          this.setPropValue({ key: 'activitySenior.timeoutWarning1', value: time.timeoutWarning1 });
        }
      } else if (a.type === 'timeoutWarning2') {
        this.timeItem.timeoutWarning2 = `${time.timeoutWarning2}`;
        a.value = this.msecToTimeSpan(time.timeoutWarning2);
        if (objLength) {
          this.setPropValue({ key: 'activitySenior.timeoutWarning2', value: time.timeoutWarning2 });
        }
      }
    });
  }

  // 时间毫秒数转时间段
  msecToTimeSpan(msec:number) {
    if (msec) {
      const days = Math.floor(msec / (1000 * 60 * 60 * 24));
      const hours = Math.floor((msec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((msec % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msec % (1000 * 60)) / 1000);
      return `${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    return '';
  }

  // 超时后策略改变事件
  selectChange(value:any) {
    this.timeoutStrategy = value;
    const objLength = Object.keys(this.curActivityProps.activitySenior).length;
    if (objLength) {
      this.setPropValue({ key: 'activitySenior.timeoutStrategy', value });
    }
  }

  // 根据数据初始化视图
  dataMounted() {
    if (Object.keys(this.curActivityProps.activitySenior).length) {
      const activitySeniorArray = Object.entries(this.curActivityProps.activitySenior);
      activitySeniorArray.forEach((a: any) => {
        if (!a && !a[0] && !a[1]) {
          return;
        }
        const [key, value] = a;
        if (key === 'timeoutStrategy') {
          // 迭代26 删除转办上级主管 兼容数据
          if (value === 'FORWARD_MANAGER') {
            this.timeoutStrategy = '转办上级主管';  
          } else {
            this.timeoutStrategy = value;
          }
          return;
        }
        this.timeData.forEach((t: any, i: string) => {
          if (t.type === key) {
            const val = typeof value === 'string' ? Number(value) : value;
            this.timeItem[key] = val;
            t.value = this.msecToTimeSpan(val);
          }
        });
      });
    }
  }

  @Watch('currentActivity')
  onActivityChange(v: string) {
    this.dataMounted();
  }
}
</script>

<style lang="less" scoped>
.over-time-policy{
  width: 100%;
  height: 32px;
  /deep/.input-select{
    width: 100%;
    border: none;
    /deep/.ant-select-selection{
      border: none;
      box-shadow: none;
    }
  }
}

</style>
