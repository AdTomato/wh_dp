<template>
  <div class="empty-page">
    <img src="../../../assets/images/userEmpty.png" alt="">
    <div class="empty__description">
      <p>暂无内容</p>
      <p>在右侧操作栏里进行设置</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'EmptyPage',
  })
export default class EmptyPage extends Vue {
  created() {
    console.log('23333');
  }
}
</script>


<style lang="less">
.empty-page {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
}
</style>

