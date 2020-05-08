<template>
  <div 
    class="common-table" 
    v-if="columns.length > 0" 
    ref="commonTable"
  >
    <!-- 表头 -->
    <div class="common-table__thead-wrap">
      <div class="common-table__thead">
        <div class="common-table__row">
          <div 
            class="common-table__col" 
            v-for="(col, colIdx) in columns"
            :style="colStyles[colIdx]"
            :key="colIdx"
            :class="col.fixed ? '' : 'not-center'"
          >
            <h3-size-slider
              class="resize-line text-ellipsis"
              :right="true"
              :style="colStyles[colIdx]"
              :minWidth="col.fixed ? col.width : 120"
              :maxWidth="col.fixed ? col.width : -1"
              @resize="e => onColResize(e,colIdx,col)"
              @resize-end="onColResizeEnd(colStyles[colIdx].width,col)"
            >
              <span v-if="col.name">{{ col.name }}</span>
              <slot v-else :name="col.headSlot"></slot>
            </h3-size-slider>
          </div>
        </div>
      </div>
    </div>

    <!-- 表体 -->
    <div 
      class="common-table__tbody-wrap"
      :style="{maxHeight: scrollY ? `${scrollY.toString()}px` : 'unset', overflow: 'auto'}"
      @mousedown="e => onMouseDown(e)"
    >
      <div class="common-table__tbody">
        <div 
          class="common-table__row" 
          v-for="(data, index) in dataSource" 
          :key="index"
        >
          <div 
            class="common-table__col"
            v-for="(col, colIdx) in columns"
            :key="colIdx"
            :style="colStyles[colIdx]"
            :class="col.fixed ? '' : 'not-center'"
          >
            <div class="text-ellipsis" :style="colStyles[colIdx]">
              <slot 
                v-if="col.bodySlot" 
                :name="col.bodySlot" 
                :text="data[col.dataIndex]" 
                :row="data"
              ></slot>
              <span v-else>{{ data[col.dataIndex] }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 数据为空时 -->
      <slot name="loadAll"></slot>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import H3SizeSlider from "@cloudpivot/common/src/components/pc/size-slider.vue";
import  * as TableTypings from './table.typings';

import * as helper from './helper';
@Component({
  name: 'CommonTable',
  components: {
    H3SizeSlider
  }
})
export default class CommonTable extends Vue {
  // 表头
  @Prop({
    default: () => []
  }) columns !:Array<TableTypings.TableColumns>; // 定义数据结构 todo

  @Prop({
    default: () => []
  }) dataSource !:any;

  @Prop({
    default: 0
  }) scrollY !:number;

  @Prop({
    default: true
  }) adaptWidth !:boolean; // 是否进行宽度平铺


  colStyles:Array<any> = [];

  baseScrollLeft:number = 0; // 鼠标按下是的横向滚动条偏移量

  /** 
   * 获取所有列宽之和
   * @isFlat 是否平铺，有平铺则过滤列宽过滤项再求和
  */
  private getColsTotalWidth(isFlat:boolean = false):number{
    let num:number = 0;
    if (isFlat) {
        this.columns.forEach((col:TableTypings.TableColumns) => {
          if (!col.fixed) {
            num += col.width;
          }
        })
    } else {
      this.colStyles.forEach((style:TableTypings.ColStyles, index:number) => {
        let diff:number = this.columns[index].fixed ? 0 : 8;
        const w:number = helper.px2num(style.width);
        num += (w + diff);
      })
    }
    return num;
  }

  /** 
   * 初始化每一列的样式
  */
  initColStyles(){
    if (this.columns.length <= 0) return;
    this.columns.forEach((col:TableTypings.TableColumns) => {
      const width:string = col.width ? col.width.toString() + 'px' : '0px';
      this.colStyles.push({
        width,
        textAlign: col.align
      })
    })
  }

  /** 
   * 初次加载列宽自适应
   * 初次加载进来的时候，当所有列宽之和小于容器宽度的时候，自动铺平
   * 由于宽度百分比的时候，拖拽出错，故再次转回px
  */
  widthAdaption() {
    this.$nextTick(() => {
      const commonTableWidth:number = (this.$refs.commonTable as HTMLElement).clientWidth;
      const totalColsWidth:number = this.getColsTotalWidth();

      if (totalColsWidth < commonTableWidth) {
        // 去除fixed部分得宽度，剩余宽度作为总宽度，做平铺操作
        const totalFlatColsWidth:number = this.getColsTotalWidth(true);
        
        this.colStyles.forEach((style:TableTypings.ColStyles, index:number) => {
          if (!this.columns[index].fixed) {
            const w:number =  ((helper.px2num(style.width) / totalFlatColsWidth) * 100) as any;
            style.width = w.toString() + '%';
          }
        })
      }
      

      this.$nextTick(() => {
        // 再次转成px, 因为宽度为%的时候，拖拽出错
        const colDoms = document.querySelectorAll('.common-table__thead .common-table__row .common-table__col') as NodeListOf<HTMLDivElement>;
        let n:number = 0;
        colDoms.forEach((col:HTMLElement, index:number) => {
          if (this.columns[index].fixed) {
            n += col.clientWidth;
          } else {
            n += col.clientWidth + 8;
          }
          this.colStyles[index].width = col.clientWidth.toString() + 'px';
        });
        const thead = document.querySelector('.common-table__thead') as HTMLElement;
        const tbody = document.querySelector('.common-table__tbody') as HTMLElement;
        thead.style.width = n.toString() + 'px';
        tbody.style.width = n.toString() + 'px';
      });
    })
  }

  /** 
   * 滚动条展示
  */
  showScroller(){
    this.$nextTick(() => {
      const tableBody:HTMLElement = document.querySelector('div.common-table') as HTMLElement;
        tableBody.onmouseenter = function(){
          tableBody.className = 'common-table active';
        }

        tableBody.onmouseleave = function(){
          tableBody.className = 'common-table';
        }
    })
  }


  /**
   * 列宽拖拽时
  */
  onColResize(evt : { width : number}, colIdx:number,col:TableTypings.TableColumns){
    if (col.fixed) return;
     const width = evt.width + 'px';
     this.colStyles[colIdx].width = width;

    this.$nextTick(() => {
      let totalColsWidth:number = 0;
      const colDoms = document.querySelectorAll('.common-table__thead .common-table__row .common-table__col') as NodeListOf<HTMLDivElement>;
      colDoms.forEach((colDom:HTMLElement, index:number) => {
        let diff:number = this.columns[index].fixed ? 0 : 8;
        totalColsWidth += (colDom.clientWidth + diff);
      });
      totalColsWidth += 8; // todo
      (document.querySelector('.common-table__thead') as HTMLElement).style.width = totalColsWidth.toString() + 'px';
      (document.querySelector('.common-table__tbody') as HTMLElement).style.width = totalColsWidth.toString() + 'px';

      // 
      const theadDom = document.querySelector('.common-table__thead') as HTMLDivElement;
      const targetDom = document.querySelector('.common-table__tbody-wrap') as HTMLDivElement;
      const curScrollLeft:number = targetDom.scrollLeft;
      theadDom.style.transform = `translateX(${-curScrollLeft}px)`;
    })
  }

  /** 
   * 列宽拖拽完成
  */
  onColResizeEnd(width:string, col:TableTypings.TableColumns){
    if (col.fixed) return;
    const _width = helper.px2num(width)
    this.$emit('resize-end', {width: _width, col})
  }

  /**
   * 滚动条滚动
   */
  scrollHandler(){
    const targetDom = document.querySelector('.common-table__tbody-wrap') as HTMLDivElement;
    const theadDom = document.querySelector('.common-table__thead') as HTMLDivElement;
    const curScrollLeft:number = targetDom.scrollLeft;
    // 横向滚动，并将此时的scrollLeft取反赋为thead的横向偏移 translateX
    if (curScrollLeft !== this.baseScrollLeft) {
        theadDom.style.transform = `translateX(${-curScrollLeft}px)`;
    }
    // 误差自修复， todo待完善
    this.$nextTick(() => {
      const _dom = document.querySelector('.common-table__tbody-wrap') as HTMLDivElement;
      theadDom.style.transform = `translateX(${-_dom.scrollLeft}px)`;
    })
  }

  mouseupHandler(e: any){
    const targetDom = document.querySelector('.common-table__tbody-wrap') as HTMLDivElement;
    targetDom.removeEventListener('scroll', this.scrollHandler);
    targetDom.removeEventListener('mouseup', this.mouseupHandler);
  }

  /** 
   * 监听横向滚动
   * @params isX 判断是否是横向滚动
  */
  onMouseDown(e:any){
    // 只有在按下滚动条的时候才做操作
    if (e.target.className !== 'common-table__tbody-wrap') return;
    const targetDom = document.querySelector('.common-table__tbody-wrap') as HTMLDivElement;
    
    // 记录按下瞬间的位置
    this.baseScrollLeft = (targetDom.scrollLeft as number) || 0;

    // 注册鼠标移动事件
    targetDom.addEventListener('scroll', this.scrollHandler);
    targetDom.addEventListener('mouseup', this.mouseupHandler);

  }

  /**
   * 注册滚动条事件
   */
  registerScroll(){
    this.$nextTick(() => {
      const targetDom = document.querySelector('.common-table__tbody-wrap') as HTMLDivElement;
      // 注册鼠标移动事件
      targetDom.addEventListener('scroll', this.scrollHandler);
    })
  }
  
  /**
   * 键盘按下
   */
  onKeyDown(e:any){
    if(e.which === 39 || e.which === 37) {
      this.registerScroll();
    }
  }


  mounted () {
    this.initColStyles();
    this.widthAdaption();
    // if (!this.adaptWidth) {
    //   this.widthAdaption();
    // } else {
    //   this.$nextTick(() => {
    //     let totalColsWidth:number = this.getColsTotalWidth()
    //     // let totalColsWidth:number = 0;
    //     // this.colStyles.forEach((style:TableTypings.ColStyles, index:number) => {
    //     //   let diff:number = this.columns[index].fixed ? 0 : 8;
    //     //   totalColsWidth += (helper.px2num(style.width) + diff);
    //     // });
    //     totalColsWidth += 16; // 尾部间距
    //     const thead = document.querySelector('.common-table__thead') as HTMLElement;
    //     const tbody = document.querySelector('.common-table__tbody') as HTMLElement;
    //     thead.style.width = totalColsWidth.toString() + 'px';
    //     tbody.style.width = totalColsWidth.toString() + 'px';
    //   })
    // }
    this.showScroller();
    this.registerScroll();

    document.addEventListener('keydown', this.onKeyDown)
  }

  destroyed () {
    document.removeEventListener('keydown', this.onKeyDown)
  }

}
</script>
<style lang="less">
  .common-table {
    max-width: 100%;
    &__row {
      width: 100%;
      display: flex;
      border-bottom: 1px solid #e8e8e8;
      transition: all ease .3s;
    }
    &__col {
      padding: 8px 0;
      box-sizing: content-box;
      &.not-center {
        margin-left: 8px;
      }
    }
    &__thead-wrap {
      width: 100%;
      background-color: #F4F6FC;
      overflow: hidden;
    }
    &__thead {
      background-color: #F4F6FC;
      .common-table__col {
        color: rgba(0, 0, 0, 0.65);
        font-weight: 600;
      }
      .resize-line {
        border-right: 1px solid rgba(0, 0, 0, 0.15);
      }
    }
    &__tbody{
      min-height: 1px;
      .common-table__row:hover {
        background: #f0f7ff;
      }
    }
    .text-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/.h3-size-slider__sider-right {
      width: 5px;
    }
  }
  .common-table .common-table__tbody-wrap::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0);
    box-shadow: unset;
    transition: all ease .3s;
  }

  .common-table.active .common-table__tbody-wrap::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, .45);
    box-shadow: auto;
  }
</style>

