<template>
  <div class="no-data">
    <div>
      <img src="@/assets/images/userEmpty.png">
      <p class="tips">{{ tip }}</p>
      <p class="btn">
        <a-button type="primary" @click="$emit('click')">
          <i class="icon aufontAll h-icon-all-plus-o"></i>
          {{ buttonText || $t('languages.Apps.AddNew') }}
        </a-button>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'no-list-data'
})
export default class NoListData extends Vue {
  @Prop() tip!: string;

  @Prop() buttonText?: string;
}
</script>
<style lang="less" scoped>
.no-data {
  & > div {
    margin-top: 143px;
    text-align: center;
  }
  .tips {
    color: rgba(0,0,0,0.45);
    font-weight: 400;
    margin: 24px 0;
  }
  .btn {
    i {
      padding-right: 3px;
    }
  }
}
</style>
