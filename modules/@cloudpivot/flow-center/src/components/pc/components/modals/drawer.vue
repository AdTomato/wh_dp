<template>
  <a-drawer
    title="用户信息"
    :closable="true"
    :mask="true"
    :width="640"
    :visible="isShowModal"
    @close="onClose"
  >
    <div class="user-box">
      <div class="user-box-top">
        <div class="avatar-box">
          <img v-if="userInfo.imgUrl" :src="userInfo.imgUrl"/>
          <i v-else class="icon aufontAll h-icon-all-normal_smile default-avatar"></i>
          <p>
            <i class="icon aufontAll h-icon-all-dingding-circle"></i>
            <a :href="'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=' + userInfo.mobile">发起钉钉对话</a>
          </p>
        </div>
      </div>

      <div class="user-box-content">
        <ul>
          <li>
            <span class="label">姓名</span>
            <span class="text">{{ userInfo.name }}</span>
          </li>

          <li>
            <span class="label">职位</span>
            <span class="text">{{ userInfo.appellation }}</span>
          </li>

          <li>
            <span class="label">所属部门</span>
            <span class="text" :title="userInfo.departmentName">{{ userInfo.departmentName }}</span>
          </li>

          <li>
            <span class="label">工号</span>
            <span class="text">{{ userInfo.employeeNo }}</span>
          </li>

          <li>
            <span class="label">邮箱</span>
            <span class="text">{{ userInfo.email }}</span>
          </li>

          <li>
            <span class="label">手机号</span>
            <span class="text">{{ userInfo.mobile }}</span>
          </li>

          <li>
            <span class="label">角色</span>
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ userInfo.roleName }}</span>
              </template>
              <span class="text">{{ userInfo.roleName }}</span>
            </a-tooltip>
          </li>
        </ul>
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  Drawer, Tooltip
} from 'h3-antd-vue';

@Component({
  name: 'CommonDrawer',
  components: {
    ADrawer: Drawer,
    ATooltip: Tooltip,
  }
})

export default class CommonDrawer extends Vue {
@Prop() value !: any;

@Prop() data !: any;

isShowModal:boolean = false;

userInfo:any = {};

onClose() {
  this.$emit('input', false);
}


@Watch('value')
onValueChange(v:any) {
  this.isShowModal = v;
}

@Watch('data')
onDataChange(v:any) {
  const keys = Object.keys(v);
  keys.forEach((k:any) => {
    v[k] = v[k] || '--';
  });
  this.userInfo = v;
}
}
</script>

<style lang="less" scoped>
// @import '../../../styles/themes/default.less';
.user-box{
  .user-box-top {
    .avatar-box {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      & > .icon.default-avatar {
        font-size: 40px;
        line-height: 40px;
        color: #36CFC9;
      }
      p {
        display: inline-block;
        vertical-align: bottom;
        margin-left: @base4-padding-lg;
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
    margin-top: @base4-padding-lg;
    ul > li {
      width: 50%;
      float: left;
      margin-bottom: @base10-padding-md;
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
