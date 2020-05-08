<template>
  <div class="condition-panel">
    <section class="condition-panel-top">
      <span>连接方式：</span>
      <a-select
        v-model="form.connection"
        class="connection-select"
        placeholder="请选择连接方式"
      >
        <a-select-option
          v-for="(con, index) in connects"
          :key="index"
          :value="con.value"
        >{{ con.name }}</a-select-option>
      </a-select>
    </section>
    <h3>条件表达式</h3>
    <section class="condition-box">
      <!-- 编辑区 -->
      <div
        v-for="(item, idx) in form.ruleList"
        :key="idx"
        class="row clearfix"
      >
        <!-- 数据项 -->
        <a-select
          v-model="item.dataItemCode"
          class="select-item"
          placeholder="请选择数据项"
          @change="onDataItemChange($event, item)"
        >
          <a-select-option
            v-for="(dataItem,j) in filteDataList(item)"
            :key="dataItem.code + j"
            :value="dataItem.code"
          >{{ dataItem.name }}</a-select-option>
        </a-select>
        <!-- 运算符 -->
        <a-select
          v-model="item.rule"
          class="select-item"
          placeholder="请选择规则"
        >
          <a-select-option
            v-for="(r, i) in filteRuleList(item)"
            :key="r.value + i"
            :value="r.value"
          >{{ r.name }}</a-select-option>
        </a-select>
        <!-- 预设文本值 -->
        <a-tooltip :visible="item &&!!item.errorMsg">
          <template slot="title">
            <span>{{ item.errorMsg }}</span>
          </template>
          <div :class="!!item.errorMsg && 'has-error'">
            <a-input
              v-model="item.text"
              class="input-item"
              :disabled="!item.dataItemCode"
              :type="item.valueType === '2' ? 'number' : 'text'"
              @change="validate(item)"
            />
          </div>
        </a-tooltip>
        <!-- 删除按钮 -->
        <span class="delete" @click="popItem(idx)">
          <i class="icon aufontAll h-icon-all-delete-o"></i>
        </span>
      </div>
      <!-- 添加按钮 -->
      <div class="add" ref="addButton">
        <span @click="addItem">
          <i class="icon aufontAll h-icon-all-plus-o"></i>
          新增数据
        </span>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'Expression'
  })
export default class Expression extends Vue {
  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem:any;

  @Prop() value: any;

  connects: any[] = [
    { name: '所有条件都必须满足', value: '&&' },
    { name: '任意一条满足即可', value: '||' }
  ];
  form: Apps.Workflow.LineConditions = {
    connection: '&&',
    ruleList: []
  };
  /* 规则可选列表，acceptTypes: 0短文本，2数值 */
  rules: any[] = [
    { name: '等于', value: '==', acceptTypes: [0, 2] },
    { name: '大于', value: '>', acceptTypes: [2] },
    { name: '小于', value: '<', acceptTypes: [2] },
    { name: '大于等于', value: '>=', acceptTypes: [2] },
    { name: '小于等于', value: '<=', acceptTypes: [2] },
    { name: '不等于', value: '!=', acceptTypes: [2] },
    { name: '包含', value: 'Contains', acceptTypes: [0] },
  ];

  mounted() {
    this.Init(this.value.expression);
  }

  Init(ctx: string) {
    /* 解析传入的表达式数据 */
    if (!ctx) return;
    if (/&&/.test(ctx)) {
      this.form.connection = '&&';
    } else if (/\|\|/.test(ctx)) {
      this.form.connection = '||';
    }
    const _expressions = ctx.split(this.form.connection);
    if (_expressions.length) {
      const _patternTxt: RegExp = /^\{(.+?)\}(==|>|<|>=|<=|!=)"(.+?)"$/;
      const _patternNum: RegExp = /^\{(.+?)\}(==|>|<|>=|<=|!=)(\d+(\.\d+)?)$/;
      const _contains: RegExp = /^Contains\({(.+?)},"(.+?)"\)$/;
      const list:Array<Apps.Workflow.LineConditionItem> = [];
      _expressions.forEach((exp: string) => {
        if (_patternTxt.test(exp)) {
          const arr: any = exp.match(_patternTxt);
          const [dataItemCode, rule, txt] = arr.slice(1);
          let valueType = '';
          let text = txt;
          if (rule === '==') {
            /* 判断是哪一种数据类型 */
            const it:Apps.Datamodel.ChildeDataItem = this.dataItems.find((item: Apps.Datamodel.ChildeDataItem) => item.code === dataItemCode);
            valueType = it ? `${it.propertyType}` : '2';
          } else {
            const r: any = this.rules.find((rul: any) => rul.value === rule);
            valueType = r ? `${r.acceptTypes[0]}` : '2';
          }
          if (valueType === '2') {
            text = txt.replace(/"/g, '');
          }
          list.push({
            dataItemCode,
            rule,
            text,
            valueType
          });
        } else if (_patternNum.test(exp)) {
          const arr: any = exp.match(_patternNum);
          const [dataItemCode, rule, number] = arr.slice(1);
          const valueType = '2';
          const text = number.replace(/"/g, '');
          list.push({
            dataItemCode,
            rule,
            text,
            valueType
          });
        } else if (_contains.test(exp)) {
          const crr: any = exp.match(_contains);
          // console.log('包含表达式：', crr);
          const [e, dataItemCode, text]= crr;
          list.push({
            dataItemCode,
            rule: 'Contains',
            text,
            valueType: '0'
          });
        }
      });
      this.form.ruleList = list;
    }
  }

  /* Methods */
  addItem() {
    const _item: Apps.Workflow.LineConditionItem = {
      dataItemCode: '',
      rule: '==',
      text: '',
      valueType: '', // 输入数据项类型： 短文本'0' 数值'2'
      errorMsg: '', // 输入有误时的错误提示
    };
    this.form.ruleList.push(_item);
    this.$nextTick(() => {
      /* 聚焦到底部 */
      const dom: any = this.$refs.addButton;
      dom.scrollIntoView();
    });
  }
  popItem(idx: number) {
    this.form.ruleList.splice(idx, 1);
  }

  /* 根据当前条目的数据类型，过滤对应的运算规格 */
  filteRuleList(item: Apps.Workflow.LineConditionItem) {
    if (item && item.valueType) {
      return this.rules.filter((r: any) => r.acceptTypes.includes(+item.valueType));
    }
    return this.rules;
  }
  /* 根据当前已选数据项，筛选可选数据项，每个数据项只能被添加一次 */
  filteDataList(item: Apps.Workflow.LineConditionItem) {
    // 迭代24 一个条件支持配置多次 by John
    return this.dataItems;
    let selected = this.form.ruleList.map((r: Apps.Workflow.LineConditionItem) => r.dataItemCode);
    if (item && item.dataItemCode) {
      selected = selected.filter((code: string) => code !== item.dataItemCode);
    }
    return this.dataItems.filter((data: Apps.Datamodel.ChildeDataItem) => !selected.includes(data.code));
  }

  onDataItemChange(code: any, item: Apps.Workflow.LineConditionItem) {
    // console.log(code, item);
    const _data:Apps.Datamodel.ChildeDataItem = this.dataItems.find((d:Apps.Datamodel.ChildeDataItem) => d.code === code);
    item.valueType = `${_data.propertyType}`;
    item.rule = '';
    item.text = '';
  }

  validate(item: Apps.Workflow.LineConditionItem) {
    /* 校验条目输入框内容 */
    let err = '';
    if (!item.text && item.valueType) {
      err = '请输入内容';
    }
    if (
      item.valueType === '2'
      && !/^\d+(\.\d+)?$/.test(item.text)) {
      err = '请输入数值';
    }
    item.errorMsg = err;
    // if (item.dataItemCode) {
    //   this.getExpression();
    // }
  }

  clearValidate() {
    this.form.ruleList.forEach((item: Apps.Workflow.LineConditionItem) => { item.errorMsg = ''; });
  }

  /* 数据项可选列表 */
  get dataItems() {
    /* TODO: 此处的判断是否为短文本/数值类型的数据项为临时用法，暂无法清楚是怎么判定短文本/数值控件类型的数据项 */
    return this.WorkflowDataItem.filter((item: Apps.Datamodel.ChildeDataItem) => ['0', '2'].includes(`${item.propertyType}`) && item.published);
  }

  /* 组件的合并结果 */
  getExpression() {
    return new Promise((resolve, reject) => {
      const hasError = this.form.ruleList.some((item: Apps.Workflow.LineConditionItem) => (!!item.errorMsg || !item.text || !item.rule));
      if (hasError) {
        // this.$emit('input', { ...this.value, expression: '' });
        this.$message.warning('请检查表达式是否填写完整');
        reject();
        return;
      }

      if (!this.form.ruleList.length) {
        this.$emit('input', { ...this.value, expression: '' });
        resolve('');
        return;
      }

      const _results = this.form.ruleList.map((item: Apps.Workflow.LineConditionItem) => {
        if (item.rule === 'Contains') {
          return `${item.rule}({${item.dataItemCode}},"${item.text}")`;
        } else if (item.valueType === '2') {
          return `{${item.dataItemCode}}${item.rule}${item.text.replace(/"/g, '')}`;
        }
        return `{${item.dataItemCode}}${item.rule}"${item.text}"`;
      });
      const _express = _results.join(this.form.connection);
      this.$emit('input', {
        ...this.value,
        expression: _express
      });
      resolve(_express);
    });
  }
}
</script>
<style lang="less" scoped>
.condition-panel {
  &-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  h3 {
    margin-top: 24px;
    margin-bottom: 0;
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #fafafa;
    border-bottom: 1px solid #e8e8e8;
  }
}
.connection-select {
  width: 307px;
}
.condition-box {
  // max-height: 250px;
  max-height: calc(100vh - 390px);
  min-height: 32px;
  overflow: auto;
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    border-bottom: 1px solid #e8e8e8;
  }
  .select-item {
    width: 136px;
    margin-left: 16px;
  }
  .input-item {
    width: 280px;
    margin-left: 16px;
    margin-right: 16px;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    &[type="number"]{
      -moz-appearance: textfield;
    }
  }
  .delete {
    display: inline-flex;
    padding: 12px 16px;
    cursor: pointer;
  }
  .add {
    margin-top: 8px;
    text-align: center;
    color: @primary-color;
    span {
      cursor: pointer;
    }
  }
}
</style>
