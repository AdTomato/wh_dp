<template>
  <div class="formula-wrap">
    <section class="formula-left">
      <formula-tree @select="selectItem"/>
    </section>
    <section class="formula-right">
      <div class="formula-editor">
        <textarea
          v-model="content"
          ref="editor"
          @blur="setPointerLocale"
          @change="setExpress"
        />
      </div>
      <div class="formula-description">{{ description || placeholder }}</div>
    </section>
  </div>
</template>
<script lang="ts">
/*
 * {} 包裹数据项
 * xxx(,) / xxx() 为函数
 */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import FormulaTree from '@/components/apps/workflow/base/formulaTree.vue';

const DataModelModule = namespace('Apps/DataModel');
const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'Formula',
  components: {
    FormulaTree
  }
})
export default class Formula extends Vue {
  @DataModelModule.State('bizSchemaCode') schemaCode: any; // 当前的业务模型schemaCode

  @WorkflowModule.Action('getFormulaTree') getFormulaTree: any;

  // 原始的函数数据
  @Prop() value: any;
  // 指定编辑的类型： 参与者函数participant/条件设置函数condition
  @Prop() type?: string;
  // 所有函数方法的描述合集
  @Prop() descriptions!: Apps.Workflow.FormulaDescription[];
  // 描述占位文字
  @Prop() placeholder!: string;

  // 获取不同类型的数据时，判定函数的分支的code
  _formulaCodes: object = {};
  _formulaCode: string = '';

  // 编辑的函数内容
  content: string = '';
  // 函数描述
  description: string = '';
  // 编辑器DOM节点
  dom: any = null;
  // 当前编辑器光标位置
  cursorPosition: number = 0;

  mounted() {
    this.dom = this.$refs.editor;
    this.content = this.value.formula || '';
    this.cursorPosition = this.content.length;
    const _type:string = this.type || 'participant';
    const _formulaCodes:any = {
      participant: 'participant',
      condition: 'function',
    };
    this._formulaCode = _formulaCodes[_type];
    this.init(_type);
  }

  init(type: string) {
    const params: Apps.Workflow.FormulaParams = {
      schemaCode: this.schemaCode,
      type
    };
    this.getFormulaTree(params);
  }

  // choose item
  selectItem(info: any) {
    const {
      isLeaf, expression, parentCode, code
    } = info;
    if (isLeaf) {
      this.addContent(expression, parentCode);
      this.setDescription(code);
    } else {
      this.description = '';
    }
  }

  // 设置描述
  setDescription(code: string) {
    const res: Apps.Workflow.FormulaDescription | undefined = this.descriptions.find((item: Apps.Workflow.FormulaDescription) => item.code === code);
    if (res) {
      console.log(res);
      this.description = res.text;
    } else {
      this.description = '';
    }
  }

  // 记录光标位置
  setPointerLocale() {
    this.cursorPosition = this.dom.selectionEnd;
  }

  // 往编辑区添加内容
  addContent(ctx: string, parent: any) {
    if (!ctx) {
      return;
    }
    if (parent && parent === this._formulaCode) {
      // 添加函数：自动追加到当前内容的尾部
      if (/\(/.test(ctx)) {
        const _offset = ctx.split('(')[0].length + 1;
        this.cursorPosition = this.content.length + _offset + (this.content.length ? 1 : 0);
      }
      this.content += `${this.content.length ? '+' : ''}${ctx}`;
    } else {
      /* 光标在文本内部：判断前后是否为函数体或有+号连接 */
      const _preCtx = this.content.substring(0, this.cursorPosition);
      const _nextCtx = this.content.substring(this.cursorPosition);
      if (/\($/.test(_preCtx)) {
        /* 当前光标处于函数体内：前有（ ——直接插入内容即可 */
        this.content = _preCtx + ctx + _nextCtx;
        this.cursorPosition += ctx.length;
      } else {
        /* 光标前后是否有“+”号 */
        const _prePlus:boolean = /[+,]$/.test(_preCtx);
        const _nextPlus:boolean = /^[+),]/.test(_nextCtx);
        const _preSymbol:string = (_preCtx.length && !_prePlus) ? '+' : '';
        const _nextSymbol:string = (_nextCtx.length && !_nextPlus) ? '+' : '';
        const _resCtx = _preSymbol + ctx + _nextSymbol;
        /* 拼接内容 */
        this.content = _preCtx + _resCtx + _nextCtx;
        /* 重定位光标 */
        this.cursorPosition += _resCtx.length;
      }
    }

    this.$nextTick(() => {
      this.dom.focus();
      this.dom.setSelectionRange(this.cursorPosition, this.cursorPosition);
      this.setExpress();
    });
  }

  // 内容变化时传到父级
  setExpress() {
    this.$emit('input', { ...this.value, formula: this.content.replace(/\s/g, '').replace(/\n/g, '') });
  }
}
</script>
<style lang="less" scoped>
.formula-wrap {
  display: flex;
  justify-content: flex-start;
  min-height: 200px;
  height: calc(490 / 768 * 100 * 1vh - 15px);
  width: 100%;
  overflow: hidden;
  .formula-left {
    display: block;
    flex: none;
    width: 300px;
    height: 100%;
    // max-height: 490px;
    overflow: auto;
    background-color: #f8f8f8;
  }
  .formula-right {
    flex: 1;
    width: 400px;
    height: 100%;
    padding: 8px 16px;
    background-color: #fff;
    position: relative;
  }
  .formula-editor {
    height: 100%;
    min-height: calc(100% - 125px);
    max-height: calc(100% - 125px);
    margin-bottom: 10px;
    textarea {
      width: 100%;
      height: 100%;
      border: none;
      resize: none;
      outline: none;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,0,0,0.85);
      line-height:22px;
    }
  }
  .formula-description {
    position: absolute;
    bottom: 8px;
    left: 0;
    width: 100%;
    padding: 0 16px;
    max-height: 120px;
    height: auto;
    line-height:20px;
    font-size:12px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.45);
    overflow: auto;
    word-break: break-all;
  }
}
</style>
