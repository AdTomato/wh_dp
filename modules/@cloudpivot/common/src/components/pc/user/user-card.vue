
<template>
  <div class="user-card">
    <div class="user-card__head">
      <a-avatar
        :size="56"
        icon="user"
        :src="user.imgUrl"
      />
      <div>
        <div class="user-card__head__name">{{ user.name }}</div>
        <div>{{ user.roleName }}</div>
      </div>
    </div>

    <div class="user-card__meta">
      <label>部门</label>
      <span>{{ user.departmentName }}</span>
    </div>

    <div class="user-card__meta">
      <label>手机</label>
      <span>{{ user.mobile }}</span>
    </div>

    <div class="user-card__meta">
      <label>邮箱</label>
      <span>{{ user.email }}</span>
    </div>

    <div class="user-card__foot">
      <a-button
        type="primary"
        icon="dingding"
        @click="openDingTalk"
      >发起钉钉对话</a-button>
    </div>

  </div>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Avatar, Button } from 'h3-antd-vue';

import { userApi }  from '@cloudpivot/api';

@Component({
  name: 'user-card',
  components: {
    AAvatar: Avatar,
    AButton: Button
  }
})
export default class UserCard extends Vue {
  
  @Prop({
    default : ''
  })
  userId !: string

  user = '' as any

  @Watch('userId', {
    immediate: true
  })
  setUserId() {
    if (this.userId) {
      userApi.getUserInfo(this.userId).then((res) => {
        if (res.errcode === 0) {
          this.user = res.data;
        }
      });
    }
  }

  openDingTalk() {
    window.location.href = `dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=${this.user.mobile}`;
  }
}


</script>

<style lang="less" scoped>

// @import "../../../styles/themes/default.less";

/deep/.ant-popover-inner-content{
  padding: 0;
  box-shadow:0px 2px 8px 0px rgba(30,85,255,0.15);
}

.user-card{
  padding: 18px @base4-padding-xs;
  width: 340px;
  .label{
    width: 70px;
    color: @light-color-2;
    display: inline-block;
  }
  &__head{
    display: flex;
    justify-content: center;
    padding-bottom: @base10-padding-lg;

    & > .ant-avatar{
      margin-right: @base4-padding-xs;
      flex: 0 0 56px;
    }

    &__name{
      font-size:@font-size-16;
      font-weight:500;
      color: @light-color-1;
      margin-bottom: @font-size-12;
    }

  }


  &__meta{
    padding:@base10-padding-sm 0;
    color: @light-color-1;

    label{
      width: 70px;
      color: @light-color-2;
      display: inline-block;
    }

  }

  &__foot{
    text-align: center;
    padding-top: @base10-padding-md ;
  }

}
</style>
