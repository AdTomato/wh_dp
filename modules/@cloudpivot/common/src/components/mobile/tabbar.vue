<template>
  <div class="app-tab-bar">
    <!-- 横向拖动tab条 -->
    <div class="noscroll-bar">
      <h3-tab-flow
        ref="flowtab"
        :barActiveColor="activeColor"
        :lineWidth="2"
        :borderBottom="false"
      >
        <h3-tab-item
          v-for="(app,index) in apps"
          :key="index"
          :selected="app[assoKey] === assoKeyValue"
          @click.native="onItem(index)"
        >
          {{ app[displayName] }}
        </h3-tab-item>
      </h3-tab-flow>
    </div>
    <!-- 右侧单击侧滑开关 -->
    <div
      class="app-tab-bar-more"
      v-if="apps.length > 2"
      @click="onToggle"
    >
      <i class="icon aufontAll h-icon-all-ellipsis-o"></i>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { H3TabFlow, H3TabItem } from 'h3-mobile-vue';

@Component({
  name: 'AppTabBar',
  components: {
    H3TabFlow,
    H3TabItem,
  }
})
export default class AppTabBar extends Vue {
  @Prop() apps!: Array<any>;

  @Prop() assoKey!: string;

  @Prop({ default: 'name' }) displayName?: string;

  @Prop() active!: string | number;

  @Prop() onChange!: Function;

  @Prop() toggle!: Function;

  @Prop({ default: '#2970FF' }) activeColor?: string;

  assoKeyValue: string | number = '';

  barWidth: number = 0;

  created() {
    if (!this.active) {
      this.assoKeyValue = this.apps[0][this.assoKey];
    } else {
      this.assoKeyValue = this.active;
    }
  }

  mounted() {
    this.$nextTick(() => {
      let width:number = 0;
      const dom:any = this.$refs.flowtab;
      const items: any = dom.$el.children;
      const len: number = items.length;
      for (let i = 0; i < len; i += 1) {
        width += items[i].offsetWidth;
      }
      this.barWidth = width + 20;
    });
  }

  onItem(index: number) {
    const val:string = this.apps[index][this.assoKey];
    if (this.onChange) {
      this.onChange(val);
    } else {
      this.$emit('onChange', val);
    }
  }

  onToggle() {
    if (this.toggle) {
      this.toggle();
    } else {
      this.$emit('toggle');
    }
  }

  @Watch('active')
  onActiveChange(val:string) {
    if (val) {
      this.assoKeyValue = val;
    }
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.app-tab-bar {
  position: relative;
  padding-right: 42px;
  &-label {
    display: inline-block;
    flex: none;
    width: auto;
    max-width: 6em;
    .px2rem(padding,@horizontal-padding-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: inherit;
    color: @text-color-secondary;
    box-sizing: border-box;
  }
  /deep/.h3-tab-flow{
    overflow-y: hidden;
    white-space: nowrap !important;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
  }
  /deep/.h3-tab-item{
    color: #666;
    background: #fff !important;
  }
  /deep/.h3-tab-selected{
    color: @text-color-selected;
    font-weight: 600;
  }
  &-more {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    width: 42px;
    // height: 44px;
    // line-height: 44px;
    text-align: center;
    background-color: #fff;
    opacity: 0.96;
    box-shadow:-9px 0px 10px -10px rgba(0,0,0,0.3);
    // .backgroundline('bottom');
  }
  .noscroll-bar {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    // .backgroundline('bottom');
  }
}
</style>
