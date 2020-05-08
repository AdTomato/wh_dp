
<template>

  <div class="form-actions">

    <template v-if="actions.length > 3">
      <div
        class="form-actions__item"
        v-for="ac in mains"
        :key="ac.code"
        @click="onAction(ac)"
        :class="[ ac.code ]"
      >
        <div>{{ ac.text }}</div>
      </div>

      <div class="form-actions__item">
        <h3-popover
          placement="topRight"
          mask
          :menus="menus"
          :onSelect="onAction"
        >
          <span>{{ $t('cloudpivot.form.runtime.action.more') }}</span>
        </h3-popover>
      </div>
    </template>

    <template v-else>
      <div
        class="form-actions__item"
        v-for="ac in actions"
        :key="ac.code"
        @click="onAction(ac)"
        :class="[ ac.code ]"
      >
        <div>{{ ac.text }}</div>
      </div>
      
    </template>
  </div>

</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch, Inject
} from 'vue-property-decorator';

import {
  H3Popover
} from 'h3-mobile-vue';

import { FormAction } from '../../form-action';

import { FormActionButton } from '../../form-action-modal';


@Component({
  name: 'form-foot',
  components: {
    H3Popover
  }
})
export default class FormActions extends Vue {
  @Prop()
  actions !: FormActionButton[]

  mains:any[] = [];

  menus:any[] = [];

  onAction(ac:any) {
    if (typeof ac === 'number') {
      this.$emit('action', this.menus[ac]);
    } else {
      this.$emit('action', ac);
    }
  }

  @Watch('actions', {
    immediate: true
  })
  setActions() {
    if (this.actions.length > 3) {
      this.mains = this.actions.slice(0, 2).map(a => Object.assign({}, a, {
        content: a.text
      }));

      this.menus = this.actions.slice(2).map(a => Object.assign({}, a, {
        content: a.text
      }));
    }
  }
}


</script>

<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.form-actions{
  display: flex;
  justify-content: space-around;
  color: @primary-color;
  background-color: #fff;
  .px2rem(font-size, @font-size-base);
  height: 44px;
  // .px2rem(padding-top, @font-size-xxs);
  // .px2rem(padding-bottom, @font-size-xxs);

  &__item{
    flex-grow: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    
    &:not(:last-child) > div{
      width: 100%;
      position:relative;

      &::after {
        content:'';
        height:@font-size-20;
        width:1px;
        background:#EEEEEE;
        position:absolute;
        right:0;
      }
    }
    
    i {
      margin-right: 8px;
    }

    // &:hover{
    //   background:@background-color;
    // }

  }

}

/deep/ .h3-popover-item-content{
  .px2rem(width, 211px);
}
</style>
