<template>
  <div class="smart-search clearfix">
    <div :class="{ collapsed : collapsed }">
      <div class="query-form-left" ref="queryFormLeft">
        <slot name="search"/>
      </div>
      <div class="query-form-right">
        <span v-show="queryWidth" @click="toggle">
          <span class="query-form__controller">{{ collapsed ? '更多' : '收起' }}</span>
          <a-icon type="down" :class="{ collapsed : collapsed }"/>
        </span>
        <a-button @click="$emit('reset')">重置</a-button>
        <a-button type="primary" @click="okBtn">查询</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const UserModule = namespace('System/User');

@Component({
  name: 'query-workitem',
  components: {}
  })
export default class SmartSearch extends Vue {
  @UserModule.State('menuShowStatus') menuShowStatus!: boolean;
  screenWidth: number = document.body.clientWidth;

  menuLeftWidth: number = 224;

  queryWidth: boolean = false;

  timer: boolean = false;

  collapsed: boolean = true;

  toggle() {
    this.collapsed = !this.collapsed;
  }

  okBtn() {
    this.$emit('search');
    this.collapsed = true;
  }

  onresize() {
    window.screenWidth = document.body.clientWidth;
    this.screenWidth = window.screenWidth;
    const val = this.screenWidth;
    if (!this.timer) {
      this.screenWidth = val;
      this.timer = true;
      const that = this;
      setTimeout(() => {
        const boxWidth = that.screenWidth - that.menuLeftWidth - 243;
        that.isWidth(boxWidth);
        that.timer = false;
      }, 300);
    }
  }

  // 获取body宽度
  mounted() {
    const that = this;
    that.setLeftWidth(that.menuShowStatus);
    window.addEventListener('resize', that.onresize);
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.onresize);
  }

  // 监听左侧是否展开
  @Watch('menuShowStatus')
  menuWidth(val: boolean, oldVal: boolean) {
    this.setLeftWidth(val);
  }

  // 设置左侧宽度
  setLeftWidth(val: boolean) {
    if (val) {
      this.menuLeftWidth = 46;
      const boxWidth = this.screenWidth - this.menuLeftWidth - 243;
      this.isWidth(boxWidth);
    } else {
      this.menuLeftWidth = 224;
      const boxWidth = this.screenWidth - this.menuLeftWidth - 243;
      this.isWidth(boxWidth);
    }
  }
  // 判断宽度
  isWidth(val: number) {
    const block:any = this.$refs.queryFormLeft;
    if (!block) {
      return;
    }
    this.queryWidth = block.offsetHeight > 60;
  }
}
</script>
<style lang="less" scoped>
.smart-search {
  height: 32px;
  position: relative;
  & > div {
    padding: 0 24px;
    z-index: 10;
    position: absolute;
    background: white;
    box-shadow: 0px 4px 8px 0px rgba(30, 85, 255, 0.1);
    width: 100%;
    &.collapsed {
      overflow: hidden;
      height: 32px;
      box-shadow: none;
    }
    .query-form-left {
      float: left;
      width: calc(100% - 195px);
    }
    .query-form-right {
      float: left;
      width: 195px;
      // height: 45px;
      // padding: 8px;
      text-align: right;
      button {
        margin-left: 8px;
        &:first-of-type {
          margin-left: 16px;
        }
      }

      i {
        transform: rotate(180deg);
        &.collapsed {
          transform: rotate(0);
        }
      }
    }
    .query-form__controller {
      cursor: pointer;
    }
  }
}
</style>
