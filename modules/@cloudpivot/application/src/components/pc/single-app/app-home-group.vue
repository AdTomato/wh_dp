<template>
  <div class="app-home-group">
    <div class="app-home-group__title" v-if="title">
      {{ title }}
    </div>
    <div class="app-home-group__container">
      <app-group-item
        v-for="item in childrens"
        :key="item.code"
        :name="item.name"
        :code="item.code"
        :icon="item.icon"
        :type="item.type"
        :openMode="item.openMode"
        :pcUrl="item.pcUrl"
        :parentId="item.parentId"
      >
      </app-group-item>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppGroupItem from './app-group-item.vue';
@Component({
  name: 'app-home-group',
  components: {
    AppGroupItem,
  }
})
export default class AppHomeGroup extends Vue {
  @Prop() title!: string;

  @Prop() childrens!: Array<any>;
}

</script>
<style lang='less' scoped>
.app-home-group {
  margin-top: 4px;
  &__title {
    position: relative;
    margin-bottom: 16px;
    padding-left: @base4-padding-sm;
    line-height: @line-height-7;
    color: rgba(0,0,0,0.65);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform:translateY(-50%);
      height: 14px;
      border-left: 2px solid @primary-color;
      border-right: 2px solid @primary-color;
      border-radius: @border-radius-base;
    }
  }
  &__container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
