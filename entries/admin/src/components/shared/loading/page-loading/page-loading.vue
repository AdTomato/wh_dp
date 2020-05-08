<template>
  <div
    ref="pageLoading"
    v-show="value"
    class="page-loading"
    :class="{'global-loading':shadeGlobal}"
  >
    <div
      v-show="shade"
      class="page-loading__shade"
      :style="`background-color: ${shadeColor};opacity: ${shadeOpacity};`"
    ></div>
    <div class="page-loading__content">
      <i></i>
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'page-loading'
})
export default class PageLoading extends Vue {
  @Prop({ default: false }) value!: Boolean;

  @Prop({ default: true }) shade!: Boolean;

  @Prop({ default: '#FFFFFF' }) shadeColor!: String;

  @Prop({ default: 0.85 }) shadeOpacity!: Number;

  @Prop({ default: false }) shadeGlobal!: Boolean; // loading是否在全局

  @Prop({ default: '加载中' }) text!: string; // loading文字

  mounted() {
    this.loadingToggle();
  }

  @Watch('value')
  watchLoading() {
    this.loadingToggle();
  }

  loadingToggle() {
    const pageLoading = this.$refs.pageLoading as HTMLElement;
    if (pageLoading.parentElement) {
      pageLoading.parentElement.classList.toggle('page-loading-wrap', this.value as any);
    }
  }
}
</script>

<style lang="less">
  .page-loading{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
    z-index: 998;
    &-wrap{
      position:relative !important;
      overflow: hidden !important;
    }
    &__shade{
      position: absolute;
      top:0;
      left:0;
      bottom: 0;
      right: 0;
      z-index: 0;
    }
    &__content{
      text-align: center;
      z-index: 1;
      i{
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url("../loading.png");
        animation: pageLoading linear 1.5s infinite;
      }
      span{
        color: rgba(0,0,0,0.45);
        display: block;
      }
    }
    @keyframes pageLoading {
      from {transform: rotate(0deg);}
      to {transform: rotate(360deg);}
    }
  }
  .global-loading{
    position: fixed !important;
  }
</style>
