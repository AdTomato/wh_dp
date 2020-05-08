<template>
  <div class="form-unpublished">
    <EmptyHeader></EmptyHeader>
    <div class="main">
      <img src="./images/form-unpublished.png">
      <p>该表单未发布，请现在后台发布表单或者联系管理员处理</p>
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
import EmptyHeader from '../empty-header/empty-header.vue';



@Component({
  name: 'empty-page',
  components: {
    EmptyHeader,
    AButton: Button
  }
})
export default class FormUnpublished extends Vue {
  
}
</script>
<style lang="less">
  .form-unpublished{
    .main{
      background:rgba(244,246,252,1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p{
        font-size:14px;
        font-weight:500;
        color:rgba(0,0,0,0.45);
        line-height:20px;
      }
    }
  }
</style>
