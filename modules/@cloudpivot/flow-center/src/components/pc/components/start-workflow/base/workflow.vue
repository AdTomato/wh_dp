<template>
  <div
    class="workflow-wrap"
    :class="{'pop':pop}"
    @click="onClick(data.code)"
  >
    <div
      class="workflow-content"
      :class="{'pop':pop}"
      v-html="data.name"
      v-if="$i18n.locale === 'zh'"
    ></div>
    <div
      v-else
      class="workflow-content en"
      :class="{'pop':pop}"
      v-html="data.name_i18n[$i18n.locale]"
    ></div>
    <a-tooltip placement="top">
      <template slot="title">
        <span v-if="!favoriteClass">{{ $t('cloudpivot.flowCenter.pc.setCommon') }}</span>
        <span v-else>{{ $t('cloudpivot.flowCenter.pc.cancelCommon') }}</span>
      </template>
      <div
        class="star"
        :class="{'pop':pop}"
        @click="setFavorite"
      >
        <img
          class="square"
          :class="{'pop':pop}"
          src="../../../assets/images/square.png"
        >
        <i class="aufontAll h-icon-all-star" :class="{'favorite':favoriteClass,'pop':pop}"></i>
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import {
  Tooltip
} from 'h3-antd-vue';

import { workflowCenterApi, workflowCenter as workflowCenterParams, workflowApi }  from '@cloudpivot/api';


@Component({
  name: 'workflow',
  components: {
    ATooltip: Tooltip,
  }
})
export default class Workflow extends Vue {

  @Prop() pop!: boolean;

  @Prop() data!: any;

  @Prop() appCode!: string;

  favoriteClass: boolean = false; // 是否为常用流程


  get isShowSearchResult() {
    return this.$store.state.StartWorkflowStore.isShowSearchResult;
  }

  beforeMount() {
    if (this.data) {
      this.favoriteClass = this.data.favorites;
    }
  }

  getFavoriteWorkflowList(){
    return this.$store.dispatch('StartWorkflowStore/getFavoriteWorkflowList');
  }

  getWorkflowList(){
    return this.$store.dispatch('StartWorkflowStore/getWorkflowList');
  }

  /*
  * 设置常用流程
  */
  async setFavorite(evt: Event) {
    evt.stopPropagation();

    const cancelParams: workflowCenterParams.WorkflowParams = {
      workflowCode: this.data.code
    };
    const setParams: workflowCenterParams.WorkflowParams = {
      workflowCode: this.data.code,
      appCode: this.appCode
    };
    if (this.favoriteClass) {
      const res = await workflowCenterApi.deleteFavoriteWorkflow(cancelParams);
      if (!res.errcode) {
        this.favoriteClass = false;
        if (this.isShowSearchResult) return;
        await this.getFavoriteWorkflowList();
        this.$emit('calcPopTop');
        this.getWorkflowList();
      }
    } else {
      const res = await workflowCenterApi.setFavoriteWorkflow(setParams);
      if (!res.errcode) {
        this.favoriteClass = true;
        if (this.isShowSearchResult) return;
        const result:any = await this.getFavoriteWorkflowList();
        if (!result.errcode) {
          this.$emit('calcPopTop');
        }
      } else if (res.errcode === 201014) {
        this.$message.warning(this.$t('cloudpivot.flowCenter.pc.sevenFlowsIsMost'));
      }
    }
  }

  /*
  * 点击流程打开表单
  */
  onClick(code: string) {
    const route = {
      name: 'form-detail',
      query: {
        startWorkflowCode: code,
        return: location.pathname + location.search
      }
    };
    if (this.isDingTalk) {
      this.$router.push(route);
    } else {
      const { href } = this.$router.resolve(route);
      window.open(href, '_blank');
    }
  }

  @Watch('data', { deep: true })
  onDataChange(v: any) {
    if (v) {
      this.favoriteClass = v.favorites;
    }
  }
}
</script>

<style lang="less" scoped>
.workflow-wrap {
  cursor: pointer;
  width: 210px;
  height: 72px;
  float: left;
  padding: 14px;
  margin: 0 6px @base4-padding-md 6px;
  border-radius: @border-radius-lg;
  background: @main-background;
  position: relative;
  &:hover{
    border: 1px solid #B1BBC5;
  }
  .workflow-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .star {
    position: absolute;
    right: -3px;
    top: -2px;
    width: 34px;
    height: 34px;
    cursor: pointer;
    img {
      width: 34px;
      height: 34px;
    }
    i {
      position: absolute;
      right: 5px;
      top: 2px;
      cursor: pointer;
      font-size: @font-size-12;
      color: rgba(0, 0, 0, 0.18);
    }
    i.favorite {
      color: @random-color-4;
    }
  }
}
/*ie11 css hack*/ 
@media all and (-ms-high-contrast:none) { 
  *::-ms-backdrop, .workflow-content { max-height: 44px; text-overflow: ellipsis; } 
  } 
</style>
