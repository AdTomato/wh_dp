<template>
  <div class="folder-instances">
    <p 
      class="folder-instances__title" 
      slot="title" 
      @click="openFolder"
    >
      <span>{{ `${ appName }-${ getLangName(folder)}` }}</span>
      <!-- 控制图标 -->
      <span class="right">
        <span class="counts">{{ folder.size }} {{ $t('cloudpivot.flowCenter.mobile.flowItems') }}</span>
        <!-- <span class="text">{{ text }}</span> -->
        <i class="icon aufontAll h-icon-all-up-o" :class="!opened && 'closed'"/>
      </span>
      <!--<span class="folder-instances__icon">-->
      <!--{{ folder.size }}个-->
      <!--<i class="icon aufontAll h-icon-all-caret-down" :class="{'active': opened}"/>-->
      <!--</span>-->
    </p>
    <transition name="collapse">
      <grid-list
        v-show="opened"
        class="collapse-item"
        colorKey="code"
        :list="showList"
        @onItem="$emit('onItem',$event)"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { initialInstanceApi, initialInstanceParams } from '@cloudpivot/api';
import common from '@cloudpivot/common';
@Component({
  name: 'folder-instances',
  components: {
    GridList: common.components.mobile.GridList
  }
})
export default class FolderInstances extends Vue {
  @Prop() folder!: initialInstanceParams.InstanceItem;

  @Prop() appName!: string;

  showList: Array<initialInstanceParams.InstanceItem> = [];

  opened: boolean = false;

  // text: string = '展开';

  mounted() {
    this.showList = this.folder.children || [];
  }

  getLangName(item: any){
    return common.utils.BusinessFunctions.getLangName(item);
  }

  /**
   * 展开/收起 目录
   */
  openFolder() {
    if (this.opened) {
      this.opened = false;
      // this.text = '展开';
    } else if (!this.showList.length) {
      /* get folder items from api */
      initialInstanceApi.listMyWorkflowByFolderId(this.folder.id, true).then((res: initialInstanceParams.HttpResponse<any>) => {
        console.log(res.data);
        if (Array.isArray(res.data)) {
          this.showList = res.data;
        }
        this.opened = true;
        // this.text = '收起';
      });
    } else {
      this.opened = true;
      // this.text = '收起';
    }
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.folder-instances {
  .px2rem(margin-top, @horizontal-padding-md);
  .px2rem(margin-bottom, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  text-align: left;
  background: @white-background;
  &__title {
    display: flex;
    justify-content: space-between;
    .px2rem(line-height, 40px);
    .px2rem(font-size, 28px);
    color: rgba(0,0,0,0.85);
    font-weight: 500;
    .right {
      flex: 1 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 10px;
      color: #999;
      .px2rem(font-size, 24px);
      span {
        display: inline-block;
        line-height: 1;
      }
    }
    i {
      transition: all 0.3s;
      &.closed {
        transform: rotate(180deg);
      }
    }
  }
  &__icon {
    float: right;
    color: #666;
    i {
      display: inline-block;
      .px2rem(line-height, 40px);
      .px2rem(margin-left, 16px);
      .px2rem(font-size, 16px);
      transition: all 0.35s linear;
      &.active {
        transform: rotate(180deg);
        transform-origin: center;
      }
    }
  }
}
</style>
