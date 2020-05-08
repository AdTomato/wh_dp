<template>
 <div class="import-sheet-container">
   <div class="import-sheet" :style="{'width': tableWidth}" v-if="columns && columns.length">
    <div class="sheet-header-wrapper" :class="{'sheet-fixed-head': fixedHead}">
      <div class="sheet-row sheet-header-row">
        <div
            v-for="(row,rowIdx) in columns"
            :key="row.key"
            class="sheet-row-item"
            :class="{'sheet-fixed-left': fixedLeft && rowIdx === 0}"
            :style="{'width': row.propertyType === 8 ? '': row.width+'px'}"
        >
          <label v-if="row.title && row.propertyType !== 8">{{ row.title }}</label>
          <div class="child-sheet-wrapper" v-else-if="row.title && row.propertyType === 8">
            <div class="child-sheet-title" :style="{'max-width': row.width+'px'}">{{ row.title }}</div>
            <template v-for="(child, index) in row.childColumns">
              <div class="child-row-inner-wrapper" :style="{'width': child.width+'px'}">{{ child.title }}</div>
            </template>
          </div>
          <slot
            v-else
            :name="row.dataIndex"
          ></slot>
        </div>
      </div>
    </div>
    <div class="sheet-body-wrapper">
      <div
        v-for="(tr,rowIdx) in tableData"
        :key="tr.key"
        class="sheet-row sheet-body-row"
      >
        <div
          v-for="(row,idx) in columns"
          :key="row.key"
          class="sheet-row-item"
          :class="{'sheet-fixed-left': fixedLeft && idx === 0}"
          :style="{'width': row.propertyType === 8 ? '': row.width +'px'}"
        > 
          <!-- 子表 -->
          <div class="child-sheet-wrapper" v-if="row.propertyType === 8">
            <template v-for="(rowItem,index) in tr[row.dataIndex]">
              <div :key="index" class="child-items-row">
                <div
                  :key="i"
                  v-for="(item,i) in row.childColumns"
                  class="child-items"
                  :style="{'width': item.width+'px'}"
                >
                  <div v-if="item.propertyType === 5">
                    <template v-for="(user,cindex) in rowItem[item.dataIndex]">
                      <span
                        class="row-inner-user"
                        :class="{'error-user': user.excelType}"
                        :key="cindex"
                        v-if="cindex === (rowItem[item.dataIndex].length - 1)"
                      >
                        {{ `${user.name}${getErrorText(user.excelType)}` }}
                      </span>
                      <span class="row-inner-user" :class="{'error-user': user.excelType}" :key="cindex" v-else>{{ `${user.name}${getErrorText(user.excelType)}、` }}</span>
                    </template>
                    <span class="error-user" v-if="!rowItem[item.dataIndex] || !rowItem[item.dataIndex].length">{{ $t('cloudpivot.list.pc.null') }}</span>
                    <SelectUser v-model="rowItem[item.dataIndex]"></SelectUser>
                  </div>
                  <span v-else>{{ rowItem[item.dataIndex] }}</span>
                </div>
              </div>
            </template>
          </div>
          <!-- 选人控件 -->
          <div class="row-inner-wrapper" v-else-if="row.propertyType === 5">
            <template v-for="(user,index) in tr[row.dataIndex]">
              <span
                class="row-inner-user"
                :class="{'error-user': user.excelType}"
                :key="index"
                v-if="index === (tr[row.dataIndex].length - 1)"
              >
                {{ `${user.name}${getErrorText(user.excelType)}` }}
              </span>
              <span class="row-inner-user" :class="{'error-user': user.excelType}" :key="index" v-else>
                {{ `${user.name}${getErrorText(user.excelType)}、` }}
              </span>
            </template>
            <span class="error-user" v-if="!tr[row.dataIndex] || !tr[row.dataIndex].length">{{ $t('cloudpivot.list.pc.null') }}</span>
            <SelectUser v-model="tr[row.dataIndex]"></SelectUser>
          </div>
          <div class="row-inner-wrapper" v-else>{{ tr[row.dataIndex] }}</div>
        </div>
      </div>
    </div>
  </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import SelectUser from './select-user.vue';

@Component({
  name: "import-sheet",
  components: {
    SelectUser
  }
})

export default class ImportSheet extends Vue {
  @Prop({ default: false }) fixedHead!: boolean; // 固定表头

  @Prop({ default: false }) fixedLeft!: boolean; // 固定序号列

  @Prop() columns!: any;

  @Prop() dataSource!: any;

  tableWidth:any = '';

  get tableData() {
    let data:any = [];
    data = this.dataSource.map((d:any, index:number) => {
      d.key = index+1;
      d.index = index+1;
      return d;
    });
    return data;
  }

  mounted() {
    this.$nextTick(() => {
      this.calcTableWidth();
    });
  }

  /* 
  * 计算Table宽度
  */
  calcTableWidth() {
    let tableWidth:number = 0;
    const tableWrapWidth = document.querySelector('.import-sheet-container') ? (document.querySelector('.import-sheet-container') as any).clientWidth : 0;
    this.columns.forEach((c:any) => {
      // 子表宽度由内部数据项决定
      if (c.propertyType === 8 && Array.isArray(c.childColumns)) {
        c.childColumns.forEach((child:any) => {
          tableWidth += child.width;
        });
        if (c.childColumns.length) {
          tableWidth += (c.childColumns.length + 1);
        }
      } else {
        tableWidth += c.width;
      }
    }); 
    this.tableWidth = tableWidth > tableWrapWidth ? `${tableWidth}px`: '100%';
  }

  getErrorText(errType:any) {
    if (errType === 1) {
      return this.$t('cloudpivot.list.pc.repeat');
    } else if (errType === 2) {
       return this.$t('cloudpivot.list.pc.noExisted');
    }
    return '';
  }
}
</script>

<style lang="less" scoped>
.import-sheet-container{
  margin-top: 8px;
  height: 100%;
  max-height: 360px;
  overflow: auto;
  .import-sheet{
    border: 1px solid #E8E8E8;
    .sheet-header-wrapper{
      .sheet-header-row{
        background: #FAFAFA;
        border-bottom: 1px solid #e8e8e8 !important;
        &:hover { background-color:#FAFAFA; }
        .sheet-row-item{
          padding: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .child-sheet-wrapper{
            margin: -8px;
            overflow: hidden;
            .child-sheet-title{
              padding: 8px;
              border-bottom: 1px solid #e8e8e8;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .child-row-inner-wrapper{
              float: left;
              padding: 8px;
              border-right: 1px solid #e8e8e8;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &:last-child { border-right: none; }
            }
          }
        }
      }
    }
    .sheet-body-wrapper{
      .child-sheet-wrapper{
        height: 100%;
        .child-items-row{
          display: flex;
          border-bottom: 1px solid #e8e8e8;
          &:last-child { border-bottom: none; height: 100%; }
          .child-items{
            padding: 8px;
            white-space: normal;
            overflow: hidden;
            border-right: 1px solid #e8e8e8;
            &:last-child { border-right: none; }
          }
        }
      }
    }
    .sheet-row{
      display:flex;
      flex-direction:row;
      min-height:37px;
      border-bottom: 1px solid #e8e8e8;
      &:hover { background-color:#f0f7ff; }
      &:last-child { border-bottom: none; }
      .sheet-row-item{
        position:relative;
          z-index:1;
          box-sizing:border-box;
          overflow:hidden;
          // 一列高度增加, 其他列自动扩展
          flex:0 1 auto;
          // 当行超出显示省略号
          border-right:1px solid #e8e8e8;
          &:last-child { border-right: none; }
          .row-inner-wrapper{
            overflow: hidden;
            text-overflow: ellipsis;
            padding:8px;
          }
      }
    }
  }
  .sheet-fixed-head{
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .sheet-fixed-left{
    position: sticky !important;
    left: 0 !important;
    z-index: 19 !important;
    background: #fff !important;
  }
  .error-user{
    color: #F4454E;
  }
  .center{
    text-align: center;
  }
}
</style>
