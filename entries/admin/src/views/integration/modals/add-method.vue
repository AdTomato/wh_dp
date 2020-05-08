<template>
  <div class="add-method">
    <section class="add-method__block">
      <h3 class="add-method__title">基本信息</h3>

      <div class="add-method__form">
        <div class="add-method__item">
          <span class="label-required">方法编码：</span>
          <p v-show="method">
            <template v-if="id">{{ form.code }}</template>
            <form-input
              v-else
              v-model="form.code"
              placeholder="请填写编码，例：bpmH3_01"
              :rules="rules.code"
            />
          </p>
        </div>
        <div class="add-method__item">
          <span class="label-required">方法名称：</span>
          <p>
            <form-input
              v-model="form.name"
              placeholder="请填写"
              :rules="rules.name"
            />
          </p>
        </div>
        <div class="add-method__item add-method__item--http">
          <span>Http方法：</span>
          <p>
            <template v-if="id">{{ httpTypeName(configs.httpType) }}</template>
            <a-radio-group
              v-else
              v-model="configs.httpType"
              :options="httpTypes"
              @change="selectHttp"
            />
          </p>
        </div>
        <div class="add-method__item add-method__item--full">
          <span>地址URL：</span>
          <p>
            <a-input v-model="configs.url"/>
          </p>
        </div>
        <div class="add-method__item" v-show="configs.httpType === postValue">
          <span>Request Body格式：</span>
          <p>
            <a-radio-group v-model="configs.requestBodyType" :options="requestBodyTypes"/>
          </p>
        </div>
      </div>

      <!-- tab -->
      <a-tabs v-model="currentTab" @change="resetFormInput">
        <a-tab-pane tab="传入参数" key="input">
          <!-- 传入参数 -->
          <div class="add-method__table">
            <a-table
              :columns="columns"
              :dataSource="inputParameters"
              :pagination="false"
              :scroll="{ y: 500 }"
              :locale="{emptyText: ''}"
              size="small"
              ref="argTable"
            >
              <!-- 表头 -->
              <span class="text-ellipsis" slot="indexTitle">序号</span>
              <span class="text-ellipsis resize" slot="codeTitle">参数名称</span>
              <span class="text-ellipsis resize" slot="nameTitle">显示名称</span>
              <span class="text-ellipsis resize" slot="positionTitle">应用位置</span>
              <span class="text-ellipsis resize" slot="bizPropertyTypeTitle">参数类型</span>
              <span class="text-ellipsis resize" slot="descriptionTitle">描述</span>
              <span class="text-ellipsis resize" slot="actionTitle">操作</span>
              <!-- 表体 -->
              <form-input
                slot="code"
                slot-scope="text,record"
                v-model="record.code"
                :rules="rules.value"
                tipPosition="top"
                :ref="`form-input-arg-code-${record.sortKey}`"
              />
              <form-input
                slot="name"
                slot-scope="text,record"
                v-model="record.name"
                :rules="rules.value"
                tipPosition="top"
                :ref="`form-input-arg-name-${record.sortKey}`"
              />
              <a-select
                slot="position"
                slot-scope="text,record"
                v-model="record.configJson.position"
                :options="locationTypes"
              />
              <a-select
                slot="bizPropertyType"
                slot-scope="text,record"
                v-model="record.bizPropertyType"
                :options="record.configJson.position === 0 ? queryBizPropertyTypes : bizPropertyTypes"
              />
              <template slot="description" slot-scope="text,record">
                <h3-textarea
                  class="add-method__textarea"
                  v-model="record.description"
                  :maxLength="200"
                  :autosize="{minRows:1,maxRows:5}"
                />
              </template>
              <span slot="action" slot-scope="text,record">
                <i class="icon aufontAll h-icon-all-delete-o" @click="popItem(record)"/>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="返回值" key="output">
          <!-- 返回值 -->
          <div class="add-method__table">
            <a-table
              :columns="outputColumns"
              :dataSource="outputParameters"
              :pagination="false"
              :scroll="{ y: 500 }"
              :locale="{emptyText: ''}"
              size="small"
              ref="resultTable"
            >
              <!-- 表头 -->
              <span class="text-ellipsis" slot="indexTitle">序号</span>
              <span class="text-ellipsis resize" slot="codeTitle">参数名称</span>
              <span class="text-ellipsis resize" slot="nameTitle">显示名称</span>
              <span class="text-ellipsis resize" slot="bizPropertyTypeTitle">参数类型</span>
              <span class="text-ellipsis resize" slot="descriptionTitle">描述</span>
              <span class="text-ellipsis resize" slot="actionTitle">操作</span>
              <!-- 表体 -->
              <form-input
                slot="code"
                slot-scope="text,record"
                v-model="record.code"
                :rules="rules.value"
                tipPosition="top"
                :ref="`form-input-res-code-${record.sortKey}`"
              />
              <form-input
                slot="name"
                slot-scope="text,record"
                v-model="record.name"
                :rules="rules.value"
                tipPosition="top"
                :ref="`form-input-res-name-${record.sortKey}`"
              />
              <a-select
                slot="bizPropertyType"
                slot-scope="text,record"
                v-model="record.bizPropertyType"
                :options="bizPropertyTypes"
              />
              <a-input
                slot="description"
                slot-scope="text,record"
                v-model="record.description"
                maxLength="200"
              />
              <span slot="action" slot-scope="text,record">
                <i class="icon aufontAll h-icon-all-delete-o" @click="popItem(record)"/>
              </span>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </section>
    <p class="add-method__btn">
      <span @click="addItem">
        <i class="icon aufontAll h-icon-all-plus-o"/>
        <span>新增数据</span>
      </span>
    </p>
    <div class="add-method__footer">
      <a-button @click="saveAndTest">保存并连接测试</a-button>
      <a-button type="primary" @click="save()">保存</a-button>
    </div>
    <!-- 底线 -->
    <div class="add-method__blank" ref="footLine"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  namespace, State, Action, Mutation
} from 'vuex-class';
import { pattern, nameValidator } from '@/common/utils';

import serviceApi from '@/apis/biz-service/service.api';

import FormInput from '@/components/global/form-input/index.vue';
import H3Textarea from '@cloudpivot/form/src/renderer/components/pc/h3-textarea.vue';

const MethodsModule = namespace('Integration/Methods');

@Component({
  name: 'add-method',
  components: {
    FormInput,
    H3Textarea
  }
})
export default class AddMethod extends Vue {
  @MethodsModule.State('locationTypes') locations: any;

  @MethodsModule.State('paramTypes') paramTypes: any;

  @MethodsModule.State('httpTypes') httpTypes: any;

  @MethodsModule.State('requestBodyTypes') requestBodyTypes: any;

  @MethodsModule.Action('createMethod') createMethod: any;

  @MethodsModule.Action('updateMethod') updateMethod: any;

  @Prop() method!: any;

  @Prop() service!: any;

  // 当前切换到的tab面板，input：传入参数 output：返回值
  currentTab: string = 'input';

  id: string = '';

  form: BizService.Method.CreateParams = {
    code: '',
    configJson: '',
    description: '',
    inputParametersJson: '',
    name: '',
    outputParametersJson: '',
    remarks: '',
    serviceCode: '',
  };

  configs: BizService.Method.MethodConfig = {
    httpType: 0,
    requestBodyType: 0,
    url: ''
  };

  inputParameters: BizService.Method.InputParam[] = [];

  outputParameters: BizService.Method.OutputParam[] = [];

  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      key: 'index',
      width: 78,
      align: 'center',
    },
    {
      dataIndex: 'code',
      slots: { title: 'codeTitle' },
      scopedSlots: { customRender: 'code' },
      key: 'code',
      width: 150,
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      key: 'name',
      width: 150,
    },
    {
      dataIndex: 'configJson.position',
      slots: { title: 'positionTitle' },
      scopedSlots: { customRender: 'position' },
      key: 'position',
      width: 150,
    },
    {
      dataIndex: 'bizPropertyType',
      slots: { title: 'bizPropertyTypeTitle' },
      scopedSlots: { customRender: 'bizPropertyType' },
      key: 'bizPropertyType',
      width: 130,
    },
    {
      dataIndex: 'description',
      slots: { title: 'descriptionTitle' },
      scopedSlots: { customRender: 'description' },
      key: 'description',
      width: 130,
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      key: 'action',
      width: 80,
      align: 'right',
    },
  ];

  outputColumns: Array<Common.TableHead> = this.columns.filter((item: Common.TableHead) => item.key !== 'position');

  // 规则
  rules: any = {
    code: [
      {
        required: true,
        message: '请填写方法编码'
      },
      {
        pattern: pattern('code'),
        message: '以字母开头,包括字母或下划线或数字,不超过28个字符'
      }
    ],
    value: [
      {
        required: true,
        message: '请填写内容'
      },
      {
        validator: nameValidator,
        message: '仅限50个字符以内，并不能以空格开头'
      }
    ],
    description: [
      {
        validator: nameValidator,
        message: '仅限50个字符以内，并不能以空格开头'
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
  };

  // 枚举信息： 选人控件5、子表8
  enums: any = {
    xuanrenkongjian: 5,
    zibiao: 8
  };

  get postValue() {
    const post: any = this.httpTypes.find((item: any) => /post/i.test(item.label));
    if (post) {
      if (!this.id) {
        this.configs.httpType = post.value;
      }
      return post.value;
    }
    return '';
  }

  get locationTypes() {
    if (this.configs.httpType === this.postValue) {
      return this.locations;
    }
    return this.locations.filter((item: any) => item.value === 0);
  }

  get bizPropertyTypes() {
    const { xuanrenkongjian, zibiao } = this.enums;
    if (this.configs.httpType === this.postValue && this.configs.requestBodyType === 1) {
      /* post - json传送时，参数类型不可选：选人控件和子表 */
      return this.paramTypes.filter((item: any) => ![xuanrenkongjian, zibiao].includes(item.value));
    } if (this.configs.httpType !== this.postValue) {
      /* get 请求时，只能采用查询参数，所以参数类型不能选择子表8 */
      return this.paramTypes.filter((item: any) => item.value !== xuanrenkongjian);
    }
    return this.paramTypes;
  }

  get queryBizPropertyTypes() {
    return this.bizPropertyTypes.filter((item: any) => item.value !== this.enums.zibiao);
  }

  /**
   * 获取http请求显示名
   */
  httpTypeName(val: any) {
    const item: any = this.httpTypes.find((e: any) => e.value === val);
    return item ? item.label : val;
  }

  /**
 * 选定http请求方式
 */
  selectHttp(e: any) {
    if (e.target.value !== this.postValue) {
      this.inputParameters.forEach((item: any) => { item.configJson.position = 0; });
    }
  }

  /**
 * 删除条目
 */
  popItem(record: any) {
    if (this.currentTab === 'input') {
      const inputParameters:BizService.Method.InputParam[] = this.inputParameters
        .filter((item: any) => item.sortKey !== record.sortKey)
        .map((item: any, index: number) => {
          item.index = index + 1;
          return item;
        });
      this.inputParameters = [];
      this.$nextTick(() => {
        this.inputParameters = inputParameters;
      })
    } else {
      const outputParameters:BizService.Method.OutputParam[] = this.outputParameters
        .filter((item: any) => item.sortKey !== record.sortKey)
        .map((item: any, index: number) => {
          item.index = index + 1;
          return item;
        });
      this.outputParameters = [];
      this.$nextTick(() => {
        this.outputParameters = outputParameters;
      })
    }
  }

  /**
 * 添加条目
 */
  addItem() {
    const item: BizService.Method.InputParam = {
      code: '',
      name: '',
      configJson: { position: 0 },
      bizPropertyType: 0,
      description: '',
      index: -1,
      sortKey: Date.now().toString(),
    };
    if (this.currentTab === 'input') {
      item.index = this.inputParameters.length + 1;
      this.inputParameters.push(item);
    } else {
      item.index = this.outputParameters.length + 1;
      delete item.configJson;
      this.outputParameters.push(item);
    }
    this.$nextTick(() => {
      // 新建按钮滚动至可视区域
      const dom: any = this.$refs.footLine;
      dom.scrollIntoView();
      // 表格内部滚动至底部
      try {
        const aTable: any = this.currentTab === 'input' ? this.$refs.argTable : this.$refs.resultTable;
        const table: any = aTable.$el.getElementsByClassName('ant-table-body')[0];
        table.scrollTop = table.scrollHeight;
      } catch (error) {
        console.log(error);
      }
    });
  }

  /**
 * 校验表单填写内容
 */
  validateForm() {
    return new Promise((resolve, reject) => {
      let hasError: boolean = false;
      const list: any[] = [];
      if (this.currentTab === 'input') {
        Object.entries(this.$refs).forEach(([key, value]) => {
          if (value && /^form-input-arg/.test(key)) {
            list.push(this.$refs[key]);
          }
        });
      } else {
        Object.entries(this.$refs).forEach(([key, value]) => {
          if (value && /^form-input-res/.test(key)) {
            list.push(this.$refs[key]);
          }
        });
      }
      const inputs: any[] = this.$vnode.componentInstance
        ? this.$vnode.componentInstance.$children.filter((el: any) => el.$el.className.includes('form-input'))
        : [];
      list.push(...inputs);
      list.forEach((node: any) => {
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

  resetFormInput() {
    const list: any[] = [];
    if (this.currentTab !== 'input') {
      Object.entries(this.$refs).forEach(([key, value]) => {
        if (value && /^form-input-arg/.test(key)) {
          list.push(this.$refs[key]);
        }
      });
    } else {
      Object.entries(this.$refs).forEach(([key, value]) => {
        if (value && /^form-input-res/.test(key)) {
          list.push(this.$refs[key]);
        }
      });
    }
    list.forEach((node: any) => {
      node.reset();
    });
  }

  /**
 * 保存方法
 * @param callback 保存后回调
 */
  save(callback?: Function) {
    this.validateForm()
      .then(async () => {
        this.form.configJson = JSON.stringify(this.configs);
        this.form.inputParametersJson = JSON.stringify(this.inputParameters.map((param: any) => {
          const {
            code, name, configJson, bizPropertyType, description,
          } = param;
          return {
            code, name, configJson, bizPropertyType, description,
          };
        }));
        this.form.outputParametersJson = JSON.stringify(this.outputParameters.map((param: any) => {
          const {
            code, name, configJson, bizPropertyType, description,
          } = param;
          return {
            code, name, configJson, bizPropertyType, description,
          };
        }));
        // console.log(this.form);
        let res: any = null;
        if (this.id) {
          res = await this.updateMethod({
            ...this.form,
            id: this.id,
          });
        } else {
          res = await this.createMethod(this.form);
        }
        if (res && res.errcode === 0) {
          /**
           * 如果为更新，则检查是否由关联业务方法并提示手动更新 2019-06-20
           */
          let bindCount: number = 0;
          if (this.id) {
            bindCount = await this.checkBindStatusAndAlert();
          }
          /**
           * 新建后返回的数据重新初始化到界面，以便再次编辑
           */
          if (res.data) {
            this.initialData(res.data);
            this.id = res.data.id;
          }
          if (callback) {
            callback();
          } else {
            this.$emit('submit', bindCount);
          }
        } else {
          this.$message.warning(res.errmsg);
        }
      })
      .catch(() => { });
  }

  checkBindStatusAndAlert() {
    console.log('check bind status');
    return serviceApi.getServiceBizBindInfo({
      serviceCode: this.service.code,
      serviceMethodCode: this.method.code
    }).then((res: any) => {
      console.log('check result:', res);
      if (res.errcode === 0 && res.data) {
        // this.$warning({
        //   title: '更新提示',
        //   content: '更新成功！该集成方法关联的业务方法需手动更新。',
        //   okText: this.$t('languages.Apps.Ok').toString(),
        // });
        // this.$message.success('更新成功！该集成方法关联的业务方法需手动更新。');
        return res.data;
      }
    });
  }

  /**
 * 保存并测试连接
 */
  saveAndTest() {
    const vm: any = this;
    this.save(() => {
      vm.$emit('test', this.form);
    });
  }

  /**
 * 解析编辑时带入的方法数据
 */
  parseJson(jsonString: string, argName: string) {
    try {
      this.$set(this, argName, JSON.parse(jsonString));
    } catch (error) {
      console.log(error);
    }
  }

  /**
 * 初始化数据
 */
  initialData(data: BizService.Method.Item) {
    Object.keys(this.form).forEach((key: string) => {
      this.$set(this.form, key, (data as any)[key] || '');
    });
    this.parseJson(data.configJson, 'configs');
    this.parseJson(data.inputParametersJson, 'inputParameters');
    this.parseJson(data.outputParametersJson, 'outputParameters');
    if (this.inputParameters.length) {
      this.inputParameters.forEach((item: any, index: number) => {
        item.index = index + 1;
        item.sortKey = Date.now().toString() + index;
        if (!item.configJson) {
          item.configJson = {
            position: 0
          };
        }
      });
    }
    if (this.outputParameters.length) {
      this.outputParameters.forEach((item: any, index: number) => {
        item.index = index + 1;
        item.sortKey = Date.now().toString() + index;
        if (!item.configJson) {
          item.configJson = {
            position: 0
          };
        }
      });
    }
  }

  mounted() {
    if (this.method && this.method.id) {
      this.id = this.method.id;
      this.initialData(this.method);
    }
    this.form.serviceCode = this.service.code;
  }
}
</script>
<style lang="less" scoped>
.add-method {
  &__title {
    font-weight: 600;
  }
  &__form {
    margin-bottom: 24px;
  }
  &__item {
    display: flex;
    align-items: center;
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.65);
    &--http {
      margin-top: 25px;
      margin-bottom: 25px;
    }
    &--full {
      > p {
        flex: 1;
      }
    }
    > span {
      display: inline-block;
      width: 130px;
      margin-right: 5px;
    }
    > p {
      width: 306px;
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
    button:not(:last-child) {
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  &__btn {
    padding: 14px 0;
    background-color: #fff;
    text-align: center;
    user-select: none;
    span {
      display: inline-block;
      cursor: pointer;
    }
    i {
      margin-right: 9px;
      font-size: 12px;
    }
    color: @primary-color;
  }
  &__table {
    // /deep/.ant-table-thead span {
    //   display: block;
    //   height: 22px;
    //   line-height: 22px;
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    /deep/.ant-select {
      width: 100%;
    }
    /deep/.ant-table-body {
      color: rgba(0,0,0,0.85);
      max-height: calc(100vh - 250px) !important;
    }
    /deep/.ant-table-footer {
      padding: 0;
      background: none;
    }
    /deep/.ant-table-placeholder {
      display: none;
    }
  }
  &__textarea {
    /deep/div {
      display: none;
    }
  }
  /deep/.ant-tabs {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
