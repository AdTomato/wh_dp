<template>
  <header class="top-bar section-bar">
    <!-- 标题 -->
    <div class="bar-title" @click="showDropViewList">
      <div class="bar-name">{{ backupsName }}</div>
      <i v-show="!showDropList" class="icon aufontAll h-icon-all-down-o"></i>
      <i v-show="showDropList" class="icon aufontAll h-icon-all-up-o"></i>
    </div>
    <!-- 新增按钮 -->
    <div class="bar-operation" @click="showAddView">
      <i class="icon aufontAll h-icon-all-plus-square"></i>
    </div>
    <!-- 切换视图 -->
    <div class="bar-action" v-show="designType === 'page'">
      <a-radio-group :value="clientType">
        <a-radio-button @click="setClient" value="PC">{{ $t('languages.Apps.listDesignPage.pcTerminal') }}</a-radio-button>
        <a-radio-button @click="setClient" value="APP">{{ $t('languages.Apps.listDesignPage.mobileTerminal') }}</a-radio-button>
      </a-radio-group>
    </div>
    <div class="bar-tips" v-show="designType === 'html'">{{ `当前处于${clientText}html设计模式下` }}</div>
    <!-- 右侧提醒/预览/发布 -->
    <div v-show="!isPublish" class="publish-btn">未发布</div>
    <span class="bar-right">
      <a-button @click="preview">
        <i class="icon aufontAll h-icon-all-eye-o"></i> {{ $t('languages.Apps.Preview') }}
      </a-button>
      <button
        class="ant-btn ant-btn-primary"
        @click="handleSave"
      >
        <i class="icon aufontAll h-icon-all-plane-o"></i>
        <span>{{ $t('languages.Apps.Publish') }}</span>
      </button>
    </span>
    <!-- 视图下拉列表 -->
    <div
      class="lists"
      v-show="showDropList"
    >
      <a-radio-group :defaultValue="listCode" :value="listCode">
        <draggable
          v-model="lists"
          :options="dragItemOptions"
          @end="onEnd">
          <div
            v-for="(list, idx) in lists"
            :id="list.code"
            :key="list.code + idx"
            class="list-item"
          >
            <a-radio
              :value="list.code"
              @click="goListConfirm(list)"
            >
              <div class="item-content">
                <i class="icon aufontAll h-icon-all-layout-o"></i>
                <div class="item-name">{{ list.name }}</div>
              </div>
            </a-radio>
            <div class="item-operation" @click.stop="()=>{}">
              <a-tooltip placement="top" :mouseEnterDelay="1">
                <template slot="title">
                  <span>PC端展示</span>
                </template>
                <i
                  @click="showPC(list)"
                  :class="{'selected': list.showOnPc}"
                  class="icon aufontAll h-icon-all-desktop-o i25"
                ></i>
              </a-tooltip>
              <a-tooltip placement="top" :mouseEnterDelay="1">
                <template slot="title">
                  <span>移动端展示</span>
                </template>
                <i
                  @click="showMobile(list)"
                  :class="{'selected': list.showOnMobile}"
                  class="icon aufontAll h-icon-all-mobile i25"
                ></i>
              </a-tooltip>
              <div class="line"></div>
              <i
                @click="openDeleteConfirm(list)"
                :class="{'not-allowed': list.showOnPc || list.showOnMobile}"
                class="icon aufontAll h-icon-all-delete-o i65"
              ></i>
              <i class="icon aufontAll h-icon-all-drag i45 drag"></i>
            </div>
          </div>
        </draggable>
      </a-radio-group>

      <!-- 下拉框遮罩 -->
      <div class="filter-mask" @click="showDropList = false"></div>
    </div>

    <!-- 预览弹窗 -->
    <div class="design__preview" v-if="showPreview">
      <ListPreview :curview="clientType" @hidePreview="hidePreview"></ListPreview>
    </div>

    <!-- 新建列表弹窗 -->
    <AddListModal
      :schemaCode="schemaCode"
      v-model="isShowListModal"
      :data="curListData"
      @confirm="handleConfirmList"
      @cancel="handleCancelList"
    />

    <!-- 离开时保存提示弹窗 -->
    <a-modal
      :visible="showUnsaveConfirm"
      :closable="false"
      :maskClosable="false"
      :width="400"
      wrapClassName="unsave-confirm"
    >
      <div class="unsave-confirm--content">
        <i class="icon aufontAll h-icon-all-question-circle"></i>
        <strong>{{ $t('languages.Apps.ListLeaveTips') }}</strong>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="handleConfirmCancel">{{ $t("languages.Apps.Cancel") }}</a-button>
        <a-button key="unsave" @click="handleConfirmUnsave">{{ $t("languages.Apps.Unpublish") }}</a-button>
        <a-button
          key="save"
          type="primary"
          @click="handleConfirmOk"
        >{{ $t("languages.Apps.PublishAndLeave") }}</a-button>
      </template>
    </a-modal>
  </header>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import AddListModal from '@/components/apps/modals/addList.vue';
import ListPreview from '@/components/apps/list-preview/list-preview.vue';
import * as listApi from '@/apis/list/list.api';

import * as ModelAction from '@/typings/model-action';
import Draggable from 'vuedraggable';

import Bus from '@/utils/bus';

const ListdesignModule = namespace('Apps/Listdesign');

import * as H3List from '@cloudpivot/h3-list';

@Component({
  name: 'ListDesignHeader',
  components: {
    AddListModal,
    Draggable,
    ListPreview
  }
})
export default class ListDesignHeader extends Vue {
  @ListdesignModule.State('backupsName') backupsName: any;

  @ListdesignModule.State('clientType') clientType: any;

  @ListdesignModule.State('isPublish') isPublish: any;

  @ListdesignModule.State('edit') edit: any;

  @ListdesignModule.State('saveCompleted') saveCompleted: any;

  @ListdesignModule.Mutation('onEdit') onEdit: any;

  @ListdesignModule.Mutation('setSaveFlage') mutationSaveFlage: any;

  @ListdesignModule.Mutation('setClientType') setClientType: any;

  @ListdesignModule.Action('getListTitle') getListTitle: any;

  @Prop() designType!:any;
  @Prop() showPreview:boolean = false;

  showDropList:boolean = false;

  lists:any[] = [];

  isShowListModal: boolean = false;

  curListData: any = {};

  clientText:string = 'PC端';

  showUnsaveConfirm = false;

  saveConfirmPromiseResolve : Function | null = null;

  saveConfirmPromiseReject : Function | null = null;

  dragItemOptions: any = {
    ghostClass: 'ghostClass',
    fallbackClass: 'dragClass',
  }

  // 不好做国际化, 加上抽离意义不大, 将数据直接写在 <template> 里
  // views:any = [
  //   {
  //     value: H3List.schema.ClientTypes.PC,
  //     text: 'PC端设计'
  //   },
  //   {
  //     value: H3List.schema.ClientTypes.APP,
  //     text: "移动端设计"
  //   }
  // ];

  created() {
    this.getListTitle({schemaCode: this.schemaCode, listCode: this.listCode});
    this.setClientType(H3List.schema.ClientTypes.PC);
    this.getLists();
  }

  handleSave() {
    this.$emit('handleSave');
  }

  get listCode() {
    return this.$route.params.code;
  }

  get schemaCode() {
    return this.$route.params.bizSchemaCode;
  }

  get appCode() {
    return this.$route.params.appCode;
  }

  /*
  * 预览
  */
  preview() {
    // const { appCode } = this.$route.params;
    // const { href } = this.$router.resolve({
    //   name: 'list-preview',
    //   params: this.$route.params
    // });
    // window.open(href, '_blank');
    this.$emit('togglePreview', true);
  }

  hidePreview() {
    this.$emit('togglePreview', false);
  }

  /*
  * 设置pc端设计、移动端设计
  */
  setClient(evt: any) {
    const type = evt.target.value;
    const vm:any = this;
    if (vm.edit) {
      vm.confirmSave().then(
        () => {
          vm.setClientType(type);
          vm.clientText = type === H3List.schema.ClientTypes.PC ? 'PC端' : '移动端';
          vm.$emit('viewChange');
          vm.onEdit(false);
        },
        () => {
          return;
        }
      );
    } else {
      vm.setClientType(type);
      vm.clientText = type === H3List.schema.ClientTypes.PC ? 'PC端' : '移动端';
      vm.$emit('viewChange');
    }
  }

  /*
  * 展开视图下拉列表
  */
  showDropViewList() {
    this.showDropList = !this.showDropList;
  }

  /*
  * 打开新增视图弹窗
  */
  showAddView() {
    this.curListData = {};
    this.isShowListModal = true;
  }

  /*
  * 新增视图弹窗确定回调
  */
  handleConfirmList(listData: any) {
    this.getLists();
    this.isShowListModal = false;
    this.goList(listData);
  }

  /*
  * 新增视图弹窗取消回调
  */
  handleCancelList() {
    this.isShowListModal = false;
  }

  /*
  * 跳转视图（列表）-- 离开保存提示窗
  */
  goListConfirm(list: any) {
    const vm = this;
    if (vm.edit) {
      vm.confirmSave().then(
        () => {
          vm.onEdit(false);
          vm.goList(list);
        },
        () => {
          this.showDropList = false;
          return;
        }
      );
    } else {
      vm.goList(list);
    }
  }

  /*
  * 跳转视图（列表）
  */
  goList(list: any) {
    this.$router.push({
      name: 'list-design',
      params: {
        bizSchemaCode: this.schemaCode,
        code: list.code
      }
    });
    this.showDropList = false;
    this.saveModelAction(ModelAction.ModalActionTypes.List, list.code);
    this.$emit('viewChange');
  }

  /**
   * @desc 存储操作痕迹
   * @params type 当前操作类型
   * @params code 当前操作项的code
   */
  saveModelAction(type: number, code: string) {
    if (!type) return;
    const modelActions = window.localStorage.getItem('ModelAction') as string;
    const { bizSchemaCode } = this.$route.params;
    const obj: ModelAction.ModelActionItem = {
      type,
      code,
      bizSchemaCode
    };
    if (!modelActions) {
      window.localStorage.setItem('ModelAction', JSON.stringify([obj]));
    } else {
      const modelActionsArray = JSON.parse(modelActions);
      const newReords: any = modelActionsArray.filter((item: any) => (item.bizSchemaCode !== bizSchemaCode) && (item.code !== code));
      newReords.push(obj);
      window.localStorage.setItem('ModelAction', JSON.stringify(newReords));
    }
  }

  /*
  * 展示pc视图
  */
  showPC(item:any) {
    console.log('item', item);
    if (item.showOnPc) {
      const pcLength:number = this.lists.filter((l:any) => l.showOnPc).length;
      if (pcLength <= 1) {
        this.$message.error('该视图展示为必选，不可取消');
      } else {
        item.showOnPc = false;
      }
    } else {
      item.showOnPc = true;
    }
    this.updateShowOn(item);
  }

  /*
  * 展示移动端视图
  */
  showMobile(item:any) {
    if (!item.publish) {
      this.$message.error('该视图未发布，发布之后才能在移动端展示');
      return;
    }

    if (item.showOnMobile) {
      const mobileLength:number = this.lists.filter((l:any) => l.showOnMobile).length;
      if (mobileLength <= 1) {
        this.$message.error('该视图展示为必选，不可取消');
      }
    } else {
      this.lists.forEach((l:any) => l.showOnMobile = false);
      item.showOnMobile = true;
    }
    this.updateShowOn(item);
  }

  /*
  * 点亮PC、移动端可见
  */
  updateShowOn(item:any) {
    const params = {
      schemaCode: this.schemaCode,
      code: item.code,
      showOnMobile: item.showOnMobile,
      showOnPc: item.showOnPc
    };
    listApi.updateShowOn(params);
  }

  /*
  * 获取查询列表的列表
  */
  getLists() {
    listApi.getList(this.schemaCode).then((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        this.lists = res.data.filter((l: any) => l.name);
      }
    });
  }

  /*
  * 打开删除弹窗
  */
  openDeleteConfirm(list:any) {
    // 已点亮的视图不允许删除
    if (list.showOnPc || list.showOnMobile) {
      return;
    }
    const vm = this;
    /* 删除单项 */
    this.$confirm({
      title: this.$t('languages.Apps.ConfirmDelete', {
        name: list.name
      }), // `确定要删除“${'默认视图'}”吗？`,
      okType: 'danger',
      class: 'delete-confirm',
      okText: this.$t('languages.Apps.Delete').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        vm.deleteList(list.code);
      }
    });
  }

  /*
  * 删除视图
  */
  deleteList(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    listApi
      .remove(this.schemaCode, code)
      .then((res: any) => {
        hideLoader();
        if (this.$route.name === 'list-design' && code === this.$route.params.code) {
          this.$router.push(`/apps/model/${this.appCode}/${this.schemaCode}/data`);
        }
        _this.$message.success(_this.$t('languages.DeleteSuccess'));
        _this.getLists();
      })
      .catch((e: any) => {
        // 不可删除逻辑
        if (e.errcode === 50000) return;
        if (e.errcode && e.errcode > 0 && e.data.length > 0) {
          this.$warning({
            title: this.$t('languages.Apps.DefaultList'),
            okText: this.$t('languages.Apps.DeleteOk').toString()
          });
        }
      })
      .finally(() => hideLoader());
  }

  /**
   * 视图拖拽排序结束
   */
  onEnd(evt: any) {
    const params = {
      schemaCode: this.schemaCode,
      code: evt.item.id,
      sortKey: parseInt(evt.newIndex, 10) + 1
    };
    listApi.updateSortkey(params).then((res:any) => {
      // console.log(res);
    });
  }

  /**
   * 询问是否保存
   */
  confirmSave() {
    const _this = this;
    this.showUnsaveConfirm = true;

    return new Promise((resolve, reject) => {
      this.saveConfirmPromiseResolve = resolve;
      this.saveConfirmPromiseReject = reject;
    });
  }

  /*
  * 保存提示窗--取消
  */
  handleConfirmCancel() {
    this.showUnsaveConfirm = false;
    if(this.saveConfirmPromiseReject){
      this.saveConfirmPromiseReject();
      this.saveConfirmPromiseReject = null;
    }
  }

  /*
  * 保存提示窗--不保存
  */
  handleConfirmUnsave() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseResolve) {
      this.saveConfirmPromiseResolve();
      this.saveConfirmPromiseResolve = null;
    }
  }

  /*
  * 保存提示窗--保存并离开
  */
  handleConfirmOk() {
    Bus.$emit('saveListDesign', (flag: boolean) => {
      this.handleConfirmUnsave();
    });
  }

  /*
  * 列表保存完成时，触发事件
  */
  @Watch('saveCompleted')
  onSaveCompleted(v:any) {
    if ( !v ) return;
    this.getLists();
  }

  /**
   * 路由切换时 重新获取列表标题
   */
  @Watch('$route')
  onRouteChange(route: any) {
    this.getListTitle({schemaCode: this.schemaCode, listCode: this.listCode});
  }
}
</script>

<style lang="less">
.section-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .bar-operation{
    color: @primary-color;
    margin-left: 16px;
    font-size: 16px;
    cursor: pointer;
  }
  .bar-action{
    flex: 10;
    text-align: center;
  }
  .bar-tips{
    flex: 10;
    padding-right: 16px;
    text-align: right;
    color: rgba(0,0,0,0.45);
    font-size: 12px;
  }
  .publish-btn{
    border-radius: 11px;
    background: rgba(250,173,20,0.09);
    font-size: 12px;
    color: #FAAD14;
    padding: 0 8px;
    line-height: 22px;
  }
  button {
    margin-left: 8px;

    & > i.aufontAll {
      font-size: 14px;
      margin-right: 3px;
    }
  }
  .lists{
    position: absolute;
    z-index: 982;
    margin: auto;
    background-color: #fff;
    width: 480px;
    max-height: 320px;
    overflow-y: auto;
    top: 36px;
    text-align: left;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    /deep/.ghostClass {
      opacity: 1;
      background-color: #fff;
      // border: 1px dashed red;
      &.list-item {
        border: 1px dashed @primary-color;
        background: #fff !important;
        padding: 0 14px;
      }

      * {
        opacity: 0;
      }
    }
    /deep/.dragClass {
      opacity: 1 !important;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    }
    .ant-radio-group{
      width: 100%;
      z-index: 9;
      position: relative;
    }
    .list-item{
      display: block;
      height: 32px;
      line-height: 30px;
      padding: 0 16px;
      margin: 0;
      position: relative;
      color: rgba(0,0,0,0.85);
      &:hover{
        background: #E8FCF4;
        .item-operation {
          opacity:1;
        }
      }
      .ant-radio-wrapper{
        margin-right: 0;
        span.ant-radio + *{
          padding-right: 0;
        }
      }
      .item-content{
        display: inline-block;
        vertical-align: middle;
        width: 318px;
        &>i{
          color: #1890FF;
        }
        .item-name{
          font-size: 14px;
          width: 292px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 8px;
          float: right;
        }
      }
      .item-operation{
        // #23813
        opacity:0;
        transition-duration:200ms;

        position: absolute;
        right: 16px;
        top: 0;
        text-align: right;
        width: 106px;
        cursor: pointer;
        i{
          margin: 0 4px;
          font-size: 14px;
        }
        .i25{
          color: rgba(0,0,0,0.25);
        }
        .i45{
          color: rgba(0,0,0,0.45);
        }
        .i65{
          color: rgba(0,0,0,0.65);
        }
        .drag{
          cursor: move;
        }
        .selected{
          color: @primary-color;
        }
        .not-allowed{
          cursor: not-allowed;
          color: rgba(0,0,0,0.25);
        }
        .line{
          display: inline-block;
          width: 1px;
          height: 18px;
          margin: 0 4px;
          vertical-align: middle;
          background: #D8D8D8;
        }
      }
    }
  }
  .design__preview{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: #F4F6FC;
  }
}
.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
.delete-confirm{
  .ant-modal-confirm-title{
    word-break: break-all;
  }
}
</style>
