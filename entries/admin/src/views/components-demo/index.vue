<template>
  <div class="demo">
    <section>
      <h2>WorkflowSelector 组件</h2>
      <h3>Base use</h3>
      <workflow-selector v-model="workflowCode"/>
      <p class="result">{{ workflowCode }}</p>
      <p class="result">实际选中节点对应值：{{ workflowCode.replace('workflow_','') }}</p>
      <h3>
        With arguments ---
        <code>onlyPublished</code>
      </h3>
      <workflow-selector
        v-model="workflowCode"
        :placeholder="'Here is customal placeholder'"
        class="selector-class-name"
        :onlyPublished="true"
      />
      <p class="result">{{ workflowCode }}</p>
    </section>

    <section>
      <h2>FormInput 组件</h2>
      <form-input
        v-model="form.name"
        placeholder="请填写"
        :rules="rules.name"
        :type="'text'"
        :tipPosition="tipPosition"
        :defaultValue="defaultValue"
        @change="change"
      />
      <br>
      <br>
      <a-button type="primary" @click="toggleTipPosition">切换错误信息位置</a-button>&emsp;
      <a-button type="primary" @click="validate">提交</a-button>
    </section>
    <section>
      <pca-selector
        :format="'pp-cc-aa'"
        @change="cityChange"
      />
    </section>

    <!-- <section>
      <data-title />
    </section> -->
    <!-- :format='"pp-cc"' -->
    <section>
      <role-select
        title="选择角色title"
        :defaultValue="'423290002'"
        @select="selectRole"></role-select>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { pattern, nameValidator } from '@/common/utils';
import WorkflowSelector from '@/components/global/workflow-selector/index.vue';
import FormInput from '@/components/global/form-input/index.vue';
import PcaSelector from '@/components/global/pca-selector/pca-selector.vue'

import common from '@cloudpivot/common';

// import DataTitle from '@/components/global/data-title/data-title.vue'
@Component({
  name: "workflow-selector-demo",
  components: {
  WorkflowSelector,
  FormInput,
  PcaSelector,
  RoleSelect: common.components.pc.RoleSelect
  // DataTitle
  }
  })
export default class WorkflowSelectorDemo extends Vue {
  workflowCode: string = '';

  form: any = {
    name: ''
  };
  cityStr:string = '[{"adcode":"370000","center":"117.000923,36.675807","citycode":[],"level":"province","name":"山东省"},{"adcode":"370600","center":"121.391382,37.539297","citycode":"0535","level":"city","name":"烟台市"},{"adcode":"370684","center":"120.762689,37.811168","citycode":"0535","level":"district","name":"蓬莱市"}]'
  city:any[] = [];
  defaultValue: string = '超过50个文字超过50个文字超过50个文字超过50个文字超过50个文字超过50个文字超过50个文字超过50个文字超过50个文字超过50个文字';
  tipPosition: string = 'bottom';
  rules: any = {
    name: [
      {
        required: true,
        message: '请填写方法名称'
      },
      {
        validator: nameValidator,
        message: '仅限50个字符以内，并不能以空格开头'
      }
    ]
  };

  created() {
    this.city = JSON.parse(this.cityStr);
  }
  cityChange(val:any) {
  }
  /**
   * 校验
   */
  validateForm() {
    return new Promise((resolve, reject) => {
      let hasError: boolean = false;
      const inputs: any[] = this.$vnode.componentInstance
        ? this.$vnode.componentInstance.$children.filter((el: any) => el.$el.className.includes('form-input'))
        : [];
      inputs.forEach((node: any) => {
        const unValidated: boolean = node.validateValue({ target: { value: node.content } });
        if (unValidated) {
          hasError = true;
        }
      });
      if (hasError) {
        reject(new Error('validate failed'));
      } else {
        resolve();
      }
    });
  }
  /**
   * 输入框内容变化
   */
  change(e: any) {
    console.log('input value', e.target.value);
  }
  /**
   * 切换错误提示位置
   */
  toggleTipPosition() {
    this.tipPosition = this.tipPosition === 'bottom' ? 'top' : 'bottom';
  }
  /**
   * 执行校验
   */
  validate() {
    this.validateForm().then(() => {
      console.log('validate success');
    }).catch((err) => {
      console.log('validate error', err);
    });
  }

  selectRole(role:any) {
    console.log('select role result: --> ', role);
  }
}
</script>
<style lang="less" scoped>
.demo {
  section {
    width: 900px;
    padding: 20px 0;
    margin: auto;
    text-align: left;
  }
  h2 {
    font-weight: bold;
  }
  h3 {
    margin: 24px 0 0;
  }
}
</style>
