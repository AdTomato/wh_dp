<template>
  <div class="add-bizmethod">
    <div class="add-bizmethod__form">
      <div class="add-bizmethod__item">
        <span class="label-required">方法编码：</span>
        <p>
          <template v-if="isEdit">{{ form.code }}</template>
          <form-input
            v-else
            v-model="form.code"
            placeholder="请填写方法编码，例:kmh_123"
            :rules="rules.code"
          />
        </p>
      </div>
      <div class="add-bizmethod__item">
        <span class="label-required">方法名称：</span>
        <p>
          <form-input
            v-model="form.name"
            placeholder="请填写"
            :rules="rules.name"
          />
        </p>
      </div>
      <div class="add-bizmethod__item">
        <span>类型：</span>
        <p>{{ form.methodTypeName || '普通' }}</p>
      </div>
      <div class="add-bizmethod__item add-bizmethod__item--area">
        <span>描述：</span>
        <p>
          <h3-textarea
            v-model="form.description"
            :maxLength="200"
            placeholder="请填写描述内容"
          />
        </p>
      </div>
    </div>
    <div class="add-bizmethod__footer">
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import FormInput from '@/components/global/form-input/index.vue';
import H3Textarea from '@cloudpivot/form/src/renderer/components/pc/h3-textarea.vue';
import { pattern, nameValidator } from '@/common/utils';

@Component({
  name: 'add-bizmethod',
  components: {
    FormInput,
    H3Textarea
  }
})
export default class AddBizMethod extends Vue {
  @Prop() method!: any;

  isEdit: boolean = false;

  // 编辑信息
  form: any = {
    code: '',
    name: '',
    description: '',
    methodTypeName: '',
  };

  // 规则
  rules: any = {
    code: [
      {
        required: true,
        message: '请填写方法编码'
      },
      {
        pattern: pattern('code'),
        message: '以字母开头不超过28个字符，仅支持字母、数字、下划线'
      }
    ],
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
  }

  /**
   * 校验表单填写内容
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
   * 保存
   */
  save() {
    this.validateForm()
      .then(() => {
        this.$emit('submit', this.form);
      })
      .catch(() => { });
  }

  mounted() {
    if (this.method) {
      this.isEdit = !!this.method.id;
      Object.keys(this.form).forEach((key: string) => {
        this.$set(this.form, key, this.method[key] || '');
      });
    }
  }
}
</script>
<style lang="less" scoped>
.add-bizmethod {
  padding-bottom: 50px;
  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.65);
    &--area {
      align-items: flex-start;
      > p {
        flex: 1;
        width: auto;
      }
      /deep/.h3-textarea textarea {
        height: 108px!important;
      }
    }
    > span {
      display: inline-block;
      width: 5em;
      margin-right: 5px;
    }
    > p {
      width: 306px;
      color: rgba(0, 0, 0, 0.85);
    }
    /deep/.ant-select {
      width: 100%;
    }
  }
  &__footer {
    position: absolute;
    z-index: 9;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    border-top: 1px solid #e8e8e8;
    text-align: center;
    background: #fff;
  }
}
</style>
