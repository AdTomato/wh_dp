<template>
  <div class="config-rule">
    <!-- 钉钉集成 -->
    <div class="config-rule__item">
      <div class="config-rule__header">
        <span>钉钉集成</span>
      </div>
      <div
        class="item__wrap"
        v-for="(content, index) in dingTalkCheck"
        :key="index"
      >
        <p class="item__title">  {{ `${index + 1}、${content.title}` }}</p>
        <p class="item__info"> {{ content.content }} <a
          target="_blank"
          v-if="content.url"
          :href="content.url"
        > {{ content.url }}</a> </p>
        <div class="item__img">
          <img :src="content.img" @click="previewImg(content.img)">
        </div>
      </div>
    </div>

    <!-- 增量同步 -->

    <!-- <div class="config-rule__item">
      <div class="config-rule__header">
        <span>增量同步</span>
      </div>
      <div class="item__wrap">
        <p class="item__title"> 1、 组织同步增量事件，用于组织增量同步，若不配置组织机构只能手动同步 增量同步地址：
          <a href="javascript:void(0)"> http://SERVER:8080 </a>
        </p>
      </div>
    </div> -->

    <!-- 门户访问设置 -->

    <div class="config-rule__item">
      <div class="config-rule__header">
        <span>门户访问</span>
      </div>
      <div
        class="item__wrap"
        v-for="(content, index) in portalSetting"
        :key="index"
      >
        <p class="item__title">  {{ `${index + 1}、${content.title}` }}</p>
        <p class="item__info"> {{ content.content }} <a
          target="_blank"
          v-if="content.url"
          :href="content.url"
        > {{ content.url }}</a> </p>
        <div class="item__img">
          <img
            v-for="(img, imgIndex) in content.img"
            :src="img"
            :key="imgIndex"
            data-img="dsd"
            @click="previewImg(img)"
          >
        </div>
      </div>

      <!-- 放大图片 -->
      <a-modal
        v-model="isPreviewImage"
        :footer="null"
        width="65%"
        :maskClosable="false"
        :keyboard="false"
      >
        <img style="width: 100%" :src="imgSrc">
      </a-modal>

    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'config-setting'
})
export default class configRule extends Vue {
  dingTalkCheck = [
    {
      title: '登录钉钉管理后台，进入工作台-自建应用，添加应用。',
      content: '钉钉后台管理地址：',
      url: 'https://oa.dingtalk.com/index.htm#/login',
      img: require('./images/01.png')
    },
    {
      title: '填写应用的基本信息，填写访问地址。',
      content: '钉钉后台管理地址：',
      url: '',
      img: require('./images/02.png')
    },
    {
      title: '应用首页链接：',
      content: '云枢系统移动端访问地址，\
      格式为：http://SERVER/mobile?corpId=$CORPID$&agentId=xxx，其中，\
      XXX为当前应用的AgentId，创建后获取 服务器出口IP：云枢系统的IP地址，\
      每个IP只能在一个企业中使用 PC端首页地址：云枢系统访问PC端的地址，\
      格式：http://SERVER?corpId=$CORPID$&agentId=xxx 管理后台地址：\
      云枢系统访问PC端的地址，格式：http://SERVER/admin',
      url: '',
      img: require('./images/03.png')
    },

    {
      title: '生成应用，获取Appkey、APPSecret和AgentId，\
      将AgentId填写到地址中，更新应用，并将信息填写到云枢系统“钉钉集成”中。',
      content: '',
      url: '',
      img: require('./images/04.png')
    },

    {
      title: '开通企业应用的通讯录权限：企业应用-权限管理-查看详情',
      content: '',
      url: '',
      img: require('./images/05.png')
    }
  ]

  portalSetting = [
    {
      title: 'CorpID、SSOsecret：钉钉企业的唯一标识，获取地址：工作台-自建应用-开发信息-开发账号管理-企业自用账号信息。',
      content: '',
      url: '',
      img: [require('./images/04.png')]
    },
    {
      title: '扫码登录app ID、扫码登录appSecret、移动接入应用的标识，\
      获取地址：钉钉后台，工作台-自建应用--应用设置-移动介入应用-扫码登录使用的\
      app ID、appSecret获取',
      content: '',
      url: '',
      img: [require('./images/05.png'), require('./images/06.png')]
    },
    // {
    //   title: '',
    //   content: '',
    //   url: '',
    //   img: []
    // },
  ]

  imgSrc:string = ''; // 图片连接

  isPreviewImage:boolean = false;

  /**
   * 预览图片
  */
  previewImg(src:string) {
    this.isPreviewImage = true;
    this.imgSrc = src;
  }
}

</script>

<style lang="less" scoped>
.config-rule{
  &__item {

    padding-bottom: 19px;
    border-bottom: 1px solid #E8E8E8;
    margin-bottom: 20px;
    &:last-child {
      border-bottom: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .config-rule__header {
      font-size:16px;
      font-weight:400;
      color:rgba(0,0,0,0.85);
      margin-bottom: 10px;
    }
    .item__wrap{
      .item__title{
        font-weight:400;
        line-height: 24px;
      }
      .item__info {
        font-size:12px;
        line-height: 24px;
        padding-top: 5px;
        a{
          color: @primary-color;
        }
      }
      .item__img{
        padding: 9px 0;
        text-align: center;
        & img {
          width: 100%;
          cursor: url("./images/enlarge.png"), pointer;
        }
      }
    }
  }

}
</style>
