<template>
  <div class="urge-content">
    <div class="desc-box">
      <textarea
        v-model="urgeContent"
        :placeholder="$t('cloudpivot.form.runtime.urge.plzInput')"
        maxlength="100"
      ></textarea>
      <div class="desc-num">{{ urgeContent.length }}/100</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Component, Vue, Prop, Watch
  } from 'vue-property-decorator';
  
  @Component({
    name: 'urge-content'
  })

  export default class UrgeContent extends Vue {
    urgeContent: string = ''
  }
</script>
  
<style lang="less">
  .urge-content {
    .desc-box {
      height: 170px;
      position: relative;
      border:1px solid rgba(217,217,217,1);
      border-radius:4px;
      .desc-num {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        text-align: right;
        position: absolute;
        bottom: 8px;
        right: 8px;
      }
      textarea {
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: rgba(0,0,0,.85);
        border: none;
        resize: none;
        outline: none;
        border-radius:4px;
        padding: 4px 8px;
        &::-webkit-input-placeholder {
          color: rgba(0, 0, 0, 0.25);
        }
        &:-moz-placeholder {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
</style>

