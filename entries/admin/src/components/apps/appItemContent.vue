<template>
  <div class="item-content">
    <!-- <ul class="content-list"> -->
    <!-- 新建模型 -->
    <!-- <li class="list" @click="showNewModel">
        <img src="../../assets/images/newmodel.png" alt="">
        <p>{{ $t('languages.Apps.AddModel') }}</p>
    </li>-->
    <!-- 自定义页面 -->
    <!-- <li class="list">
        <img src="../../assets/images/custompage.png" alt="">
        <p>{{ $t('languages.Apps.CustomPage') }}</p>
    </li>-->
    <!-- 导入 -->
    <!-- <li class="list" @click="importData">
        <img src="../../assets/images/import.png" alt="">
        <p>{{ $t('languages.Apps.Import') }}</p>
    </li>-->
    <!-- </ul> -->
    <div class="item-content-head">

      <a-dropdown :placement="placement">

        <a-button
          type="primary"
          class="btns"
        >
          <a-icon type="plus" class="app-icon-plus"/>{{ $t('languages.Apps.AddNew') }}
        </a-button>

        <a-menu slot="overlay">
          <a-menu-item @click="showNewModel">
            <div>{{ $t('languages.Apps.AddModel') }}</div>
          </a-menu-item>
          <a-menu-item @click="addGroups">
            <div>{{ $t('languages.Apps.AddGroup') }}</div>
          </a-menu-item>
          <a-menu-item @click="addDefinPage">
            <div>{{ $t('languages.Apps.AddCustomPage') }}</div>
          </a-menu-item>
          <a-menu-item @click="addReport">
            <div>{{ $t('languages.Apps.AddReport') }}</div>
          </a-menu-item>
        </a-menu>

      </a-dropdown>

      <!--       
      <a-button class="btns" @click="addGroups">
        <a-icon type="plus"/>
        <span>{{ $t('languages.Apps.Group') }}</span>
      </a-button>

      <a-button class="btns" @click="addDefinPage">
        <a-icon type="plus"/>
        <span>{{ $t('languages.Apps.AddCustomPage') }}</span>
      </a-button> -->
      <!--
      <a-button
        class="btns"
        @click="addReport"
      >
        <a-icon type="plus"/>报表
      </a-button> -->
      <a-button class="btns" @click="importData">
        <i class="icon aufontAll h-icon-all-download-o"></i>
        <!--{{ $t('languages.Apps.Import') }}-->
        <span>{{ $t('languages.Apps.Import') }}</span>
      </a-button>
      <!-- <a-input
        :placeholder="$t('languages.Apps.Search')"
        class="input-search"
        v-model="searchKey"
        v-show="appMenu && appMenu.length>1000000"
        @pressEnter="onSearch"
      >
        <a-icon
          class="suffix-icon close-icon"
          v-if="searchKey.length > 0 "
          slot="suffix"
          type="close-circle"
          @click="clearKeyword"
        />

        <a-icon
          class="suffix-icon"
          type="search"
          slot="suffix"
          @click="onSearch"
        />
      </a-input>
      <a-dropdown class="drop-down" v-show="appMenu && appMenu.length>1000000">
        <a class="ant-dropdown-link" href="#">
          默认类型
          <a-icon type="down"/>
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;">默认类型</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">仅分组</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">仅模型</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown> -->
    </div>
    <div
      class="item-content-list"
      @scroll="contenScroll"
      id="item-content"
      ref="itemContent"
    >
      <Draggable
        element="div"
        :id="appDetails.id"
        :list="appMenu"
        class="biz-model-wrap"
        :options="dragItemOptions"
        @end="onSortEnd"
      >
        <template v-for="item in appMenu">
          <BizModel
            :key="item.code"
            :id="item.code"
            :itemData="item"
            :searchKey="searchKey"
            v-if="item.type === 'BizModel' || item.type === 'Page' || item.type === 'Report'"
          ></BizModel>
        </template>
      </Draggable>
      <template v-for="item in appMenu">
        <BizModelGroup
          :class="{'cur-folder':curFolderId === `anchor${item.sortKey}`}"
          :key="item.code"
          :id="`anchor${item.sortKey}`"
          :itemData="item"
          :searchKey="searchKey"
          @addModel="showNewModel"
          v-if="item.type === 'Folder'"
        ></BizModelGroup>
      </template>
      <div class="item-content-list-empty" v-if="!appMenu.length && appMenuLoaded">
        <img src="@/assets/images/nodata.png" alt="empty"/>
        <p>
          <span>{{ $t('languages.Apps.NoAppItemPlz') }}</span>
          <span class="add">{{ $t('languages.Apps.AddModel') }}</span>
          <span>{{ $t('languages.Apps.Or') }}</span>
          <span class="add">{{ $t('languages.Apps.AddGroup') }}</span>
        </p>
      </div>
    </div>
    <div
      class="back-top"
      v-show="backTop"
      @click="goBackTop"
    >
      <i class="icon aufontAll h-icon-all-circle-up"></i>
    </div>
    <!-- 新建模型弹窗 -->
    <AddBizModel v-model="newModel" @getBizModel="getBizModel"></AddBizModel>
    <!-- 新建分组弹窗 -->
    <AddFolder
      v-model="showAddFolder"
      :folderModel="folderModel"
      @resetFolderModel="resetFolderModel"
    ></AddFolder>

    <!-- 新建报表弹窗 -->
    <AddReport
      v-model="showAddReport"
      mode="add"
    ></AddReport>

    <!-- 导入 -->
    <data-import
      v-model="isShowDataImport"
      :accept="'.xml'"
      :action="uploadUrl"
      @importEnd="onImportSuccess"
    ></data-import>

    <!-- 新建自定义页面 -->
    <add-define-page
      :isShowDefinePage="isShowDefinPage"
      :appCode="appDetails.code"
      :parentId="appDetails.id"
      @cancel="closeDefinePage"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import Draggable from 'vuedraggable';
import AddBizModel from '@/components/apps/modals/addBizModel.vue';
import AddFolder from '@/components/apps/modals/addFolders.vue';
import AddReport from '@/components/apps/modals/addReport.vue';
import BizModel from '@/components/apps/bizModel.vue';
import BizModelGroup from '@/components/apps/bizModelGroup.vue';
import AddDefinePage from '@/components/apps/modals/add-define-page.vue';
import { pattern } from '@/common/utils';
import AppsApi from '@/apis/apps';
import * as formApi from '@/apis/form';

import { LanguageTransform } from '@/utils';

import DataImport from './modals/import/index.vue';

const MenuModule = namespace('Apps/AppItem');
const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'appitemcontent',
  components: {
    AddBizModel,
    AddFolder,
    AddReport,
    DataImport,
    BizModel,
    BizModelGroup,
    Draggable,
    AddDefinePage
  }
})

export default class AppItemContent extends Vue {
  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.State('appMenu') appMenu: any;

  @MenuModule.State('appMenuLoaded') appMenuLoaded: any;

  @MenuModule.State('menuId') menuId: any;

  @MenuModule.Mutation('setMenuId') setMenuId: any;

  @MenuModule.Action('getAppItem') getAppItem: any;

  @MenuModule.Action('appItemTreeSort') appItemTreeSort: any;

  @Prop() curFolderId!: string;
  @Prop({default: 'bottomLeft'}) placement!: string;
  newModel: boolean = false;

  showAddFolder: boolean = false;

  folderModel: any = {};

  // 搜索关键字
  searchKey:string = '';

  // 是否展示回到顶部
  backTop:boolean = false;

  // 搜索模型数组
  searchList: any = [];

  // 是否为搜索结果
  isSearchResult: boolean = false;

  showAddReport:boolean = false;

  // 是否展示文件上传
  isShowDataImport:boolean = false;

  // 是否展示自定义页面
  isShowDefinPage: boolean = false;

  dragItemOptions: any = {
    animation: 150,
    sort: true,
    group: {
      name: 'Folder',
    },
  }

  get uploadUrl() {
    return AppsApi.fileUploadUrl;
  }

  onSortEnd(evt: any) {
    const parentId: string = evt.to.id;
    const ItemId: string = evt.item.id;
    const sortKey: number = parseInt(evt.newIndex, 10) + 1;
    const parmars: Apps.AppItem.AppItemSortParams = {
      code: ItemId,
      parentId,
      sortKey
    };
    console.log('content', parentId);
    this.appItemTreeSort(parmars);
  }

  // 应用搜索
  onSearch() {
    this.searchList = [];
    if (this.searchKey) {
      this.appMenu.forEach((app: any) => {
        const langName:string = this.getLangName(app);
        if (langName.indexOf(this.searchKey) !== -1) {
          this.searchList.push(app);
        }
      });
      this.isSearchResult = true;
    } else {
      this.isSearchResult = false;
    }
  }

  // 清空搜索关键字
  clearKeyword() {
    this.searchKey = '';
    this.isSearchResult = false;
  }

  // 新建分组
  addGroups() {
    // 新建分组弹窗
    this.showAddFolder = true;
  }

  // 新增报表
  addReport() {
    // 新增报表弹窗
    this.showAddReport = true;
  }

  // 重置传入分组模态窗的数据
  resetFolderModel() {
    this.folderModel = {};
  }

  // 打开新建模型模态窗
  showNewModel(id: string) {
    if (id && typeof id === 'string') {
      this.setMenuId(id);
    }
    this.newModel = true;
  }

  // 新建业务模型后回传数据给父组件
  getBizModel(formData: any) {
    this.openBizModel(formData.code);
  }

  // 打开数据模型页面
  async openBizModel(bizSchemaCode: string) {
    if (!this.appInfo.appCode) {
      return;
    }
    const data = await this.getFormList(bizSchemaCode);
    const href = `/admin#/apps/model/${this.appInfo.appCode}/${bizSchemaCode}/form-design/${data[0].code}`;
    window.open(href, '_blank');
  }

  /**
   * @desc 获取最新表单列表
   * @params bizSchemaCode 业务模型编码
  */
  async getFormList(schemaCode: string) {
    const res = await formApi.list(schemaCode);
    if (res.errcode === 0) {
      return res.data;
    }
    return null;
  }

  // 内容区域滚动事件
  contenScroll() {
    const itemDom = this.$refs.itemContent as HTMLElement;
    if (!itemDom) {
      return;
    }
    if (itemDom.scrollTop > 50) {
      this.backTop = true;
    } else {
      this.backTop = false;
    }
  }

  // 回到顶部
  goBackTop() {
    const itemDom = this.$refs.itemContent as HTMLElement;
    if (!itemDom) {
      return;
    }
    itemDom.scrollTop = 0;
  }

  importData() {
    this.isShowDataImport = true;
  }

  /**
   * 添加自定义页面
   */
  addDefinPage() {
    this.isShowDefinPage = true;
  }

  closeDefinePage(isGetItems: boolean) {
    this.isShowDefinPage = false;
    if (isGetItems) {
      this.getAppItem({ appCode: this.appInfo.appCode });
    }
  }

  /**
   * 导入成功的时候
   */
  onImportSuccess(v: boolean) {
    this.getAppItem({ appCode: this.appInfo.appCode });
  }

  getLangName(item: any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }
}
</script>

<style lang="less" scoped>
.item-content {
  height: 100%;
  background: #f6f7f9;
  padding: 24px;
  padding-right: 0;
  .item-content-head {
    margin-bottom: 12px;
    margin-right: 24px;
     margin-left:4px !important;
    text-align: left;
    .app-icon-plus{
      margin-right:0 !important;
    }
    .btns {
      min-width: 82px;
      height: 32px;
      margin-right: 8px;
      i {
        margin-right: 8px;
        font-size: 14px;
      }
      span{
        margin-left: 0;
      }
    }
    // .btn{
    //   margin-right: 8px;
    //   i{
    //     margin-right: 8px;
    //     font-size: 14px;
    //   }
    // }
    .input-search {
      width: 240px;
      float: right;
      .close-icon {
        color: rgba(0, 0, 0, 0.25);
        margin-right: 12px;
      }
    }
    .drop-down {
      float: right;
      line-height: 32px;
      margin-right: 22px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .item-content-list {
    text-align: left;
    overflow-y: scroll;
    height: calc(100% - 56px);
    &-empty {
      height: 100%;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 402px;
        height: 195px;
        object-fit: contain;
      }
      span {
        color: rgba(0, 0, 0, 0.65);
      }
      .add {
        color: @primary-color;
        cursor: pointer;
      }
    }
  }
  .back-top {
    position: fixed;
    right: 24px;
    bottom: 24px;
    i {
      font-size: 44px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
.ant-row {
  margin-bottom: 16px;
}
</style>
<style lang="less">
.item-content {
  .item-content-list {
    & > .biz-model-wrap {
       margin-left:4px !important;
      .biz-model {
        .biz-model-icon {
          color: #f5222d;
        }
      }
    }
    & > .biz-model-group:nth-child(4n + 1) {
      .biz-model-icon {
        color: #fa8c16;
      }
    }
    & > .biz-model-group:nth-child(4n + 2) {
      .biz-model-icon {
        color: #1890ff;
      }
    }
    & > .biz-model-group:nth-child(4n + 3) {
      .biz-model-icon {
        color: #13c2c2;
      }
    }
    & > .biz-model-group:nth-child(4n) {
      .biz-model-icon {
        color: #f5222d;
      }
    }
    .cur-folder {
      .biz-model-group-head-title {
        color: @primary-color;
      }
    }
    .biz-model-group-head,.biz-model-group-content{
     margin-left:4px !important;
   }
  }
}
</style>
