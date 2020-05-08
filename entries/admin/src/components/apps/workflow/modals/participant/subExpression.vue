<template>
  <a-radio-group
    v-model="findType"
    class="subexpression-group"
    @change="setExpress"
  >
    <h3>按经理查找</h3>
    <!-- 按部门经理查找 -->
    <a-radio :value="OUManager.formula">
      <span class="middle">查找</span>
      <a-select
        v-model="OUManager.param"
        placeholder="请选择"
        @change="selectParam($event,OUManager)"
      >
        <a-select-option
          v-for="(item, idx) in childSheetUserList"
          :key="idx"
          :value="item.value"
        >{{ `${item.label}${ item.code ? '{'+item.code+'}' : '' }` }}</a-select-option>
      </a-select>
      <span class="middle">部门经理</span>
    </a-radio>
    <!-- 按角色查找 -->
    <h3>按角色查找</h3>
    <a-radio :value="FindUserByRole.formula">
      <span class="middle">根据</span>
      <a-select
        v-model="FindUserByRole.param"
        placeholder="请选择"
        @change="selectParam($event,FindUserByRole)"
      >
        <a-select-option
          v-for="(item, idx) in childSheetUserList"
          :key="idx"
          :value="item.value"
        >{{ `${item.label}${ item.code ? '{'+item.code+'}' : '' }` }}</a-select-option>
      </a-select>
      <span class="middle">查找角色为</span>
      <role-tree :selected="FindUserByRole.role" @select="selectRole"/>
      <span class="middle">的成员</span>
    </a-radio>
    <!-- 按数据项查找 -->
    <h3>按数据项查找</h3>
    <a-radio :value="FindUserByDataItem.formula">
      <span class="middle">查找</span>
      <a-select
        class="data-select"
        v-model="FindUserByDataItem.param"
        @change="selectParam($event,FindUserByDataItem)"
      >
        <a-select-option
          v-for="sheet in childSheetUserList"
          :value="sheet.value"
          :key="sheet.value"
        >{{ `${sheet.label}${ sheet.code ? '{'+sheet.code+'}' : '' }` }}</a-select-option>
      </a-select>
    </a-radio>
  </a-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import RoleTree from '@/components/apps/workflow/base/roleTree.vue';
import Bus from '@/utils/bus';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'SubExpression',
  components: {
    RoleTree,
  }
})
export default class SubExpression extends Vue {
  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem: any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @Prop() value: any;

  /* 查找类型 */
  findType: string = '';

  /* 按部门经理查找 */
  OUManager: any = {
    formula: 'OUManager',
    param: ''
  };

  /* 按角色查找 */
  FindUserByRole: any = {
    formula: 'FindUserByRole',
    param: '',
    role: ''
  };

  /* 按数据项查找 */
  FindUserByDataItem: any = {
    formula: 'FindUserByDataItem',
    param: '',
  };

  get childSheetUserList() {
    const UserData:any = [];
    const triggerMapping = this.curActivityProps.commonSettings.triggerMappingObj;
    const childSheetCode = triggerMapping ? triggerMapping.code : '';

    const childSheet = this.WorkflowDataItem.filter((item: Apps.Datamodel.ChildeDataItem) => `${item.propertyType}` === '8' && item.published && item.code === childSheetCode);
    childSheet.forEach((item: any) => {
      if (item.subSchema && item.subSchema.properties) {
        item.subSchema.properties.forEach((subItem: any) => {
          if (`${subItem.propertyType}` === '5' && subItem.published) {
            UserData.push({
              label: `${item.name}.${subItem.name}`,
              value: `${item.code}.${subItem.code}`,
              code: `${item.code}.${subItem.code}`
            });
          }
        });
      }
    });
    return UserData;
  }

  mounted() {
    if (/^\{(.+?)\}$/.test(this.value.subExpression)) {
      this.findType = 'FindUserByDataItem';
      this.$set(this, 'FindUserByDataItem', {
        formula: 'FindUserByDataItem',
        param: this.value.subExpression.replace('{', '').replace('}', ''),
      });
      Bus.$emit('changeFormulaRole', '');
    }
    if (!this.value.subExpression || !/^([a-zA-Z]+)\((.+?)\)$/.test(this.value.subExpression)) {
      Bus.$emit('changeFormulaRole', '');
      return;
    }
    this.judgeType(this.value.subExpression);
  }

  judgeType(ctx: string) {
    const arr: any = ctx.match(/^([a-zA-Z]+)\((.+?)\)$/);
    if (!Array.isArray(arr) || arr.length < 3) {
      return;
    }
    const [none, formula, param] = arr;
    this.findType = formula;
    if (formula === 'FindUserByRole') {
      const role = param.split(',')[1].replace(/"/g, '');
      this.$set(this, `${formula}`, {
        formula,
        param: param.split(',')[0].replace(/[{}]/g, ''),
        role
      });
      Bus.$emit('changeFormulaRole', this.FindUserByRole.role);
    } else {
      this.$set(this, `${formula}`, {
        formula,
        param: param.replace(/[{}]/g, ''),
      });
      Bus.$emit('changeFormulaRole', '');
    }
  }

  selectParam(value: string, target: any) {
    this.$set(target, 'param', value);
    this.setExpress();
  }

  selectRole(value: any[]) {
    const [group, role] = value;
    this.FindUserByRole.role = role || '';
    this.findType = 'FindUserByRole';
    this.setExpress();
  }

  setExpress() {
    this.$nextTick(() => {
      const vm: any = this;
      const _res: any = vm[`${this.findType}`];
      let _express: string = `${_res.formula}()`;
      if (_res && _res.param) {
        if (this.findType === 'FindUserByRole' && _res.role) {
          _express = `${_res.formula}({${_res.param}},"${_res.role}")`;
        } else if (this.findType === 'FindUserByDataItem') {
          _express = `{${_res.param}}`;
        } else {
          _express = `OUManager({${_res.param}})`;
        }
      }
      console.log('表达式结果：', _express);
      this.$emit('input', { ...this.value, subExpression: _express });
    });
  }
}
</script>
<style lang="less" scoped>
.subexpression-group {
  // height: 492px;
  /deep/.ant-radio-wrapper {
    display: block;
    margin-bottom: 16px;
    .middle {
      margin-top: 4px;
    }
    .data-select{
      width: 593px;
    }
  }
  /deep/.ant-select,
  /deep/.ant-cascader-picker {
    width: 200px;
    margin: 0 8px;
    vertical-align: middle;
  }
  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    margin-top: 24px;
    &:first-of-type {
      margin-top: 0;
    }
  }
}
</style>
