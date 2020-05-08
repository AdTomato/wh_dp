import { Component, Vue } from "vue-property-decorator"
import ControlBack from '../directives/control-back'

//全局
@Component({
  name: "DingtalkBack",
  directives: {
    ControlBack,
  },
})
export default class DingtalkBackMixin extends Vue {
  showModal: boolean = false;

  show() {
    this.showModal = true;
  }
  close() {
    this.showModal = false;
  }
};
