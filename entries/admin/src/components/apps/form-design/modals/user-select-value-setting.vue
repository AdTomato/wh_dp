
<template>
  <a-modal
    :title="title"
    :visible="true"
    width="536px"
    @cancel="onCancel"
    @ok="onOk"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    :maskClosable="false"
  >
    <div class="row">
      <a-radio
        :checked="isFixed"
        @click="setValueType('')"
      >选择组织架构</a-radio>
      <staff-selector
        v-model="staff"
        :options="staffSelectorOpts"
        :disabled="!isFixed"
      ></staff-selector>
    </div>

    <template v-if="isOrgRoot">
      <div class="row">
        <a-radio
          :checked="isRef"
          @click="setValueType('ref')"
        >表单字段</a-radio>

        <a-select
          v-model="refControlKey"
          :disabled="!isRef"
        >
          <a-select-option
            v-for="c of deptControls"
            :key="c.key"
            :value="c.key"
          >{{ c.options.name }}</a-select-option>
        </a-select>
      </div>

      <div class="row">
        <a-radio
          :checked="isCreator"
          @click="setValueType('originatorDept')"
        >创建人部门</a-radio>
      </div>
    </template>

    <template v-else>
      <div class="row">
        <a-radio :checked="isCreator" @click="setValueType(null)">创建人相关</a-radio>

        <a-select 
          :value="selectValue"
          @change="e => setValueType(e)"
          :disabled="!isCreator"
        >
          <a-select-option v-if="selectUser" value="originator">创建人</a-select-option>
          <a-select-option v-if="selectOrg" value="originatorDept">创建人部门</a-select-option>
        </a-select>
      </div>
    </template>
  </a-modal>
</template>


<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Watch,
  Inject
} from "vue-property-decorator";

import { Modal } from "h3-antd-vue";

import { schema, renderer } from "@cloudpivot/form";

import { ModalAttributeType } from "../form-property/typings/form-attribute";

import * as dataitemStore from "../stores/data-items.store-helper";

@Component({
  name: "user-select-value-setting",
  components: {
    AModal: Modal,
    StaffSelector: renderer.components.pc.StaffSelector
  }
})
export default class UserSelectValueSetting extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;

  @Prop()
  dataItem!: any;

  @Prop()
  getFormControls!: () => { [key: string]: schema.FormControl };

  selectOrg = false;

  selectUser = false;

  staffSelectorOpts = {
    key: "orgRoot",
    selectOrg: false,
    selectUser: false,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: "点击选择"
  };

  opts: schema.StaffSelectorOptions = {} as any;

  valueType = "";

  staff: any[] = [];

  refControlKey = "";

  get title() {
    const data = this.modalData;
    if (!data || !data.label) {
      return "";
    }
    return data.label;
  }

  get isCreator() {
    const type = this.valueType;
    return (
      type === schema.StaffSelectorValueType.Originator ||
      type === schema.StaffSelectorValueType.OriginatorDept
    );
  }

  get isFixed() {
    return this.valueType === schema.StaffSelectorValueType.None;
  }

  get isRef() {
    return this.valueType === schema.StaffSelectorValueType.Ref;
  }

  /**
   * 组织根节点
   */
  get isOrgRoot() {
    return this.modalData.type === ModalAttributeType.UserSelectOrgValueSetting;
  }

  get deptControls() {
    if (!this.getFormControls) {
      return [];
    }

    const controls = this.getFormControls();

    if (!controls) {
      return [];
    }

    const depts = Object.keys(controls)
      .map(k => controls[k])
      .filter(
        c =>
          (c.type === schema.FormControlType.StaffSelector ||
            c.type === schema.FormControlType.StaffMultiSelector ||
            c.type === schema.FormControlType.DepartmentSelector ||
            c.type === schema.FormControlType.DepartmentMultiSelector) &&
          c.options.deptVisible === schema.StaffSelectorSelectType.Org &&
          c.key !== this.dataItem.code
      );

    return depts;
  }

  @Watch("modalData", {
    immediate: true
  })
  onModalDataChange(modalData: any) {
    if (!modalData.data) {
      this.opts = {} as any;
      this.staff = [];
      return;
    }

    this.opts = modalData.data;
    this.valueType = this.isOrgRoot
      ? this.opts.orgRootValueType
      : this.opts.defaultValueType;

    this.selectOrg = false;
    this.selectUser = false;

    let mulpitle = false;

    if (this.isOrgRoot) {
      mulpitle = true;
      this.selectOrg = true;
      this.selectUser = false;
      this.valueType = this.opts.orgRootValueType;

      if (
        this.valueType === schema.StaffSelectorValueType.None &&
        Array.isArray(this.opts.orgRoot)
      ) {
        this.staff = this.opts.orgRoot;
      } else {
        this.staff = [];

        if (
          this.valueType === schema.StaffSelectorValueType.Ref &&
          this.opts.orgRoot &&
          typeof this.opts.orgRoot === "string"
        ) {
          let refControlKey = this.opts.orgRoot;
          if (refControlKey) {
            const keys = this.deptControls.map(c => c.key);
            refControlKey = refControlKey.substr(1, refControlKey.length - 2);
            if (keys.indexOf(refControlKey) > -1) {
              this.refControlKey = refControlKey;
            }
          }
        }
      }
    } else {
      mulpitle = this.opts.multi;

      this.valueType = this.opts.defaultValueType;

      this.staff =
        this.valueType === schema.StaffSelectorValueType.None
          ? this.opts.defaultValue || []
          : [];

      switch (this.opts.deptVisible) {
        case schema.StaffSelectorSelectType.All:
          this.selectOrg = true;
          this.selectUser = true;
          break;
        case schema.StaffSelectorSelectType.User:
          this.selectOrg = false;
          this.selectUser = true;
          break;
        case schema.StaffSelectorSelectType.Org:
          this.selectOrg = true;
          this.selectUser = false;
          break;
      }
    }

    this.staffSelectorOpts = Object.assign(this.staffSelectorOpts, {
      selectOrg: this.selectOrg,
      selectUser: this.selectUser,
      mulpitle
    });
  }

  get selectValue() {
    if (this.isCreator) {
      return this.valueType;
    }
    return "";
  }

  setValueType(type: string) {
    if (type === null) {
      this.valueType =
        this.opts.deptVisible === schema.StaffSelectorSelectType.Org
          ? schema.StaffSelectorValueType.OriginatorDept
          : schema.StaffSelectorValueType.Originator;
    } else {
      this.valueType = type;
    }
  }

  onOk() {
    let value: any;

    if (this.isOrgRoot) {
      if (this.valueType === schema.StaffSelectorValueType.Ref) {
        value = this.refControlKey ? `{${this.refControlKey}}` : null;
      } else {
        value = this.staff.length === 0 ? null : this.staff;
      }
    } else {
      value = this.staff.length === 0 ? null : this.staff;
    }

    const data = {
      type: this.valueType,
      value
    };
    this.$emit("backData", data);
  }

  onCancel() {
    this.$emit("closeModal");
  }
}
</script>

<style lang="less" scoped>
.row {
  display: flex;
  // align-items: center;

  &:not(:last-child) {
    margin-bottom: 24px;
  }

  & > div:last-child {
    flex-grow: 1;
  }
}

/deep/.ant-radio-wrapper {
  width: 116px;
  margin-top: 0.4em;
}

/deep/.h3-organization {
  display: inline-block;
}
</style>


