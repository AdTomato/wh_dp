
<template>
  <staff-select 
    :value="selectValue" 
    :options="selectOpts" 
    @change="onChange"
  >
  </staff-select>
</template>


<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Inject,
  Model
} from "vue-property-decorator";

import { renderer } from "@cloudpivot/form";

@Component({
  name: "report-staff-select",
  components: {
    StaffSelect: renderer.components.pc.StaffSelector
  }
})
export default class ReportStaffSelect extends Vue {
  @Model("input", {
    default: () => []
  })
  value!: any;

  @Prop({
    default: ""
  })
  formula!: string;

  selectValue: any[] = [];

  selectOpts = {
    selectOrg: true,
    selectUser: true,
    mulpitle: true,
    showModel: true,
    showSelect: true,
    recursive: true
  };

  @Watch("formula", {
    immediate: true
  })
  onFormulaChange(formula: string) {
    let mulpitle = true;
    switch (formula) {
      case "Equal":
      case "NotEqual":
        mulpitle = false;
        break;
      default:
        mulpitle = true;
        break;
    }
    this.selectOpts = Object.assign({}, this.selectOpts, {
      mulpitle
    });
  }

  @Watch("value", {
    immediate: true
  })
  onValueChange() {
    if (Array.isArray(this.value)) {
      this.selectValue = this.value.map(x => ({
        name: x.label,
        id: x.value
      }));
    } else {
      this.selectValue = [];
    }
  }

  onChange(values: any[]) {
    const vals = values.map(x => ({
      label: x.name,
      value: x.id
    }));
    this.$emit("input", vals);
  }
}
</script>