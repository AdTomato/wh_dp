
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import ReverseRelevanceList from "./reverse-relevance-list.vue";

import ReverseRelevanceLink from "./reverse-relevance-link.vue";

import { ReverseRelevanceControl } from "../../../controls";

import common from '@cloudpivot/common';


@Component({
  name: "reverse-relevance",
  components: {
    ReverseRelevanceList,
    ReverseRelevanceLink,
    H3Panel: common.components.pc.Panel,
  }
})
export default class ReverseRelevance extends ReverseRelevanceControl {
  get tips() {
    return this.control.options.tips
  }
}