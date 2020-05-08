<template>
  <div class="app-item">
    <div class="app-menu" v-resize.east>
      <div class="menu-tree">
        <ul class="menu ant-menu ant-menu-inline ant-menu-root ant-menu-light">
          <li
            class="sub-menu ant-menu-submenu ant-menu-submenu-inline"
            :class="{'ant-menu-submenu-selected': all}"
            @click="onClickFolder('all')"
          >
            <div class="ant-menu-submenu-title all">
              <div class="menu-title">
                <i class="icon aufontAll h-icon-all-same-size"></i>
                <span>{{ $t('languages.Apps.All') }}</span>
              </div>
            </div>
          </li>
        </ul>
        <Draggable
          element="ul"
          :list="appMenu"
          :id="appDetails.id"
          :options="dragMenuOptions"
          @end="onSortEnd"
          class="menu ant-menu ant-menu-inline ant-menu-root ant-menu-light"
        >
          <template v-for="item in appMenu">
            <li
              v-if="item.type==='Folder'"
              :key="item.code"
              :id="item.code"
              :data-type="item.type"
              class="sub-menu ant-menu-submenu ant-menu-submenu-inline"
              :class="{'ant-menu-submenu-selected':currentItemID===item.id,'isshow':showIcon&&iconId===item.id}"
              @click="onClickFolder(item)"
            >
              <div
                :id="item.id"
                class="ant-menu-submenu-title"
              >
                <div class="menu-title">
                  <i class="icon aufontAll h-icon-all-folder-o"></i>
                  <template v-if="$i18n.locale === 'zh'">
                    {{ getLangName(item) }}
                  </template>
                  <template v-else>
                    {{ getLangName(item) }}
                  </template>
                </div>
              </div>
            </li>
          </template>
        </Draggable>
      </div>
    </div>
    <div class="app-router-wrap">
      <AppItemContent
        :curFolderId="curFolderId"
        @afterAddModel="showDataModel"
      ></AppItemContent>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import AppItemContent from '@/components/apps/appItemContent.vue';

import { pattern } from '@/common/utils';

import { LanguageTransform } from '@/utils';

import Draggable from 'vuedraggable';

const MenuModule = namespace('Apps/AppItem');

const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'AppItem',
  components: {
    AppItemContent,
    Draggable
  }
})

export default class AppItem extends Vue {
  @Prop({ type: String }) appCode: any;

  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appMenu') appMenu: any;

  @MenuModule.Mutation('setAppCode') setAppCode: any;

  @MenuModule.Mutation('setMenuId') setMenuId: any;

  @MenuModule.Action('getAppItem') getAppItem: any;

  @MenuModule.Action('appItemTreeSort') appItemTreeSort: any;

  showIcon:boolean = false;

  iconId:string = '';

  bizModelData:any = {};

  code:string = '';

  // 请求流程数据参数
  dragMenuOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    group: {
      name: 'menu',
      put: ['menu', 'item'],
    }
  };

  currentItemID: string = '';

  all: boolean = true;

  curFolderId:string = '';

  // 手动出发document的鼠标抬起事件
  // 解决拖拽重鼠标按下后无法抬起的问题
  dispatchMouseUpEvent() {
    const e = document.createEvent('MouseEvents');
    e.initEvent('mouseup', true, true);
    document.dispatchEvent(e);
  }

  dragIntoFolder(evt:any) {
    console.log(evt);
    const isFolder = evt.item.dataset.type === 'Folder';
    if (isFolder) {
      return;
    }
    const parentId:string = evt.to.id;
    const ItemId:string = evt.item.id;
    const parmars:Apps.AppItem.AppItemSortParams = {
      code: ItemId,
      parentId,
      sortKey: 1,
    };
    this.appItemTreeSort(parmars);
    this.dispatchMouseUpEvent();
  }

  onSortEnd(evt:any) {
    const isFolder = evt.item.dataset.type === 'Folder';
    const dragIntoFolder = evt.to.dataset.type === 'Folder';
    if (isFolder && dragIntoFolder) {
      this.getAppItem({
        appCode: this.appCode,
      });
      this.dispatchMouseUpEvent();
      return;
    }
    const ItemId:string = evt.item.id;
    const sortKey:number = parseInt(evt.newIndex, 10) + 1;
    const parmars:Apps.AppItem.AppItemSortParams = {
      code: ItemId,
      parentId: this.appDetails.id,
      sortKey
    };
    this.appItemTreeSort(parmars);
    this.dispatchMouseUpEvent();
  }

  onClickFolder(item:any) {
    if (item === 'all') {
      this.currentItemID = '';
      this.all = true;
      this.setMenuId(this.appDetails.id);
      const scrollDom = document.getElementById('item-content');
      this.curFolderId = '';
      if (!scrollDom) return;
      scrollDom.scrollTop = 0;
    } else {
      this.all = false;
      this.currentItemID = item.id;
      this.setMenuId(item.id);
      const dom = this.$el.querySelector(`#anchor${item.sortKey}`);
      this.curFolderId = `anchor${item.sortKey}`;
      if (!dom) return;
      dom.scrollIntoView();
      this.$forceUpdate();
    }
  }

  showDataModel(item: any) {
    // 打开业务模型具体页面
    this.currentItemID = item.id;
    this.bizModelData = item;

    // code by John 20181205
    this.code = item.code;
  }

  getLangName(item:any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }

  beforeMount() {
    if (this.$route.params.appCode) {
      const appParams:Apps.AppItem.ItemTree = {
        appCode: this.appCode
      };
      this.setAppCode(appParams);
      this.getAppItem(appParams);
    }
  }
}
</script>

<style lang="less">
.ghostClass{
  opacity: 0;
}
.icon-open{
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
.app-menu{
  width: 224px;
  padding-right: 1px;
  height: calc(100vh - 64px);
  float: left;
  box-shadow: 1px 0px 0px 0px #E8E8E8;
  position: relative;
  z-index: 2;
  .new-menu{
    height: 40px;
    background: #F2F2F2;
    font-size: 14px;
    line-height: 40px;
    width: calc(~'100% + 1px');
    cursor: pointer;
    &>span{
      color: rgba(0,0,0,0.65);
    }
    &>i{
      font-size: 12px;
      margin-right: 7px;
    }
  }
  .menu-tree{
    overflow: auto;
    height: calc(100vh - 64px - 24px);
    .menu{
      border: none;
      i.setting{
        position: absolute;
        z-index: 9;
        top: 0px;
        right: 29px;
        width: 14px;
        height: 14px;
        margin: 0;
        font-size: 14px !important;
        visibility: hidden;
        &:hover{
          color: @primary-color;
        }
      }
      .sub-menu.ant-menu-submenu-selected{
        .ant-menu-submenu-title{
          background: #E8FCF4;
          color: @primary-color;
          .menu-title{
            padding-right: 38px !important;
          }
          .setting{
            visibility: visible;
            color: rgba(0, 0, 0, 0.65);
            &:hover{
              color: @primary-color;
            }
          }
          &:hover{
            color: @primary-color !important;
          }
          &:after{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            border-left: 4px solid @primary-color;
          }
        }
      }
      .sub-menu{
        cursor: pointer;
        position: relative;
        .ant-menu-submenu-title{
          padding: 0px !important;
          width: 100%;
          margin-top: 8px;
          .menu-title{
            padding: 0px 16px !important;
            margin-right: 25px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            i{
              font-size: 14px;
              margin-right: 8px;
            }
          }
          &:hover {
            color: rgba(0, 0, 0, 0.65);
            background: #E8FCF4;
            .menu-title{
              padding-right: 38px !important;
            }
            .setting{
              visibility: visible;
            }
          }
          &>.ant-menu-submenu-arrow{
            margin-top: 2px;
            &:before{
              background: linear-gradient(to right, #000, #000);
            }
            &:after{
              background: linear-gradient(to right, #000, #000);
            }
          }
        }
        .ant-menu-submenu-title.all{
          margin-bottom: 0;
        }
      }
      li.ant-menu-item-selected{
        background: #E8FCF4;
        color: @primary-color;
        padding-right: 46px;
        &:hover{
          color: @primary-color;
        }
        &:after{
          border-left: 4px solid @primary-color;
        }
        .setting{
          visibility: visible;
          color: rgba(0, 0, 0, 0.65);
          &:hover{
            color: @primary-color;
          }
        }
      }
      .ant-menu-item{
        width: 100%;
        padding-left: 38px !important;
        text-align: left;
        overflow: hidden;
        margin-top: 8px;
        text-overflow: ellipsis;
        padding-right: 16px;
        .setting{
          right: 6px;
        }
        i{
          font-size: 14px;
          margin-right: 10px;
        }
        &:hover{
          color: rgba(0, 0, 0, 0.65);
          background: #E8FCF4;
          padding-right: 46px;
          .setting{
            visibility: visible;
          }
        }
        &:after{
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          border-right: none;
        }
      }
      .show.ant-menu-item{
        padding-right: 46px;
      }
      li.root-item{
        padding-left: 16px !important;
      }
    }
  }
}
.popover{
  cursor: pointer;
}
.popover p:first-child{
  border-top: none;
  border-radius: 4px 4px 0 0;
  &:hover {
    &:before {
      content: "";
      display: block;
      width: 8.5px;
      height: 8.5px;
      transform: rotate(45deg);
      background-color: #E8FCF4;
      position: absolute;
      left: 6px;
      top: 12px;
    }
  }
}
.popover p:last-child{
  border-radius: 0 0 4px 4px;
}
.popover .ant-popover-inner-content{
  padding: 0px;
}
.popover p{
  border-top: 1px solid rgba(0,0,0,0.09);
  padding: 5px 16px;
}
.popover p:hover{
  background-color: #E8FCF4;
}
.app-router-wrap{
  height: calc(100vh - 64px);
  overflow: hidden;
}
.red{
  color: #F5222D;
}
.show{
  color: #000;
  background: #E8FCF4;
}
.isshow .menu-title .setting,.show .setting{
  visibility: visible !important;
}
.menu-tree::-webkit-scrollbar {
  width: 0;
  height: 7px;
  background: #fff;
}
.menu-tree::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 4px;
}
</style>
