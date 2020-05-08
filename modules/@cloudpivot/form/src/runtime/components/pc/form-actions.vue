
<template>
  <div class="form-actions">
    <a-button
      type="default"
      v-show="false"
      @click="modifyOwner"
    >修改拥有者</a-button>
    <a-button
      v-for="(ac, index) in actions"
      v-show="ac.visible !== false"
      :key="ac.code"
      :disabled="ac.disabled === true"
      :type="index === 0 ? 'primary' : 'default'"
      @click="onAction(ac)"
      :class="[ ac.code ]"
    >{{ ac.text }}</a-button>
    <div
      class="prints-drop-down animated fadeIn"
      v-show="toShowPrints && setPdfConf"
      @click="printBtn($event)"
    >
      <div class="item-print">系统默认模板</div>
      <div class="item-print">打印模板</div>
    </div>
  </div>
</template>


<script lang="ts">

  import {
    Component, Vue, Prop, Watch
  } from 'vue-property-decorator';

  import {
    Button
  } from 'h3-antd-vue';

  import { FormAction } from '../../form-action';

  import { FormActionButton } from '../../form-action-modal';


  @Component({
    name: 'form-detail-header',
    components: {
      AButton: Button
    }
  })
  export default class FormDetailHeader extends Vue {
    @Prop()
    actions !: FormActionButton[];

    @Prop({ type: Boolean }) toShowPrints!: Boolean;

    @Prop({ type: Boolean }) setPdfConf!: Boolean;

    onAction(ac: any) {
      this.$emit('action', ac);
    }

    printBtn(e: any) {
      this.$emit('propPrintClick', e.target.innerText);
    }

    modifyOwner() {
      this.$emit('modifyOwnerClick');
    }
  }

</script>


<style lang="less" scoped>
  .form-actions {
    // flex-grow: 1;
    display: flex;
    margin-left: 16px;
    text-align: right;

    button {
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
    // 取消高亮
    .noHover{
      color: rgba(0, 0, 0, 0.65);
      background-color: #fff;
      border-color: #d9d9d9;
    }
    .noHover:hover{
      border: 1px solid #5291FF;
      color: #5291FF;
    }
  }
  .prints-drop-down {
    width: 116px;
    height: 72px;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(30,85,255,0.15);
    background: #fff;
    position: absolute;
    top: 55px;
    right: 22px;
    .item-print {
      text-align: left;
      height: 32px;
      line-height: 32px;
      padding: 5px 15px;
      &:hover {
        cursor: pointer;
        background: rgba(240,247,255,1);
        transition: 0.3s all;
      }
    }
  }
</style>
