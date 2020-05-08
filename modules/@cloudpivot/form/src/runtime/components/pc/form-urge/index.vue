<template>
  <div class="form-urge">
    <div class="header">{{ $t('cloudpivot.form.runtime.urge.check') }}:  <span :class="urgeList.length === 0 ? 'disabled' : ''" @click="toggle">{{ text }}</span></div>

    <component
      ref="component"
      :is="curComp"
      :urgeList="urgeList"
    />
  </div>
</template>
<script lang="ts">
  import {
    Component, Vue, Prop, Watch
  } from 'vue-property-decorator';

  import { FormActionComponent, FormActionModalOptions } from '../../../form-action-modal';

  import Common from '@cloudpivot/common'
  import { formApi } from '@cloudpivot/api';

  import Content from './content.vue';
  import Record from './record.vue';

  @Component({
    name: 'form-urge',
    components: {
      Content,
      Record
    }
  })

  export default class FormUrge extends Vue implements FormActionComponent {
    @Prop()
    options !: FormActionModalOptions

    curComp:string = 'Content'

    urgeList:Array<any> = [];

    get text() {
      if (this.curComp === 'Content') {
        if(this.$t){
          return this.$t('cloudpivot.form.runtime.urge.urgeRecord')
        }
        return ''
      } else {
        if(this.$t){
          return this.$t('cloudpivot.form.runtime.urge.urgeContent')
        }
        return ''
      }
    }

    toggle(){
      if (this.curComp === 'Content') {
        this.curComp = 'Record';
      } else {
        this.curComp = 'Content';
      }
    }

    submit() {
      const content = (this.$refs.component as any).urgeContent;
      const instanceId = Common.utils.parseUrlParam(window.location.href, 'workflowInstanceId');
      const data = {
        content,
        instanceId,
        type: 'pc'
      }
      return data;
    }

    /**
     * 获取催办记录
     */
    async getUrgeList(){
      const instanceId = Common.utils.parseUrlParam(window.location.href, 'workflowInstanceId');
      if(!instanceId) return;
      const res:any = await formApi.getUrgeList(instanceId);
      if (res.errcode === 0) {
        this.urgeList = res.data;
      }
    }

    mounted () {
      this.getUrgeList();
    }
  }
</script>
<style lang="less">
  .form-urge {
    .header {
      position: absolute;
      top: 16px;
      right: 78px;
      font-size: 14px;
      color: rgba(0,0,0,0.85);
      & > span {
        color: #2970FF;
        cursor: pointer;
        &.disabled {
          color:rgba(0,0,0,0.25);
          pointer-events: none;
        }
      }
    }
  }
</style>


