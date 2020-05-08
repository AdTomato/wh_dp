<template>
  <a-modal
    :title="$t('languages.Apps.FormDesignPage.Calculation')"
    :visible="true"
    width="612px"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @cancel="closeModal"
    @ok="backData"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="calculate-rule">
      <div class="data-item clearfix">
        <div class="title">
          <span>{{ $t('languages.Apps.FormDesignPage.DataItem') }}:</span>
        </div>
        <div>
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="dataItemChange"
          >
            <a-select-option
              v-for="(dataitem, i) in dataItems"
              :key="i"
              :value="dataitem.code"
            >{{ `${dataitem.name}[${dataitem.code}]` }}</a-select-option>
          </a-select>
        </div>
        <div>
          <a-button @click="pushDataItem">{{ $t('languages.Apps.FormDesignPage.Insert') }}</a-button>
        </div>
      </div>
      <div class="btn-group">
        <ul class="clearfix">
          <li v-for="(symbol, i) in symbolList" :key="i" @click="symbolBtnClick(symbol)">
            <a-button>{{ symbol }}</a-button>
          </li>
        </ul>
      </div>
      <div class="btn-group">
        <ul class="clearfix sum">
          <li v-for="(rule, i) in ruleList" :key="i" @click="ruleBtnClick(rule)">
            <a-button>{{ rule }}</a-button>
          </li>
        </ul>
      </div>
      <div class="text-area">
        <!-- <a-textarea
          v-model="ruleString"
          ref="ruletextarea"
          @click="getCursorIndex"
          @change="getCursorIndex"
        ></a-textarea> -->
        <div
          ref="ruleHTMLRef"
          :id="contentId"
          class="ant-input"
          contenteditable="true"></div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

import * as dataitemStore from "../stores/data-items.store-helper";

// 文字转图片
function textBeComeImg (text: string, fontColor:string='#1890ff', fontSize:number=16) {
      var canvas = document.createElement('canvas');
    //小于32字加1  小于60字加2  小于80字加4    小于100字加6
    let $buHeight = 0;
    if(fontSize <= 32){ $buHeight = 1.2; }
    else if(fontSize > 32 && fontSize <= 60 ){ $buHeight = 2;}
    else if(fontSize > 60 && fontSize <= 80 ){ $buHeight = 4;}
    else if(fontSize > 80 && fontSize <= 100 ){ $buHeight = 6;}
    else if(fontSize > 100 ){ $buHeight = 10;}
    //对于g j 等有时会有遮挡，这里增加一些高度
    canvas.height=fontSize + $buHeight ;
    var context:any = canvas.getContext('2d');
    // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
    context.fillStyle = fontColor;
    context.font=fontSize+"px PingFangSC-RegularPingFangSC-Regular";
    context.textBaseline = 'middle';
    context.fillText(text,0,fontSize/2)

    canvas.width = context.measureText(text).width;
    context.fillStyle = fontColor;
    context.font=fontSize+"px PingFangSC-Regular";
    context.textBaseline = 'middle';
    context.fillText(text,0,fontSize/2)
    // context.clearRect(0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');//注意这里背景透明的话，需要使用png
}

interface IruleArr {
  type: 'string'|'img' // ruleHTML中元素类型
  val: string, // ruleHTML中元素内容
  len: number, // ruleHTML中元素长度
  data?: any // IMG类型 完整数据
  id?: string
}
var ruleHTMLNode: any = ''
@Component({
  name: "CalculateRule"
})
export default class CalculateRule extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;
  /** 全部的 */
  /**
   * notUsed 未使用
   */
  get dataItemCodeList() {
    const codeArr: any[] = [];
    const length: number = this.items.length;
    for (let i = 0; i < length; i += 1) {
      codeArr.push(this.items[i].code);
    }
    return codeArr;
  }
  get items() {
    // const initiallyArr = dataitemStore
    //   .getDataItems(this)
    //   .filter((res: any) => res.published);
    // 取消只显示发布后的数据项
    const initiallyArr = dataitemStore.getDataItems(this);
    const dataArr = JSON.parse(JSON.stringify(initiallyArr));
    const targetArr: any[] = [];
    const length: number = dataArr.length | 0;
    for (let i = 0; i < length; i += 1) {
      targetArr.push(dataArr[i]);
      if (dataArr[i].type === 8 && dataArr[i].properties) {
        const parentCode: string = dataArr[i].code;
        const subDataItem = dataArr[i].properties as any;
        const subLength: number = subDataItem.length | 0;
        for (let j = 0; j < subLength; j += 1) {
          subDataItem[j].code = `${parentCode}.${subDataItem[j].code}`;
          targetArr.push(subDataItem[j]);
        }
      }
    }
    return targetArr.filter((res: any) => res.type === 2);
  }
  ruleList: Array<string> = ["SUM", "AVG", "MAX", "MIN", "COUNT"];
  symbolList: Array<string> = ["+", "-", "*", "/", "(", ")"];
  ruleString: string = "";
  textArea: any = null;
  cursorIndex: any = null;
  dataItems: Array<Apps.Datamodel.DataItem> = [];
  selectDataItem: any = "";
  ruleHTML: any = ""
  ruleArr:IruleArr[] = []
  created() {
    this.dataItems = this.items as any;
    /**
     * 赋予默认值
     */
    let s = this.testRuleString("(sum({Sheet1576827530223.Number1576827532565})+avg({Sheet1576827530223.Number1576827542393})-max({Sheet1576827530223.Number1576827550259}))*{Number1576827505238}/{Number1576827508702}+count({Sheet1576827530223.Number1576827532565})-6+min(3，2，5)")
    console.log('测试:', s)
  }
  /**
   * @Author: Fan
   * @Description: 解析字符串,插入ruleNode中
   * @param {type} string
   * @Date: 2019-12-20 14:41:53
   */
  parseStringToNode(str) {
    let tempType = ''
    let tempStr = ''
    for (let s of str.split('')) {
      if(s === '{') {
        if (tempType === 'text' && !!tempStr) {
          ruleHTMLNode.insertAdjacentText('beforeend',tempStr)
        }
        tempType = 'img';
        tempStr = ''
      } else if (s === '}') {
        if (tempType === 'img') {
          let d = this.dataItems.filter( (item) => item.code === tempStr)
          if (d.length) {
            let dataItem = d[0]
            let imgID = Math.ceil(Math.random() * 1000)+dataItem.code
            let imgSrc = textBeComeImg(dataItem.name)
            let imgNode = `<img src="${imgSrc}" id="${imgID}" data-val='{${dataItem.code}}'>`;
            ruleHTMLNode.insertAdjacentHTML('beforeend',imgNode)
            tempType = '';
            tempStr = ''
          } else {
            ruleHTMLNode.insertAdjacentText('beforeend','{'+tempStr+'}')
            tempType = '';
            tempStr = ''
          }
        } else {
          tempType = 'text'
          tempStr += '}'
        }
      } else {
        if (!tempType) {
          tempType = 'text'
        }
        tempStr += s
      }
    }
    if (tempStr) {
      ruleHTMLNode.insertAdjacentText('beforeend',tempStr)
    }
  }
  mounted() {
    document.addEventListener('selectionchange', this.selectHandler);
    ruleHTMLNode = document.getElementById(this.contentId)
    const data = this.modalData.data;
    if (data && data.value) {
      console.log('created => ', data.value)
      this.parseStringToNode(data.value)
    }
  }
  /**
   * 数据项切换
   */
  dataItemChange(val: any) {
    let item = this.dataItems.filter((v:any) => (v.code === val))[0]
    this.selectDataItem = item;
  }
  /**
   * 将数据推送到工公式
   */
  // pushDataItem() {
  //   if (this.selectDataItem) {
  //     let cursorIndex: number = 0;
  //     const strStart: string = this.ruleString.slice(0, this.cursorIndex);
  //     const strEnd: string = this.ruleString.slice(this.cursorIndex);
  //     this.ruleString = `${strStart}{${this.selectDataItem}}${strEnd}`;
  //     cursorIndex = strStart.length + this.selectDataItem.length + 2;
  //     setTimeout(() => {
  //       this.setCursorPosition(this.textArea.$el, cursorIndex);
  //       this.getCursorIndex();
  //     }, 10);
  //   }
  // }
  pushDataItem() {
    if (this.selectDataItem) {
        let imgID = Math.ceil(Math.random() * 1000)+this.selectDataItem.code
        let imgSrc = textBeComeImg(this.selectDataItem.name)
      if (!!this.savedRange.commonAncestorContainer) {
        // let start = this.savedRange.startOffset
        // let end = this.savedRange.endOffset
        let imgNode = document.createElement('img')
        imgNode.src = imgSrc
        imgNode.id = imgID
        imgNode.dataset.val = `{${this.selectDataItem.code}}`
        this.savedRange.insertNode(imgNode)
        this.savedRange.collapse(true)
      } else {
        let imgNode = `<img src="${imgSrc}" id="${imgID}" data-val='{${this.selectDataItem.code}}'>`;
        ruleHTMLNode.insertAdjacentHTML('beforeend',imgNode)
      }
    }
  }
  // symbolBtnClick(symbol: string) {
  //   let cursorIndex: number = 0;
  //   if (this.cursorIndex && this.cursorIndex !== null) {
  //     const strStart: string = this.ruleString.slice(0, this.cursorIndex);
  //     const strEnd: string = this.ruleString.slice(this.cursorIndex);
  //     this.ruleString = `${strStart}${symbol}${strEnd}`;
  //     cursorIndex = strStart.length + symbol.length;
  //   } else {
  //     this.ruleString = `${this.ruleString}${symbol}`;
  //     cursorIndex = this.ruleString.length;
  //   }
  //   setTimeout(() => {
  //     this.setCursorPosition(this.textArea.$el, cursorIndex);
  //     this.getCursorIndex();
  //   }, 10);
  // }

  symbolBtnClick(symbol: string) {
    if(!!this.savedRange.commonAncestorContainer) {
      let textNode = document.createTextNode(symbol)
      this.savedRange.insertNode(textNode)
      this.savedRange.collapse(true)
    } else {
      ruleHTMLNode.insertAdjacentText('beforeend',symbol)
    }
  }
  /**
   * 设置光标位置
   */
  setCursorPosition(ctrl: any, pos: any) {
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  }
  /**
   * 添加计算按钮
   */
  // ruleBtnClick(rule: string) {
  //   const ruleStr = rule.toLowerCase();
  //   let cursorIndex: number = 0;
  //   if (this.cursorIndex && this.cursorIndex !== null) {
  //     const strStart: string = this.ruleString.slice(0, this.cursorIndex);
  //     const strEnd: string = this.ruleString.slice(this.cursorIndex);
  //     this.ruleString = `${strStart}${ruleStr}()${strEnd}`;
  //     cursorIndex = strStart.length + ruleStr.length + 2;
  //   } else {
  //     this.ruleString = `${this.ruleString}${ruleStr}()`;
  //     cursorIndex = this.ruleString.length;
  //   }
  //   setTimeout(() => {
  //     this.setCursorPosition(this.textArea.$el, cursorIndex - 1);
  //     this.getCursorIndex();
  //   }, 10);
  // }
  ruleBtnClick(rule: string) {
    if(!!this.savedRange.commonAncestorContainer) {
      let textNode = document.createTextNode(`${rule.toLowerCase()}()`)
      this.savedRange.insertNode(textNode)
      this.savedRange.collapse(true)
    } else {
      ruleHTMLNode.insertAdjacentText('beforeend',`${rule.toLowerCase()}()`)
    }
  }
  /**
   * 获取鼠标光标下标
   */
  getCursorIndex() {
    this.cursorIndex = this.textArea.$el.selectionStart;
    console.log(this.textArea.$el.selectionStart);
  }
  backData() {
    let ruleString = this.formatterRuleHTML()
    console.info('formatterRuleHTML =>', ruleString, this.testRuleString(ruleString))
    if (!this.testRuleString(ruleString) && ruleString) {
      this.$message.error("计算规则不合法");
      return;
    }
    const backData = {
      value: ruleString
    };
    this.$emit("backData", backData);
  }
  /**
   * @Author: Fan
   * @Description: 将 ruleHTMLNode数据 格式话成字符串
   * @URL:http://redmine.h3bpm.com/issues/31177
   * @Date: 2019-12-20 13:48:11
   */
  formatterRuleHTML() {
    let str = ''
    for (let n of ruleHTMLNode.childNodes) {
      if (n.nodeName === 'IMG') {
        str += `${n.dataset.val}`
      } else if (n.nodeName === '#text' && !!n.textContent) {
        str += `${n.textContent}`
      }
    }
    return str
  }
  closeModal() {
    this.$emit("closeModal");
  }
  /**
   * 计算规则的校验
   */
  testRuleString(str: string) {
    // 聚合函数
    const obj: any = {
      sum: 1,
      avg: 1,
      max: 1,
      min: 1,
      count: 1
    };

    // 剔除空白符
    str = str.replace(/\s/g, "");

    // 错误情况，空字符串
    if (!str) {
      return false;
    }

    // 错误情况，运算符连续
    if (/[\+\-\*\/]{2,}/.test(str)) {
      return false;
    }
    // 不能以计算符号结尾 或开始
    if(/[\+\-\*\/]$/.test(str) || /^[\+\-\*\/]/.test(str)) {
      return false
    }

    // 错误情况，数据项连续 {}{}
    if (/\}\{/.test(str)) {
      return false;
    }

    // 空括号
    if (/\(\)/.test(str)) {
      return false;
    }
    // 输入的字符中 不能含有'，'否则 h3-form中的 语句解析会报错
    if (/，/.test(str)) {
      return false
    }

    // 错误情况，括号不配对
    const stack: any[] = [];
    for (let i = 0, item; i < str.length; i += 1) {
      item = str.charAt(i);
      if ("(" === item) {
        stack.push("(");
      } else if (")" === item) {
        if (stack.length > 0) {
          stack.pop();
        } else {
          return false;
        }
      }
    }
    if (0 !== stack.length) {
      return false;
    }

    // 错误情况，(后面是运算符
    if (/\([\+\-\*\/]/.test(str)) {
      return false;
    }

    // 错误情况，)前面是运算符
    if (/[\+\-\*\/]\)/.test(str)) {
      return false;
    }
    //花括号为空
    if (/\{\}/.test(str)) {
      return false;
    }
    //错误情况，花括号不配对
    const bstack: any[] = [];
    for (let i = 0, bitem; i < str.length; i++) {
      bitem = str.charAt(i);
      if ("{" === bitem) {
        bstack.push("{");
      } else if ("}" === bitem) {
        if (bstack.length > 0) {
          bstack.pop();
        } else {
          return false;
        }
      }
    }
    if (0 !== bstack.length) {
      return false;
    }
    // 错误情况，变量没有来自“待选公式变量”
    var tmpStr = str
      .replace(/\{.*?\}/g, "")
      .replace(/[\{\}\(\)\+\-\*\/]{1,}/g, "`");
    var array = tmpStr.split("`");
    for (var i = 0, item; i < array.length; i++) {
      item = array[i];
      if (/[A-Z]/i.test(item) && "undefined" === typeof obj[item]) {
        return false;
      }
    }
    //提取code,检查code 是否存在（已发布）
    const codeStack: any[] = [];
    const arr: any = str.match(/\{(.+?)\}/g);
    const arrCode = this.dataItemCodeList;
    for (var j = 0, len = arr.length; j < len; j++) {
      const strTwo: string = arr[j].replace(/^\{|\}$/g, "");
      if (arrCode.indexOf(strTwo) === -1) {
        return false;
      }
      codeStack.push(strTwo);
    }
    //TODO 数组codeStack 处理，调用接口
    console.log(codeStack);
    // 校验输入的内容格式是否正确
    var sss = str.replace(/(sum)|(avg)|(max)|(min)|(count)/g, "C");
    sss = sss.replace(/\{(.+?)\}/g, "N");
    sss = sss.replace(/\d+/g, "N");
    while (/C\(N(,N)*\)/.test(sss)) {
      sss = sss.replace(/C\(N(,N)*\)/g, "N");
    }
    var stack_arr:string[] = [];
    console.log(sss)
    for (let _i = 0, l = sss.length; _i < l; _i++) {
      let c:string = sss[_i];
      if (c === "(") {
        stack_arr.push("(");
      } else if (c === "N") {
        if (stack_arr.length === 0) {
          stack_arr.push("N");
        } else {
          let _len = stack_arr.length;
          let _pre = stack_arr[_len - 1];
          if (~["+", "-", "*", "/"].indexOf(_pre) && stack_arr[_len - 2] === "N") {
            stack_arr.splice(_len - 2, 2, "N");
          } else {
            stack_arr.push("N");
          }
        }
      } else if (~["+", "-", "*", "/"].indexOf(c)) {
        stack_arr.push(c);
      } else if (c === ")") {
        let _len = stack_arr.length;
        let _pre = stack_arr[_len - 1];
        if (_pre === "N" && stack_arr[_len - 2] === "(") {
          stack_arr.splice(_len - 2, 2, "N");
        }
      } else {
        stack_arr.push(c);
      }
    }
    console.log(stack_arr)
    if (stack_arr.length === 1 && stack_arr[0] === "N") {
      return true
    } else {
      return false
    }
    return true;
  }

  contentId = `content${this.getGuid()}`
  savedRange:any = {}
  getGuid() {
    // 生成随机ID
    return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
  }
  selectHandler() {
    // 监听选定文本的变动
    let sel = window.getSelection();

    let range:any = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    if (
      !!range &&
      range.commonAncestorContainer &&
      range.commonAncestorContainer.ownerDocument.activeElement.id === this.contentId
    ) {
      this.savedRange = range;
      !ruleHTMLNode && (ruleHTMLNode=range.commonAncestorContainer)
    }
  }

}
</script>
<style lang="less" scoped>
.calculate-rule {
  .data-item {
    margin-bottom: 16px;
    & > div {
      float: left;
      .select {
        width: 308px;
        margin: 0 8px;
      }
    }
    /deep/.title {
      span {
        line-height: 32px !important;
      }
    }
  }
  .btn-group {
    margin-bottom: 16px;
    ul {
      &.sum {
        li {
          button {
            width: 56px;
          }
        }
      }
      li {
        float: left;
        margin-right: 16px;
        /deep/ button {
          padding: 0;
          width: 32px;
          text-align: center;
          span {
            line-height: 32px;
          }
        }
      }
    }
  }
  .text-area {
    & textarea, & > div.ant-input {
      width: 100%;
      height: 142px;
      border-radius: 4px;
    }
  }
}
</style>
