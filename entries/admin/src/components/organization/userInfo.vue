<template>
  <div
    v-if="orgUserInfo"
    class="user-detail-wrapper"
    :class="$i18n.locale"
  >
    <!--基本信息-->
    <div class="box-item">
      <div class="item-title">{{ $t('languages.User.BaseInfo') }}</div>
      <div class="item-child">
        <p class="left-header item-avator-name">{{ $t('languages.User.Avatar')+'：' }}</p>
        <div class="item-avator">
          <a-avatar
            v-if="orgUserInfo.imgUrl"
            :size="64"
            :src="orgUserInfo.imgUrl"
            shape="square"
            icon="user"
          />
          <i v-else class="icon aufontAll h-icon-all-normal_smile"></i>
        </div>
      </div>
      <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.UserName')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.name ? orgUserInfo.name : '- -' }}</p>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.UserAccount')+'：' }}</p>
          <span class="inner-text">{{ orgUserInfo.username ? orgUserInfo.username : '- -' }}</span>
        </div>
      </div>
      <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.UserDepartment')+'：' }}</p>
          <!--
                //TODO 暂无主部门数据，以多部门中的首个代替
               -->
          <p class="inner-text limit" v-if="mainDepartmentName">
            <i class="icon aufontAll h-icon-all-team-o"></i>{{ mainDepartmentName }}
          </p>
          <p
            class="setting-department"
            v-if="showSettingMain"
            @click="showModel"
          >{{ $t('languages.User.SettingMainDepartment') }}</p>
        </div>
        <!-- <div class="child-right">
          <p class="left-header">{{ $t('languages.User.Manager')+'：' }}</p>
          <p class="inner-text" v-if="orgUserInfo.managerName"><i class="icon aufontAll h-icon-all-user-o"></i>{{ orgUserInfo.managerName ? orgUserInfo.managerName : '- -' }}</p>
          <p v-else>- -</p>
        </div> -->
        <!-- <div class="child-right">
          <p class="left-header">{{ $t('languages.User.Gender')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.gender | gender }}</p>
        </div> -->
      </div>
      <!-- <div class="item-child">
        <div class="child-content">
          <p class="left-header">{{ $t('languages.User.Manager')+'：' }}</p>
          <p class="inner-text" v-if="orgUserInfo.managerName"><i class="icon aufontAll h-icon-all-user-o"></i>{{ orgUserInfo.managerName }}</p>
        </div>
      </div> -->
      <!--兼职部门-->
      <div class="item-child">
        <div class="child-content">
          <p class="left-header">{{ $t('languages.User.PartTimeDepartment')+'：' }}</p>
          <p class="inner-text limit2" v-if="Array.isArray(orgUserInfo.otherDepartments) && orgUserInfo.otherDepartments.length">
            <template v-for="(depart,idx) in orgUserInfo.otherDepartments">
              <span
                v-if="depart !== mainDepartmentName"
                :key="idx"
              ><i class="icon aufontAll h-icon-all-team-o"></i>{{ depart }}</span>
            </template>
          </p>
          <p v-else>- -</p>
        </div>
      </div>
      <div class="item-child">
        <div class="child-content">
          <p class="left-header">{{ $t('languages.User.Role')+'：' }}</p>
          <p class="inner-text limit2" v-if="orgUserInfo.roleName">
            <span v-for="(role, idx) in orgUserInfo.roleName.split(',')" :key="idx">
              <i class="icon aufontAll h-icon-all-user-list-o"></i>{{ role }}
            </span>
          </p>
          <p v-else>- -</p>
        </div>
      </div>
    </div>
    <!--个人信息-->
    <!-- <div class="box-item">
      <div class="item-title">{{ $t('languages.User.PersonInfo') }}</div>
      <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.Birthday')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.birthday ? orgUserInfo.birthday : '- -' }}</p>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.IdentityNumber')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.identityNo ? orgUserInfo.identityNo : '- -' }}</p>
        </div>
      </div>
    </div> -->
    <!--联系方式-->
    <div class="box-item" v-if="!orgUserInfo.tag">
      <div class="item-title">{{ $t('languages.User.Contact') }}</div>
      <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.MobilePhone')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.mobile ? orgUserInfo.mobile : '- -' }}</p>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.OfficePhone')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.officePhone ? orgUserInfo.officePhone : '- -' }}</p>
        </div>
      </div>
      <div class="item-child">
        <!-- <div class="child-left">
          <p class="left-header">{{ $t('languages.User.DingTalk')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.dingtalkId ? orgUserInfo.dingtalkId : '- -' }}</p>
        </div> -->
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.Email')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.email ? orgUserInfo.email : '- -' }}</p>
        </div>
      </div>
    </div>

    <!-- 学生信息（家校） -->
    <div class="box-item" v-if="orgUserInfo.tag && orgUserInfo.tag === '学生'">
      <div class="item-title">{{ $t('languages.User.StudentInfo') }}</div>
      <div class="item-child">
        <div class="child-content">
          <p class="left-header">{{ $t('languages.User.StudentId')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.employeeNo ? orgUserInfo.employeeNo : '- -' }}</p>
        </div>
      </div>
      <div class="item-child">
        <div class="child-content">
          <p class="left-header">{{ $t('languages.User.Class')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.studentClassName ? orgUserInfo.studentClassName : '- -' }}</p>
        </div>
      </div>
      <div class="item-child">
        <div class="child-content">
          <p class="left-header">{{ $t('languages.User.Parents')+'：' }}</p>
          <p
            class="inner-text link"
            v-if="orgUserInfo.guardians"
            v-for="(parent,index) in orgUserInfo.guardians"
            :key="index"
            @click="goParent(parent)"
          >{{ `${parent.name}` }}&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <p v-else class="inner-text">- -</p>
        </div>
      </div>
    </div>

    <!-- 老师信息（家校） -->
    <div class="box-item" v-if="orgUserInfo.tag && orgUserInfo.tag === '老师'">
      <div class="item-title">{{ $t('languages.User.TeachersInfo') }}</div>
      <div
        class="item-child"
        v-if="orgUserInfo.tearchers"
        v-for="(tearcher,index) in orgUserInfo.tearchers"
        :key="index"
      >
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.Class')+'：' }}</p>
          <span class="inner-text">{{ tearcher.deptName ? tearcher.deptName : '- -' }}</span>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.IsHeadTeacher')+'：' }}</p>
          <span class="inner-text">{{ tearcher.isAdviser ? '是' : '否' }}</span>
        </div>
      </div>
    </div>

    <!-- 孩子信息（家校） -->
    <div class="box-item" v-if="orgUserInfo.tag && isShowChild">
      <div class="item-title">{{ $t('languages.User.ChildsInfo') }}</div>
      <div
        class="item-child"
        v-if="orgUserInfo.childrens"
        v-for="(child,index) in orgUserInfo.childrens"
        :key="index"
      >
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.ChildName')+'：' }}</p>
          <span class="inner-text">{{ child.name ? child.name : '- -' }}</span>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.Class')+'：' }}</p>
          <span class="inner-text">{{ child.deptName ? child.deptName : '- -' }}</span>
        </div>
      </div>
    </div>

    <!--组织信息-->
    <div class="box-item" v-if="!orgUserInfo.tag">
      <div class="item-title">{{ $t('languages.User.OrganizationInfo') }}</div>
      <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.EmployeeNumber')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.employeeNo ? orgUserInfo.employeeNo : '- -' }}</p>
        </div>
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.EntryDate')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.entryDate ? orgUserInfo.entryDate : '- -' }}</p>
        </div>
        <!-- <div class="child-right">
          <p class="left-header">{{ $t('languages.User.EmployeeRank')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.employeeRank ? orgUserInfo.employeeRank : '- -' }}</p>
        </div> -->
      </div>
      <!-- <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.Appellation')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.appellation ? orgUserInfo.appellation : '- -' }}</p>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.Secretary')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.secretaryName ? orgUserInfo.secretaryName : '- -' }}</p>
        </div>
      </div> -->
      <!-- <div class="item-child">
        <div class="child-left">
          <p class="left-header">{{ $t('languages.User.EntryDate')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.entryDate ? orgUserInfo.entryDate : '- -' }}</p>
        </div>
        <div class="child-right">
          <p class="left-header">{{ $t('languages.User.DepartureDate')+'：' }}</p>
          <p class="inner-text">{{ orgUserInfo.departureDate ? orgUserInfo.departureDate : '- -' }}</p>
        </div>
      </div> -->
    </div>
    <a-modal
      :title="$t('languages.User.SettingMainDepartment')"
      :okText="$t('languages.Save')"
      v-model="visible"
      @ok="handleOk"
      :maskClosable="false"
      :keyboard="false"
    >
      <div class="main-department-wrap">
        <div class="main-department">
          <span class="left-header">{{ $t('languages.User.MainDepartment') }}</span>
          <span class="inner-text">{{ mainDepartmentName }}</span>
        </div>
        <div class="department-list">
          <div
            class="department"
            :class="{'main':d.deptId === mainDepartmentId}"
            v-for="(d,index) in departmentList"
            @click="settingMainDepartment(d)"
            :key="index"
          >{{ d.deptName }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import * as OrganizationApi from '@/apis/organization';

const UserModule = namespace('Organization/User');

@Component({
  name: 'UserInfo',
  // filters: {
  //   gender(v: any) {
  //     if (v === 'MALE') {
  //       return '男'
  //     }
  //     else if (v === 'FEMALE') {
  //       return '女'
  //     }
  //     else {
  //       return ''
  //     }
  //   }
  // }
})
export default class userInfo extends Vue {
  @UserModule.State('orgUserInfo') orgUserInfo:any;

  @UserModule.Mutation('setEduUserInfoParams') setEduUserInfoParams: any;

  @UserModule.Mutation('clearUserInfo') clearUserInfo: any;

  @UserModule.Action('getOrgUserInfo') getOrgUserInfo: any;

  get showSettingMain() {
    if (this.orgUserInfo.departmentName) {
      return this.orgUserInfo.departmentName.split(',').length >= 2;
    }
    return false;
  }

  // 家长是否展示孩子信息
  get isShowChild() {
    if (this.orgUserInfo.tag === '家长') {
      return true;
    } else if (this.orgUserInfo.childrens && this.orgUserInfo.childrens.length && this.orgUserInfo.tag === '老师') {
      return true;
    }
    return false;
  }

  visible:boolean = false;

  departmentList:any = [];

  mainDepartmentName:string = '';

  mainDepartmentId:string = '';

  beforeMount() {
    if (this.orgUserInfo && this.orgUserInfo.id) {
      this.getDepartmentList();
    }
  }

  // 获取当前用户的所属部门列表
  async getDepartmentList() {
    const params = {
      id: this.orgUserInfo.id,
      filterType: 'admin'
    };
    this.mainDepartmentId = this.orgUserInfo.departmentId;
    const res = await OrganizationApi.getDepartmentList(params);
    if (res.errcode === 0) {
      if (Array.isArray(res.data)) {
        this.departmentList = res.data;
        const mainDepartment = res.data.find((r:any) => r.deptId === this.mainDepartmentId);
        if (this.orgUserInfo.departmentName) {
          this.mainDepartmentName = mainDepartment ? mainDepartment.deptName : this.orgUserInfo.departmentName.split(',')[0];
        }
      }
    }
  }

  /*
  * 展示主部门弹窗
  */
  async showModel() {
    this.visible = true;
  }

  /*
  * 设置主部门
  */
  async settingMainDepartment(dept:any) {
    const params = {
      deptId: dept.deptId,
      main: true,
      userId: this.orgUserInfo.id,
    };
    // 获取当前用户的所属部门列表
    const res = await OrganizationApi.updateMainDepartment(params);
    console.log(res);
    if (res.errcode === 0) {
      this.mainDepartmentId = dept.deptId;
      this.mainDepartmentName = dept.deptName;
    }
  }

  handleOk() {
    this.visible = false;
  }

  // 家校跳转家长信息页面
  goParent(data:any) {
    if (!data.id || !data.deptId) {
      return;
    }
    this.clearUserInfo();
    const params:Organization.Users.EduRequestParams = {
      userId: data.id,
      deptId: data.deptId
    };
    this.setEduUserInfoParams(params);
    this.getOrgUserInfo(true);
  }

  @Watch('orgUserInfo')
  onUserInfoChange(v:any) {
    if (v && v.id) {
      this.getDepartmentList();
    }
  }
}
</script>

<style lang="less">
@import "../../styles/themes/index.less";
  .user-detail-wrapper {
    padding: 0 24px 24px 24px;
    &.en {
      /* 英文下样式修复 */
      .box-item .item-child .left-header {
        width: auto;
        min-width: 135px;
      }
    }
    .box-item {
      padding: 21px 0 19px;
      border-bottom: 1px solid rgb(232,232,232);
      &:last-child {
        border-bottom: 0 none;
      }
      .item-title {
        padding-bottom: 6px;
        text-align: left;
        font-size: 14px;
        color:@base-text-color;
        font-weight:500;
      }
      .item-child {
          font-size: 0;
          white-space: nowrap;
          padding: 10px 0;
          p {
            display: inline-block;
            vertical-align: top;
            margin-bottom: 0;
          }
          .item-avator-name{
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
          }
          .item-avator{
            display: inline-block;
            vertical-align: top;
            border-radius: 4px;
            overflow: hidden;
            & > i.icon {
              font-size: 64px;
              line-height: 64px;
              color: #FFB131;
            }
          }
          .setting-department{
            color: @primary-color;
            margin-left: 20px;
            cursor: pointer;
          }
      .child-left,
      .child-right,
      .child-content {
            font-size:14px;

          }
      .child-left,
      .child-right {
            display: inline-block;
            vertical-align: top;
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .left-header{
            width: 68px;
            margin-right: 8px;
            color:rgba(0,0,0,0.65);
          }
          .limit{
            max-width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .limit2{
            max-width: 90%;
            white-space: normal;
          }
          .link{
            color: @primary-color !important;
            cursor: pointer;
          }
          .inner-text{
            // white-space: normal;
            // max-width: 220px;
            // overflow: hidden;
            // text-overflow: ellipsis;
            color:rgba(0,0,0,0.85);
        i {
          margin-right: 6px;
          font-size: 14px;
          color: rgba(0,0,0,0.25);
          }
        span:nth-child(n+2){
          margin-left: 17px;
        }
      }
    }
  }
}
.main-department-wrap{
  .main-department{
    .left-header{
      color: rgba(0,0,0,0.65);
    }
    .inner-text{
      margin-left: 24px;
      color: rgba(0,0,0,0.85);
    }
  }
  .department-list{
    overflow: hidden;
    margin-top: 22px;
    .department{
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid #D9D9D9;
      background: #FAFAFA;
      float: left;
      margin: 0 8px 16px 0;
      color: rgba(0,0,0,0.65);
      cursor: pointer;
    }
    .main{
      border: 1px solid @primary-color;
      background: #E8FCF4;
      color: @primary-color;
    }
  }
}
</style>
