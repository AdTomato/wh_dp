<template>
  <div class="workitem-box">
    <div class="content-top">
      <h2>个人信息</h2>
    </div>

    <div class="table-box">
      <div class="user-box">
        <div class="user-box-top">
          <div class="bg-img">
            <img src="@/assets/images/userinfo-bg.png" alt="">
          </div>
          <div class="avatar-box">
            <img v-if="user.imgUrl" :src="user.imgUrl"/>
            <i v-else class="icon aufontAll h-icon-all-normal_smile default-avatar"></i>
            <!-- <p>
              <i class="icon aufontAll h-icon-all-dingding-circle"></i>
              <a :href="'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=' + user.mobile">发起钉钉对话</a>
            </p> -->
          </div>
        </div>

        <div class="user-box-content">
          <ul>
            <li v-for="(item, index) in userInfo" :key="index">
              <span class="label">{{ item.title }}</span>
              <span class="text">{{ item.value }}</span>
            </li>
            <!-- <li>
              <span class="label">入职时间</span>
              <span class="text">{{ userInfo.entryDate }}</span>
            </li>

            <li>
              <span class="label">钉钉号</span>
              <span class="text">{{ userInfo.userId }}</span>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';

import { workflowCenterApi } from '@cloudpivot/api';

import {
  State, namespace
} from 'vuex-class';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: 'UserInfo'
})

export default class UserInfo extends Vue {
  @WorkflowCenterModule.State('userId') userId!:any;

  userInfo:any = [];

  user:any = [];

  mounted() {
    this.getUserInfo(this.userId);
  }

  // 获取用户信息
  async getUserInfo(id:string) {
    if (!id) return;
    const res = await workflowCenterApi.getUserInfo({ id });
    if (res.errcode === 0) {
      const { data } = res;
      this.user = data;
      this.setUserInfo();
    }
  }

  setUserInfo() {
    const data = this.user;
    this.userInfo = [
      {
        title: this.$t('languages.common.userInfo.name'),
        value: data.name || '--'
      },
      {
        title: this.$t('languages.common.userInfo.id'),
        value: data.userId || '--'
      },
      {
        title: this.$t('languages.common.userInfo.departmentName'),
        value: data.departmentName || '--'
      },
      {
        title: this.$t('languages.common.userInfo.appellation'),
        value: data.appellation || '--'
      },
      {
        title: this.$t('languages.common.userInfo.email'),
        value: data.email || '--'
      },
      {
        title: this.$t('languages.common.userInfo.employeeNo'),
        value: data.employeeNo || '--'
      },
      {
        title: this.$t('languages.common.userInfo.mobile'),
        value: data.mobile || '--'
      },
      {
        title: this.$t('languages.common.userInfo.officePhone'),
        value: data.officePhone || '--'
      },
      {
        title: this.$t('languages.common.userInfo.roleName'),
        value: data.roleName || '--'
      },
      {
        title: this.$t('languages.common.userInfo.remark'),
        value: data.remark || '--'
      }
    ];
  }

  @Watch('userId')
  onUserIdChange(v:any) {
    if (v) {
      this.getUserInfo(v);
    }
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setUserInfo();
  }
}
</script>


<style lang="less" scoped>
@import './style/index.less';
.user-box{
  padding: @base4-padding-md;
  max-height: 100%;
  overflow: auto;
  .user-box-top {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .bg-img {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      & > img {
        height: 100%;
      }
    }
    .avatar-box {
      text-align: center;
      position: relative;
      z-index: 1;
      img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
      & > .icon.default-avatar {
        font-size: 64px;
        line-height: 64px;
        color: #36CFC9;
      }
      p {
        margin-top: @base4-padding-xs;
        color: @primary-color;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
        i.icon, a{
          display: inline-block;
          vertical-align: middle;
          margin-right: @base4-padding-xs;
        }
      }
    }
  }
  .user-box-content {
    margin: @base4-padding-lg 0 0 @base4-padding-lg;
    ul > li {
      width: 50%;
      float: left;
      margin-bottom: @base10-padding-md;
      &.department-name {
        width: 100%;
        & > .label {
          vertical-align: top;
        }
        & > span:last-of-type {
          width: calc( 100% - 112px );
        }
      }
      span {
        display: inline-block;
        vertical-align: middle;
        &.label {
        width: 112px;
        color: @light-color-2;
        }
        &.text {
          color: @light-color-1;
          font-weight: 400;
          max-width: calc( 100% - 135px );
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
