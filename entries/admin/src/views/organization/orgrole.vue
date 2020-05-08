<template>
  <div class="role clearfix">
    <div class="role-tree" v-resize.east>
      <div class="role-operation">
        <div class="role-btn add-role-group" @click="showRoleGroup(0)">
          <i class="icon aufontAll h-icon-all-plus-o"></i>
          <span>新建角色组</span>
        </div>
        <div class="role-line"></div>
        <div class="role-btn add-role" @click="showRole(0)">
          <i class="icon aufontAll h-icon-all-plus-o"></i>
          <span>新建角色</span>
        </div>
      </div>
      <div class="search-wrap">
        <a-input
          :placeholder="$t('languages.PlaceHolder.InputRole')"
          class="input-search"
          v-model="searchRoleKeys"
          @pressEnter="onSearchRole"
        >
          <a-icon
            class="suffix-icon close-icon"
            v-if="searchRoleKeys.length > 0 "
            slot="suffix"
            type="close-circle"
            @click="clearRoleKey"
          />

          <a-icon
            class="suffix-icon"
            type="search"
            slot="suffix"
            @click="onSearchRole" />
        </a-input>
        <div class="search-tips" v-show="searchTips">
          <span>{{ `"${searchRoleKeys}"` }}</span>
          <div class="search-result">相关的搜索结果：共0个</div>
        </div>
      </div>
      <a-directory-tree
        v-if="showOrgTree"
        class="tree"
        @expand="getExpandedNodes"
        @select="getUserList"
        :defaultExpandedKeys="expandedKeys"
        :defaultSelectedKeys="defaultSelectedKeys"
      >
        <a-tree-node
          v-for="(node,index) in treeData"
          :key="node.key"
          :isLeaf="node.isLeaf"
          :nodeData="node"
        >
          <span slot="title" class="role-title">
            {{ node.title }}
            <span class="dingding" v-if="node.roleType === 'DINGTALK'">钉钉</span>
            <a-popover
              placement="rightTop"
              trigger="click"
              :visible="isShowPop&&iconCode===node.code"
              overlayClassName="role-popover"
              @visibleChange="onVisibleChange($event, node.code)"
            >
              <template slot="content">
                <p @click="showRoleGroup(1, node)">编辑</p>
                <p @click="deleteRoleGroup(node)">删除</p>
              </template>
              <i
                v-if="node.roleType === 'SYS'"
                class="icon aufontAll h-icon-all-setting-o edit"
                :class="{'isshow':isShowPop&&iconCode===node.code}"
                @click.stop="()=>{}"></i>
            </a-popover>
          </span>
          <template v-if="node.children">
            <a-tree-node
              v-for="child in node.children"
              :key="child.key"
              :isLeaf="child.isLeaf"
              :nodeData="child"
            >
              <span slot="title" class="role-title">
                {{ child.title }}
                <a-popover
                  placement="rightTop"
                  trigger="click"
                  :visible="isShowPop&&iconCode===child.code"
                  overlayClassName="role-popover"
                  @visibleChange="onVisibleChange($event, child.code)"
                >
                  <template slot="content">
                    <p @click="showRole(1, child)">编辑</p>
                    <p @click="deleteRole(child)">删除</p>
                  </template>
                  <i
                    v-if="node.roleType === 'SYS'"
                    class="icon aufontAll h-icon-all-setting-o edit"
                    :class="{'isshow':isShowPop&&iconCode===child.code}"
                    @click.stop="()=>{}"></i>
                </a-popover>
              </span>
            </a-tree-node>
          </template>
        </a-tree-node>
      </a-directory-tree>
    </div>
    <div class="role-content">
      <div class="role-content__search">
        <div class="search__role" v-show="userInfo.code">{{ `${userInfo.name}` }}&nbsp;&nbsp;&nbsp;<span>{{ `ID：${userInfo.code}` }}</span></div>
        <div class="search__input">
          <a-input
            class="seach-input"
            :placeholder="$t('languages.PlaceHolder.SearchByName')"
            ref="searchInput"
            v-model="searchVal"
            @pressEnter="filterTable"
          >
            <a-icon
              class="suffix-icon close-icon"
              v-if="searchVal.length > 0 "
              slot="suffix"
              type="close-circle"
              @click="clearUserKey"
            />

            <a-icon
              class="suffix-icon"
              type="search"
              slot="suffix"
              @click="filterTable" />
          </a-input>
          <a-button
            class="user-btn"
            v-if="userInfo.roleType === 'SYS'"
            :disabled="deleteDisable"
            @click="deleteUser">
            <i class="icon aufontAll h-icon-all-delete-o"/>批量删除用户
          </a-button>
          <a-button
            class="user-btn"
            v-if="userInfo.roleType === 'SYS'"
            type="primary"
            @click="showUser(0)">
            <i class="icon aufontAll h-icon-all-plus-o"/>新建用户
          </a-button>
        </div>
      </div>
      <div class="table-wrap">
        <a-table
          :columns="tableHead"
          size="small"
          :dataSource="roleList"
          :pagination="false"
          :loading="loading"
          :locale="{emptyText:''}"
          :scroll="{ y: 500 }"
          :customRow="onRowClick"
          @onBodyScroll="onTableBodyScroll"
          :rowKey="record => record.id"
        >
          <span
            slot="indexTitle"
            class="index"
            style="font-weight: 500; white-space: nowrap"
            @mouseenter="indexMouseenter"
            @mouseleave="indexMouseleave"
          >
            <a-checkbox
              v-show="showSelectAllBox || isSelectAll"
              @change.stop="selectAll"
              v-model="isSelectAll"
            ></a-checkbox>
            <span class="text" v-show="!showSelectAllBox && !isSelectAll">{{ $t('languages.NO') }}</span>
          </span>
          <span slot="nameTitle" class="resize">用户</span>
          <span slot="departmentTitle" class="resize">所属部门</span>
          <span slot="ouScopeTitle" class="resize">{{ $t('languages.ManagementScope') }}</span>
          <span slot="actionTitle" class="resize">操作</span>

          <span
            slot="index"
            class="index"
            slot-scope="text,record"
            @click.stop="()=>{}"
            @mouseenter="record.hover = true"
            @mouseleave="record.hover = false"
          >
            <a-checkbox
              v-show="record.hover || record.checked"
              v-model="record.checked"
              @change.stop="onItemCheckboxChange"
            ></a-checkbox>
            <span class="text" v-show="!record.hover && !record.checked">{{ text }}</span>
          </span>
          <p
            slot="name"
            slot-scope="text,record"
            class="text-ellipsis">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ text }}</span>
              </template>
              <span v-if="userListType === 'search' && searchVal" class="cursor">
                <template
                  v-for="(fragment, i) in text.split(new RegExp(`(?<=${searchVal})|(?=${searchVal})`, 'i'))"
                >
                  <span
                    v-if="fragment.toLowerCase() === searchVal.toLowerCase()"
                    :key="i"
                    class="highlight"
                  >{{ fragment }}</span>
                  <template v-else>{{ fragment }}</template>
                </template>
              </span>
              <span v-else class="cursor">{{ text }}</span>
            </a-tooltip>
            <!-- <span class="aufontAll h-icon-all-star" style="color: #FADB14;margin-left: 8px;font-size: 14px"></span> -->
          </p>
          <span
            class="text-ellipsis"
            slot="departmentName"
            slot-scope="text,record"
          >
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ text }}</span>
              </template>
              <span>{{ text }}</span>
            </a-tooltip>
          </span>
          <span
            slot="ouScope"
            slot-scope="text,record"
            class="text-ellipsis">{{ text }}</span>
          <span
            slot="action"
            slot-scope="text,record"
            class="text-ellipsis cursor"
            @click.stop="showUser(1, record)"
          >
            <a href="javascript:void(0)">
              <i class="icon aufontAll h-icon-all-edit-o edit"></i>
            </a>
          </span>
        </a-table>
      </div>
      <div class="load-more">
        <template v-if="isDataEmpty">
          <span
            class="text"
            v-if="userListType === 'search' && searchVal"
          >{{ $t('languages.NoSearchData') }}</span>
          <span class="text" v-else>{{ $t('languages.NoRelevantData') }}</span>
        </template>
        <template v-if="!isDataEmpty && slideToBottom">
          <span
            @click="loadMore"
            v-if="!loading && !isLoadMore"
          >{{ $t('languages.ClickToLoadMore') }}</span>
          <span v-if="loading && !isLoadMore">{{ $t('languages.LoadMore') }}</span>
          <span class="text" v-if="isLoadMore">{{ $t('languages.HasLoadedAllData') }}</span>
        </template>
      </div>
    </div>
    <!--用户信息弹框-->
    <a-drawer
      :title="$t('languages.User.UserInformation')"
      width="850"
      placement="right"
      @close="onCloseInfoModal"
      :closable="true"
      :visible="infoVisible"
      wrapClassName="user-info-drawer"
    >
      <UserInfo></UserInfo>
    </a-drawer>

    <!-- 新增/编辑角色组弹窗 -->
    <AddRoleGroup
      v-model="roleGroupVisible"
      :roleGroupType="roleGroupType"
      :roleGroupData="roleGroupData"
      @reloadTree="reloadTree"
    ></AddRoleGroup>

    <!-- 新增/编辑角色弹窗 -->
    <AddRole
      v-model="roleVisible"
      :roleType="roleType"
      :roleData="roleData"
      :treeData="treeData"
      @reloadTree="reloadTree"
      @nameChange="nameChange"
    ></AddRole>

    <!-- 新增/编辑用户弹窗 -->
    <AddUser
      v-model="userVisible"
      :userType="userType"
      :userData="userData"
      :roleData="userInfo"
      @reloadUser="clearUserKey"
    ></AddUser>
  </div>
</template>

<style lang="less">
.role {
  height: 100%;
  overflow: hidden;
  p {
    margin-bottom: 0;
  }
  .role-tree {
    width: 224px;
    height: 100%;
    float: left;
    box-shadow: 1px 0px 0px 0px #e8e8e8;
    position: relative;
    text-align: left;
    padding: 8px 16px 16px 16px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 5px;
      background: #fff;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.45);
      border-radius: 4px;
    }
    .search-wrap {
      width: 100%;
      margin-bottom: 9px;
      position: relative;
      .input-search {
        width: 100%;
        .close-icon {
          color: rgba(0, 0, 0, 0.25);
          margin-right: 12px;
        }
        &.ant-input {
          padding-right: 52px;
        }
      }
      .search-tips {
        position: absolute;
        left: 0;
        top: 38px;
        padding: 10px 12px;
        background: #fff;
        z-index: 9;
        width: 100%;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        & > span {
          word-break: break-all;
        }
      }
    }
    ul {
      li {
        span.ant-tree-switcher {
          float: left;
          color: rgba(0, 0, 0, 0.65) !important;
        }
        span.ant-tree-node-content-wrapper {
          display: block;
          margin-left: 24px;
          &:hover {
            background-color: #e8fcf4 !important;
            .role-title{
              .edit{
                display: block;
              }
            }
          }
          &:before {
            background: transparent !important;
          }
        }
        span.ant-tree-node-selected {
          background-color: #eeeeee !important;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.65) !important;
          &:hover {
            background-color: #eeeeee !important;
          }
        }
        span.ant-tree-iconEle {
          display: none;
        }
      }
    }

    .role-operation{
      width: 100%;
      height: 32px;
      padding: 0 8px;
      margin-bottom: 8px;
      line-height: 32px;
      .role-line{
        width: 1px;
        height: 24px;
        float: left;
        background: #D8D8D8;
        margin: 4px 20px 4px 12px;
        line-height: 32px;
      }
      .role-btn{
        font-size: 12px;
        color: @primary-color;
        float: left;
        cursor: pointer;
        i{
          margin-right: 4px;
          font-size: 10px;
        }
      }
    }

    .role-title{
      .edit{
        float: right;
        display: none;
      }
      .dingding{
        display: inline-block;
        font-size: 12px;
        width: 40px;
        height: 22px;
        background: #E8FCF4;
        border-radius: 12px;
        text-align: center;
        line-height: 22px;
        color: @primary-color;
      }
    }
  }
  .role-content {
    margin-left: 224px;
    padding: 16px 24px 0;
    text-align: left;
    overflow: hidden;
    &__search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search__input {
        .ant-input-affix-wrapper {
          .seach-input.ant-input {
            padding-right: 52px;
          }
        }
        .user-btn{
          margin-left: 8px;
          vertical-align: middle;
          i{
            font-size: 14px;
            margin-right: 8px;
          }
        }
      }
      .search__role {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        &>span{
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }

    .seach-input {
      width: 192px;
      .close-icon {
        color: rgba(0, 0, 0, 0.25);
        margin-right: 12px;
      }
    }
    .table-wrap {
      padding: 16px 0;
      padding-bottom: 0;
      .cursor {
        cursor: pointer;
      }
      table {
        padding: 0;
        tr {
          td,
          th {
            &:nth-child(1) {
              // width: calc(48 / 542 * 100%);
              min-width: 48px;
              text-align: center;
            }
          }
        }
      }
      .table-operation {
        font-size: 14px;
        margin-right: 16px;
      }
      .highlight {
        color: @primary-color;
      }
      .ant-table-header {
        overflow-x: hidden;
        padding-bottom: 20px !important;
        margin-bottom: -20px !important;
      }
      .ant-table-thead > tr > th {
        color: rgba(0, 0, 0, 0.65);
      }
      .ant-table-body {
        max-height: calc(100vh - 220px) !important;
        overflow-y: auto;
        overflow-x: hidden !important;
        color: rgba(0, 0, 0, 0.85);
        p {
          margin-bottom: 0;
        }
      }
    }
  }
  .load-more {
    text-align: center;
    padding: 11px 0;
    span {
      padding: 11px 0;
      color: rgba(0, 0, 0, 0.45);
      font-weight: 400;
      font-size: 12px;
      cursor: pointer;
    }
    .text {
      cursor: default;
    }
  }

  .h3-organization {
    opacity: 0;
  }
}
.ant-table-body::-webkit-scrollbar,
.ant-table-header::-webkit-scrollbar {
  width: 0;
}
.user-info-drawer {
  .ant-drawer-body {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}

.role-popover {
  cursor: pointer;
}
.role-popover p:first-child{
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
.role-popover .ant-popover-inner-content{
  padding: 0px;
}
.role-popover p{
  border-top: 1px solid rgba(0,0,0,0.09);
  padding: 5px 16px;
}
.role-popover p:hover{
  background-color: #E8FCF4;
}
.isshow {
  display: block !important;
  color: @primary-color;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import UserInfo from '../../components/organization/userInfo.vue';
import AddRoleGroup from '../../components/organization/roleModals/role-group.vue';
import AddRole from '../../components/organization/roleModals/role.vue';
import AddUser from '../../components/organization/roleModals/user.vue';

import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';
import OrgApi from '@/apis/organization';

const UserModule = namespace('Organization/User');
const RoleModule = namespace('Organization/Role');
@Component({
  components: {
    UserInfo,
    AddRoleGroup,
    AddRole,
    AddUser,
    StaffSelector
  }
})
export default class orgrole extends Vue {
  @RoleModule.State('orgTree') orgTree: any;

  @RoleModule.State('loading') loading: any;

  @RoleModule.State('isLoadMore') isLoadMore: any;

  @RoleModule.State('roleList') roleList: any;

  @RoleModule.State('roleTitle') roleTitle: any;

  @RoleModule.State('orgTreeBySearch') orgTreeBySearch: any;

  @RoleModule.State('isRoleSearchResult') isRoleSearchResult: any;

  @RoleModule.State('searchTips') searchTips: any; // 展示搜索角色结果为空时提示

  // 修改

  @RoleModule.Mutation('assignTreeParams') assignTreeParams: any;

  @RoleModule.Mutation('setEventKey') setEventKey: any;

  @RoleModule.Mutation('clearRoleList') clearRoleList: any;

  @RoleModule.Mutation('clearOrgTreeBySearch') clearOrgTreeBySearch: any;

  @UserModule.Mutation('assignUserInfoParams') assignUserInfoParams: any;

  @UserModule.Mutation('clearUserInfo') clearUserInfo: any;

  // 异步
  @RoleModule.Action('getOrgRoleNode') getOrgRoleNode: any;

  @RoleModule.Action('getOrgRoleList') getOrgRoleList: any;

  @RoleModule.Action('getChildrenRole') getChildrenRole: any;

  @RoleModule.Action('searchOrgRoleNode') searchOrgRoleNode: any;

  @UserModule.Action('getOrgUserInfo') getOrgUserInfo: any;

  searchVal: string = '';

  infoVisible: boolean = false;

  isDataEmpty: boolean = false;

  slideToBottom: boolean = false;

  searchRoleKeys: string = ''; // 搜索角色关键字

  tableHead: Array<Organization.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: 80
    },
    {
      dataIndex: 'name',
      // key: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: {
        // filterDropdown: 'filterDropdown',
        // filterIcon: 'filterIcon',
        customRender: 'name'
      },
      // onFilter: (value:string, record:any) =>
      //   record.name.toLowerCase().includes(value.toLowerCase()),
      width: 180
    },
    {
      dataIndex: 'departmentName',
      slots: { title: 'departmentTitle' },
      scopedSlots: { customRender: 'departmentName' },
      width: 300
    },
    {
      dataIndex: 'ouScope',
      slots: { title: 'ouScopeTitle' },
      scopedSlots: { customRender: 'ouScope' }
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      width: 80,
      align: 'center'
    }];

  userInfo = {
    roleType: '',
    code: '',
    name: '',
    id: ''
  }


  userListType: string = 'page'; // 用户列表数据展示的类型： page，默认数据  search，搜索结果

  page: number = 0;

  showOrgTree: boolean = false;

  isShowPop: boolean = false;

  iconCode: string = "";

  roleGroupVisible:boolean = false;

  roleGroupType:number = 0;

  roleGroupData:any = {};

  roleVisible:boolean = false;

  roleType:number = 0;

  roleData:any = {};

  userVisible:boolean = false;

  userType:number = 0;

  userData:any = {};

  isSelectAll:boolean = false;

  showSelectAllBox:boolean = false;

  /**
    * 全选 
    */
  selectAll(e: Event) {
    const isChecked = (e.target as any).checked;

    if (isChecked) {
      this.roleList.forEach((item: any) => {
        item.checked = true;
      });
    } else {
      this.roleList.forEach((item: any) => {
        item.checked = false;
      });
    }
  }

  /*
  * 当checkbox选择change时事件
  */ 
  onItemCheckboxChange() {
    const isCheckedItems = this.roleList.filter((d: any) => d.checked);
    if (isCheckedItems.length < this.roleList.length) {
      this.isSelectAll = false;
    } else {
      this.isSelectAll = true;
    }
  }

  indexMouseenter() {
    this.showSelectAllBox = true;
  }

  indexMouseleave() {
    this.showSelectAllBox = false;
  }

  // 生命周期
  created() {
    this.getOrgRoleNode().then(() => {
      this.showOrgTree = true;
    });
    const listParams: Organization.Roles.RequestListParams = {
      roleId: '',
      page: 0,
      size: 100,
      filterType:'admin'
    };
    this.getOrgRoleList({ params: listParams }).then(() => {
      this.userInfo = JSON.parse(JSON.stringify(this.roleTitle));
    });
  }

  destroyed() {
    this.clearRoleList();
    this.clearOrgTreeBySearch();
    const treeParams: Organization.Roles.RequestChildrenTreeParams = {
      groupId: ''
    };
    this.assignTreeParams(treeParams);
  }

  onTableBodyScroll(e: any) {
    const tableBody = e.target;
    const bodyClientHeight = tableBody.clientHeight;
    const bodyScrollHeight = tableBody.scrollHeight;
    const bodyScrollTop = tableBody.scrollTop;
    this.slideToBottom = bodyClientHeight + bodyScrollTop === bodyScrollHeight;
  }

  // 获取角色组下的角色
  getExpandedNodes(expandedKeys: any, e: any) {
    if (e.expanded && !this.isRoleSearchResult) {
      const treeParams = {
        groupId: e.node.$attrs.nodeData.id
      };
      this.setEventKey({ dataRef: e.node.$attrs.nodeData });
      this.assignTreeParams(treeParams); // 设置参数
      this.getChildrenRole();
    }
  }

  // 获取角色下的用户
  getUserList(selectedKeys: any, e: any) {
    // 子节点才展示数据，父节点只做展开操作
    if (!e.node.isLeaf) {
      return;
    }
    this.userInfo.code = e.node.$attrs.nodeData.code;
    this.userInfo.name = e.node.$attrs.nodeData.name;
    this.userInfo.id = e.node.$attrs.nodeData.id;
    this.userInfo.roleType = e.node.$attrs.nodeData.roleType;
    this.clearUserKey(); // 刷新table数据
  }

  // 加载更多-角色下的用户
  loadMore() {
    this.page += 1
    const params: Organization.Roles.RequestListParams = {
      roleId: this.userInfo.id,
      page: this.page,
      size: 100,
      filterType:'admin'
    };
    if (this.userListType === 'search') {
      params.name = this.searchVal;
    };
    this.isSelectAll = false;
    this.getOrgRoleList({ type: this.userListType, params }); // 刷新table数据
  }

  // 搜索高亮
  filterTable() {
    this.searchVal = this.searchVal.trim();
    // searchVal为空或数据未加载完成时，清空上次搜索结果并加载全部数据
    if (!this.searchVal || this.loading) {
      this.clearUserKey();
      return;
    }
    this.userListType = 'search';
    this.page = 0;
    this.clearRoleList();
    const params: Organization.Roles.RequestListParams = {
      roleId: this.userInfo.id,
      page: 0,
      size: 100,
      name: this.searchVal,
      filterType:'admin'
    };
    this.slideToBottom = false;
    this.isSelectAll = false;
    this.getOrgRoleList({ type: 'search', params });
  }

  // 清空搜索用户关键字
  clearUserKey(type?:string) {
    if (type === 'save') {
      // 根据之前的分页及搜索结果刷新用户列表
      const listParams: Organization.Roles.RequestListParams = {
        roleId: this.userInfo.id,
        page: 0,
        size: (this.page + 1) * 100,
        filterType:'admin'
      };
      if (this.userListType === 'search') {
        listParams.name = this.searchVal;
      };
      this.isSelectAll = false;
      this.getOrgRoleList({ type: this.userListType, params: listParams });
      return;
    }
    this.searchVal = '';
    this.userListType = 'page';
    this.page = 0;
    this.clearRoleList();
    const params: Organization.Roles.RequestListParams = {
      roleId: this.userInfo.id,
      page: 0,
      size: 100,
      filterType:'admin'
    };
    this.slideToBottom = false;
    this.isSelectAll = false;
    this.getOrgRoleList({ params });
  }

  /* 用户信息相关 */
  showInfoModal(val: string) {
    if (val) {
      this.assignUserInfoParams({
        id: val
      });
      this.getOrgUserInfo().then(() => {
        this.infoVisible = true;
      });
    }
  }

  // 用户信息抽屉关闭事件
  onCloseInfoModal() {
    this.infoVisible = false;
    this.clearUserInfo();
  }

  // table行点击事件
  onRowClick(record: any, index: number) {
    return {
      on: {
        click: () => {
          if (record.unitType !== 1) {
            this.showInfoModal(record.id);
          }
        }
      }
    };
  }

  /* 
  * 搜索角色
  */
  onSearchRole() {
    this.searchRoleKeys = this.searchRoleKeys.trim();
    // searchRoleKeys为空时，不做搜索并清空上次搜索结果
    if (!this.searchRoleKeys) {
      this.clearRoleKey();
      return;
    }
    this.showOrgTree = false;
    const treeParams = {
      groupId: ''
    };
    this.clearOrgTreeBySearch();
    this.assignTreeParams(treeParams);
    this.searchOrgRoleNode(this.searchRoleKeys).then(() => {
      this.showOrgTree = true;
    });
  }

  /* 
  * 清空搜索角色关键字、结果
  */
  clearRoleKey() {
    this.showOrgTree = false;
    this.searchRoleKeys = '';
    this.clearOrgTreeBySearch();
    // 清空关键字，默认展示默认分组下的第一个角色下的用户
    this.userInfo = this.roleTitle;
    this.clearUserKey();
    setTimeout(() => {
      // 重新渲染tree, 默认展开搜索的角色组
      this.showOrgTree = true;
    }, 1);
  }

  /* 
  * popover显示控制
  */
  onVisibleChange(visible: boolean, code: string) {
    this.isShowPop = visible;
    this.iconCode = code;
  }

  /* 
  * show角色组弹窗-- 0：新增，1：编辑
  */
 showRoleGroup(type: number, node:any) {
   this.isShowPop = false;
   this.roleGroupType = type;
   if (node) {
     this.roleGroupData = node;
   }
   this.roleGroupVisible = true;
 }

 /* 
  * 删除角色组
  */
 deleteRoleGroup(node:any) {
    this.isShowPop = false;
    const vm: any = this;
    this.$confirm({
      title: '确定删除当前角色组吗？',
      okText: vm.$t("languages.Apps.Ok").toString(),
      cancelText: vm.$t("languages.Apps.Cancel").toString(),
      onOk() {
        const params = {
          ids: node.id,
        };
        OrgApi.deleteRoleGroup(params).then((res:any) => {
          if (res.errcode) {
            vm.$message.error(res.errmsg);
            return;
          }

          vm.$message.success('删除成功！');
          vm.reloadTree();
        }); 
      }
    });
 }

 // 角色名称变化
  nameChange(data?:any) {
    if (!data) {
      this.reloadTree();
      return;
    }
    this.userInfo.name = data.roleName;
  }

 /* 
  * show角色弹窗-- 0：新增，1：编辑
  */
 showRole(type: number, node:any) {
   this.isShowPop = false;
   this.roleType = type;
   if (node) {
     this.roleData = node;
   }
   this.roleVisible = true;
 }

 /* 
  * 删除角色
  */
 deleteRole(node:any) {
    this.isShowPop = false;
    const vm: any = this;
    this.$confirm({
      title: '确定删除当前角色吗？',
      okText: vm.$t("languages.Apps.Ok").toString(),
      cancelText: vm.$t("languages.Apps.Cancel").toString(),
      onOk() {
        const params = {
          ids: node.id,
        };
        OrgApi.deleteRole(params).then((res:any) => {
          if (res.errcode) {
            vm.$message.error(res.errmsg);
            return;
          }

          vm.$message.success('删除角色成功！');
          vm.nameChange();
        });
      }
    });
 }

 /* 
  * show用户弹窗-- 0：新增，1：编辑
  */
 showUser(type: number, node:any) {
   this.userType = type;
   if (node) {
     this.userData = node;
   }
   this.userVisible = true;
 }

 /* 
  * 批量删除用户
  */
 deleteUser() {
   const userIds: any = [];
   const deptIds: any = [];
   this.roleList.forEach((role:any) => {
     if (role.checked) {
       if (role.unitType === 1) {
         deptIds.push(role.deptId);
       } else {
          userIds.push(role.id);
       }  
      }
   });

   const params = {
      roleId: this.userInfo.id,
      userIds,
      deptIds
    };
    OrgApi.deleteRoleUser(params).then((res) => {
      if (!res.errcode) {
        this.$message.success('删除用户成功！');
        this.clearUserKey();
      } else {
        this.$message.error(res.errmsg);
      }
    });
 }

/* 
* 重载树
*/
 reloadTree() {
   const treeParams: Organization.Roles.RequestChildrenTreeParams = {
      groupId: ''
    };
    this.showOrgTree = false;
    this.assignTreeParams(treeParams);
    this.getOrgRoleNode();
    setTimeout(() => {
      // 重新渲染tree, 默认展开搜索的角色组
      this.showOrgTree = true;
    }, 1);
    this.reloadUser();
 }

 /* 
 * 重载用户列表
 */
 reloadUser() {
    this.clearRoleList();
    const listParams: Organization.Roles.RequestListParams = {
      roleId: '',
      page: 0,
      size: 100,
      filterType:'admin'
    };
    this.getOrgRoleList({ params: listParams }).then(() => {
      this.userInfo = JSON.parse(JSON.stringify(this.roleTitle));
    });
 }

 get deleteDisable() {
   return !this.roleList.filter((list:any) => list.checked).length;
 }

  get treeData() {
    if (this.isRoleSearchResult) {
      return this.orgTreeBySearch;
    } else {
      return this.orgTree;
    }
  }

  get expandedKeys() {
    const res: any[] = [];
    if (this.isRoleSearchResult) {
      if (this.orgTreeBySearch.length) {
        this.orgTreeBySearch.forEach((list: any) => {
          if (list.children && list.children.length) {
            res.push(list.key);
          }
        });
      }
      return res;
    } else {
      if (this.orgTree.length) {
        res.push(this.orgTree[0].key);
      }
      return res;
    }
  }

  get defaultSelectedKeys() {
    const res: any[] = [];
    if (this.isRoleSearchResult) return res;
    if (this.orgTree.length && this.orgTree[0].children && this.orgTree[0].children.length) {
      res.push(this.orgTree[0].children[0].key);
    }
    return res;
  }

  @Watch('roleList')
  computerRolistLength() {
    this.isDataEmpty = !this.roleList.length;
  }
}

</script>
