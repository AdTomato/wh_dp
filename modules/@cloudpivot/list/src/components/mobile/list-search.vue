<template>
  <div class="search">
    <div class="search-header">
      <div
        v-for="(searchItem, index) in searchWays"
        :key="index"
        :class="[
          'search-header-inner',
          searchItem.type === currentWay && 'selectActive'
        ]"
        @click="switchWay(searchItem)"
      >
        <span>
          {{
            (searchItem.type === 'status' && currentStatusName.length)
              ? currentStatusName.join('/')
              : searchItem.name
          }}
        </span>
        <i
          :class="[
            'icon aufontAll',
            searchItem.icon,
            searchItem.type === currentWay && (searchItem.activeIcon || '')
          ]"
        ></i>
      </div>
    </div>
    <div class="search-content" v-show="currentWay">
      <div class="search-content-status" v-show="currentWay === 'status'">
        <ul>
          <li
            v-for="(item, index) in formStatus"
            :key="index"
            :class="{'checked': item.checked}"
            @click="formSatusChange(index)"
          >
            <span>{{ item.name }}</span>
            <check-box :defaultChecked="item.checked" @change="formSatusChange(index)"/>
          </li>
        </ul>
        <div class="buttons">
          <h3-button type="primary" @click="submitStatus">{{ $t('cloudpivot.list.mobile.OK') }}</h3-button>
        </div>
      </div>
      <list-design-search
        v-show="currentWay === 'filter'"
        ref="filters"
        class="search-content-status-input"
        @commit="submitQueryValue"
        :schemaCode="schemaCode"
        :queryConditions="queryConditions"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';
import { H3Input, H3Button } from 'h3-mobile-vue';

import ListDesignSearch from './search-content.vue';

import common from '@cloudpivot/common';

@Component({
  name: 'ListFormSearch',
  components: {
    H3Input,
    H3Button,
    // commonSearch,
    ListDesignSearch,
    BottomButton: common.components.mobile.BottomButton,
    CheckBox: common.components.mobile.Checkbox
  }
})
export default class ListFormSearch extends Vue {
  @Prop() schemaCode!: string; // 业务模型编码

  @Prop() queryConditions!: Array<any>

  searchWays: Array<any> = [
    {
      name: '单据状态',
      type: 'status',
      icon: 'h-icon-all-down-o',
      activeIcon: 'h-icon-all-up-o'
    },
    {
      name: '筛选',
      type: 'filter',
      icon: 'h-icon-all-filter-o'
    }
  ]

  currentWay: string = '';

  currentStatusName: string[] = [];

  formStatus: Array<any> = [];

  logStatusNames() {
    this.currentStatusName = this.formStatus.map((item: any) => item.checked && item.name).filter(Boolean);
  }

  switchWay(item: any) {
    if (item.type === 'filter' && !this.queryConditions.length) {
      this.currentWay = '';
      this.$h3.toast.show({
        text: `${this.$t('cloudpivot.list.mobile.NoFilterTip')}`,
        iconType: 'close'
      });
      return;
    }
    if (this.currentWay === item.type) {
      this.currentWay = '';
    } else {
      this.currentWay = item.type;
    }
  }

  /**
   * 根据筛选条件筛选列表
   */
  submitQueryValue(val: any) {
    this.currentWay = '';
    const status = this.formStatus.filter((res: any) => res.checked);
    // val.instanceState = status.length ? status[0].status : '';
    this.$emit('filter', val);
    this.reSetStatus(val);
  }

  /**
   * 勾选单据状态状态选项
   */
  formSatusChange(index: number) {
    this.formStatus[index].checked = !this.formStatus[index].checked;
    this.logStatusNames();
  }

  /**
   * 根据表单状态筛选列表
   */
  submitStatus() {
    this.currentWay = '';
    const formStatus = {
      propertyCode: 'sequenceStatus',
      propertyType: 0,
      propertyValue: ''
    };
    const targetArr = this.formStatus.filter((res: any) => res.checked);
    formStatus.propertyValue = targetArr.map((res: any) => res.status).join(';');
    this.$emit('filter', [formStatus]);
    this.setFilterStatus();
  }

  /**
   * 将当前左侧筛选的单据状态传入到右侧筛选中的单据状态
   * NOTE: 新增将额外的筛选条件置空
   */
  setFilterStatus(){
    this.queryConditions.forEach((con: any) => {
      if (con.propertyCode === 'sequenceStatus') {
        (this.$refs.filters as any).setFilterValue('sequenceStatus', this.currentStatusName);
      } else {
        (this.$refs.filters as any).setFilterValue(con.propertyCode, "");
      }
    });
    // if (this.queryConditions.some((con:any) => con.propertyCode === 'sequenceStatus')) {
    //   (this.$refs.filters as any).setFilterValue('sequenceStatus', this.currentStatusName);
    // }
  }

  /**
   * 根据筛选条件中的单据状态，重置左侧单据状态下拉信息
   */
  reSetStatus(filters: any) {
    const sequenceStatus:any = filters.find((filter: any) => filter.propertyCode === "sequenceStatus");
    if (sequenceStatus && sequenceStatus.propertyValue) {
      const status: Array<String> = sequenceStatus.propertyValue.split(';');
      this.formStatus.forEach((stat:any) => {
        stat.checked = status.includes(stat.status);
      })
    } else {
      this.formStatus.forEach((stat:any) => {
        stat.checked = true;
      })
    }
    this.logStatusNames();
  }

  /**
   * 页面初始化
   */
  initPage(){
    this.searchWays = this.searchWays = [
      {
        name: `${this.$t('cloudpivot.list.mobile.SequenceStatus')}`,
        type: 'status',
        icon: 'h-icon-all-down-o',
        activeIcon: 'h-icon-all-up-o'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Filter')}`,
        type: 'filter',
        icon: 'h-icon-all-filter-o'
      }
    ];
    this.formStatus = [
      {
        name: `${this.$t('cloudpivot.list.mobile.Processing')}`,
        checked: false,
        status: 'PROCESSING'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Completed')}`,
        checked: false,
        status: 'COMPLETED'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Cancled')}`,
        checked: false,
        status: 'CANCELED'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Draft')}`,
        checked: false,
        status: 'DRAFT'
      }
    ];
  }

  /**
   * 页面初始查询搜索: 根据左侧的单据状态
   */
  initQuery(){
    if (!this.queryConditions.length) {
      this.reSetStatus([]);
      const formStatus = {
        propertyCode: 'sequenceStatus',
        propertyType: 0,
        propertyValue: this.formStatus.map((res: any) => res.status).join(';')
      };
      this.$emit('setFilter', [formStatus]);
    }
  }

  mounted() {
    this.initPage();
  }
}
</script>
<style lang="less" scoped>
/**.px2rem(line-height,@search-head);**/
/*border-left: 1px solid @base-border-color;*/
@import '~@cloudpivot/common/styles/mixins.less';
@search-head: 87px;
@search-has-border: 89px;
@li-line-height: 90px;
.search {
  background: @white-background;
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .px2rem(height, @search-head);
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    border-bottom: 1px solid @base-border-color;
    span {
      .px2rem(font-size, @font-size-base);
    }
    &-inner {
      // flex: 1;
      display: flex;
      justify-content: flex-start;
      line-height: 0.7rem;
      &:last-child {
        justify-content: flex-end;
      }
      span {
        .px2rem(padding-right, 10px);
      }
      .icon {
        font-size: 10px;
      }
    }
    .selectActive {
      font-weight: 500;
      color: @primary-color;
      i {
        color: @primary-color;
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    /*position: absolute;*/
    position: fixed;
    width: 100%;
    // background: @white-background;
    background: @light-color-3;
    bottom: 0;
    /*overflow: hidden;*/
    justify-content: space-between;
    .px2rem(top, @search-has-border);
    z-index: 100;
    &-button {
      flex: none;
      display: flex;
      & > div {
        flex: 1;
      }
    }
    &-wrap {
      /*flex: 1;*/
      flex: 1 0 auto;
      position: relative;
      overflow-y: auto;
    }
    &-status {
      position: absolute;
      top: 0;
      left: 0;
      // height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: @white-background;
      .buttons {
        .px2rem(height, 90px);
        .px2rem(padding-top, 30px);
        .px2rem(padding-right, 30px);
        .px2rem(padding-left, 30px);
        text-align: right;
        /deep/.h3-button {
          display: inline-block;
          .px2rem(width, 112);
          .px2rem(height, 60px);
          .px2rem(line-height, 60px);
          .px2rem(border-radius, 50px);
          .px2rem(font-size, 26px);
          background-color: @primary-color;
          &::before {
            border: none;
          }
        }
      }
    }
    ul {
      width: 100%;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        // width: 50%;
        // padding: 5px 10px;
        // box-sizing: border-box;
        .px2rem(padding-left, @horizontal-padding-lg);
        .px2rem(padding-right, @horizontal-padding-lg);
        .px2rem(line-height, @li-line-height);

        &.checked {
          span:first-child {
            font-weight: 500;
            color: @text-color-main;
          }
        }
        span:first-child {
          .px2rem(font-size, @font-size-base);
        }

        /deep/.home-checkbox-item {
          float: right;
          .px2rem(width, 36px);
          .px2rem(height, 36px);
          .px2rem(line-height, 36px);
        }

        // .inner {
        //   background: rgba(247, 248, 252, 1);
        //   border-radius: 4px;
        //   padding-left: 10px;
        //   color: #333;
        // }

        // .active {
        //   color: @primary-color !important;
        //   background: rgba(41, 112, 255, 0.1036) !important;
        //   font-weight: 500 !important;
        // }

        // .bold {
        //   font-weight: 500;
        //   color: @text-color-main;
        // }

        // span {
        //   .px2rem(font-size, @font-size-base);
        // }

        // i {
        //   float: right;
        //   color: @primary-color;
        //   .px2rem(padding-right, @horizontal-padding-lg);
        // }
      }
    }
    .search-content-status-input {
      height: 100%;
      /*height: auto;*/
      // background: @white-background;
      // position: absolute;
      // z-index: 99;
      // width: 100%;
      // height: 100%;
      // top: 0;
      // left: 0;
      // overflow-y: auto;
      // .status-input-button {
      //   position: absolute;
      //   z-index: 9;
      //   bottom: 0;
      // }
    }
  }
}
</style>
