<template>
  <div class="common-setting">
    <div class="common-setting__header">
      <span>常规设置</span>
    </div>
    <div class="common-setting__content">
      <template>
        <a-steps
          direction="vertical"
          :current="-1"
          class="common-setting__step"
        >
          <a-step id="app-list1">
            <div class="common-setting__dingtalk" slot="description">
              <check-dingtalk>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </check-dingtalk>
            </div>
          </a-step>
          <!--     <a-step id="app-list4">
            <div class="common-setting__dingtalk" slot="description">
              <syn-redirect-url>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </syn-redirect-url>
            </div>
          </a-step> -->
          <a-step id="app-list2">
            <div class="common-setting__dingtalk" slot="description">
              <portal-setting>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </portal-setting>
            </div>
          </a-step>
          <a-step id="app-list3">
            <div class="common-setting__dingtalk" slot="description">
              <file-storage>
                <span @click="ShowConfigRule" slot="settingTips"><a href="javascript:void(0)"> 配置规则 </a></span>
              </file-storage>
            </div>
          </a-step>
        </a-steps>
      </template>
      <!-- <div class="common-setting__border"></div>
      <div class="common-setting__storage" id="app-list4">
        <file-storage/>
      </div> -->
      <!-- <div class="common-setting__dingtalk">
        <check-dingtalk/>
      </div>
      <div class="common-setting__border"></div>
      <div class="common-setting__portal">
        <portal-setting/>
      </div>
      <div class="common-setting__border"></div>
      <div class="common-setting__storage">
        <file-storage/>
      </div> -->
    </div>

    <a-modal
      :visible="showGuide"
      width="418px"
      :centered="true"
      class="common-setting__guide"
      :okText="'下一步'"
      @ok="doGuide"
      :maskClosable="false"
      :keyboard="false"
    >
      <div class="guide__wrap clearfix">
        <div class="guide__wrap--img">
          <img src="@/assets/images/welcomeBpm.png"/>
        </div>
        <p class="guide__wrap--tips">
          Hi，欢迎进入云枢系统， 为了您在使用过程中得到更好的体验， 请先跟着我配置信息。
        </p>
      <!-- <div class="guide__wrap--tips">

      </div> -->
      </div>
    </a-modal>

    <a-drawer
      title="配置规则"
      width="560"
      :visible="showDrawer"
      @close="ShowConfigRule"
    >
      <config-rule/>
    </a-drawer>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import h3Intro from '@/utils/introjs/h3-intro';
import CheckDingtalk from './check-dingtalk.vue';
import FileStorage from './file-storage.vue';
import PortalSetting from './portal-setting.vue';
import SynRedirectUrl from './syn-redirect-url.vue';
import ConfigRule from './config-rule/index.vue';
@Component({
  name: 'common-setting',
  components: {
    CheckDingtalk,
    FileStorage,
    PortalSetting,
    SynRedirectUrl,
    ConfigRule
  }
})
export default class CommonSetting extends Vue {
 showGuide: boolean = false;

 showDrawer: boolean = false;

 /**
 * 抽屉显隐的控制
 */
 ShowConfigRule() {
   this.showDrawer = !this.showDrawer;
 }

 /**
  * 指引开始
  */
 doGuide() {
   (window as any).h3Intro.start();
   this.showGuide = false;
 }

 /**
   * 生命周期
   */
 mounted() {
   // 设置引导提示信息
   this.showGuide = true;
   const isShowGuide = localStorage.getItem('isNewUser');
   if (!isShowGuide) {
     this.showGuide = true;
     localStorage.setItem('isNewUser', 'toDoGuide');
   } else {
     this.showGuide = false;
   }
   // if (!isShowGuide) {

   (window as any).h3Intro = h3Intro({
     stepData: [
       {
         element: '#app-list1',
         content: '钉钉集成：系统基于钉钉内置使用，系统中组织机构从钉钉同步，需在钉钉中自建应用，\
          并获取应用消息填写在下方，详细配置步骤请查看“配置规则”',
       },
       /* {
         element: '#app-list2',
         content: '增量同步：钉钉中组织修改变更，增量同步到系统中，\
          配置信息保存即可绑定钉钉同步，详细配置步骤请查看“配置规则”'
       },  */
       {
         element: '#app-list2',
         content: '门户访问设置：用户在门户钉钉扫码登录配置，\
          需配置相关信息，详细配置步骤请查看“配置规则”',
         // position: 'right',
       },
       {
         element: '#app-list3',
         content: '文件存储：系统存储文件位置，相关信息从阿里云获取',
         // position: 'right',
       }
     ]
   });
   // }
 }
}
</script>
<style lang="less" scoped>
.common-setting{
    margin: 0 24px;
    height: 100%;
    &__content{
      .common-setting__step {
       max-width: 700px;
      }
      /deep/.ant-steps-item-description {
        padding-bottom: 24px;
      }
      height: calc(100% - 70px);
      overflow-y: auto;
      padding-left: 10px;
      padding-top: 24px;
      padding-bottom: 64px;
      // position: relative;
    }
    &__header{
        padding: 13px 0;
        text-align: left;
        border-bottom: 1px solid rgba(232,232,232,1);
        span{
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
        }
    }
    &__border{
        border-bottom: 1px solid rgba(232,232,232,1);
        // min-height: 1px;
    }
    &__dingtalk{
      max-width: 700px;
      margin-top: 2px;
      // margin-top: 300px;
    }
    &__storage{
        max-width: 740px;
        margin-top: 24px;
    }
    &__portal{
      max-width: 700px;
      margin-top: 24px;
    }
    /deep/&__guide{
      /deep/.ant-modal-close{
        display: none;
      }
    }
}
</style>
<style lang="less">
@import '~@/utils/introjs/h3-intro.less';
.common-setting__guide{
  .guide__wrap{
    .guide__wrap--img{
      float: left;
      img{
        width: 82px;
        height: 93px;
      }
    }
    .guide__wrap--tips{
      // float: left;
      margin-left: 108px;
      padding-top: 7px;
      font-size: 16px;
    }
  }
  .ant-modal-close{
    display: none;
  }
  .ant-modal-footer{
    border-top: 0;
  }
  .ant-btn-default{
    display: none;
  }
  .ant-modal-body {
    padding-bottom: 0;
  }
}
</style>
