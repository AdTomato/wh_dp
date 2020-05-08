



<style lang="less">
  .custom-template-container {
    // 滚动
    height:100%;
    overflow:auto;

    // &::-webkit-scrollbar { width:0!important; height:0!important; }
    // 自动隐藏滚动条
    &::-webkit-scrollbar-thumb {
      background-color:rgba(0,0,0,.35)
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color:rgba(0,0,0,.5)
    }
    &.scrollbar-auto-hidding {
      &::-webkit-scrollbar-thumb {//滚动条的设置
        background-color:rgba(0, 0, 0, 0);
        // box-shadow:none;
      }
      &:hover::-webkit-scrollbar-thumb {
        background-color:rgba(0, 0, 0, 0.35);
      }
    }

    // 列表, 通用
    .table-container {
      position:relative;
      // 两侧固定, 根据位置变化显示阴影
      @fixedColumnShadow:inset 8px 0px 6px -6px rgba(0, 0, 0, 0.15);
      &:not([data-h-pos=h-left]) .fixed-left-column-last::after,
      &:not(.self-adaption):not([data-h-pos=h-right]) .fixed-right-column-last::after {
        box-shadow: @fixedColumnShadow;
      }
      // 最后一个调节栏在表格100%宽度时, 只能增大, 不能缩小; 图标也根据状态进行改变;
      &.self-adaption .table-head-wrapper .table-row-item:last-child .resize-bar {
        cursor:e-resize;
      }
      // 如果设置了不能调节列宽, 所有调节栏图标hover时呈现默认状态
      &.no-column-resizing .resize-bar {
        cursor:default!important;
      }

      // 通用
      .table-row {
        display:flex;
        flex-direction:row;
        min-height:37px;
        &:hover { background-color:#f0f7ff; }
        .table-row-item {
          position:relative;
          z-index:1;
          box-sizing:border-box;
          padding:8px;
          // padding-right:13px;
          white-space:nowrap;
          overflow:hidden;

          // 一列高度增加, 其他列自动扩展
          flex:0 1 auto;

          // &.colspan { flex:1 1 auto; }

          // 当行超出显示省略号
          border-bottom:1px solid #e8e8e8;

          // 序号列
          &-__ordinalNo {
            cursor:pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            min-width:48px;
          }
          //
          &.text-disabled {
            color:#ccc;
          }
          // 固定列
          &.fixed-left-column,
          &.fixed-right-column { position:sticky; -ms-position:aboslute; z-index:10; }
          @fixedColumnWidth:8px;
          &.fixed-left-column-last,
          &.fixed-right-column-last {
            overflow:visible!important;
            &::after {
              content: "\200B";
              height: 100%;
              width: @fixedColumnWidth;
              position: absolute;
              top: 0;
              z-index: 1;
              transition:box-shadow .3s ease;
              pointer-events:none;
            }
          }
          &.fixed-left-column-last::after {
            right: -@fixedColumnWidth;
          }
          &.fixed-right-column-last::after {
            left: -@fixedColumnWidth;
            transform:rotate(180deg);
          }
        }
        img { max-width:100%; }
      }
      // 可选 & 不可选
      .table-body-row .table-row-item-__ordinalNo{
        .row-serial-no { display:block; }
        .ant-checkbox-wrapper.checked +.row-serial-no { display:none; }
        .ant-checkbox-wrapper:not(.checked) { display:none; }
      }
      &.row-selectable {
        .table-body-row .table-row-item-__ordinalNo:hover {
          .ant-checkbox-wrapper { display:block; }
          .row-serial-no { display:none!important; }
        }
      }
    }

    // 表头
    .table-head-wrapper {
      &.fixed-top-header { position:sticky; z-index:20; }
      .table-row {
        .table-row-item {
          font-weight:600;
          background-color:#f8fbff;
          overflow:visible;
          transition:background-color 200ms;
          &.resizing {
            background-color:#e5effe;
          }
          .resize-bar {
            position:absolute; right:-5px; top:10%;
            width:11px; height:80%;
            background-color:rgba(0, 0, 0, 0.15);
            background-clip:content-box;
            border:5px solid transparent;
            cursor:col-resize;
          }
          &:last-child {
            padding-right:13px;
            .resize-bar {
              right:0;
            }
          }
        }
      }
    }
    // 表体
    .table-body-row {
      &:hover .table-row-item{ background:#f0f7ff; }
      &.unfinished .table-row-item:first-child::before {
        position:absolute; left:0; top:0;
        width:4px; height:100%;
        background-color:#FAAD14;
        content:'\200B';
      }
      .table-row-item {
        display:flex;
        flex-direction:column;
        justify-content:center;
        // height:100%;
        & > * {
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          // &:only-child {
          //   height:100%;
          // }
        }
        // & > div:only-child {
        //   display:flex;
        //   flex-direction:column;
        //   justify-content:center;
        // }
        background-color:#fff;

        .attachment-wrapper {
          // align-items:center;
          img, a {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            &:not(:first-child) { margin-top:4px; }
          }
        }

        // 普通项 hover
        // &:not(.text-disabled)
        .col-inner-wrapper:hover {
          cursor:pointer;
          color:#2970ff;
        }
      }
      // .table-row-item-__ordinalNo {
      //   // 默认显示序号, 隐藏"没被选择"的选择框
      //   .row-serial-no { display:block; }
      //   .ant-checkbox-wrapper.checked +.row-serial-no { display:none; }
      //   .ant-checkbox-wrapper:not(.checked) { display:none; }
      //   // .ant-checkbox-wrapper:not(.checked) + .row-serial-no { display:block; }
      //   // hover时显示选择框, 隐藏序号
      //   // &:hover {
      //     // .ant-checkbox-wrapper { display:block; }
      //     // .row-serial-no { display:none!important; }
      //   // }
      // }
    }
  }
</style>
<template>
  <div class="custom-template-container" :class="{'scrollbar-auto-hidding':tableConfig.scrollbarAutoHidding}">
    <!-- 列表容器 -->
    <div
      :class="[{'self-adaption':tableScrollWidth==='100%'}, ...tableData.additionalClasses]"
      :style="{ width:tableScrollWidth }"
      data-v-pos="v-top"
      data-h-pos="h-left"
    >
      <!-- 列表头 -->
      <div :class="tableData.thead.additionalClasses" :style="tableData.thead.style">
        <div
          v-for="(row,rowIdx) in tableData.thead.rows"
          :key="rowIdx"
          :class="row.additionalClasses"
          :style="row.style"
        >
          <div
            v-for="(col,colIdx) in row.cols"
            :key="colIdx"
            :class="col.additionalClasses"
            :style="{width:col.properties.width+'px', ...col.style}"
          >
            <!-- 首列为 序号&选择 -->
            <template v-if="tableConfig.rowOrdinal && tableConfig.rowSelectable && col.properties.id==='__ordinalNo'">
              <a-checkbox v-if="!tableData.tbody.rows.length" :checked="false" />
              <a-checkbox v-else-if="tableData.tbody.rows.every(r=>r.checked)" checked @change="rowSelection('cancelAll')"/>
              <a-checkbox v-else :indeterminate="tableData.tbody.rows.some(r=>r.checked)" @change="rowSelection('checkAll')"></a-checkbox>
            </template>
            <!-- 其他列输出 标题 -->
            <label v-else>{{ col.value }}</label>
          </div>
        </div>
      </div>
      <!-- 列表体 -->
      <div :class="tableData.tbody.additionalClasses" :style="tableData.tbody.style">
        <div
          v-for="(row,rowIdx) in tableData.tbody.rows"
          :key="rowIdx"
          :class="row.additionalClasses"
          :style="row.style"
        >
          <div
            v-for="(col,colIdx) in row.cols"
            :key="colIdx"
            :class="col.additionalClasses"
            :style="{width:(col.colspan?combineColsWidth(row,col):col.properties.width)+'px', ...col.style}"
          >
            <!-- 首列为 序号/选择 -->
            <div class="row-selection-box" v-if="tableConfig.rowOrdinal && col.properties.id==='__ordinalNo'">
              <a-checkbox :class="{checked:row.checked}" :checked="row.checked" @change="rowSelection('check',row)"></a-checkbox>
              <span class="row-serial-no">{{ row.__ordinalNo }}</span>
            </div>
            <!-- 如果是附件, 需要换取地址 -->
            <div v-else-if="col.properties.propertyType===6" class="attachment-wrapper">
              <a v-for="(atta,attaIdx) in col.value" :key="attaIdx" :href="atta.url" target="_blank" rel="noopener noreferrer" download>
                <template v-if="atta.isImage"><img :src="atta.url" :alt="atta.name"></template>
                <template v-else>{{atta.name}}</template>
              </a>
            </div>
            <!-- <div v-else-if="col.id==='custom-cols'" class="inner-table">
              {{ col.value }}
            </div> -->
            <!-- 其他字段作为字符串直接输出 -->
            <div v-else class="col-inner-wrapper" @click="pageVM.goForm(col.properties, rowIdx)">{{ col.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

// 默认模板 & 模板编译器
import listCustomTemplateConverter from '@cloudpivot/list/src/components/listCustom/template/pc/handler'
const vueCompiler = require('@cloudpivot/list/src/components/mobile/application-list/vueCompiler.build');

// 函数
// import common from '@cloudpivot/common';
// const { getRealValue } = common.utils.BusinessFunctions;
// 工具函数
import { renderer } from '@cloudpivot/form';


// ant-design
const Antd = require('h3-antd-vue');
Vue.use(Antd);

// 类型
interface TableData {
  thead:TableDataRowCategory;
  tbody:TableDataRowCategory;
  additionalClasses:string[];
  style?:object;
}
interface TableDataRowCategory {
  rows:TableDataRow[];
  additionalClasses:string[];
  style?:object;
}
interface TableDataRow {
  __ordinalNo?:number;
  checked?:boolean;
  cols:TableDataColItem[],
  additionalClasses:string[],
  style?:object;
}
interface TableDataColItem {
  value:any;
  properties:any;
  additionalClasses:string[],
  style?:object;
  colspan?:number;
}


// @@ 组件定义
@Component({
  name:'custom-template'
})
export default class listCustomTemplate extends Vue {

  // @@ 参数
  @Prop() pageVM:any;
  // @Prop() columns:any;
  @Prop() originalTableColumns:any;
  @Prop() originalTableData:any;
  @Prop() templateString:any;
  @Prop({
    default() {
      return {
        presentationType:'table',
        fixedHeader:true,
        fixedLeftColumns:['__ordinalNo'],
        fixedRightColumns:[],
        rowOrdinal:true,
        rowSelectable:true,
        columnResizable:true,
        scrollbarAutoHidding:true,
      }
    }
  }) tableConfig:any;


  // @@ 变量
  columns :any[] = [];
  // tableData:TableData;
  tableData :TableData = {
    additionalClasses:[],
    thead:{ rows:[], additionalClasses:[] },
    tbody:{ rows:[], additionalClasses:[] }
  };


  // @@ watching
  @Watch('originalTableColumns', {immediate: true})
  onOriginalTableColumnsChange(columns,oldColumns) {
    if ( !columns || !columns.length ) return;
    this.columns = this.serializeColumns();
  }
  @Watch('columns', {immediate: true})
  onColumnsChange(columns, oldColumns) {
    if ( !columns || !columns.length ) return;
    // console.log( '___________', columns?columns.length:'000', oldColumns?oldColumns.length:'111' );
    this.tableData = this.serializeTableData();
    this.$nextTick(this.initDomEvents);
  }
  @Watch('tableConfig', {immediate: true})
  onTableConfigChange(newVal:any, oldVal:any) {
    if ( !oldVal ) return;
    this.tableData = this.serializeTableData();
  }
  @Watch('originalTableData', {immediate: true})
  onOriginalTableDataChange(newVal:any, oldVal:any) {
    if ( !oldVal ) return;
    this.tableData = this.serializeTableData();
  }


  // @@ 数据序列化
  serializeColumns() {
    let originalTableColumns = this.originalTableColumns;
    let sle = { id:'__ordinalNo', width:48, vcTitle:'序号', type:1000 };
    let cls = this.tableConfig.rowOrdinal? [ sle,...originalTableColumns ]: [...originalTableColumns];
    return JSON.parse(JSON.stringify(cls));
  }
  serializeTableData() {
    let tableData:TableData;
    let tableConfig = this.tableConfig;
    let columns = this.columns;

    // 表属性
    let tableClasses:string[] = ['table-container'];
    if ( tableConfig.rowSelectable ) {
      tableClasses.push( 'row-selectable' )
    }
    if ( !tableConfig.columnResizable ) {
      tableClasses.push('no-column-resizing');
    }

    // 表头
    let thead:TableDataRowCategory = {
      additionalClasses:['table-head-wrapper'],
      rows: [{
        checked:false,
        additionalClasses:['table-row','table-head-row'],
        cols: columns.map(col=>({
          value:col.vcTitle,
          // NOTE: thead-col 的属性会复制到 tbody-col 上
          properties:col,
          additionalClasses:['table-row-item',`table-row-item-${col.id}`, `table-row-item-type-${col.propertyType}`],
          style:{},
        }))
      }]
    };
    // 加 fixed-top 标识, 并带上 sticky 位置信息;
    if ( tableConfig.fixedHeader ) {
      thead.additionalClasses.push('fixed-top-header');
      thead.style = { top:0 };
    }
    // 加 fixed-left
    let positiveCols:TableDataColItem[] = thead.rows[0].cols.concat();
    let fixedLeftColumns  = tableConfig.fixedLeftColumns || [];
    let fixedLeftPosition = 0;
    // 计算 fixed-left 位置
    positiveCols.some((col:TableDataColItem,colIdx:number)=>{
      if ( fixedLeftColumns.indexOf(col.properties.id)<0 ) {
        if ( colIdx>0 ) {
          // 给最后一个添加标识
          positiveCols[colIdx-1].additionalClasses = positiveCols[colIdx-1].additionalClasses || [];
          positiveCols[colIdx-1].additionalClasses.push('fixed-left-column-last')
        }
        return true;
      }
      // 加上固定左边的标识
      col.additionalClasses.push( 'fixed-left-column' );
      // console.log('__________', col);
      col.style = { ...col.style, left:fixedLeftPosition+'px' };
      fixedLeftPosition += col.properties.width;
      return false;
    });


    // 加 fixed-right 标识
    let invertedCols:TableDataColItem[] = thead.rows[0].cols.concat().reverse();
    let fixedRightColumns  = tableConfig.fixedRightColumns || [];
    let fixedRightPosition = 0;
    // 倒序循环, 计算 fixed-right 的位置
    invertedCols.some((col:TableDataColItem,colIdx)=>{
      // 如果碰到 fixed-left, 也结束循环
      // col.additionalClasses = col.additionalClasses || [];
      if (
        col.additionalClasses.indexOf('fixed-left-column-last')>-1 ||
        fixedRightColumns.indexOf(col.properties.id)<0
      ) {
        if ( colIdx>0 ) {
          invertedCols[colIdx-1].additionalClasses.push('fixed-right-column-last')
        }
        return true;
      }
      // 加上固定左边的标识
      col.additionalClasses.push( 'fixed-right-column' );
      col.style = { ...col.style, right:fixedRightPosition+'px' };
      fixedRightPosition += col.properties.width;
      return false;
    });

    // 表体, 表头标题字段一致; 所以某些属性直接复制, 不做计算
    let tbody:TableDataRowCategory = {
      additionalClasses:['table-body-wrapper'],
      rows: this.originalTableData.map((row,rowIdx)=>{
        // 'table-row-item',`table-row-item-${col.properties.id}`, ...
        let additionalClasses:string[] = ['table-row','table-body-row'];
        if ( ['草稿','进行中'].includes(row.sequenceStatus) ) {
          additionalClasses.push('unfinished');
        }
        return {
          index:rowIdx,
          __ordinalNo: rowIdx+1,
          checked : false,
          additionalClasses,
          cols : columns.map((col,colIdx)=>{
            let value = row[col.id];
            // NOTE:  table-body-col 会使用 table-head-col 所定义的类名
            let { properties, additionalClasses, style } = positiveCols[colIdx];
            // 对附件
            if ( col.propertyType===6 && !!value) {
              value.forEach(v=>{
                // 图片要使用<img>标签, 其他使用<a>标签, 因此做个标识;
                v.isImage = /^image\//.test(v.mimeType);
                v.url = renderer.UploadControl.service.getDownloadUrl(v);
              })
            }
            // 对富文本
            else if ( col.propertyType===1 && (/<\/?[a-zA-Z]+("[^"]*"|'[^']*'|[^'">])*>/).test(value) ) {
              value = '该内容不支持展示';
              additionalClasses = [...additionalClasses];
              additionalClasses.push('text-disabled');
            }

            return {
              properties,
              additionalClasses,
              style,
              value,
            }
          })
        }
      }),
    };

    tableData = { thead,tbody, additionalClasses:tableClasses };



    // let z1 = { value:'占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; 占据三列; ', colspan:3, properties:{ id:'custom-cols' }, additionalClasses:[]}
    // tableData.tbody.rows[0].cols.splice(3, 3, z1)
    // let z2 = {value:'占据2列; 占据2列; 占据2列; 占据2列; 占据2列; 占据2列; 占据2列; 占据2列; 占据2列; ', colspan:2, properties:{id:'ttt'}, additionalClasses:[] }
    // tableData.tbody.rows[0].cols.splice(4, 2, z2)


    // console.log('_____________ tabl')
    // console.log( tableData )

    return tableData;
  }

  // @@ 函数
  // 合并列宽度(colspan)
  combineColsWidth(row,col) {
    // return col.properties.width;
    let span = +col.colspan;
    if ( isNaN(span) || span<=1 ) return col.properties.width;


    // 计算对应的 columns idx
    let colIdx = 0;
    row.cols.some((c,i)=>{
      if ( c===col ) return true;
      colIdx += isNaN(c.colspan)? 1: parseInt(c.colspan,10);
    });

    // 通过下标和span的长度, 获取合并长度
    let columns = this.columns;
    let colWidth   = 0;
    let loopIdx=colIdx,
        loopLen=colIdx+span>columns.length? columns.length: colIdx+span;
    for(; loopIdx<loopLen; loopIdx++ ) {
      colWidth += +columns[loopIdx].width;
    }

    // console.log(colIdx, '|', colWidth);
    return colWidth;
  }


  // @@ dom 事件
  // * 列宽自定义
  resizeStart :number = 0;
  resizeMove  :number = 0;
  resizeBar  :any    = null;
  resizeBars :any[]  = [];
  resizeBarName:string = 'resize-bar'
  resizeMinWidth = 70;
  resizeStartHandler(e) {
    // console.log( e );
    let target = e.target;
    if ( target.className!==this.resizeBarName ) return;

    // console.log( target, this.resizeBars.length );

    e.preventDefault();
    let resizeBar  = this.resizeBars[+target.getAttribute('data-index')];

    resizeBar.width = resizeBar.parent.clientWidth;
    // resizeBar.minWidth = (resizeBar.parent.children[0] as any).clientWidth || this.resizeMinWidth;
    resizeBar.parent.classList.add('resizing');

    // console.log( (resizeBar.parent.children[0]).clientWidth, resizeBar.minWidth );

    // 记录
    this.resizeBar = resizeBar;
    this.resizeStart = e.pageX;
  }
  resizeMoveHandler(e) {
    if ( !this.resizeBar ) return;
    let { index,column,width,parent,minWidth,isLastColumn } = this.resizeBar;

    let computedWidth = width - (this.resizeStart-e.pageX);

    // 如果小于最小宽度, 直接滚粗
    if ( computedWidth <= minWidth ) {
      return;
    }

    // 重置 backupWidth, 否则最后一列的宽度无法设置
    if ( isLastColumn ) {
      this.resizeBar.backupWidth = 0;
    }

    // console.log('_______ coooo')
    column.width = computedWidth;

    this.computeWidth();
    // this.columns.splice( index, column );
  }
  resizeEndHandler(e) {
    if ( !this.resizeBar ) return;
    let { index,width,parent,column } = this.resizeBar;
    let finalWidth = parseInt(parent.style.width);

    parent.classList.remove('resizing');

    this.resizeBar.width = column.width;
    this.resizeStart = 0;
    this.resizeBar = null;

    // 修改源数据, 否则在不刷新的情况下调整宽度+设置列展示项, 会取之前的宽度
    let cIndex = this.tableConfig.rowOrdinal? index-1: index;
    this.originalTableColumns[cIndex].width = column.width;
    // 驱动 vm 做记录
    this.$emit('onResizeEnd', { index,column,width:column.width });
  }
  // * 初始化列调整尺寸功能
  initColumnsResizing() {
    let theadWrapper:any = this.$el.querySelector('.table-head-wrapper');
    if ( !theadWrapper ) return console.error('table-head not found!');

    let ths   = theadWrapper.querySelectorAll('.table-row-item');
    let thLen = ths.length;

    this.resizeBars = [];
    [].forEach.call(ths, ((th,i)=>{

      // 最后一个不开发"手动"宽度调整, 仅程序自动
      // if ( i===thLen-1 ) return;

      // 序号不开放宽度调整
      let column = this.columns[i];
      let isLastColumn = i === thLen-1;
      let offsetWidth  = th.children[0].offsetWidth
      if ( column.id==='__ordinalNo' ) return;

      let bar = th.querySelector(`.${this.resizeBarName}`);
      if ( !bar ) {
        bar = document.createElement('b');
        bar.className = this.resizeBarName;
        bar.setAttribute('data-index', String(this.resizeBars.length));
        th.appendChild( bar );
      }
      // 最后一行样式有些许不同, 因此这里做个偏移
      let minWidthOffset = isLastColumn? 5: 0;
      let minWidth = offsetWidth? offsetWidth+15+minWidthOffset: this.resizeMinWidth+minWidthOffset;
      if ( minWidth>column.width ) column.width = minWidth
      this.resizeBars.push({
        index:i,
        element:bar,
        parent:th,
        column,
        // 最后一个需要做特别处理, 所以加个标识
        isLastColumn,
        minWidth
        // : offsetWidth? offsetWidth+15+minWidthOffset: this.resizeMinWidth+minWidthOffset
      });


    }));
  }
  tableScrollHandler(e) {
    // console.log('_)____')
    let el = this.$el;
    let container = this.tableContainerElement;
    let v, h;

    if ( !container ) return;

    // 纵向
    if ( el.scrollTop === 0 ) { v='v-top' }
    else if ( el.scrollTop===(el.scrollHeight-el.clientHeight) ) { v='v-bottom' }
    else { v='v-middle' }
    // 横向
    if ( el.scrollLeft===0 ) { h='h-left' }
    else if ( el.scrollLeft===(el.scrollWidth-el.clientWidth) ) { h='h-right' }
    else { h='h-middle' }

    container.setAttribute('data-v-pos', v);
    container.setAttribute('data-h-pos', h);
  }

  // 根据用户自定义列宽, 动态调整表格/最后一列的尺寸
  tableClientWidth:number = 0;
  tableScrollWidth:string = '100%';
  // shouldComputeWidth:boolean = true;
  computeWidth() {
    if ( !this.resizeBars.length ) return;  // 跟着 columns 变, 但仍然需要等待渲染完毕才能用

    let columns          = this.columns;
    let lastColumn       = columns[columns.length-1];
    let lastResizebar    = this.resizeBars[this.resizeBars.length-1];
    let tableClientWidth = this.tableClientWidth || ( this.tableClientWidth = (document.querySelector('#ApplicationList') as any).clientWidth || 0 );
    let tableScrollWidth = columns.reduce((s,c,i)=>(
      s += isNaN(c.width)?
        this.resizeMinWidth:
        // 如果是最后一个, 取备份值来计算
        +( c===lastColumn && lastResizebar.backupWidth || c.width )
      ), 0);
    let exsertedWidth    = tableScrollWidth - tableClientWidth;


    // console.log( tableClientWidth, tableScrollWidth, exsertedWidth );

    // 记录尾列的原始数据
    if ( !lastResizebar.backupWidth ) {
      lastResizebar.backupWidth = +lastColumn.width;
    }
    if ( !lastResizebar.backupMinWidth ) {
      lastResizebar.backupMinWidth = lastResizebar.minWidth;
    }

    // 做拉伸
    if ( exsertedWidth===0 ) return;
    else if ( exsertedWidth > 0 ) {
      // this.shouldComputeWidth = false;
      lastColumn.width = lastResizebar.backupWidth;
      // 动态记录最后一列的最小宽度
      lastResizebar.minWidth = lastResizebar.minWidth-exsertedWidth>lastResizebar.backupMinWidth? lastResizebar-exsertedWidth: lastResizebar.backupMinWidth;
      this.tableScrollWidth  = tableScrollWidth + 'px';
    }
    else {
      // this.shouldComputeWidth = false;
      lastColumn.width = lastResizebar.backupWidth - exsertedWidth;
      // 动态记录最后一列的最小宽度
      lastResizebar.minWidth = lastColumn.width > lastResizebar.backupMinWidth? lastColumn.width: lastResizebar.backupMinWidth;
      this.tableScrollWidth = '100%';
    }
  }

  tableContainerElement:any;
  initDomEvents() {

    // console.log('--------')
    let tableConfig = this.tableConfig;
    let tableSelector = tableConfig.tableSelector || '.table-container';
    let tableContainer = this.$el.querySelector( tableSelector ) as any;
    if ( !tableContainer ) return this.$message.error(`找不到表单元素: ${ tableSelector }`);

    // 记录为 vm 变量
    this.tableContainerElement = tableContainer;

    // 如果可调节尺寸
    if ( tableConfig.columnResizable ) {
      let theadSelector = tableConfig.theadSelector || '.table-head-wrapper';
      let theadWrapper = tableContainer.querySelector( theadSelector );
      if ( theadWrapper ) {
        theadWrapper.removeEventListener('mousedown', this.resizeStartHandler);
        theadWrapper.addEventListener('mousedown', this.resizeStartHandler);
        document.removeEventListener('mousemove', this.resizeMoveHandler);
        document.addEventListener('mousemove', this.resizeMoveHandler);
        document.removeEventListener('mouseup', this.resizeEndHandler);
        document.addEventListener('mouseup', this.resizeEndHandler);
      }
      else {
        this.$message.error(`找不到表头元素: ${theadSelector}`)
      }
    }

    // 如果有固定的元素, 要监听滚动操作
    if (
      tableConfig.fixedHeader ||
      (Array.isArray(tableConfig.fixedLeftColumns)&&tableConfig.fixedLeftColumns.length) ||
      (Array.isArray(tableConfig.fixedRightColumns)&&tableConfig.fixedRightColumns.length)
    ) {
      this.$el.removeEventListener('scroll', this.tableScrollHandler);
      this.$el.addEventListener('scroll', this.tableScrollHandler);
    }

    window.onresize = function(){};
    window.addEventListener('resize', e=>{
      this.tableClientWidth = this.$el.clientWidth;
      this.computeWidth();
    });


    this.initColumnsResizing();
    this.computeWidth();
    this.tableScrollHandler(null);
  }

  // @@ 用户事件
  rowSelection(action:string, row) {
    let rows = this.tableData.tbody.rows;

    if ( action==='checkAll' ) {
      rows.forEach(r=>r.checked=true);
    }
    else if ( action==='cancelAll' ) {
      rows.forEach(r=>r.checked=false);
    }
    else if ( action==='check' ) {
      row.checked = !row.checked;
    }


    this.$emit('onCheck', rows.map(r=>r.checked));
  }







  // @@ render
  // 如果模板字符串改变, compiled 相关也重置
  templateRender:Function|null = null;
  templateStaticRenderFns:Function|null = null;
  @Watch('templateString', {immediate: true})
  onTemplateStringChange() {
    this.templateRender = null;
    this.templateStaticRenderFns = null;
  }
  // 正常渲染流程
  render(h) {
    const outerVm = this;
    const templateString = outerVm.templateString? outerVm.templateString.trim(): listCustomTemplateConverter.template;

    // 优先使用缓存模板
    if ( !outerVm.templateRender ) {
      let compiled = vueCompiler.compile( templateString  );
      if ( compiled.errors.length ) {
        outerVm.templateParsingError = `Error compiling template:\n\n${templateString}'\n\n${compiled.errors.join('\n')}`;
        return outerVm.errorRender(h);
      }
      outerVm.templateRender = new Function(compiled.render);
      outerVm.templateStaticRenderFns = new Function(compiled.staticRenderFns);
    }

    return outerVm.templateRender(h);
  }
  // 错误渲染流程 (输出错误信息)
  templateParsingError:string = '';
  templateParsingErrorHtml:any;
  errorRender(h) {
    return h(
      'div', {
        attrs: { id:'custom-list-container' }
      },
      [
        h(
          'pre',
          { attrs: { id:'custom-list-parsing-error' } },
          this.templateParsingError
        )
      ]
    );
  }
}


</script>
