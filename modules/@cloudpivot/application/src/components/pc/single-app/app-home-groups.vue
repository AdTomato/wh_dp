<template>
  <div class="app-home-groups">
    <app-home-group
      v-for="(group, index) in appGroups"
      :key="index"
      :title="group.title"
      :childrens="group.childrens"
    >
    </app-home-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppHomeGroup from './app-home-group.vue';

@Component({
  name: 'app-home-groups',
  components: {
    AppHomeGroup
  }
})
export default class AppHomeGroups extends Vue {
  @Prop() appGroups!: Array<any>;
}

</script>
<style lang='less' scoped>
</style>
