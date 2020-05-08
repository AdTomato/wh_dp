<template>
  <a-modal
    :visible="value"
    width="700px"
    :wrapClassName="`condition-modal ${currentView}`"
    :cancelText="'取消'"
    :okText="'保存'"
    @cancel="closeModal"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
  >
    <template slot="title">
      <h3>条件设置</h3>
      <p>
        切换至：
        <a href="javascript:;" @click="toggleView">
          {{
            currentView === 'formula' ? '表达式视图': '公式视图'
          }}
        </a>
      </p>
    </template>
    <component
      v-if="currentView"
      :is="currentView"
      :descriptions="currentView === 'formula' ? descriptions : ''"
      :placeholder="currentView === 'formula' ? placeholder : ''"
      type="condition"
      v-model="form"
      ref="conditionform"
    />
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import { LINE } from '@/typings/line';

import { dealErrorCode } from '@/utils/error-tips';

import Expression from './expression.vue';
import Formula from '../participant/formula.vue';

const DataModelModule = namespace('Apps/DataModel');
const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'ConditionModal',
  components: {
    Expression,
    Formula
  }
})
export default class ConditionModal extends Vue {
  @DataModelModule.State('bizSchemaCode') schemaCode: any; // 当前的业务模型schemaCode

  @WorkflowModule.Action('validateFormula') validateFormula: any;

  @Prop() value!: boolean;
  @Prop() data: any;

  // 当前弹窗视图
  currentView: string = '';
  form: Apps.Workflow.LineConditionForm = {
    expression: '',
    formula: ''
  }
  // 函数描述合集
  descriptions: Apps.Workflow.FormulaDescription[] = [
    {
      code: 'IsMember',
      text: 'IsMember(parent,child)，判定child是否是parent成员,返回true/false。Parent、child参数支持数据项（选人控件类型）、常量（人员/部门ID），例如，IsMember({user_dept},{Originator}),当前处理人是否是数据项(编码=user_dept)的成员，user_dept是财务部，当前处理人属于财务部是返回true，否则返回false。',
    },
    {
      code: 'Contains',
      text: `Contains(parent,child)，判断Parent是否包含Child，Parent和child都可以是字符串或字符串数组。
      1.如果是数组，则需要全匹配；
      2.如果是字符串与字符串比较，则是包含关系比较；`,
    },
    {
      code: 'IsEmpty',
      text: `IsEmpty(x)，判断x(一个表达式）是否为空值，返回true/false。通常用于判断选人类型的数据项或字符串，其他数据项不可以判断；
      1.如果是选人类型的数据项，当没有选择人员/组织，则返回true，否则为false；
      2.如果是String，那么为空值则返回 true；`,
    },
    {
      code: 'ExecuteBizMethod',
      text: `ExecuteBizMethod(ServiceCode,MethodName,Params),通过执行业务服务方法，返回布尔值（True/false)
1.ServiceCode:业务服务编码；2.MethodName：业务服务方法名称；3.Params:参数绑定，以JSON格式传入，例如 {"param1":"param1Value"}，其中param1Value可以是一个数据项或者一个固定字符串，如果是数据项，则获取数据项的值进行传入；`
    },
    {
      code: 'IsRoleMember',
      text: `判断一个人/人的集合是否属于某个角色。
IsRoleMember("角色编码",X)，参数X是否属于“角色编码”的角色成员，X可以是发起人或选人数据项的值；例如IsRoleMember(“482371773”,{shenpiren})、IsRoleMember(“482371773”,{Originator})`
    },
    // 新增系统数据项描述
    // TODO
    {
      code: 'id',
      text: '业务对象ID{id}：每新建一个表单会创建一条数据记录，这条数据记录的唯一识别码就是业务对象ID。'
    },
    {
      code: 'name',
      text: '数据标题{name}：短文本类型数据，提交表单的时候会根据管理后台数据模型里面设置的数据标题结构自动生成这条数据的标题，用来显示在列表上作为区分其他数据。'
    },
    {
      code: 'creater',
      text: '创建人{creater}：新建表单时的登录用户就是这条数据的创建人。'
    },
    {
      code: 'createdDeptId',
      text: '创建人部门{createdDeptId}：新建表单时的登录用户的主部门就是这条数据的创建人部门。'
    },
    {
      code: 'owner',
      text: '拥有者{owner}：拥有者和创建者有所区别，默认创建人就是拥有者。但是，如果表单设计时拖入拥有者控件，拥有者可以在填写表单时设置成其他人A，提交表单后这条数据的归属就是A,创建人从列表默认是看不到这条数据的，相当于创建人帮助拥有者创建了这条数据，一般用于助理帮经理发起流程，流程发起后助理将看不到这个流程，经理可以看到。'
    },
    {
      code: 'ownerDeptId',
      text: '拥有者部门{ownerDeptId}：拥有者所在部门，当拥有者有多个部门，创建数据的时候提交表单时选择的部门就是拥有者部门。'
    },
    {
      code: 'createdTime',
      text: '创建时间{createdTime}：首次填写表单的时间是创建时间。'
    },
    {
      code: 'modifier',
      text: '修改人{modifier}：最近一次修改这条数据的用户。'
    },
    {
      code: 'modifiedTime',
      text: '修改时间{modifiedTime}：最近一次修改这条数据的时间。'
    },
    {
      code: 'workflowInstanceId',
      text: '流程实例ID{workflowInstanceId}：如果这条数据是流程产生的数据，就会有流程实例ID，这是流程实例的唯一识别码。'
    },
    {
      code: 'sequenceNo',
      text: '单据号{sequenceNo}：单据号格式可以在表单设计-表单属性中设置，每创建一条数据会默认生成一个单据号，在同一个业务模型内，单据号是唯一的。'
    },
    {
      code: 'sequenceStatus',
      text: '单据状态{sequenceStatus}：单据状态指的是这条数据的状态，发起流程的时候暂存后是草稿状态，提交后是进行中状态，流程结束后是已完成状态；非流程表单没有进行中状态，提交后就是已完成状态；'
    },
    {
      code: 'ownerDeptQueryCode',
      text: '部门查询编码{ownerDeptQueryCode}：用于列表加载时计算部门权限用；'
    },
    // 新增系统参数描述
    // TODO
    {
      code: 'Originator',
      text: '发起人ID{Originator}：流程发起人的用户ID'
    },
    {
      code: 'Originator.OU',
      text: '发起人所属部门{Originator.OU}：流程发起人所在的主部门ID'
    },
    {
      code: 'Originator.OUName',
      text: '发起人组织名称{Originator.OUName}：发起人所在的主部门名称'
    },
  ];
  // 描述默认文字
  placeholder: string = `支持数据项、系统参数、函数输入。
函数输入需要填入参数，参数支持数据项、系统参数、常量；
参数格式要求：数据项、系统参数用{}包裹，常量用""（英文）包裹，例如IsEmpty("dljweljdljkajkajfaksakl"),IsMember({user_dept},{Originator})`;

  mounted() {
    this.Init();
  }

  Init() {
    if (!this.data || !this.data.formula) {
      this.currentView = 'expression';
      return;
    }
    /* 判定展示 popupType: 表达式EXPRESSION 函数FUNCTION 参见枚举popupTypes */
    if (this.data.popupType === LINE.popupTypes.expression) {
      this.form.expression = this.data.formula;
      this.currentView = 'expression';
    } else {
      this.form.formula = this.data.formula;
      this.currentView = 'formula';
    }
  }

  toggleView() {
    if (this.currentView === 'expression') {
      this.currentView = 'formula';
    } else {
      this.currentView = 'expression';
    }
  }

  closeModal() {
    if (this.currentView === 'expression') {
      const node: any = this.$refs.conditionform;
      node.clearValidate();
    }
    this.$emit('close');
  }
  /**
   * 处理确定按钮事件
   */
  async handleOk() {
    if (this.currentView === 'expression') {
      const node: any = this.$refs.conditionform;
      const validate: any = await node.getExpression();
      if (typeof validate !== 'string') {
        return;
      }
    }

    const vm: any = this;
    const result = vm.form[`${vm.currentView}`];
    if (!result) {
      vm.submit('');
      return;
    }
    const params: Apps.Workflow.ValidateFormulaParams = {
      function: result,
      schemaCode: this.schemaCode
    };
    this.validateFormula(params).then((res: Common.Data) => {
      if (res.errcode === 0) {
        vm.submit(result);
      } else {
        dealErrorCode(res, this);
      }
    });
  }
  /**
   * 提交
   */
  submit(formula: string) {
    this.$emit('submit', {
      formula,
      popupType: this.currentView === 'expression' ? LINE.popupTypes.expression : LINE.popupTypes.function
    });
  }

  @Watch('value')
  onShowChange(v: boolean) {
    if (v) {
      this.Init();
    } else {
      this.form.expression = '';
      this.form.formula = '';
      setTimeout(() => {
        this.currentView = '';
      }, 500);
    }
  }
}
</script>
<style lang="less">
.condition-modal {
  // z-index: 100000;
  .ant-modal-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 48px;
    font-weight: 400;
    p {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    a {
      color: @primary-color;
      text-decoration: none;
    }
  }
  &.formula {
    .ant-modal-body {
      padding: 0;
    }
  }
}
</style>
