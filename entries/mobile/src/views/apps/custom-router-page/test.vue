<template>
  <div class="test">
    测试自定义路由
  </div>
</template>

<script lang="ts">

import {
  Component, Vue
} from 'vue-property-decorator';


@Component({
  name: 'test',
  components: {
  }
})
export default class Test extends Vue {

}
</script>
<style lang="less" scoped>
.test{
  text-align: center;
  color: red;
  font-weight: 600;
  font-size: 24px;
}
</style>
