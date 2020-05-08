<template>
  <div class="setting">
    <div class="setting-item">
      <ul>
        <li>
          <div>
            <span class="text">{{ $t('languages.common.version') }}</span>
            <span class="text">V{{ version }}</span>
          </div>
          <div class="icon"></div>
        </li>
        <li @click="showToggleLang">
          <div>
            <span class="text">{{ $t('languages.common.toggleLanguage') }}</span>
            <span class="text">{{ curLanguage }}</span>
          </div>
          <div class="icon"><i class="icon aufontAll h-icon-all-right-o"></i></div>
        </li>
      </ul>
    </div>
    <H3Actionsheet
      class="sheet-adjust"
      v-model="showActionSheet"
      :menus="actionSheetMenus"
      showCancel
      @on-click-menu="clickActionSheetMenu"
    ></H3Actionsheet>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';

import { H3Actionsheet } from 'h3-mobile-vue';

import { utils } from '@cloudpivot/common';

@Component({
  name: 'Setting',
  components: {
    H3Actionsheet
  }
})
export default class Setting extends Vue {
  showActionSheet:boolean = false;

  actionSheetMenus:Array<any> = [
    {
      label: '中文',
      type: 'Default',
      value: 'zh'
    },
    {
      label: '英文',
      type: 'Default',
      value: 'en'
    }
  ]


  get curLanguage() {
    switch (this.$i18n.locale) {
      case 'zh':
        return '中文';
      case 'en':
        return '英文';
      default:
        return '';
    }
  }

  get version() {
    return this.$store.state.config.systemVersion;
  }


  /**
   * 切换语言
  */
  toggleLanguage(lang:string) {
    this.$i18n.locale = lang;
    localStorage.setItem('locale', this.$i18n.locale);
    this.$forceUpdate();
  }

  showToggleLang() {
    this.showActionSheet = true;
  }

  clickActionSheetMenu(value:any) {
    if (value === 'cancel') return;
    this.toggleLanguage(value);
  }

  @Watch('showActionSheet')
  onShowActionSheetChange(v:boolean) {
    if (!v) {
      setTimeout(() => {
        utils.Bus.$emit('toggleNavbar', !v);
      }, 100);
    } else {
      utils.Bus.$emit('toggleNavbar', !v);
    }
  }
}
</script>
<style lang='less'>
  @import "~@cloudpivot/common/styles/mixins.less";
  .setting {
    .setting-item {
      .px2rem(margin-top, 40px);
      ul {
        li {
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .px2rem(padding, 30px);

          div {
            span {
              .px2rem(font-size, 30px);
              display: inline-block;
              line-height: 1;
              &:first-of-type {
                color: rgba(102, 102, 102, 1);
                .px2rem(width, 145px)
              }
              &:last-of-type {
                color: rgba(51, 51, 51, 1);
                .px2rem(margin-left, 85px)
              }
            }
          }
        }
      }
    }
    .sheet-adjust {
      .h3ui-actionsheet__menu, .h3ui-actionsheet__action {
        color: #333333;
      }
    }
  }
</style>
