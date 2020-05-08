<template>
  <div class="message-reminder-drawer">
    <a-row class="message-reminder-drawer-row">
      <a-col :span="24">
        <div
          class="message-reminder-drawer-title"
          @click="showDatas"
        >提醒对象</div>
      </a-col>
    </a-row>

    <a-row class="message-reminder-drawer-row">
      <a-col :span="12">
        <a-row>
          <a-col :span="6">部门</a-col>
          <a-col :span="18">
            <staff-selector
              v-model="remindDrawerValues.depIds"
              :options="staffSelectorOpts_Org"
            ></staff-selector>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row>
          <a-col :span="6">
            <span class="message-reminder-drawer-left-title">用户</span>
          </a-col>
          <a-col :span="18">
            <staff-selector
              v-model="remindDrawerValues.userIds"
              :options="staffSelectorOpts_User"
            ></staff-selector>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-row class="message-reminder-drawer-row">
      <a-col :span="3">角色</a-col>
      <a-col :span="21">
        <role-tree v-model="remindDrawerValues.roleIds" placeholder="请选择角色" />
      </a-col>
    </a-row>

    <!-- 提醒对象数据项 -->
    <a-row class="message-reminder-drawer-row">
      <a-col :span="3">数据项</a-col>
      <a-col :span="21">
        <div>
          <a-select
            mode="multiple"
            :placeholder="$t('languages.PlaceHolder.Select')"
            class="w320"
            @change="dataSummaryChange"
            :notFoundContent="$t('languages.NoRelevantData')"
            :value="remindDrawerValues.userDataOptions"
          >
            <a-select-opt-group>
              <span slot="label" class="select-title">业务数据项</span>
              <a-select-option
                v-for="i in object_bizSummaryList"
                :key="i.code"
              >{{ i.name }}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label" class="select-title">系统数据项</span>
              <a-select-option
                v-for="i in object_defaultSummaryList"
                :key="i.code"
              >{{ i.name }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
      </a-col>
    </a-row>

    <!-- 提醒内容数据项 -->
    <a-row class="message-reminder-drawer-row">
      <a-col :span="24">
        <div class="message-reminder-drawer-title">提醒设置</div>
      </a-col>
    </a-row>

    <a-row class="message-reminder-drawer-row">
      <a-col :span="3">提醒内容</a-col>
      <a-col :span="21">
        <div>
          <a-select
            mode="tags"
            :placeholder="$t('languages.PlaceHolder.Select')"
            class="w320"
            @change="contentSummaryChange"
            :notFoundContent="$t('languages.NoRelevantData')"
            :value="remindDrawerValues.msgTemplate"
          >
            <a-select-opt-group>
              <span slot="label" class="select-title">业务数据项</span>
              <a-select-option
                v-for="i in content_bizSummaryList"
                :key="i.code"
              >{{ i.name }}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label" class="select-title">系统数据项</span>
              <a-select-option
                v-for="i in content_defaultSummaryList"
                :key="i.code"
              >{{ i.name }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
      </a-col>
    </a-row>

    <a-row
      class="message-reminder-drawer-row"
      v-if="enumList && enumList.remindType"
    >
      <a-col :span="12">
        <a-row>
          <a-col :span="6">提醒类型</a-col>
          <a-col :span="18">
            <a-select
              placeholder="请选择"
              style="width: 100%"
              @change="onRemindTypeChange"
              v-model="remindDrawerValues.remindType"
            >
              <a-select-option
                v-for="item in enumList.remindType"
                :key="item.index"
              >{{ item.desc }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <!-- <a-row class="message-reminder-drawer-row" :gutter="26" v-if="dateControlEnum && dateControlEnum.length"> -->

    <a-row class="message-reminder-drawer-row">
      <a-col :span="12">
        <a-row>
          <a-col :span="6">日期控件</a-col>
          <a-col :span="18">
            <a-select
              placeholder="请选择"
              style="width: 100%"
              @change="onDataControlChange"
              v-model="remindDrawerValues.dateOption"
            >
              <a-select-option
                v-for="item in dateControlEnum"
                :key="item.code"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row
          justify="space-around"
          align="middle"
          class="right-row"
        >
          <a-col :span="5" v-if="enumList && enumList.dateType">
            <a-select
              :defaultValue="enumList.dateType[0].desc"
              placeholder="请选择类型"
              style="width: 100%"
              @change="onDateTypeChange"
              v-model="remindDrawerValues.dateType"
            >
              <a-select-option
                v-for="item in enumList.dateType"
                :key="item.index"
              >{{ item.desc }}</a-select-option>
            </a-select>
          </a-col>
          <!-- 天 时 分 -->
          <template v-if="remindDrawerValues.dateType !== 1">
            <a-col :span="1"></a-col>
            <a-col :span="4">
              <a-input-number
                style="width: 100%"
                :min="0"
                :max="999"
                :step="1"
                :precision="0"
                :defaultValue="dayMoment"
                @blur="onDayMomentChange"
              />
              <!-- <a-select
                v-model="dayMoment"
                placeholder="请选择类型"
                style="width: 100%"
                @change="onDayMomentChange"
              > 
                <a-select-option v-for="item in days" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>-->
            </a-col>

            <a-col :span="2">
              <span>天</span>
            </a-col>

            <a-col :span="4">
              <a-select
                v-model="hourMoment"
                placeholder="请选择类型"
                style="width: 100%"
                @change="onHourMomentChange"
              >
                <a-select-option
                  v-for="item in hours"
                  :key="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="2">
              <span>时</span>
            </a-col>

            <a-col :span="4">
              <a-select
                v-model="minuteMoment"
                placeholder="请选择类型"
                style="width: 100%"
                @change="onMinuteMomentChange"
              >
                <a-select-option
                  v-for="item in minutes"
                  :key="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="2">
              <span>分</span>
            </a-col>
          </template>

          <template v-else>
            <a-col :span="1"></a-col>
            <a-col :span="8">
              <a-time-picker
                v-model="currentDate"
                format="HH:mm"
                @change="currentDataChange" 
              />
            </a-col>
          </template>
        </a-row>
      </a-col>
    </a-row>

    <a-row
      class="message-reminder-drawer-row"
      v-if="enumList && enumList.conditionType"
    >
      <a-col :span="12">
        <a-row>
          <a-col :span="6">提醒条件</a-col>
          <a-col :span="18">
            <a-select
              placeholder="请选择"
              style="width: 100%"
              @change="onConditionTypeChange"
              v-model="remindDrawerValues.conditionType"
            >
              <a-select-option
                v-for="item in enumList.conditionType"
                :key="item.index"
              >{{ item.desc }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-col>
      <a-col
        :span="8"
        :offset="2"
        v-if="remindDrawerValues.conditionType !== 1 && remindDrawerValues.conditionType !== null"
      >
        <a-input
          placeholder="过滤条件"
          v-model="conditionStr"
          @click="onClickFilter"
        >
          <a-icon slot="suffix" type="ellipsis" />
        </a-input>
      </a-col>
    </a-row>

    <a-modal
      v-model="visible"
      title="添加过滤条件"
      :width="700"
      :maskClosable="false"
      :keyboard="false"
      :cancelText="$t('languages.Apps.Cancel')"
      :okText="$t('languages.Apps.Ok')"
      :destroyOnClose="true"
      @ok="ok"
      @cancel="onCancel"
    >
      <dataitem-condition :items="items" v-model="conditionValue"></dataitem-condition>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import MessageReminderApis from "@/apis/message-reminder/index.api";
import StaffSelector from "@cloudpivot/form/src/renderer/components/shared/staff-selector.vue";
import RoleTree from "@/components/shared/user/role-tree.vue";
import { State, Action, Mutation, namespace } from "vuex-class";
import DataitemCondition from "@/components/shared/data-item/dataitem-condition3.vue";

import {
  OperatorService,
  DateItemOperatorType
} from "@/components/shared/data-item/data-item";

import moment from "moment";

const DataModelModule = namespace("Apps/DataModel");

@Component({
  name: "reminder-drawer",
  components: {
    StaffSelector,
    RoleTree,
    DataitemCondition
  }
})
export default class ReminderDrawer extends Vue {
  @DataModelModule.State("dataItemList") dataItemList: any;
  @DataModelModule.State("summaryList") summaryList: any;
  @DataModelModule.State("defaultSummary") defaultSummary: any;
  @DataModelModule.Mutation("setBizSchemaCode") setBizSchemaCodeX: any;
  @DataModelModule.Action("getDataItemList") getDataItemListX: any;
  @DataModelModule.Mutation("setFilterDataItemList") setFilterDataItemList: any;
  @DataModelModule.Mutation("setKeyWords") setKeyWords: any;
  @DataModelModule.Action("getDataItemType") getDataItemType: any;
  @DataModelModule.Action("getSummary") getSummaryX: any;

  @Prop() public record: any;

  // 抽屉各项数据
  public remindDrawerValues: any = {};

  // 部门选项配置
  public staffSelectorOpts_Org: any = {
    selectOrg: true,
    selectUser: false,
    mulpitle: true,
    showModel: true,
    showSelect: true,
    placeholder: "请选择部门"
  };

  // 用户选项配置
  public staffSelectorOpts_User: any = {
    selectOrg: false,
    selectUser: true,
    mulpitle: true,
    showModel: true,
    showSelect: true,
    placeholder: "请选择用户"
  };

  // 保存数据项的值
  public userDataOptions: any[] = [];

  // public keyWords: string = ""

  // 过滤控件的显示状态
  public visible: Boolean = false;

  // 天数的值
  public dayMoment: number = 0;

  // 小时数的值
  public hourMoment: number = 0;

  // 分钟数的值
  public minuteMoment: number = 0;

  // 传递给条件过滤组件数据
  public items: any = [];

  // 过滤控件回传出来的值
  public conditionValue: any = {
    type: 1,
    conditions: []
  };

  // 新建消息提醒枚举对象
  public enumList: any[] = [];

  // 日期控件枚举
  public dateControlEnum: any[] = [];

  // 天数遍历
  get days() {
    const h = 30;
    const result: any[] = [];
    for (var i = 0; i < h; i++) {
      result.push(i);
    }
    return result;
  }

  // 小时数遍历
  get hours() {
    const h = 24;
    const result: any[] = [];
    for (var i = 0; i < h; i++) {
      result.push(i);
    }
    return result;
  }

  // 分钟数遍历
  get minutes() {
    const h = 60;
    const result: any[] = [];
    for (var i = 0; i < h; i++) {
      result.push(i);
    }
    return result;
  }

  // 属性计算获取最终的分钟数
  get getAllMinutes() {
    return this.dayMoment * 24 * 60 + this.hourMoment * 60 + this.minuteMoment;
  }

  currentDate: any = null;
  /**
   * 时间转换
   */
  transeIntervalTime(val: number) {
    // debugger
    const day = Math.floor(val / (24 * 60));
    const hour = Math.floor((val % (24 * 60)) / 60);
    const minute = Math.floor((val % (24 * 60)) % 60);
    if (this.remindDrawerValues.dateType !== 1) {
      this.dayMoment = day;

      this.hourMoment = hour;

      this.minuteMoment = minute;
    } else {
      this.currentDate = moment(`${hour}:${minute}`, "HH:mm");
    }
  }

  currentDataChange(time: any, timeString: string) {
    const timeArr = timeString.split(":");
    this.remindDrawerValues.intervalTime =
      Number(timeString.split(":")[0]) * 60 + Number(timeString.split(":")[1]);
  }

  // 提醒对象数据项过滤后的系统数据项
  get object_defaultSummaryList() {
    return this.summaryList.filter(
      (data: any) => data.defaultProperty && data.propertyType === 5
    );
  }

  // 提醒对象数据项过滤后的业务数据项
  get object_bizSummaryList() {
    return this.summaryList.filter(
      (data: any) => !data.defaultProperty && data.propertyType === 5
    );
  }

  // get object_default() {
  //   // console.log(this.defaultSummary)
  //   // return this.defaultSummary.filter((data) => data.propertyType === 5)
  // }

  // 提醒对象数据项过滤后的系统数据项
  get content_defaultSummaryList() {
    // debugger
    return this.summaryList.filter(
      (data: any) =>
        data.defaultProperty && data.propertyType !== 10 && data.published
      // (data: any) => data.defaultProperty
    );
  }

  // 提醒对象数据项过滤后的业务数据项
  get content_bizSummaryList() {
    return this.summaryList.filter(
      (data: any) =>
        !data.defaultProperty && data.propertyType !== 10 && data.published
      // (data: any) => !data.defaultProperty
    );
  }

  // 获取枚举列表
  public toGetEnumList() {
    MessageReminderApis.getEnumList().then((res: any) => {
      if (res.errcode === 0) {
        // debugger
        this.enumList = res.data;
      }
    });
  }

  public dataSummaryChange(val: Array<string>) {
    this.remindDrawerValues.userDataOptions = val;
  }
  msgTemplate: any[] = [];
  public contentSummaryChange(val: Array<string>) {
    this.msgTemplate = [];
    val.forEach((res: any) => {
      const dataItem = this.summaryList.find((item: any) => {
        return item.code === res;
      });
      if (dataItem) {
        const summaryObj = {
          isDataItem: 1,
          code: res
        };
        this.msgTemplate.push(summaryObj);
      } else {
        const summaryObj = {
          isDataItem: 0,
          code: res
        };
        this.msgTemplate.push(summaryObj);
      }
    });
    this.remindDrawerValues.msgTemplate = val;
  }

  // 过滤
  // public filterList() {
  //   const that = this
  //   setTimeout(() => {
  //     this.setFilterDataItemList(that.keyWords)
  //     this.setKeyWords(that.keyWords)
  //   }, 200);
  // }

  // 提醒类型改变
  public onRemindTypeChange(val: any) {
    this.remindDrawerValues.remindType = val;
  }

  // 时间控件改变
  public onDataControlChange(val: any) {
    this.remindDrawerValues.dateOption = val;
  }

  // 提醒类型改变
  public onDateTypeChange(val: any) {
    this.remindDrawerValues.dateType = val;
    this.remindDrawerValues.intervalTime = 0;
    this.dayMoment = 0;
    this.hourMoment = 0;
    this.minuteMoment = 0;
  }

  // 天数改变
  public onDayMomentChange(val: any) {
    this.dayMoment = Number(val.target.value);
    this.remindDrawerValues.intervalTime = this.getAllMinutes;
  }

  // 小时数改变
  public onHourMomentChange(val: any) {
    this.remindDrawerValues.intervalTime = this.getAllMinutes;
  }

  // 分钟数改变
  public onMinuteMomentChange(val: any) {
    this.remindDrawerValues.intervalTime = this.getAllMinutes;
  }

  // 提醒条件改变
  public onConditionTypeChange(val: any) {
    this.remindDrawerValues.conditionType = val;
  }

  // 点击过滤条件框
  public onClickFilter() {
    this.visible = true;
  }

  // 点击条件弹窗保存按钮
  filterType = 1;
  public ok() {
    this.visible = false;
    this.remindDrawerValues.roleCondition = this.conditionValue.conditions;
    this.filterType = this.conditionValue.type;
    this.setconditionString();
  }

  conditionStr = "";
  setconditionString() {
    // debugger
    const relativeMap: any = {
      1: "&&",
      2: "||"
    };
    if (this.conditionValue.conditions) {
      const condition = this.conditionValue.conditions.map((res: any) => {
        let operator: any =
          OperatorService.findByValue(res.propertyType, res.operatorType) || "";
        return `{${res.propertyCode}} ${operator.label} ${res.value}`;
      });

      this.conditionStr = condition.join(relativeMap[this.conditionValue.type]);
    }
  }

  // 点击条件弹窗取消按钮
  public onCancel() {
    this.visible = false;

    // this.conditionValue = {
    //   type : 1,
    //   conditions : []
    // }

    // this.remindDrawerValues.userDataOptions = null
    // this.remindDrawerValues.msgTemplate =  null
  }

  setUserOption() {
    // debugger
    if (
      !this.remindDrawerValues.userDataOptions ||
      this.remindDrawerValues.userDataOptions.length === 0
    ) {
      return "";
    } else {
      const arrList: any = [];
      this.remindDrawerValues.userDataOptions.forEach((res: any) => {
        const item: any = this.summaryList.find((child: any) => {
          return res === child.code;
        });
        // debugger
        if (item) {
          const { code, propertyType, name } = item;
          arrList.push({
            propertyCode: code,
            propertyType,
            value: name
          });
        }
      });

      return JSON.stringify(arrList);
    }

    this.summaryList;
  }
  // 创建表单消息提醒
  public createListItem() {
    return new Promise((resolve, reject) => {
      const schemaCode = { schemaCode: this.$route.params.bizSchemaCode };

      // if (this.remindDrawerValues.depIds && )
      const depIds = this.remindDrawerValues.depIds
        ? JSON.stringify(this.remindDrawerValues.depIds)
        : "";
      const msgTemplate = this.remindDrawerValues.msgTemplate
        ? JSON.stringify(this.msgTemplate)
        : "";
      const roleCondition = this.remindDrawerValues.roleCondition
        ? JSON.stringify(this.remindDrawerValues.roleCondition)
        : "";
      const roleIds = this.remindDrawerValues.roleIds
        ? JSON.stringify(this.remindDrawerValues.roleIds)
        : "";
      const userDataOptions = this.setUserOption();
      // this.remindDrawerValues.userDataOptions.length > 0? JSON.stringify(this.remindDrawerValues.userDataOptions) : '';
      const userIds = this.remindDrawerValues.userIds
        ? JSON.stringify(this.remindDrawerValues.userIds)
        : "";
      // this.setUserOption();
      // debugger
      if (
        (!depIds || depIds.length === 0) &&
        (!roleIds || roleIds.length === 0) &&
        (!userIds || userIds.length === 0) &&
        (!userDataOptions || userDataOptions.length === 0)
      ) {
        this.$message.error("请选择提醒对象！");
        resolve(false);
        return;
      }

      if (msgTemplate.length === 0) {
        this.$message.error("请设置提醒内容！");
        resolve(false);
        return;
      }

      if (!this.remindDrawerValues.dateOption) {
        this.$message.error("请设置日期控件！");
        resolve(false);
        return;
      }
      // 校验条件
      if (
        this.remindDrawerValues.conditionType === 2 &&
        roleCondition.length === 0
      ) {
        this.$message.error("请设置条件！");
        resolve(false);
        return;
      }

      const format: any = {
        depIds,
        msgTemplate,
        roleCondition,
        roleIds,
        userDataOptions,
        userIds
      };
      const params = Object.assign(
        { id: this.id, filterType: this.filterType },
        this.remindDrawerValues,
        format,
        schemaCode
      );
      const postData = this.isEdit
        ? MessageReminderApis.upDateListItem
        : MessageReminderApis.createListItem;

      postData(params).then((res: any) => {
        if (res.errcode === 0) {
          resolve(true);
        } else {
          this.$message.error(res.errmsg);
          resolve(false);
        }
      });
    });
  }

  public created() {
    this.getDataItemListX().then(() => {
      // this.filterList(); // 对请求到数据过滤

      this.items = this.summaryList
        .map((x: any) => {
          // 添加额外属性（属性名称不一样了）
          x.type = x.propertyType;
          x.isSystem = x.defaultProperty;
          return x;
        })
        .filter((res: any) => {
          if (res) {
            return res;
          }
        });
      // 数据项数据
      // debugger
      // this.remindDrawerValues.userDataOptions = this.defaultSummary

      // 日期控件枚举过滤, propertyType === 3
      // debugger
      this.dateControlEnum =
        this.dataItemList.filter(
          (item: any) => item.propertyType === 3 && item.published
        ) || [];
    });

    this.getDataItemType();
    // this.getSummaryX() // 获取摘要
  }
  isEdit = false;
  id = "";
  mounted() {
    // debugger
    const record: any = JSON.parse(JSON.stringify(this.record));
    if (record.id) {
      this.id = record.id;
      this.isEdit = true;
      // 部门
      if (record.depIds) {
        record.depIds = JSON.parse(record.depIds);
      }

      // 提示内容
      if (typeof record.msgTemplate === "string") {
        const summeryList: any = JSON.parse(record.msgTemplate);

        record.msgTemplate = summeryList.map((res: any) => {
          return res.code;
        });

        this.msgTemplate = summeryList;
      }
      // 提醒条件
      // debugger
      if (record.roleCondition) {
        record.roleCondition = JSON.parse(record.roleCondition);
      }
      // 角色
      if (record.roleIds) {
        record.roleIds = JSON.parse(record.roleIds);
      }

      // 数据项
      if (record.userDataOptions) {
        const itemList: any = JSON.parse(record.userDataOptions);

        record.userDataOptions = itemList.map((res: any) => {
          return res.propertyCode;
        });
      }
      // 提醒用户
      if (record.userIds) {
        record.userIds = JSON.parse(record.userIds);
      }

      // 之前与之后时间转换
    }
    const {
      depIds,
      msgTemplate,
      roleIds,
      userIds,
      roleCondition,
      userDataOptions,
      remindType,
      dateOption,
      dateType,
      conditionType,
      intervalTime,
      filterType
    } = record;

    const backData = {
      depIds,
      msgTemplate, //会报错 // todo
      roleIds,
      userIds,
      userDataOptions,
      remindType, //提醒类型
      dateOption,
      dateType, // 时间类型
      conditionType,
      intervalTime,
      roleCondition
    };
    this.remindDrawerValues = backData;
    if (record.intervalTime) {
      this.transeIntervalTime(record.intervalTime);
    }

    if (record.roleCondition) {
      this.conditionValue.conditions = roleCondition;
      this.conditionValue.type = filterType;
      this.setconditionString();
    }

    this.toGetEnumList();
  }

  public showDatas() {
    console.log(this.remindDrawerValues);
  }
}
</script>

<style lang="less" scoped>
.message-reminder-drawer {
  text-align: left;
  &-left-title {
    margin-left: 26px;
  }
  .right-row {
    padding-left: 24px;
  }
  .ant-col-6,
  .ant-col-3 {
    display: flex;
    align-items: center;
    height: 32px;
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-col-2 {
    display: flex;
    height: 32px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    span {
      display: block;
      width: 100%;
    }
  }
  .select-title {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px !important;
  }
  &-row {
    margin-bottom: 20px;
    .w320 {
      width: 100%;
      .ant-select-selection {
        max-height: 60px;
        overflow-x: auto;
      }
    }
  }
  &-title {
    font-size: 14px;
    color: rgba(0, 0, 0.85);
    line-height: 22px;
    font-weight: bold;
  }
  &-set-title {
    font-size: 14px;
    color: rgba(0, 0, 0.85);
    line-height: 22px;
    font-weight: bold;
  }
}
</style>


