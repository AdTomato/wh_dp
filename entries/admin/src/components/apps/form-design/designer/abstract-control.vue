
<script lang='ts'>
import { Vue, Prop, Component, Inject } from "vue-property-decorator";

import {
  FormControl,
  FormControlType
} from "@/components/apps/form-design/typings";

import Sheet from "./sheet.vue";
import BaseControl from "./base-control.vue";
import H3MoibleView from "./mobile-compontents.vue";

@Component({
  name: "abstract-control",
  components: {
    BaseControl,
    H3MoibleView,
    Sheet
  }
})
export default class AbstractControl extends Vue {
  //functional = true;

  @Prop()
  control!: FormControl;

  @Prop()
  span!: number;

  @Inject()
  isMobile!: Function;

  render(h: Function) {
    let opts = {
      attrs: {
        control: this.control
      }
    };

    if (this.isMobile()) {
      return h("h3-moible-view", opts);
    } else {
      const createSheet = () => h("sheet", opts);

      const createBase = () => h("base-control", opts);

      if (this.control.type === FormControlType.Sheet) {
        return createSheet();
      }

      return createBase();
    }
  }
}
</script>


<style lang="less" scoped>
</style>

