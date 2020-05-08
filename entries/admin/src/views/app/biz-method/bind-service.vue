<template>
  <div class="bind-server">
    <section class="bind-server__block">
      <h3 class="bind-server__title">基本属性</h3>
      <div class="bind-server__form">
        <div class="bind-server__item">
          <span>集成服务：</span>
          <p>
            <template v-if="isEdit">{{ service.serviceName }}</template>
            <a-select
              v-else
              v-model="serviceCode"
              @change="selectService">
              <a-select-option
                v-for="(item,i) in servicesList"
                :key="i"
                :value="item.code"
              >{{ item.name }}</a-select-option>
            </a-select>
          </p>
        </div>
        <div class="bind-server__item" v-if="serviceCode">
          <span>集成方法：</span>
          <p>
            <template v-if="isEdit">{{ service.serviceMethodName }}</template>
            <a-select
              v-else
              v-model="serviceMethodCode"
              @change="selectMethod">
              <a-select-option
                v-for="(item,i) in methodList"
                :key="i"
                :value="item.code"
              >{{ item.name }}</a-select-option>
            </a-select>
          </p>
        </div>
      </div>
    </section>
    <section class="bind-server__block">
      <h3 class="bind-server__title">传入参数</h3>
      <bind-table
        v-model="inputMappings"
        :dataItemList="inputDataItemList"
        :isGetList="isGetList"
        :isEdit="isEdit"
        type="input"
      />
    </section>
    <section class="bind-server__block">
      <h3 class="bind-server__title">返回值</h3>
      <bind-table
        v-model="outputMappings"
        :dataItemList="dataItemList"
        :isGetList="isGetList"
        :isEdit="isEdit"
        type="output"
      />
    </section>
    <div class="bind-server__footer">
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import appsApi from '@/apis/apps'; // getDataItemList
import serviceApi from '@/apis/biz-service/service.api'; // listServices
import methodApi from '@/apis/biz-service/method.api'; // listMethodsByCode
import bizMethodApi from '@/apis/biz-method/index.api';
import BindTable from '@/views/app/biz-method/bind-table.vue';

import common from '@cloudpivot/common';

const { getDataItemText } = common.utils.BusinessFunctions;

@Component({
  name: 'bind-server',
  components: {
    BindTable
  }
})
export default class BindServer extends Vue {
  @Prop() bizmethod!: BizMethod.MethodItem;

  @Prop() service!: BizMethod.BindDetailItem;

  // 是否为getlist业务方法，该业务方法下const可下拉
  isGetList: boolean = false;

  // 是否为编辑
  isEdit: boolean = false;

  servicesList: BizService.Service.OptionItem[] = [];

  methodList: BizService.Method.Item[] = [];

  // 数据项列表
  dataItemList: any[] = [];

  // 传入参数数据项列表（包含系统数据项）
  inputDataItemList: any[] = [];

  serviceCode: string = '';

  serviceMethodCode: string = '';

  form: BizMethod.CreateBindParam = {
    // bizMethodId: this.bizmethod.id,
    methodCode: this.bizmethod.code,
    inputMappings: [],
    outputMappings: [],
    schemaCode: this.bizmethod.schemaCode,
    serviceMethodCode: '',
    serviceCode: '',
  };

  inputMappings: BizMethod.CreateInputMapping[] = []

  outputMappings: BizMethod.CreateOutputMapping[] = []

  /**
   * 获取所有下拉所需的选项内容
   */
  getOptions() {
    Promise.all([
      serviceApi.listServices(),
      appsApi.getDataItemList({
        schemaCode: this.bizmethod.schemaCode,
        isPublish: true,
      })
    ]).then(([services, dataItems]) => {
      if (Array.isArray(services.data)) {
        this.servicesList = services.data;
      }
      if (Array.isArray(dataItems.data)) {
        // 数据项过滤 系统数据项defaultProperty、附件6、审批意见7
        this.dataItemList = dataItems.data.filter((item: any) => ![6, 7].includes(item.propertyType) && !item.defaultProperty);
        this.inputDataItemList = dataItems.data.filter((item: any) => ![6, 7].includes(item.propertyType));
      }
    });
  }

  /**
   * 获取服务下的集成方法列表
   */
  getMethodList(serviceCode: string) {
    return methodApi.listMethodsByCode({ serviceCode }).then((res: any) => {
      if (Array.isArray(res.data)) {
        this.methodList = res.data;
      }
    });
  }

  /**
   * 获取绑定服务的详情
   */
  getBindDetail() {

    function sortItems(mappings: Array<any>) {
      return mappings.map((item: any, index: number) => ({
        ...item,
        bizPropertyTypeName: '',
        index: index + 1,
      }));
    }

    const setData = (opt: any) => {
      this.serviceCode = opt.serviceCode;
      this.serviceMethodCode = opt.serviceMethodCode;
      this.inputMappings = sortItems(opt.inputMappings);
      this.outputMappings = sortItems(opt.outputMappings);
    }

    bizMethodApi.getBindDetail({
      methodMappingId: this.service.id
    }).then((res: any) => {
      if (res.data) {
        Object.keys(this.form).forEach((key: string) => {
          this.$set(this.form, key, res.data[key]);
        });
        setData(res.data);
      } else {
        setData(this.service);
      }
    }).finally(() => {
      this.getMethodList(this.service.serviceCode).then(() => {
        this.combineBizPropertyType();
      });
    });
  }
  /**
   * 从方法列表中获取出入参，并将参数类型合并到当前出入参列表
   */
  combineBizPropertyType() {
    const currentMethod: any = this.methodList.find((item: BizService.Method.Item) => item.code === this.serviceMethodCode);
    if (!currentMethod) {
      return
    }

    const vm: any = this;

    const setBizProperty = (mappingString: string, targetMapping: Array<any>) => {
      const mappings: any = JSON.parse(mappingString);
      if (mappings && mappings.length) {
        targetMapping.forEach((mapItem: any) => {
          mappings.some((item: any) => {
            if (item.code === mapItem.serviceMethodParameterCode) {
              vm.$set(mapItem, 'bizPropertyTypeName', getDataItemText(item.bizPropertyType));
              return true;
            }
          });
        })
      }
    }

    setBizProperty(currentMethod.inputParametersJson, this.inputMappings);
    setBizProperty(currentMethod.outputParametersJson, this.outputMappings);
  }

  /**
   * 选中集成服务
   */
  selectService(value: any) {
    this.getMethodList(value);
    this.serviceCode = value;
    this.serviceMethodCode = '';
    this.inputMappings = [];
    this.outputMappings = [];
  }

  /**
   * 初始化出入参数列表
   */
  initialMappins(mappingString: string) {
    const mappings: any = JSON.parse(mappingString);
    if (mappings && mappings.length) {
      const mappingList: Array<any> = mappings.map((item: BizService.Method.InputParam, index: number) => ({
        index: index + 1,
        bizCode: '',
        codeType: 1,
        serviceMethodParameterCode: item.code,
        bizPropertyTypeName: getDataItemText(item.bizPropertyType)
      }));
      return mappingList;
    }
    return [];
  }

  /**
   * 选中集成方法
   */
  selectMethod(value: any) {
    this.serviceMethodCode = value;
    const method: any = this.methodList.find((item: any) => item.code === value);
    if (method) {
      this.inputMappings = this.initialMappins(method.inputParametersJson);
      this.outputMappings = this.initialMappins(method.outputParametersJson);
    }
  }

  /**
   * 保存
   */
  save() {
    this.form.inputMappings = this.inputMappings.map((item: any) => {
      delete item.index;
      return item;
    });
    this.form.outputMappings = this.outputMappings.map((item: any) => {
      delete item.index;
      return item;
    });
    this.form.serviceCode = this.serviceCode;
    this.form.serviceMethodCode = this.serviceMethodCode;
    const isEmpty: boolean = Object.values(this.form).some((val: any) => !val);
    if (isEmpty) {
      this.$message.warning('请填写完整的绑定信息');
      return;
    }
    if (this.isEdit) {
      this.updateBind();
    } else {
      this.createBind();
    }
  }

  createBind() {
    bizMethodApi.createBindService(this.form).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success('绑定成功');
        this.$emit('submit', 'create');
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  updateBind() {
    bizMethodApi.updateBindService({
      ...this.form,
      id: this.service.id,
    }).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success('更新成功');
        this.$emit('submit', 'update');
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  mounted() {
    this.getOptions();
    this.isGetList = /^getlist$/i.test(this.bizmethod.code);
    this.isEdit = false;
    if (this.service && this.service.id) {
      this.isEdit = true;
      this.getBindDetail();
    }
  }
}
</script>
<style lang="less" scoped>
.bind-server {
  padding-bottom: 30px;
  &__block {
    &:nth-child(n + 2) {
      &:before {
        content: "";
        display: block;
        margin: 24px 0;
        height: 1px;
        width: 100%;
        background-color: #e8e8e8;
      }
    }
  }
  &__title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
  }
  &__form {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__item {
    display: flex;
    align-items: center;
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.65);
    > span {
      display: inline-block;
      width: 5em;
      margin-right: 5px;
    }
    > p {
      width: 305px;
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
  &__table {
    margin-top: 16px;
    // /deep/.ant-table-thead span {
    //   font-weight: 600;
    // }
    /deep/.ant-select {
      width: 100%;
    }
  }
}
</style>
