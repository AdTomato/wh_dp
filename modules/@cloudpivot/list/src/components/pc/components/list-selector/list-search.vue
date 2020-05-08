<template>
  <div class="list-selector-search">
    <div 
      class="actions" 
      :class="{ 'has-filterbox' : isShowFilterBox && showSearch }"
    >
      <slot name="add-btn"></slot>
      <div class="settings-item" v-if="queryConditions.length >= 1">
        <filterCard
          @clear="clearFilter"
          v-if="queryConditionSource.length === 1"
          :source="queryConditionSource"
        />
        <filterCard
          @item-click="toggleQueryConditions"
          @clear="clearFilter"
          v-else-if="queryConditionSource.length >= 1"
          :source="queryConditionSource"
        />
        <a-tooltip >
          <template slot="title">
            {{ $t('cloudpivot.list.pc.Screen') }} 
          </template>
          <i
            class="icon aufontAll  h-icon-all-filter-o"
            :class="{'high-light': isShowFilterBox}"
            @click="toggleQueryConditions"
          ></i>
        </a-tooltip>
      </div>
    </div>
    <div
      class="filters-box show-more"
      v-show="showSearchBox"
    >
      <slot name="form"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Model, Emit
} from 'vue-property-decorator';

@Component({
  name: 'list-search',
})

export default class ListSearch extends Vue {

  /**
   * 目前用来区分是反向查询还是关联表单
   */
  @Prop({
    default: true
  })
  showSearch !: boolean;

  @Prop({
    default: false
  })
  showSearchBox !: boolean;

  @Prop({
    default: false
  })
  isShowFilterBox !: boolean;

  @Prop({
    default: false
  })
  isReverse !: boolean;

  @Prop({
    default: []
  })
  queryConditionSource;

  @Prop({
    default: []
  })
  queryConditions;

  @Emit('toggleQueryConditions')
  toggleQueryConditions () {
  }
  @Emit('clearFilter')
  clearFilter () {
  }
}

</script>

<style lang="less" scoped>
.list-selector-search {
  // position: relative;
  overflow: hidden;
  .filters-box {
    position: absolute;
    width: 100%;
    z-index: 666;
    padding: 0 4px 8px;
    background: #fff;
    
    /deep/.collapsed  {
      // height: 100%;
      // overflow: auto;
    }
    &.show-more{
      height: 100%;
      overflow: auto;
    }
  }
  .actions{
    // text-align: right;
    display: flex;
    // margin-bottom: 8px;
  }
  .settings-item {
    margin-left: 20px;
    margin-top: 4px;
    cursor: pointer;
    .icon:hover {
      color: @primary-color;
    }
    .high-light{
      color: @primary-color;
    }
  }
  .query-form{
    box-shadow: 0px 4px 8px 0px rgba(30, 85, 255, 0.1);
  }
}
</style>
