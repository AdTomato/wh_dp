<template>
  <div class="mobile">
    <div class="mobile-view">
      <div class="mobile-view-header"></div>
      <div class="mobile-view-content">
        <div class="view-header">
          <div class="bar-back">
            <i class="icon aufontAll h-icon-all-left-o"></i>
            <span>返回</span>
          </div>
          <div class="bar-title">列表展示</div>
        </div>
        <div class="view-content">
          <div class="list-search">
            <div class="list-search-head" @click="showFilter('status')">
              <span>{{ statusText ? statusText: '单据状态' }}</span>
              <i class="icon aufontAll h-icon-all-down-o"></i>
            </div>
            <div class="list-search-head" @click="showFilter('filter')">
              <span :class="{'high-light': isShowFilterBox}">筛选</span>
              <i class="icon aufontAll h-icon-all-filter-o" :class="{'high-light': isShowFilterBox}"></i>
            </div>
          </div>
          <div class="list-item">
            <MobileItemList :isPreview="isPreview" :propDataList="queryColumns"></MobileItemList>
            <div class="search-content" v-if="isShowFilterBox">
              <div class="mobile-filter">
                <QueryForm :fields="queryConditions"></QueryForm>
              </div>
              <div class="filter-footer">
                <div class="filter-btn">重置</div>
                <div class="filter-btn primary" @click="hideFilter">确定</div>
              </div>
            </div>
            <!-- 单据状态 -->
            <div class="search-content status" v-show="isShowFormStatus">
              <div class="status-list">
                <ul>
                  <li
                    v-for="status in formStatus"
                    :key="status.value"
                    @click="statusChecked(status)"
                  >
                    <span>{{ status.name }}</span>
                    <span class="check-group icon aufontAll h-icon-all-check-circle checked" v-if="status.checked"></span>
                    <span class="check-group icon aufontAll h-icon-all-circle-o" v-else></span>
                  </li>
                </ul>
                <div class="status-footer">
                  <div class="filter-btn primary" @click="hideFilter">确定</div>
                </div>
              </div>
            </div>
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
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import MobileItemList from './mobile-item-list.vue';
import * as applicationList from '@cloudpivot/list'

import * as listApi from '@/apis/list';

const ListdesignModule = namespace('Apps/Listdesign');

@Component({
  name: 'MobileList',
  components: {
    MobileItemList,
    QueryForm: applicationList.components.mobile.QueryForm
  }
})
export default class MobileList extends Vue {
  @ListdesignModule.State('payloadOptions') payloadOptions: any;

  @ListdesignModule.State('clientType') clientType: any;

  @Prop() propDataList !: any;

  @Prop() isPreview !: boolean;

  @Prop({
    default: ''
  })
  listCode!: string;

  @Prop({
    default: ''
  })
  schemaCode!: string;

  isShowFilterBox:boolean = false;

  isShowFormStatus:boolean = false;

  statusText:string = '';

  queryConditions:any = [];

  queryColumns:any = [];

  formStatus:any = [
    {
      name: '进行中',
      value: 'processing',
      checked: false,
    },
    {
      name: '已完成',
      value: 'completed',
      checked: false,
    },
    {
      name: '已作废',
      value: 'cancled',
      checked: false,
    },
    {
      name: '草稿',
      value: 'draft',
      checked: false,
    }
  ];

  mounted() {
    if (this.isPreview && this.clientType !== 'APP') {
      this.getListPreviewInfo();
    } else {
      this.queryConditions = this.payloadOptions;
    }
  }

  getListPreviewInfo() {
    const hideLoader = (this.$message as any).loading();
    const clientType = 'APP';
    listApi.getListInfo(this.schemaCode, this.listCode, clientType).then(
      (res: any) => {
        hideLoader();

        const { data } = res;

        // 初始化单据状态的值
        if (Array.isArray(data.queryConditions)) {
          data.queryConditions.forEach((condition: any) => {
            if (condition.propertyCode === 'sequenceStatus') {
              if (!condition.defaultValue) return;
              const vals_zh: Array<string> = condition.defaultValue.split(';')
              const vals_en: Array<string> = [];
              vals_zh.forEach((val: string) => {
                switch (val) {
                  case 'DRAFT':
                    vals_en.push('草稿');
                    break;
                  case 'PROCESSING':
                    vals_en.push('进行中');
                    break
                  case 'COMPLETED':
                    vals_en.push('已完成');
                    break
                  case 'CANCELED':
                    vals_en.push('已作废');
                    break
                  default:
                    break;
                }
              });
              condition.defaultValue = vals_en.join(';');
            }
          });
        }

        this.queryConditions = data.queryConditions;

        this.queryColumns = data.queryColumns;
      },
      () => hideLoader()
    )
  }

  statusChecked(item:any) {
    item.checked = !item.checked;
    const arr:string[] = [];
    this.formStatus.forEach((form:any) => {
      if (form.checked) {
        arr.push(form.name);
      }
    });
    this.statusText = arr.join('/');
  }

  hideFilter() {
    this.isShowFilterBox = false;
    this.isShowFormStatus = false;
  }

  showFilter(type:string) {
    if (type === 'status') {
      this.isShowFilterBox = false;
      this.isShowFormStatus = !this.isShowFormStatus;
    } else {
      this.isShowFormStatus = false;
      this.isShowFilterBox = !this.isShowFilterBox;
    }
  }

  @Watch('payloadOptions', { deep: true })
  setPayloadOptions(v:any) {
    if (this.isPreview && this.clientType !== 'APP') return;
    this.queryConditions = v;
  }
}
</script>
<style lang="less" scoped>
.mobile{
  .mobile-view-content{
    .view-header{
      height: 36px;
      line-height: 36px;
      text-align: center;
      position: relative;
      .bar-title{
        font-size: 15px;
        color: #000;
        font-weight: 600;
        margin: 0;
      }
      .bar-back{
        position: absolute;
        top: 0;
        left: 10px;
        font-size: 13px;
        color: #333333;
        i{
          font-size: 10px;
          margin-right: 5px;
        }
      }
    }
    .view-content{
      height: calc(100% - 36px);
      position: relative;
      .list-search{
        height: 36px;
        line-height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        .list-search-head{
          display: flex;
          justify-content: flex-start;
          cursor: pointer;
          &:last-child{
            justify-content: flex-end;
          }
          .icon:hover {
            color: @primary-color;
          }
          .high-light{
            color: @primary-color;
          }
          i{
            font-size: 12px;
            margin: 0 5px;
          }
        }
      }
      .list-item{
        background: #F7F8FC;
        padding: 8px;
        height: calc(100% - 36px);
      }
    }
  }
  .search-content{
    position: absolute;
    width: 100%;
    background: rgba(0, 0, 0, 0.45);
    left: 0;
    top: 36px;
    height: calc(100% - 36px);
    z-index: 100;
    &.status{
      height: 100%;
    }
    .mobile-filter{
      height: 100%;
      background: #fff;
      overflow: scroll;
      padding-bottom: 50px;
      &::-webkit-scrollbar{
        width: 0;
      }
      .query-form{
        pointer-events: none;
        /deep/.h3-org-content-add{
          width: 30px;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .filter-footer{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 48px;
      line-height: 40px;
      background: #fff;
      padding-bottom: 8px;
      text-align: center;
    }
    .status-list{
      background: #fff;
      li{
        height: 36px;
        line-height: 36px;
        color: #333;
        padding: 0 16px;
        cursor: pointer;
      }
      .check-group{
        font-size: 20px;
        float: right;
        color: #999;
        &.checked{
          color: @primary-color;
        }
      }
      .status-footer{
        height: 48px;
        padding: 8px 8px 0 8px;
        text-align: right;
      }
      .filter-btn{
        height: 30px;
        line-height: 30px;
        border: 1px solid #ddd;
        border-radius: 30px;
        display: inline-block;
        padding: 0 20px;
      }
      .primary{
        color: #fff;
      }
    }
  }
  .filter-btn{
    color: #333;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 30px;
    display: inline-block;
    padding: 0 50px;
    margin: 0 8px;
    cursor: pointer;
  }
  .primary{
    background: @primary-color;
    color: #fff;
  }
}
</style>
