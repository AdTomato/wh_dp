<template>
  <div class="attr-rows">
    <div
      class="attr-row clearfix"
      v-for="(item,index) in attrData"
      :key="index"
    >
      <label class="attr-lab">
        <span>
          {{ item.name }}
        </span>

      </label>
      <div class="attr-val" :class="{'disabled': item.disabled}">
        <label v-if="item.type === 'label'">
          {{ item.value }}
        </label>

        <!-- <a-input @change="inputChange(item.value)" class="input" v-if="item.type === 'input'" v-model="item.value" /> -->

        <form-input
          class="input"
          v-if="item.type === 'input' && isChinese"
          v-model="item.value"
          :value="item.value"
          :rules="rule"
          :type="'text'"
          ref="formInput"
          @change="e => inputChange(e.target.value)"
          :tipPosition="'top'"
        />

        <a-input
          class="input"
          v-if="item.type === 'input' && !isChinese"
          v-model="name_i18n[$i18n.locale]"
          :value="name_i18n[$i18n.locale]"
          :type="'text'"
          @change="e => inputChange(e.target.value)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import FormInput from '@/components/global/form-input/index.vue';

import { nameValidator } from '@/common/utils';

const ListdesignModule = namespace('Apps/Listdesign');

@Component({
  name: 'list-attribute',
  components: {
    FormInput
  }
})
export default class AttrRows extends Vue {
  @ListdesignModule.State('name') name: any;

  @ListdesignModule.State('name_i18n') name_i18n: any;

  @ListdesignModule.Mutation('onEdit') onEdit: any;

  @ListdesignModule.Mutation('nameChange') nameChange: any;

  get listCode() {
    return this.$route.params.code;
  }

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }


  attrData:any[] = [];

  rule:any[] =[];

  created() {
    console.log('name', this.name_i18n);
    this.setRules();
    this.attrData.find((res:any) => res.code === 'code').value = this.listCode;

    this.attrData.find((res:any) => res.code === 'name').value = this.name;
  }

  setRules() {
    this.attrData = [
      {
        name: this.$t('languages.Apps.ListCode'),
        code: 'code',
        disabled: true,
        value: this.listCode,
        type: 'label'
      },
      {
        name: this.$t('languages.Apps.ListName'),
        code: 'name',
        disabled: false,
        value: this.name,
        type: 'input'
      }
    ];
    this.rule = [
      {
        required: true,
        message: this.$t('languages.Apps.ListNamePlaceholder')
      },
      {
        validator: nameValidator,
        message: this.$t('languages.Apps.NameRule')
      }
    ];
  }

  inputChange(val:string) {
    this.onEdit(true);
    if (this.isChinese) {
      this.nameChange({ name: val, isupdate: false, name_i18n: this.name_i18n });
    }
  }

  @Watch('name')
  onNameChange(val:string) {
    this.attrData.find((res:any) => res.code === 'name').value = val.substring(0, 50);
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRules();
  }
}
</script>
<style lang="less" scoped>
.attr-rows {
  background: #fff;
  .attr-row{
    text-align: left;
    border-bottom: 1px solid #E9E9E9;
    .attr-lab{
      border-right: 1px solid #E9E9E9;
      line-height: 33px;
      width: 33%;
      float: left;
      span{
        margin: 0 8px;
      }
    }
    .attr-val{

      height: 32px;
      float: left;
      width: 67%;
      .input{
       /deep/ input {
         border: 0;
         padding: 4px 21px;
         border-radius: 0;
       }

      }
      label{
        margin: 0 21px;
        display: block;
        height: 33px;
        line-height: 33px;
      }
    }
    .attr-val.disabled {
      background:rgba(245,245,245,1)
    }
  }
}
</style>
