<template>
  <div class="biz-model-group">
    <div class="biz-model-group-head" v-if="itemData.children">
      <div class="mark"></div>
      <span class="biz-model-group-head-title">{{ getLangName(itemData) }}</span>
      <span class="biz-model-group-head-num" v-show="itemData.children && itemData.children.length">{{ `${$t('languages.Apps.Model')}*${ itemData.children.length}` }}</span>
      <a-popover
        placement="rightTop"
        trigger="click"
        :visible="isShowPop"
        overlayClassName="popover"
        @visibleChange="onVisibleChange($event,itemData.code)"
      >
        <template slot="content">
          <p @click="openFolderModel(itemData)">{{ $t('languages.Apps.Rename') }}</p>
          <p @click="popMenu(itemData)">{{ $t('languages.Apps.Delete') }}</p>
        </template>
        <i class="icon aufontAll h-icon-all-setting-o setting" :class="{'isshow':showIcon&&iconCode===itemData.code}"></i>
      </a-popover>
      <span class="biz-model-group-head-empty" v-if="itemData.children && !itemData.children.length">
        <span>{{ $t('languages.Apps.GroupHasNoModel') }}，{{ $t('languages.Apps.Please') }}</span>
        <span class="add-model" @click="addModel">{{ ($t('languages.Apps.AddModel')).toLowerCase() }}</span>
      </span>
    </div>
    <Draggable
      element="div"
      :id="itemData.id"
      :list="itemData.children"
      :options="dragItemOptions"
      class="biz-model-group-content"
      @end="onSortEnd"
    >
      <template v-for="subItem in itemData.children">
        <BizModel
          :key="subItem.code"
          :id="subItem.code"
          :itemData="subItem"
          :searchKey="searchKey"
        ></BizModel>
      </template>
    </Draggable>
    <!-- 编辑分组模态窗 -->
    <AddFolder
      v-model="showAddFolder"
      :folderModel="folderModel"
      @resetFolderModel="resetFolderModel"
    ></AddFolder>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import BizModel from '@/components/apps/bizModel.vue';
import AddFolder from '@/components/apps/modals/addFolders.vue';
import Draggable from 'vuedraggable';

import { LanguageTransform } from '@/utils';

const MenuModule = namespace('Apps/AppItem');

@Component({
  name: 'bizModelGroup',
  components: {
    BizModel,
    AddFolder,
    Draggable
  }
})

export default class BizModelGroup extends Vue {
  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.Mutation('setMenuId') setMenuId: any;

  @MenuModule.Action('deleteFolders') deleteFolders: any;

  @MenuModule.Action('validFolders') validFolders: any;

  @MenuModule.Action('appItemTreeSort') appItemTreeSort: any;

  @Prop() itemData!: any;

  @Prop() searchKey!: string;

  showIcon:boolean = false;

  iconCode:string = '';

  showAddFolder:boolean = false;

  folderModel:any = {};

  isClose:boolean = false;

  isShowPop:boolean = false;

  dragItemOptions:any = {
    animation: 150,
    sort: true,
    group: {
      name: 'Folder',
    },
  }

  onSortEnd(evt:any) {
    const parentId:string = evt.to.id;
    const ItemId:string = evt.item.id;
    const sortKey:number = parseInt(evt.newIndex, 10) + 1;
    const parmars:Apps.AppItem.AppItemSortParams = {
      code: ItemId,
      parentId,
      sortKey
    };
    console.log('group', parentId);
    this.appItemTreeSort(parmars);
  }

  /* *
  * 打开新建模型模态窗
  */
  addModel() {
    this.$emit('addModel', this.itemData.id);
  }

  onVisibleChange(visible: boolean, code: string) {
    this.showIcon = visible;
    this.iconCode = code;
    this.isShowPop = visible;
  }

  /* *
  * 打开编辑分组模态窗
  */
  openFolderModel(item:any) {
    this.isShowPop = false;
    this.showIcon = false;
    this.folderModel = item;
    this.showAddFolder = true;
  }

  /* *
  * 重置传入分组模态窗的数据
  */
  resetFolderModel() {
    this.folderModel = {};
  }

  /* *
  * 删除分组
  */
  popMenu(item: any) {
    if (this.isClose) {
      // 避免重复点击删除弹窗
      return;
    }
    this.isShowPop = false;
    this.showIcon = false;
    item.showPop = false;
    const vm: any = this;
    this.isClose = true;
    const validParams:Apps.AppItem.ValidFolder = {
      folderId: item.id,
      appCode: this.appInfo.appCode
    };
    const deleteParams:Apps.AppItem.DeleteFolders = {
      folderId: item.id
    };
    this.validFolders(validParams).then((res: Common.Data) => {
      if (res.errcode) {
        /* 删除分组 —— 分组下有模型 */
        this.$warning({
          title: this.$t('languages.Apps.DeletePrompt'),
          okText: this.$t('languages.Apps.Ok').toString(),
          cancelText: this.$t('languages.Apps.Cancel').toString(),
          content: this.$t('languages.Apps.GroupHasModelCannotBeDelete'), // '该分组下已经创建了模型，不能被删除，请先删除模型! '
          onOk() {
            vm.isClose = false;
          }
        });
      } else {
        /* 删除分组 —— 分组下无模型 */
        this.$confirm({
          title: this.$t('languages.Apps.ConfirmDelete', { name: item.name }), // `确定要删除“${item.title}”吗？`,
          okType: 'danger',
          okText: this.$t('languages.Apps.Delete').toString(),
          cancelText: this.$t('languages.Apps.Cancel').toString(),
          onOk() {
            vm.isClose = false;
            vm.setMenuId('');
            vm.deleteFolders(deleteParams);
          },
          onCancel() {
            vm.isClose = false;
          }
        });
      }
    });
  }

  getLangName(item: any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }
}

</script>

<style lang="less" scoped>
.biz-model-group{
  cursor: pointer;
  margin-top: 16px;
  &-head{
    &:hover{
      .setting {
        visibility: visible;
      }
    }
    .mark{
      width: 3px;
      height: 18px;
      float: left;
      margin-right: 14px;
      margin-top: 4px;
      border-radius: 2px;
      background: @primary-color;
    }
    &-title{
      font-size: 18px;
      font-family: PingFang-SC-Medium;
      margin-right: 8px;
      font-weight: 500;
      color: rgba(0,0,0,0.85);
      line-height: 26px;
    }
    &-num{
      margin-right: 16px;
      font-size: 12px;
      color: rgba(0,0,0,0.45);
    }
    &-empty{
      text-align: center;
      margin-left: 8px;
      span{
        color: rgba(0,0,0,0.45);
      }
      .add-model{
        color: @primary-color;
        cursor: pointer;
      }
    }
  }
  .setting {
    z-index: 9;
    font-size: 16px;
    color: rgba(0,0,0,0.45);
    visibility: hidden;
    cursor: pointer;
    &:hover {
      color: @primary-color;
    }
  }
  .isshow {
    visibility: visible !important;
  }
}
</style>
