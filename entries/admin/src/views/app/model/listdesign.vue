<template>
  <div>
    <template>
      <a-popover
        trigger="click"
        :visible="visible"
        placement="bottomRight"
      >
        <a slot="content">
          <BtnSetting
            :modalData="modalData"
            @confirm="hide"
            @cancel="hide"
            v-if="visible"
          ></BtnSetting>
        </a>
        <a-button type="primary" @click="() => visible=!visible">Click me</a-button>
      </a-popover>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import SettingPopover from '@/components/apps/list-design/modals/popover/table-setting/table-index.vue';
import BtnSetting from '@/components/apps/list-design/modals/popover/list-btn-setting.vue/btn-index.vue';
@Component({
  name: 'ListDesign',
  components: {
  SettingPopover,
  BtnSetting
  }
  })
export default class ListDesign extends Vue {
  modalData = '';
  visible:boolean = false;
  hide(val:any) {
    this.visible = false;
  }
  created() {
  }
}
</script>
<style lang="less">
  .ant-popover-inner-content {
    a:hover{
      color: rgba(0, 0, 0, .85);
    }
  }
</style>
