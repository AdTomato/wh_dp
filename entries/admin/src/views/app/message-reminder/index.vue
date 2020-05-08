<template>
  <div class="message-reminder">
    <div v-if="isLoading" class="message-reminder--loading">
      <a-spin size="large" :tip="$t('languages.Apps.Loading')" />
    </div>
    <div v-else class="message-reminder__main">
      <template v-if="list.length">
        <div class="message-reminder__buttons">
          <span class="message-reminder__describe">系统中有数据满足设置的条件时，可以自动发送消息提醒</span>
          <a-button
            icon="plus"
            type="primary"
            @click="openDrawer"
          >{{ $t('languages.Apps.AddNew') }}</a-button>
        </div>
        <div class="message-reminder__table">
          <a-table
            :columns="columns"
            :dataSource="list"
            :pagination="false"
            :scroll="{ y: 500 }"
            :loading="isLoading"
            size="small"
            :locale="{emptyText: $t('languages.NoRelevantData')}"
          >
            <!-- 表头 -->
            <span slot="indexTitle">序号</span>
            <span slot="remindGroupTitle" class="resize">提醒对象</span>
            <span slot="remindTypeTitle" class="resize">提醒类型</span>
            <span slot="conditionTypeTitle" class="resize">提醒条件</span>
            <span slot="enabledTitle" class="resize">是否启用</span>
            <span slot="actionTitle" class="resize">操作</span>

            <span slot="index" slot-scope="text, record">{{ record.index }}</span>

            <span
              slot="remindGroup"
              :title="text"
              slot-scope="text, record"
              class="text-ellipsis"
            >{{ text }}</span>

            <span
              slot="remindType"
              slot-scope="text, record"
              class="text-ellipsis"
            >{{ remindType[text] }}</span>

            <span
              slot="conditionType"
              :title="text===1?'任意':record.condition"
              slot-scope="text, record"
              class="text-ellipsis"
            >
              <template v-if="text===1">所有数据</template>
              <template v-else>{{ record.condition }}</template>
            </span>

            <span slot="enabled" slot-scope="text, record">
              <a-switch v-model="record.enabled" @change="switchListItem(record)" />
            </span>

            <span
              slot="action"
              slot-scope="text, record"
              class="message-reminder__actions"
            >
              <i class="icon aufontAll h-icon-all-edit-o" @click="edit(record)" />
              <i class="icon aufontAll h-icon-all-delete-o" @click="del(record)"></i>
            </span>
          </a-table>
        </div>
      </template>
      <div v-else>
        <div style="text-align: left">
          <span class="message-reminder__describe">系统中有数据满足设置的条件时，可以自动发送消息提醒。</span>
        </div>
        <no-data tip="暂无消息提醒，请点击新建按钮新建" @click="openDrawer" />
      </div>
    </div>

    <a-drawer
      :title="drawerTitle"
      :visible="showDrawer"
      :closable="true"
      :destroyOnClose="true"
      width="850"
      placement="right"
      @close="closeDrawer"
    >
      <reminder-drawer
        ref="drawer"
        :record="record"
        v-if="showDrawer"
      />
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'center'
        }"
      >
        <a-button :style="{marginRight: '8px'}" @click="onCancel">取消</a-button>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MessageReminderApis from "@/apis/message-reminder/index.api";
import ReminderDrawer from "./reminder-drawer.vue";
import NoData from "@/components/global/no-data.vue";
import {
  OperatorService,
  DateItemOperatorType
} from "@/components/shared/data-item/data-item";

@Component({
  name: "message-reminder",
  components: {
    ReminderDrawer,
    NoData
  }
})
export default class MessgaeReminder extends Vue {
  // 表头信息
  public columns: any = [
    {
      dataIndex: "index",
      slots: { title: "indexTitle" },
      scopedSlots: { customRender: "index" },
      width: 80,
      align: "center",
      key: "index"
    },
    {
      dataIndex: "remindGroup",
      slots: { title: "remindGroupTitle" },
      scopedSlots: { customRender: "remindGroup" },
      key: "remindGroup",
      align: "left",
      width: 200
    },
    {
      dataIndex: "remindType",
      slots: { title: "remindTypeTitle" },
      scopedSlots: { customRender: "remindType" },
      key: "remindType",
      align: "left",
      width: 300
    },
    {
      dataIndex: "conditionType",
      slots: { title: "conditionTypeTitle" },
      scopedSlots: { customRender: "conditionType" },
      width: 400,
      align: "left",
      key: "conditionType"
    },
    {
      dataIndex: "enabled",
      slots: { title: "enabledTitle" },
      scopedSlots: { customRender: "enabled" },
      width: 140,
      align: "left",
      key: "enabled"
    },
    {
      dataIndex: "action",
      slots: { title: "actionTitle" },
      scopedSlots: { customRender: "action" },
      // width: 120,
      align: "right",
      key: "action"
    }
  ];

  remindType = {
    "1": "根据日期控件提醒"
  };

  // 列表是否仍在加载
  public isLoading: boolean = true;

  // 抽屉的默认标题
  public drawerTitle: string = "新建消息提醒";

  // 是否展示抽屉
  public showDrawer: boolean = false;

  // 列表内容
  public list: any[] = [];

  // 传递给抽屉弹窗的单条列表信息
  public record: any = {};

  // 新建抽屉各项数据
  public createRecord: any = {
    depIds: [], // 部门
    userIds: [], // 用户
    roleIds: [], // 角色
    userDataOptions: [], // 数据项，默认为空数组
    msgTemplate: [], // 提醒内容
    remindType: 1, // 提醒类型
    dateOption: null, // 日期控件
    dateType: 1, // 时间间隔类型
    intervalTime: 0, // 时间设定(转化为分钟)
    conditionType: null, // 提醒条件
    roleCondition: [] // 过滤条件
  };

  // 获取列表数据
  public getList() {
    const vm: any = this;
    const params = { schemaCode: this.$route.params.bizSchemaCode };
    MessageReminderApis.getList(params).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        this.isLoading = false;
        // 添加序号
        this.list = res.data.map((resTwo: any, index: number) => {
          let remindGroup: any[] = [];

          if (resTwo.depIds && resTwo.depIds !== "null") {
            const depIds = JSON.parse(resTwo.depIds);

            remindGroup = remindGroup.concat(
              depIds.map((child: any) => child.name)
            );
          }
          if (resTwo.roleIds && resTwo.roleIds !== "null") {
            const roleIds = JSON.parse(resTwo.roleIds);
            remindGroup = remindGroup.concat(
              roleIds.map((child: any) => child.name)
            );
          }

          if (resTwo.userIds && resTwo.userIds !== "null") {
            const userIds = JSON.parse(resTwo.userIds);
            remindGroup = remindGroup.concat(
              userIds.map((child: any) => child.name)
            );
          }

          if (resTwo.userDataOptions) {
            const userDataOptions = JSON.parse(resTwo.userDataOptions);
            remindGroup = remindGroup.concat(
              userDataOptions.map((child: any) => child.value)
            );
          }

          return {
            index: index + 1,
            remindGroup: remindGroup.join(";"),
            condition: vm.setconditionString(resTwo.roleCondition, resTwo.filterType),
            ...resTwo
          };
        });
      }
    });
  }

  setconditionString(val: any, type: any) {
    // debugger
    let conditionStr = "";
    if (!val) {
      return conditionStr;
    }

    const conditionValue: any = JSON.parse(val);
    const relativeMap: any = {
      1: "&&",
      2: "||"
    };
    if (conditionValue) {
      const condition = conditionValue.map((res: any) => {
        let operator: any =
          OperatorService.findByValue(res.propertyType, res.operatorType) || "";
        return `{${res.propertyCode}} ${operator.label} ${res.value}`;
      });

      conditionStr = condition.join(relativeMap[type]);
    }

    return conditionStr;
  }

  // 切换列表单调数据项的 enable 值
  public switchListItem(record: any) {
    console.log(record);
    MessageReminderApis.switchListItem({
      id: record.id,
      enabled: record.enabled
    }).then((res: any) => {
      if (res.errcode === 0) {
        const msgTip = record.enabled ? "启用成功" : "停用成功";
        this.$message.success(msgTip);
      } else {
        const msgTip = record.enabled ? "启用失败" : "停用失败";
        this.$message.error(msgTip);
      }
    });
  }

  // 删除列表单挑数据项
  public del(record: any) {
    this.$confirm({
      width: 433,
      title: "确定删除该条提醒吗？",
      okText: "确定",
      okType: "primary",
      cancelText: "取消",
      keyboard: false,
      maskClosable: false,
      onOk: () => {
        this.delListItem(record.id);
      },
      onCancel: () => {}
    });
  }

  // 编辑列表单条数据项
  public edit(record: any) {
    this.record = record;
    this.showDrawer = true;
    this.drawerTitle = "编辑消息提醒";
  }

  // 删除列表单挑数据接口
  public delListItem(id: any) {
    return MessageReminderApis.delListItem({ id }).then((res: any) => {
      if (res.errcode === 0) {
        this.isLoading = true;
        this.$message.success("删除成功");
        this.getList();
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  // 打开抽屉
  public openDrawer() {
    this.record = this.createRecord;
    this.showDrawer = true;
    this.drawerTitle = "新建消息提醒";
  }

  // 关闭抽屉
  public closeDrawer() {
    this.showDrawer = false;
  }

  // 抽屉取消按钮
  public onCancel() {
    this.showDrawer = false;
  }

  // 抽屉保存按钮
  public onSave() {
    //
    const drawer: any = this.$refs.drawer;
    drawer.createListItem().then((res: any) => {
      if (res) {
        this.showDrawer = false;
        this.getList();
      } else {
        // this.$message.error('添加失败！');
      }
    });
  }

  public beforeMount() {
    this.getList();
  }
}
</script>

<style lang='less' scoped>
.message-reminder {
  text-align: center;
  padding: 0 24px;
  position: relative;
  .message-reminder__describe {
    line-height: 32px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    flex: 1;
    text-align: left;
  }
  &--loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
  }
  &__buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  &__table {
    /deep/.ant-table-header {
      // &::-webkit-scrollbar {
      //   width: 0;
      // }
    }
    /deep/.ant-table-thead span {
      color: rgba(0, 0, 0, 0.65);
      font-weight: 600;
    }
    /deep/.ant-table-body {
      max-height: calc(100vh - 220px - 20px) !important;
      table {
        padding: 0;
      }
      th,
      td {
        color: rgba(0, 0, 0, 0.85);
      }
      /deep/.empty .ant-table-row-expand-icon {
        display: none;
        pointer-events: none;
      }
      /deep/.ant-table-body {
        max-height: none !important;
      }
    }
    /deep/.ant-table-expanded-row {
      > td {
        padding: 0 !important;
        background-color: inherit;
      }
    }
  }
  &__actions {
    i {
      cursor: pointer;
      padding: 0 9px;
    }
    i:last-child {
      padding-right: 0;
    }
  }
}
</style>
