
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import OAuthApi from '../../apis/oauth';
@Component({
  name: 'login',
  })
export default class Login extends Vue {
  created() {
    window.location.href=OAuthApi.OAuthLoginUrl;
  }
  render(h:any) {

  }
  // mounted() {
  //   this.$confirm({
  //     title: 'Do you Want to delete these items?',
  //     content: 'Some descriptions',
  //     onOk() {
  //       console.log('OK');
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     },
  //     class: 'test',
  //   });
  // }
}

</script>
<style lang='less' scoped>
.login {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  text-align: left;
}
</style>

