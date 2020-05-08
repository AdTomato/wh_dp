<template>
  <div class="form-unpublished">
    <!-- <EmptyHeader></EmptyHeader> -->
    <div class="main">
      <img src="./images/form-unpublished.png">
      <p>该表单未发布，请联系管理员处理</p>
    </div>
  </div>

</template>

<script lang="ts">

import {
  Component, Vue
} from 'vue-property-decorator';
import {
  Button
} from 'h3-antd-vue';
// import EmptyHeader from '../empty-header/empty-header.vue';



@Component({
  name: 'empty-page',
  components: {
    AButton: Button
  }
})
export default class FormUnpublished extends Vue {
  
}
</script>
<style lang="less">
  .form-unpublished{
    .main{
      padding-top: 4.68rem;
      background:rgba(244,246,252,1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        width: 4.27rem;
        height: 2.91rem;
      }
      p{
        font-size: 0.4rem;
        font-weight: 400;
        color:rgba(153,153,153,1);
        line-height:0.56rem;
        width: 3.2rem;
      }
    }
  }
</style>
