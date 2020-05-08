<template>
  <div class="single-app">
    <app-header></app-header>
    <div class="single-app__main">
      <router-view></router-view>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppHeader from '../../components/single-app/app-header.vue';
@Component({
  name: 'single-app',
  components: {
    AppHeader
  }
})
export default class SingleApp extends Vue {
}

</script>
<style lang='less' scoped>
@import "../../styles/themes/default.less";
.single-app{
  background: @main-background;
  &__main {
    flex: 1;
    position: relative;
    overflow: hidden;
  //   position: absolute;
  //   top: 64px;
  //   left: @base4-padding-md;
  //   right: @base4-padding-md;
  //   bottom: @base4-padding-md;
  }
}
</style>
