<template>
  <a-modal
    v-model="isShow"
    :class="isStillRelease ? '' : 'hide-close-btn'"
    :title="type==='validate' ? '检验提示' : '发布提示'"
    :okText="isStillRelease ? '仍要发布' : '确定'"
    :cancelText="isStillRelease ? '去修改': '取消'"
    @cancel="closeModal"
    @ok="onConfirm"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="validate-box">
      <div class="err-validate" v-if="errorMsg.length !== 0">
        <div class="validate-top">
          <i class="icon aufontAll h-icon-all-close-circle validate-icon-error"></i>
          <span class="validate-title">检验出以下错误，全部修正后才可发布</span>
        </div>
        <div class="validate-msg err">
          <ul>
            <li v-for="(item, index) in errorMsg" :key="index">{{ (index+1) + "、" }} <span v-if="item.errContent">{{ item.errContent + ':' }}</span> {{ msgMapping[item.errCode] }}</li>
          </ul>
        </div>
      </div>

      <div class="err-validate" v-if="warningMsg.length !== 0">
        <div class="validate-top">
          <i class="icon aufontAll h-icon-all-exclamation-circle validate-icon-warning"></i>
          <span class="validate-title">检验出以下错误，发布后可能会对流程造成影响</span>
        </div>
        <div class="validate-msg warn">
          <ul>
            <li v-for="(item, index) in warningMsg" :key="index">{{ (index+1) + "、" + item.errContent }} : {{ msgMapping[item.errCode] }}</li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang='ts'>
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

@Component({
  name: 'tipModal'
})

export default class tipModal extends Vue {
  @Prop()
  value!: any;

  @Prop()
  type!: any;

  @Prop()
  warningMsg!: any;

  @Prop()
  errorMsg!: any;

  isShow: boolean = false;

  modalClass: string = 'hide-close-btn';

  okTxt: string = '确定';

  msgMapping: any = {
    401001: '流程不存在！',
    401002: '流程已存在！',
    401003: '流程id为空！',
    401004: '流程编码为空！',
    401005: '流程编码重复！',
    401006: '流程编码不规则！',
    401007: '流程名称为空！',
    401008: '流程的活动节点不存在！',
    401009: '流程的连接线不存在！',
    401011: '节点编码为空！',
    401012: '节点编码重复：',
    401013: '存在多条连接线',
    401014: '没有开始节点！',
    401023: '开始节点数量超过1个',
    401015: '没有结束节点！',
    401024: '结束节点数量超过1个',
    401016: '入口活动不存在！',
    401017: '出口活动不存在！',
    401018: '路由条件不合法',
    401019: '存在进入开始活动的连接线',
    401020: '存在从结束活动出发的连接线',
    401021: '不存在一条从开始到结束的路径',
    401022: '节点连接线不能自己连接自己',
    401025: '节点没有设置参与者',
    401026: '节点没有绑定表单',
    401027: '存在孤立节点',
    401028: '用户申请节点必填数据项未选择',
    401029: '没有设置开始节点',
    401030: '没有设置结束节点',
    401031: '节点编码包含特殊字符',
    402001: '流程发起权限id为空！',
    402002: '流程发起权限不存在！',
    401034: '子流程模板编码为空！',
    401035: '发起节点的参与者只能是{Originator}',
    401036: '发起节点的类型只能是用户活动节点',
    401038: '流程模板不存在用户参与活动节点',
    401039: '驳回到指定节点的节点编码不能为空',
    401040: '当前流程已经存在流程实例数据',
    401041: '否决出口节点编码不能为空',
    401043: '子流程节点绑定的流程不存在',
    401047: '参与者“上一活动参与者”函数设置不合法，上一活动必须是单个用户活动节点',
    401048: '驳回操作“驳回上一步”配置错误，上一步必须是单个的用户活动节点，不允许发布，请检查！',
    401049: '否决出口“驳回上一步“配置错误，上一步必须是单个的用户活动节点，不允许发布，请检查！',
    301005: '数据项不存在，请前往【数据模型】添加或发布',
    401050: '审批意见控件类型的数据项勾选了多个可见，不允许发布！',
    500106: '业务方法不存在',
    401051: '开始节点连接了多个节点，不允许发布',
    401052: '发起节点不允许驳回到开始',
    401053: '发起节点的参与者类型不允许多人',
    403001: '表达式不能为空',
    403002: '表达式连续多个符号',
    403003: '表达式缺失右括号“)”',
    403004: '表达式缺失运算符',
    403005: '运算符后缺少表达式',
    403006: '未关闭的括号“(”',
    403007: '表达式无意义',
    403008: '不能支持操作符“=”',
    403009: '不能支持操作符“&”',
    403010: '不能支持操作符“|”',
    403011: '不能支持操作符“!”',
    403012: '函数的参数个数错误',
    403013: '未识别的表达式',
    403014: '函数未关闭',
    403015: '函数参数为空',
    403016: '引号“"”未关闭',
    403018: '系统参数或数据项不存在',
    403019: '表达式不合法',
    403020: '表达式不能以运算符开始',
    403021: '函数不存在',
  }

  closeModal() {
    this.$emit('input', false);
  }

  onConfirm() {
    if (this.isStillRelease) {
      this.$emit('release');
    }
    this.closeModal();
  }

  get isStillRelease() {
    return this.warningMsg.length !== 0 && this.errorMsg.length === 0 && this.type === 'publish';
  }

  @Watch('value')
  onValueChange(val: any) {
    this.isShow = val;
  }
}
</script>

<style lang='less'>
.hide-close-btn .ant-btn.ant-btn-default {
  display: none;
}

.validate-box {
  .validate-icon-error {
    color: #f5222d;
    font-size: 22px;
  }
  .validate-icon-warning {
    color: #faad14;
    font-size: 22px;
  }
  .validate-title {
    display: inline-block;
    font-size: 16px;
    font-family: "PingFangSC-Medium";
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    margin-left: 16px;
    vertical-align: text-bottom;
  }
  .validate-msg {
    padding-left: 38px;
    font-size: 14px;
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .validate-msg {
    margin-bottom: 24px;
    ul {
      padding: 8px;
      border-radius: 4px;
    }
    &.err {
      ul {
        background-color: rgba(245, 34, 45, 0.06);
        border: 1px solid rgba(245, 34, 45, 0.08);
      }
    }
    &.warn {
      ul {
        background-color: rgba(245, 245, 245, 1);
        border: 1px solid rgba(191, 191, 191, 0.16);
      }
    }
  }
}
</style>
