
<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl,StyleControlOptions } from "../../typings";

import { BaseControl } from "../../controls";

import { Tabs } from "h3-antd-vue";

import { H3SwiperItem } from "h3-mobile-vue";


@Component({
    name : 'form-tabs-pane',
    components: {
      ATabPane: Tabs.TabPane,
      H3SwiperItem
    }
})
export default class FormTabsPane extends Vue {

  @Prop()
  readonly control!: RendererFormControl;
  @Prop()
  nodes!:any

  render(h: any) {
    // debugger
    let render: any = null;
    let opts: any = {
        props: {
          control: {}
        },
        attrs: {}
    };
    render = h("h3-swiper-item", opts, this.nodes)
    return render;
  }

}

</script>

<style lang="less" scoped>

</style>

