<template>
  <div class="org-user">
    <div
      class="user-tree"
      v-resize.east
    >
      <div class="search-wrap">
        <a-input
          :placeholder="$t('languages.PlaceHolder.SearchByName')"
          class="input-search"
          v-model="searchText"
          @pressEnter="onSearch"
        >
          <a-icon
            class="suffix-icon close-icon"
            v-if="searchText.length > 0 "
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
      </div>
      <a-tree
        v-if="orgTree"
        class="tree"
        :defaultExpandedKeys="expandedKeys"
        :treeData="orgTree"
        @expand="getChildrenNodes"
        @select="getUserList"
      />
    </div>
    <div class="user-table">
      <h2 v-if="!isSearchTitle">{{ unitTitleObj.name }}&nbsp;&nbsp;&nbsp;<span>{{ `ID：${unitTitleObj.id}` }}</span></h2>
      <div v-if="isSearchTitle" class="search-title">{{ searchTitle }}</div>
      <div class="empty-box" v-show="noUser && !orgUserList.length">
        <img
          class="user-empty"
          src="../../assets/images/userEmpty.png"
        />
        <div>{{ $t('languages.NoUser') }}</div>
      </div>
      <div
        v-show="orgUserList.length"
        class="table-wrap"
      >
        <a-table
          class="user-list"
          :class="{'scroll-bottom':!bottom}"
          :columns="tableColums"
          :dataSource="orgUserList"
          :pagination="false"
          :loading="loading"
          size="small"
          :scroll="{ y: 430 }"
          :customRow="onRowClick"
          @onBodyScroll="onTableBodyScroll"
          :rowKey="record => record.id"
        >
          <span
            slot="indexTitle"
            style="font-weight: 600; white-space: nowrap"
          >{{ $t('languages.NO') }}</span>
          <span
            slot="nameTitle"
            class="resize"
          >{{ $t('languages.Name') }}</span>
          <span
            slot="roleNameTitle"
            class="resize"
          >{{ $t('languages.Roles') }}</span>
          <span
            slot="mobileTitle"
            class="resize"
          >{{ $t('languages.User.MobilePhone') }}</span>
          <span
            slot="emailTitle"
            class="resize"
          >{{ $t('languages.User.Email') }}</span>
          <span
            slot="operationTitle"
            class="resize"
          >{{ $t('languages.Operation') }}</span>

          <p
            slot="name"
            class="cursor text-ellipsis"
            slot-scope="text,record"
          >
            <a-tooltip placement="top">
              <template v-if="record.leader" slot="title">
                <span>{{ $t('languages.User.Manager') }}</span>
              </template>
              <span v-if="searchKey">
                <template v-for="(fragment, i) in text.split(new RegExp(`(${searchKey})|(?=${searchKey})`, 'i'))">
                  <span
                    v-if="fragment.toLowerCase() === searchKey.toLowerCase()"
                    :key="i"
                    class="highlight"
                  >{{ fragment }}</span>
                  <template v-else>{{ fragment }}</template>
                </template>
              </span>
              <span v-else>{{ text }}</span>
            </a-tooltip>
            <span v-if="record.leader" class="aufontAll h-icon-all-star star"></span>
            <template v-if="!record.isAuthUser">
              <a-tooltip>
                <template slot="title">已禁止该用户登录云枢</template>
                <span class="aufontAll h-icon-all-lock-o lock"></span>
              </a-tooltip>
            </template>
          </p>

          <p
            slot="role"
            class="text-ellipsis"
            slot-scope="text"
          >
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ text }}</span>
              </template>
              <span>{{ text }}</span>
            </a-tooltip>
          </p>
          <span
            slot="mobile"
            class="text-ellipsis"
            slot-scope="text"
          >{{ text }}</span>
          <span
            slot="email"
            class="text-ellipsis"
            slot-scope="text"
          >{{ text }}</span>
          <!-- <div
            slot="operation"
            slot-scope="text,record"
          >
            <a-dropdown
              class="cursor"
              :trigger="['hover']"
            >
              <div class="aufontAll h-icon-all-ellipsis-o table-operation" @click.stop="()=>{}"></div>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <span @click.self.stop="showModel(record)">{{ $t('languages.WorkHandover') }}</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div> -->
          <span
            slot="operation"
            slot-scope="text,record"
            @click.stop="()=>{}">
            <i class="cursor icon aufontAll h-icon-all-work-handover-o" @click.self.stop="showModel(record)"></i>
          </span>
        </a-table>
      </div>
      <div
        v-show="!noUser && bottom"
        class="load-more"
      >
        <span
          v-if="!loading && !loadCompleted"
          @click="loadMore"
        >{{ $t('languages.ClickToLoadMore') }}</span>
        <span v-if="loading && !loadCompleted">{{ $t('languages.LoadMore') }}</span>
        <span class="text" v-if="loadCompleted">{{ $t('languages.HasLoadedAllData') }}</span>
      </div>
    </div>
    <!-- 工作交接弹框 -->
    <a-drawer
      :title="$t('languages.TaskTransfer.TaskTransfer', { name: userName })"
      width="850"
      placement="right"
      @close="onClose"
      :closable="true"
      :visible="visible"
      wrapClassName="task-transfer-drawer"
      :destroyOnClose="true"
    >
      <TaskTransfer :userid="userid"></TaskTransfer>
    </a-drawer>

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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import TaskTransfer from '../../components/organization/taskTransfer/index.vue';
import UserInfo from '../../components/organization/userInfo.vue';

const UserModule = namespace('Organization/User');

@Component({
  name: 'OrgUser',
  components: {
    TaskTransfer,
    UserInfo
  }
})
export default class OrgUser extends Vue {
  @UserModule.State('orgTree') orgTree: any;

  @UserModule.State('loading') loading: any;

  @UserModule.State('noUser') noUser: any;

  @UserModule.State('unitTitleObj') unitTitleObj: any;

  @UserModule.State('searchTitle') searchTitle: any;

  @UserModule.State('orgUserList') orgUserList: any;

  @UserModule.State('loadCompleted') loadCompleted: any;

  @UserModule.Mutation('clearUserList') clearUserList: any;

  @UserModule.Mutation('setDataRef') setDataRef: any;

  @UserModule.Mutation('changeTitle') changeTitle: any;

  @UserModule.Mutation('assignUserInfoParams') assignUserInfoParams: any;

  @UserModule.Mutation('setEduUserInfoParams') setEduUserInfoParams: any;

  @UserModule.Mutation('clearUserInfo') clearUserInfo: any;

  @UserModule.Action('getOrgNodes') getOrgNodes: any;

  @UserModule.Action('getOrgUserList') getOrgUserList: any;

  @UserModule.Action('getOrgUserInfo') getOrgUserInfo: any;

  tableColums = [
    {
      dataIndex: 'index',
      align: 'center',
      width: 60,
      slots: { title: 'indexTitle' }
    },
    {
      width: 151,
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      onFilter: (value: string, record: any) => record.name.toLowerCase().includes(value.toLowerCase())
    },
    {
      width: 144,
      dataIndex: 'roleName',
      slots: { title: 'roleNameTitle' },
      scopedSlots: { customRender: 'role' }
    },
    {
      width: 134,
      dataIndex: 'mobile',
      slots: { title: 'mobileTitle' },
      scopedSlots: { customRender: 'mobile' }
    },
    {
      dataIndex: 'email',
      slots: { title: 'emailTitle' },
      scopedSlots: { customRender: 'email' }
    },
    {
      width: 80,
      dataIndex: 'operation',
      slots: { title: 'operationTitle' },
      scopedSlots: { customRender: 'operation' }
    }
  ];

  page: number = 0;

  pageId: string = '';

  searchKey: string = '';

  searchText: string = '';

  userid: string = '';

  userName:string = '';

  visible: boolean = false;

  infoVisible: boolean = false;

  isSearchTitle: boolean = false;

  slideToBottom: boolean = false;

  bottom: boolean = false;

  created() {
    this.page = 0;
    const params: Organization.Users.OrgUserListParams = {
      deptId: '',
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.getOrgNodes({ deptId: '', filterType :'admin' });
    this.getOrgUserList({ params });
  }

  destroyed() {
    // destroy时重置用户列表数据
    this.clearUserList();
  }

  get expandedKeys() {
    const res:any[] = [];
    res.push(this.orgTree[0].key);
    return res;
  }

  // 展开组织树节点
  getChildrenNodes(expandedKeys: any, e: any) {
    // 已展开的节点不再请求
    if (e.expanded && !e.node.dataRef.children) {
      const param: Organization.Users.OrgTreeParams = {
        deptId: e.node.dataRef.id,
        filterType :'admin'
      };
      this.setDataRef({ dataRef: e.node.dataRef });
      this.getOrgNodes(param);
    }
  }

  onTableBodyScroll(e:any) {
    const tableBody = e.target;
    const bodyClientHeight = tableBody.clientHeight;
    const bodyScrollHeight = tableBody.scrollHeight;
    const bodyScrollTop = tableBody.scrollTop;
    this.slideToBottom = bodyClientHeight + bodyScrollTop === bodyScrollHeight;
    if (bodyClientHeight + bodyScrollTop === bodyScrollHeight) {
      this.bottom = true;
    } else if (bodyClientHeight + bodyScrollTop + 32 <= bodyScrollHeight) {
      this.bottom = false;
    }
  }

  // 点击组织树节点获取用户列表
  getUserList(selectedKeys: any, e: any) {
    if (this.loading) {
      return;
    }
    // 在点击树节点时，（展开/收缩）组织树节点触发getChildrenNodes方法
    if (e.node.$el && e.node.$el.children[0]) {
      e.node.$el.children[0].click();
    }

    this.slideToBottom = false;
    this.bottom = false;
    this.isSearchTitle = false;
    this.changeTitle({ name: e.node.dataRef.name, id: e.node.dataRef.id, deptType: e.node.dataRef.deptType });
    this.searchKey = '';
    this.pageId = e.node.dataRef.id;
    this.page = 0;
    const userListParam: Organization.Users.OrgUserListParams = {
      deptId: e.node.dataRef.id,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.clearUserList();
    this.getOrgUserList({ params: userListParam });
  }

  // 加载更多
  loadMore() {
    this.page = this.page + 1;
    if (!this.searchKey) {
      // 组织机构用户列表的加载更多
      const loadMoreParam: Organization.Users.OrgUserListParams = {
        deptId: this.pageId,
        page: this.page,
        size: 100,
        filterType :'admin'
      };
      this.getOrgUserList({ params: loadMoreParam });
    } else {
      // 组织机构搜索的用户列表加载更多
      const loadSearchParam: Organization.Users.SearchUserListParams = {
        wd: this.searchKey,
        page: this.page,
        size: 100,
        filterType :'admin'
      };
      this.getOrgUserList({ params: loadSearchParam, isSearch: true });
    }
  }

  // 清空搜索关键字
  clearKeyword() {
    this.searchKey = '';
    this.searchText = '';
    this.isSearchTitle = false;
    this.clearUserList();
    const params: Organization.Users.OrgUserListParams = {
      deptId: this.pageId,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.getOrgUserList({ params });
  }

  // 按用户名搜索
  onSearch() {
    // value为空或数据正在加载中时，不允许请求
    this.searchText = this.searchText.trim();
    if (this.searchText === '' || this.loading) {
      return;
    }
    this.searchKey = this.searchText;
    this.page = 0;
    const searchParam: Organization.Users.SearchUserListParams = {
      wd: this.searchText,
      page: 0,
      size: 100,
      filterType :'admin'
    };
    this.isSearchTitle = true;
    this.clearUserList();
    this.getOrgUserList({ params: searchParam, isSearch: true });
  }

  // 工作交接弹框
  showModel(val: any) {
    this.visible = true;
    this.userid = val.id;
    if (val.name) {
      this.userName = val.name;
    }
  }

  onClose() {
    this.visible = false;
  }

  /* 用户信息相关 */
  showInfoModal(val: string) {
    if (val) {
      const infoParams:Organization.Users.RequestParams = {
        id: val
      };
      this.assignUserInfoParams(infoParams);
      let isHomeSchool = false;
      if (this.unitTitleObj.deptType) {
        isHomeSchool = this.unitTitleObj.deptType === 2 && !this.isSearchTitle;
        const params:Organization.Users.EduRequestParams = {
          userId: val,
          deptId: this.unitTitleObj.id
        };
        this.setEduUserInfoParams(params);
      }
      this.getOrgUserInfo(isHomeSchool).then(() => {
        this.infoVisible = true;
      });
    }
  }

  onCloseInfoModal() {
    this.infoVisible = false;
    this.clearUserInfo();
  }

  onRowClick(record:any, index: number) {
    return {
      on: {
        click: () => {
          this.showInfoModal(record.id);
        }
      }
    };
  }
}
</script>


<style lang="less" scoped>
@import "../../styles/themes/index.less";
.org-user {
  height: calc(100vh - 64px);
  .user-tree {
    width: 224px;
    height: 100%;
    float: left;
    box-shadow: 1px 0px 0px 0px #E8E8E8;
    position: relative;
    text-align: left;
    padding-bottom: 25px;
    .search-wrap {
      width: 100%;
      padding: 0 16px;
      .input-search {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 8px;
        .close-icon {
          color: rgba(0, 0, 0, 0.25);
          margin-right: 12px;
        }
      }
    }
    .tree {
      text-align: left;
      margin-left: 12px;
      padding-bottom: 10px;
      max-height: calc(100vh - 64px - 57px);
      overflow: auto;
      /deep/ & > li:first-child{
        padding-top: 5px;
      }
      /deep/ li{
        padding: 8px 0 0 0;
        span.ant-tree-node-content-wrapper{
          &:hover{
            background-color: #E8FCF4;
          }
        }
        span.ant-tree-node-selected{
          background-color: #EEEEEE !important;
          font-weight: 500;
        }
      }
    }
  }
  .user-table {
    margin-left: 224px;
    overflow: scroll;
    padding: 0 24px;
    height: 100%;
    & > div.empty-box {
      text-align: center;
      .user-empty {
        margin: 0px auto;
        margin-top: 150px;
      }
    }
    .table-wrap {
      padding: 2px 0 8px 0;
      .user-list {
        min-width: 670px;
        .cursor {
          cursor: pointer;
          .star{
            color: #FADB14;
            margin-left: 8px;
            font-size: 14px;
          }
          .lock {
            margin-left: 8px;
          }
        }
        .highlight {
          color: @primary-color;
        }
      }
      /deep/ .ant-table-header{
        overflow-x: hidden;
        padding-bottom: 20px !important;
        margin-bottom: -20px !important;
        .ant-table-thead>tr>th{
          color: rgba(0, 0, 0, 0.65);;
        }
      }
      /deep/ .ant-table-body {
        min-height: 43px;
        max-height: calc(100vh - 229px + 12px)!important;
        overflow-x: hidden!important;
        color: rgba(0, 0, 0, 0.85);
        p{
          margin-bottom: 0;
        }
      }
      .scroll-bottom{
        /deep/ .ant-table-body {
          max-height: calc(100vh - 198px + 12px)!important;
        }
      }
    }
    h2{
      font-size: 16px;
      text-align: left;
      font-weight: 500;
      padding-bottom: 18px;
      padding-top: 20px;
      // background: #fff;
      // border-bottom: 1px solid #E8E8E8;
      &>span{
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .search-title{
      text-align: left;
      padding-top: 24px;
      font-size: 14px;
      opacity: 0.45;
      color: #000;
    }
    .ant-table-small{
        padding: 0;
    }
    .table-operation{
      width: 100%;
      height: 100%;
      font-size: 16px;
      margin-right: 16px;
    }
      .resize{
          white-space: nowrap;
      }
    .load-more{
      text-align: center;
      padding: 6px 0;
      span{
        padding: 11px 0;
        color:rgba(0,0,0,0.45);
        font-weight:400;
        font-size:12px;
        cursor: pointer;
      }
      .text{
        cursor: default;
      }
    }
  }
}
.tree::-webkit-scrollbar {
  width: 0;
  height: 7px;
  background: #fff;
}
.tree::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 4px;
}
</style>

<style lang="less">
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
.task-transfer-drawer {
  //  z-index: 1051;
  .ant-drawer-body{
    padding: 0px;
  }
}
</style>
