<template>
  <div class="urge-record">
    <div
      class="record-item"
      v-for="(item, index) in urgeList"
      :key="index"
    >
      <p class="text">{{ item.text }}</p>
      <p class="date">{{ item.opTime }}</p>
    </div>
    <p class="tip">{{ $t('cloudpivot.form.runtime.urge.loadAll') }}</p>
  </div>
</template>

<script lang="ts">
  import {
    Component, Vue, Prop, Watch
  } from 'vue-property-decorator';
  
  @Component({
    name: 'urge-record'
  })

  export default class UrgeRecord extends Vue {
    
    @Prop() urgeList !: Array<any>;

  }
</script>
  
<style lang="less">
  .urge-record {
    max-height: 250px;
    overflow: auto;
    .record-item {
      padding-bottom: 8px;
      padding-right: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(215,215,215,1);
      .text {
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
      }
      .date {
        font-size: 12px;
        color: rgba(0,0,0,0.45);
        line-height: 20px;
        text-align: right;
      }
    }
    .tip {
      margin-top: 8px;
      font-size: 14px;
      text-align: center;
      color: rgba(0,0,0,0.45);
    }
  }
</style>

