<template>
  <div class="syn-redirect-uri">
    <div class="guide">
      <div class="syn-redirect-uri__header">
        <span>增量同步</span>
        <span class="header__tips">组织同步增量事件，用于组织增量同步</span>
        <slot name="settingTips"/>
      </div>
      <div class="syn-redirect-uri__form">
        <a-row class="syn-redirect-uri__item">
          <a-col :span="layout.left" class="syn-redirect-uri__left">
            <span class="required">*</span>
            <span>增量回调地址:</span>
          </a-col>
          <a-col :span="layout.right" class="syn-redirect-uri__right">
            <span v-if="edit" class="syn-redirect-uri__right--edit">{{ params.synRedirectUri }}</span>
            <a-input v-else v-model="params.synRedirectUri"/>
          </a-col>
        </a-row>
      </div>
    </div>
    <a-row class="syn-redirect-uri__item">
      <a-col :span="layout.left" class="syn-redirect-uri__left"></a-col>
      <a-col :span="layout.right" class="syn-redirect-uri__right">
        <!-- <btn-group @save="save" @connect="connect"/> -->
        <div class="btn-group">
          <a-button
            type="primary"
            @click="save"
            class="btn-group__btn"
          >{{ btnText[0] }}</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


import systemApi from '@/apis/system/system-manager.api';


@Component({
  name: 'syn-redirect-uri',
  components: {
  }
  })
export default class SynRedirectUrl extends Vue {
  layout = {
    left: 5,
    right: 10
  }

  params = {
    synRedirectUri: ''
  }

  edit: boolean = false;
  btnText = [
    '保存',
    '连接测试'
  ]

  created() {
    const vm: any = this;
    systemApi.getSynRedirectUri().then((res: any) => {
      if (res.data) {
        vm.params = res.data;
        vm.edit = true;
        vm.btnText[0] = '编辑';
      }
    });
  }

  // 保持配置数据
  save() {
    const vm: any = this;
    if (vm.edit) {
      vm.edit = false;
      vm.btnText[0] = '保存';
      return;
    }
    systemApi.creatSynRedirectUri(vm.params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('保存成功!', 2);
        vm.edit = true;
        vm.btnText[0] = '编辑';
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  // 连接测试
  // connect() {
  // const vm:any = this;
  // systemApi.checkOss(vm.params).then((res:any) => {
  // 	if (res.errcode === 0) {
  // 		vm.$message.success(res.errmsg, 2);
  // 	} else {
  // 		vm.$message.error(res.errmsg, 2);
  // 	}
  // })
  // }
}
</script>

<style lang="less" scoped>
.syn-redirect-uri {
  text-align: left;
  margin-left: 6px;
  &__header {
    a {
      display: inline-block;
      font-size: 12px;
      color: @primary-color;
      padding-left: 8px;
    }
    padding-bottom: 20px;
    position: relative;
    // font-size:18px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    span {
      line-height: 26px;
      height: 26px;
      // padding-left: 14px;
      // &:before{
      // 	content: "";
      // 	position: absolute;
      // 	height: 20px;
      // 	width: 0;
      // 	top: 3px;
      // 	left: 0;
      // 	border-left: 3px solid @primary-color;
      // }
    }
    .header__tips {
      display: inline-block;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      padding-left: 8px;
    }
  }
  &__form {
    .syn-redirect-uri__item {
      margin-bottom: 20px;
      div {
        float: left;
      }
      .syn-redirect-uri__left {
        span {
          color: rgba(0, 0, 0, 0.65);
        }
        position: relative;
        .required {
          left: -6px;
          color: #f5222d;
          position: absolute;
        }
        line-height: 32px;
      }
      .syn-redirect-uri__right {
        color: rgba(0, 0, 0, 0.85);
        &--edit {
          line-height: 32px;
        }
      }
    }
  }
}
</style>
