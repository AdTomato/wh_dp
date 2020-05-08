
<template>
  <a-tabs defaultActiveKey="-1">
    <slot></slot>
  </a-tabs>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl,StyleControlOptions } from "../../typings";

import { BaseControl } from "../../controls";

import { Tabs } from "h3-antd-vue";


@Component({
    name : 'form-tabs',
    components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
  }
})
export default class FormTabs extends Vue {

}

</script>

<style lang="less" scoped>

</style>

