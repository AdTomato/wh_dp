<template>
  <a-modal
    v-model="visible"
    title="修改表单拥有者"
    :maskClosable="false"
    :keyboard="false"
    :okText="$t('languages.common.ok')"
    :cancelText="$t('languages.common.cancel')"
    :destroyOnClose="true"
    @ok="ok"
  > 
    <div class="modify-owner">
      <a-row class="modify-owner__item">
        <a-col :span = "layout.left" class="modify-owner__left">
          <span class="label-required">选择拥有者</span>
        </a-col>
        <a-col :span = "layout.right" class="modify-owner__right">
          <staff-selector
            v-model="owner"
            :options="taffSelectorOpts"
          >
          </staff-selector>
        </a-col>
      </a-row>

      <a-row class="modify-owner__item">
        <a-col :span = "layout.left" class="modify-owner__left">
          <span>拥有者部门</span>
        </a-col>
        <a-col :span = "layout.right" class="modify-ownerr__right">
          <staff-selector
            v-model="departments"
            :options="stuffOrOrgSelectorOpts"
          >
          </staff-selector>
        </a-col>
      </a-row>

      <a-row class="modify-owner__item">
        <a-col :span = "layout.left" class="modify-owner__left">
          <span >修改说明</span>
        </a-col>
        <a-col :span = "layout.right" class="modify-owner__right">
          <a-textarea
            placeholder="请输入"
          ></a-textarea>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  Modal,
  Row,
  Col,
  Input
} from 'h3-antd-vue';

import 
  StaffSelector 
  from "@cloudpivot/form/src/renderer/components/shared/staff-selector.vue";


@Component({
  name: 'form-modify-owner-modal',
  components: {
    AModal: Modal,
    ARow: Row,
    ACol: Col,
    ATextarea: Input.TextArea,
    StaffSelector
  }
})
export default class FormModifyOwnerModal extends Vue {

  visible: boolean = false

  modal: string = '';

  owner: Array<any> = []; 

  departments: Array<any> = []; 

  layout: any = {
    left: 6,
    right: 18
  }

  taffSelectorOpts: any = {
    selectOrg: false,
    selectUser: true,
    showModel: true,
    mulpitle: false,
    showSelect: true,
    placeholder: '请选择',
    title:'选择拥有者'
  }

  // 选人与选组织
  stuffOrOrgSelectorOpts: any = {
    selectOrg: true,
    selectUser: false,
    showModel: true,
    mulpitle: false,
    showSelect: true,
    placeholder: '请选择',
    title:'选择拥有者部门'
  }

  init(obj: any) {

    this.owner = [{
      id: obj.bizObject.creater.id,
      name: obj.bizObject.creater.name
    }].concat([]);

    this.departments = [{
      id: obj.departments[0].id,
      name: obj.departments[0].name
    }].concat([]);

    this.show();
  }
  show() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  ok() {
    if(this.owner.length === 0){
      this.$message.info('请选择拥有者');
    }
  }
}
</script>

<style lang="less" scoped>
.modify-owner{
  &__item+&__item{
    margin-top: 20px;
    .modify-owner__left {
      height: 32px;
      line-height: 32px;
    }
    .modify-owner__right {
      & textarea.ant-input{
        min-height: 120px;
      }
    }
  }
}
.label-required:after {
  content: "*";
  display: block;
  font-size: 14px;
  position: absolute;
  left: 0;
  top: 3px;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
  color: #f5222d;
  line-height: 19px;
}
</style>
