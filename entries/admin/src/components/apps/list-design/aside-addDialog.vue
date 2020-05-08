<template>
  <span class="bar-right">
    <span :style="wrapStyle">
      <a-popover
        placement="bottom"
        v-model="popoverVisible"
        trigger="click"
      >
        <template slot="content">
          <div class="popover-box">
            <!-- 过滤的弹窗 -->
            <ul v-if="dialogList.length">
              <!-- 全选 -->
              <li
                class="section-bar"
                @click="handleAllCheck()"
              >
                <span class="bar-title">
                  <label>{{ $t('languages.Apps.FormDesignPage.AllChecked') }}</label>
                </span>
                <span class="bar-right">
                  <a-checkbox :checked="isAllChecked" />
                </span>
              </li>
              <!-- 业务数据项 -->
              <li class="section-bar">
                <span class="bar-title bar-c">
                  <label>{{ $t('languages.Apps.BizDataItem') }}</label>
                </span>
              </li>
              <!-- 非系统数据项 -->
              <li
                class="section-bar"
                v-for="(cur,index) in dialogList"
                v-if="!cur.isSystem"
                :key="cur.index"
              >
                <span class="bar-title bar-title-c">
                  <label class="text-ellipsis">{{ `${cur.propertyName || cur.name}[${cur.code}]` }}</label>
                </span>
                <span class="bar-right">
                  <a-checkbox
                    @change="toggleChecked(cur)"
                    :checked="cur.checked"
                  />
                </span>
              </li>
              <!-- 系统数据项 -->
              <li class="section-bar">
                <span class="bar-title bar-c">
                  <label>{{ $t('languages.Apps.SysDataItem') }}</label>
                </span>
              </li>

              <li
                class="section-bar"
                v-for="(cur,index) in dialogList"
                v-if="cur.isSystem"
                :key="cur.index"
              >
                <span class="bar-title bar-title-c">
                  <label class="text-ellipsis">{{ `${cur.propertyName || cur.name}[${cur.code}]` }}</label>
                </span>
                <span class="bar-right">
                  <a-checkbox
                    @change="handleIcon(cur.checked, index)"
                    :checked="cur.checked"
                  />
                </span>
              </li>
            </ul>
            <!-- 提醒 -->
            <div v-else class="empty-tips">
              <p v-if="fieldBlock === 2">{{ $t('languages.Apps.NoSortDataTips') }}</p>
              <p v-else>{{ $t('languages.Apps.NoDataTips') }}</p>
            </div>
            <div class="bottom-bolck btn-group clearfix">
              <a-button
                class="btn"
                type="primary"
                size="small"
                @click="comfirmLevel1Popover"
              >{{ $t('languages.Apps.Ok') }}</a-button>
              <a-button
                class="btn"
                size="small"
                @click="closeLevel1Popover"
              >{{ $t('languages.Apps.Cancel') }}</a-button>
            </div>
          </div>
        </template>
        <span class="icons" @click.stop="()=>{}"> <i class="aufontAll h-icon-all-plus-square-o"></i> </span>
        <!-- <a-icon type="plus-square-o" /> -->
      </a-popover>
    </span>
  </span>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';


// import appsApi from '@/apis/apps';
import { getDataItems } from '@/apis/list';

const ListdesignModule = namespace('Apps/Listdesign');

@Component({
  name: 'Dialog',
  components: {
  }
})
export default class Dialog extends Vue {
  @ListdesignModule.State('showFieldArray') showFieldArray: any;

  @ListdesignModule.Mutation('onEdit') onEdit: any;

  @Prop() propDataList !: Array<any[]>

  @Prop() fieldBlock !: number

  wrapStyle = { left: '624px' }

  // /* 服务器获取的原始数据 */
  // originDatas:any[] = [];

  dialogList:any[] = [];

  fblock:number = -1;

  popoverVisible:boolean = false;

  isAllChecked:boolean = false;

  created() {
    // this.dialogList;
  }


  toggleChecked(item) {
    item.checked=!item.checked
    this.isAllChecked = this.dialogList.every((res:any)=>(res.checked));
  }
  /* icon点击 */
  handleIcon(checked:boolean, i:number) {
    console.info(checked, i);
    this.changeDialogListChecked(checked, i);
    this.isAllChecked = this.dialogList.every((res:any) => res.checked);
  }

  changeDialogListChecked(ck:boolean, i:number) {
    // this.dialogList[i].checked = !ck;
    let item = this.dialogList[i];
    item.checked = !ck;
    // 手动触发刷新
    this.$set(this.dialogList,i,item)
    // this.dialogList.splice(i,1,item);
  }

  handleAllCheck() {
    this.isAllChecked = !this.isAllChecked;
    this.dialogList.forEach((item) => {
      item.checked = this.isAllChecked;
    });
  }

  /* add弹窗-确定 */
  comfirmLevel1Popover() {
    this.$emit('addcomfirm', this.fieldBlock, this.dialogList);
    this.onEdit(true);
    this.popoverVisible = false;
  }

  // /* add弹窗-取消 */
  closeLevel1Popover() {
    this.popoverVisible = false;
  }

  /**
   * 下拉选择值赋值
   */
  @Watch('propDataList')
  linsteningdialogData(v:any) {
    this.dialogList = v;
    if (v) {
      const arr = v.filter((res:any) => !res.checked);

      if (arr.length === 0) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
    }
  }

  beforeDestroy() {
    this.$off('addcomfirm');
  }
}
</script>

<style lang="less" scoped>

.design-wrapper{
  .each-title{
    font-size: 14px;
  }
}
.popover-box{
  width: 260px;
  .bottom-bolck{
    padding-bottom: 4px;
    margin-top: 8px;
    .btn{
      float: right;
      margin-right: 0px!important;
      &:last-child {
        margin-right: 8px!important;
      }
    }
  }
  .empty-tips{
    text-align: center;
    padding-top: 28px;
    padding-bottom: 24px;
    color: rgba(0, 0, 0, 0.65);
  }
  ul{
    max-height: 450px;
    overflow: auto;
    overflow-x: hidden;
    margin-right: -16px;
    li{
      height: 30px;
      line-height: 30px;
      .bar-right{
        margin-right: 16px;
      }
      &:hover{
        background: #E8FCF4;
      }
    }
  }

}
</style>
