<template>
  <div class="form-wrap">
    <!--************* 基础字段（编码/名称/数据项） *************-->
    <a-form @submit="handleSubmit" :autoFormCreate="(form)=>{this.form = form}">
      <div v-for="item in templates" :key="item.uiformId">
        <a-form-item
          :label="item.labelName"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 12 }"
          :titleTip="item.tip"
          :fieldDecoratorId="item.uiformId"
          :fieldDecoratorOptions="{
            rules: [
              {
                required: item.required,
                message: item.placeholder
              },
              {
                pattern: item.pattern,
                validator: item.validator,
                message: item.ruleMsg,
              },
            ]
          }"
        >
          <!-- 输入框 -->
          <a-input
            v-if="item.uiType === 1"
            :maxLength="item.maxLength"
            :placeholder="item.placeholder"
            :disabled="item.uiformId === 'code' && editMode === 'edit' && published === true"
          />
          <!-- 下拉选择 -->
          <!-- <div v-else-if="item.uiType === 2"> -->
          <a-select
            v-else-if="item.uiType === 2"
            :placeholder="item.placeholder"
            @change="handleSelectChange"
            class="input-color"
            :disabled="item.uiformId ==='propertyType' && editMode === 'edit' && published === true"
          >
            <a-select-option
              v-for="opt in dataItemTypeList"
              :disabled="opt.disabled"
              :key="opt.index"
            >{{ opt.name }}</a-select-option>
          </a-select>

          <!-- </div> -->
        </a-form-item>
      </div>
      <!-- ************* 数据项切换对应块 ********** -->

      <!-- 关联表单9 -->
      <template v-if="Number(dataType) === 9">
        <a-form-item
          class="form-required"
          label="选择业务模型"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 12 }"
        >
          <div>
            <biz-models-selector
              :disabled="editMode === 'edit' && published === true"
              v-model="postInfo.relativeCode"
              :appCode="postInfo.appPackageCode"
              :folderId="postInfo.appFunctionCode"
              :expandCode="expandCode"
              @change="onTreeChange"
              :placeholder="$t('languages.PlaceHolder.Select')"
            />
          </div>
        </a-form-item>
        <a-form-item
          :label="$t('languages.Apps.StorageOption')"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 12 }"
        >
          <a-checkbox-group
            class="checkbox-form-align"
            v-model="storageItems"
            @change="getStorageTypes"
            :options="relationBIzOptions"
          />
        </a-form-item>
      </template>
      <!-- 短文本0/长文本1/数值型2/选人控件5  -->
      <template v-else-if="dataType !== '' && +dataType < 3 || +dataType === 5 || +dataType === 10">
        <div>
          <template v-if="+dataType !== 10">
            <!-- <a-form-item
              v-if="+dataType === 2"
              :label="$t('languages.Apps.DefaultValue')"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 12 }"
              fieldDecoratorId="defaultValue"
              :fieldDecoratorOptions="defaultValueRule"
            >
              <a-input v-model="postInfo.defaultValue" placeholder="请输入默认值"/>
            </a-form-item>-->
            <!-- v-else -->
            <a-form-item
              :label="$t('languages.Apps.DefaultValue')"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 12 }"
            >
              <a-input v-model="postInfo.defaultValue" placeholder="请输入默认值" />
            </a-form-item>
          </template>
          <a-form-item
            :label="$t('languages.Apps.StorageOption')"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 12 }"
          >
            <a-checkbox-group
              class="checkbox-form-align"
              v-model="storageItems"
              @change="getStorageTypes"
              :options="plainOptions"
            />
          </a-form-item>
        </div>
      </template>
      <!-- 日期3  -->
      <template v-else-if="Number(dataType) === 3">
        <a-form-item
          :label="$t('languages.Apps.Date')"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 12 }"
        >
          <a-date-picker
            class="date"
            @change="dateChange"
            :defaultValue="defaultDate"
            :placeholder="$t('languages.PlaceHolder.Select')"
          />
        </a-form-item>
        <a-form-item
          :label="$t('languages.Apps.StorageOption')"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 12 }"
        >
          <a-checkbox-group
            class="checkbox-form-align"
            v-model="storageItems"
            @change="getStorageTypes"
            :options="plainOptions"
          />
        </a-form-item>
      </template>
      <!-- 子表[表格]8 -->
      <template v-else-if="Number(dataType) === 8">
        <div class="subtable table-wrap">
          <a-table
            :pagination="false"
            :dataSource="schemaSource"
            :columns="columns"
            size="middle"
            :scroll="{ y: 200 }"
            :locale="{emptyText: $t('languages.NoRelevantData')}"
            id="schema"
          >
            <!-- 表头 -->
            <span class="text-ellipsis" slot="idTitle">{{ $t('languages.NO') }}</span>
            <span class="text-ellipsis resize" slot="codeTitle">编码</span>
            <span class="text-ellipsis resize" slot="nameTitle">名称</span>
            <span class="text-ellipsis resize" slot="typeTitle">数据类型</span>
            <span class="text-ellipsis resize" slot="defaultValueTitle">默认值</span>
            <span class="text-ellipsis resize" slot="propertyIndexTitle">索引</span>
            <span class="text-ellipsis resize" slot="propertyEmptyTitle">不允许空</span>
            <span class="text-ellipsis resize" slot="operationTitle">操作</span>

            <!-- 子表[输入框]:编码/名称/默认值 -->
            <template
              v-for="col in ['code', 'name']"
              :slot="col"
              slot-scope="text, record"
            >
              <form-input
                v-model="record[col]"
                :key="col"
                :value="text"
                :rules="rules[`${col}`]"
                :type="'text'"
                :ref="`form-input-${col}-${record.id}`"
                @change="e => handleRowChange(e.target.value, record.id, col)"
                :disabled="col === 'code' && record.published"
                :tipPosition="'top'"
              />
            </template>
            <!-- ///////////////// 默认值输入控件区域 ///////////////// -->
            <template slot="defaultValue" slot-scope="text, record">
              <a-date-picker
                v-if="Number(record.propertyType) === 3"
                class="date default"
                v-model="record.defaultValue"
                :placeholder="$t('languages.PlaceHolder.Select')"
              />
              <!-- @change="(e, str) => record.defaultValue = str" -->
              <a-input
                class="default"
                v-else-if="Number(record.propertyType) < 3"
                v-model="record.defaultValue"
                placeholder="请输入默认值"
              />
              <!-- [子表] 关联表单 -->
              <biz-models-selector
                class="default"
                :disabled="record.published"
                v-else-if="Number(record.propertyType) === 9"
                v-model="record.relativeCode"
                :appCode="record.appPackageCode"
                :folderId="record.appFunctionCode"
                :expandCode="expandCode"
                @change="(v) => onSchemaTreeChange(v,record)"
                :placeholder="$t('languages.PlaceHolder.Select')"
              />
            </template>

            <!-- 子表[下拉选择框]: 数据类型 -->
            <template slot="type" slot-scope="text, record">
              <a-select
                v-model="record.propertyType"
                placeholder="业务类型"
                defaultValue="0"
                @change="handleSubtableSelect"
                @select="changeSelect(record)"
                :disabled="record.published"
                class="datatype"
              >
                <!-- :disabled="published === true && !!record.schemaCode" -->
                <a-select-option v-for="opt in schemaCodeTypeList" :key="opt.index">{{ opt.name }}</a-select-option>
              </a-select>
            </template>
            <!-- 子表[复选框]：索引，不为空 -->
            <template
              v-for="p in ['propertyIndex', 'propertyEmpty']"
              :slot="p"
              slot-scope="text, record, index"
            >
              <a-checkbox
                :key="p"
                :checked="text"
                :disabled="p === 'propertyIndex' && +record.propertyType === 9"
                v-if="propertyArray.includes(record.propertyType)"
                @change="e => onCheckboxChange(e.target, index, p)"
              ></a-checkbox>
            </template>
            <template slot="operation" slot-scope="text, record">
              <span @click="onRowDelete(record.key)">
                <i class="icon aufontAll h-icon-all-delete-o"></i>
              </span>
            </template>
          </a-table>
          <div class="handle-box">
            <span @click="onRowAdd">
              <i class="icon aufontAll h-icon-all-plus-o"></i>
              {{ $t('languages.Apps.Add') }}
            </span>
          </div>
        </div>
      </template>
      <!-- 提交保存 -->
      <div class="draw-body-bottom">
        <a-form-item>
          <a-button
            :class="editMode === 'add'? '': 'green'"
            type="default"
            htmlType="submit"
            @click="handleSave"
          >保存</a-button>
          <a-button
            v-if="editMode === 'add'"
            type="primary"
            htmlType="submit"
            @click="handleSaveContinue"
          >保存并新增</a-button>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
<style lang="less">
.form-wrap {
  .resize {
    display: inline-block;
    height: 22px;
    width: calc(100% + 32px);
    padding: 0 16px;
    transform: translateX(-16px);
    border-left: 1px solid #e8e8e8;
    font-weight: 600;
  }
  /deep/.ant-checkbox-group-item {
    margin-right: 16px;
  }
  // padding-top: 20px;
  .ant-form-item-label {
    label {
      &::before {
        margin-right: 0 !important;
      }
      span {
        margin-left: 0;
        margin-right: 3px;
      }
    }
  }
  .input-color {
    div,
    li {
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .ant-select-disabled {
    .ant-select-selection-selected-value {
      color: rgba(0, 0, 0, 0.25);
    }
  }
  font-family: PingFangSC-Regular;
  .ant-row {
    margin-bottom: 16px;
  }
  .ant-col-5 {
    // padding-left: 17px;
    width: 108px;
    text-align: left;
  }
  .ant-col-12 {
    width: 292px;
    height: 32px;
    .date {
      width: 100%;
    }
  }
  .ant-btn-primary {
    margin-left: 8px;
    //  background-color: @primary-color;
    //  border-color: @primary-color;
  }
  .draw-body-bottom {
    padding: 6px 0;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    background: #fff;
    border-radius: 0 0 4px 4px;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
    .ant-row {
      margin: 0;
    }
    .ant-col-12 {
      height: auto;
    }
  }
  .table-head {
    background: #e9e9e9;
  }
  .input-box {
    padding: 8px;
    width: 94px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid #d9d9d9;
  }
  .subtable {
    .ant-table-placeholder {
      display: none;
    }
    .handle-box {
      text-align: center;
      padding: 10px 0;
      /*margin-bottom: 8px;*/
      line-height: 14px;
      /*text-align: right;*/
      font-size: 14px;
      color: @primary-color;
      span {
        cursor: pointer;
      }
    }
    .ant-table-header {
      &::-webkit-scrollbar {
        width: 0;
      }
    }
    .ant-table-body {
      td {
        padding-top: 3px !important;
        color: rgba(0, 0, 0, 0.85);
        padding-bottom: 3px !important;
        .default {
          width: 144px;
        }
        .datatype {
          width: 122px;
        }
      }
      max-height: calc(100vh - 350px) !important;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
  .ant-table-thead > tr > th {
    padding: 8px 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-table-bordered .ant-table-tbody > tr > td {
    text-align: center;
    .icon {
      cursor: pointer;
    }
  }
  .ant-drawer-title {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 24px;
  }
  .ant-form-item-label label {
    line-height: 22px;
    color: @light-color-2;
  }
  .ant-form-item-children .checkbox-form-align {
    line-height: 32px;
  }
  .ant-checkbox-wrapper,
  .ant-form-item,
  .ant-select {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-select-arrow {
    font-size: 14px;
  }

  // .table-wrap{
  //   width: 816px;
  //   overflow-x: scroll;
  // }
}
.ant-drawer-body {
  overflow: hidden;
}
.green {
  background: @primary-color;
  border: 1px solid @primary-color;
  color: #fff;
}
.green:hover {
  background: rgba(81, 188, 1, 0.8);
  border: 1px solid rgba(81, 188, 1, 0.8) !important;
  color: #fff;
}
.ant-table-middle
  > .ant-table-content
  > .ant-table-scroll
  > .ant-table-header
  > table
  > .ant-table-thead
  > tr
  > th {
  text-align: center;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { State, Action, Mutation, namespace } from "vuex-class";
import moment from "moment";
import { pattern, nameValidator, sliceString } from "@/common/utils";
import {
  rules,
  storageOptions,
  relationBIzOptions,
  dataItemTypeList,
  dataItemTypeSchema,
  dataItemColumns
} from "./dataitem-map";

import AppsApi from "@/apis/apps";
import Bus from "@/utils/bus";
import bizModelsSelector from "@/components/global/biz-models-selector/index.vue";

import FormInput from "@/components/global/form-input/index.vue";

import { LanguageTransform } from "@/utils";

const DataModelModule = namespace("Apps/DataModel");

@Component({
  name: "FormItem",
  components: {
    bizModelsSelector,
    FormInput
  }
})
export default class formItem extends Vue {
  // @DataModelModule.State('dataItemTypeList') dataItemTypeList: any; // 数据项类型

  @DataModelModule.State("editMode") editMode: any;

  // 编辑模式（新增or编辑）
  @DataModelModule.State("bizPropertyCode") bizPropertyCode: any;

  // 编辑code
  @DataModelModule.State("bizSchemaCode") schemaCode: any;

  // 新增的schemaCode
  @DataModelModule.State("drawerVisible") drawerVisible: any;

  // drawer显示隐藏
  @DataModelModule.State("bussinessType") bussinessType: any;

  // // 业务类型
  @DataModelModule.State("keyWords") keyWords: any;

  // 过滤关键字
  @DataModelModule.State("bizPropertyModel") bizPropertyModel: any;

  @DataModelModule.Mutation("setCurrenEdittMode") setEditMode: any;

  // 编辑或新增模式
  @DataModelModule.Mutation("setFilterDataItemList") setFilterDataItemList: any;

  // 过滤关键字高亮
  @DataModelModule.Mutation("setKeyWords") setKeyWords: any;

  @DataModelModule.Mutation("setBizPropertyCode") setBizPropertyCode: any;

  @DataModelModule.Action("postDataItem") postDataItem: any;

  // 保存数据项
  @DataModelModule.Action("updateDataItems") updateDataItems: any;

  // 更新数据项
  // @DataModelModule.Action('getBussinessType') getBussinessType: any; // 业务类型
  @DataModelModule.Action("getDataItemDetails") getDataItemDetails: any;

  // 查询数据项详情
  @DataModelModule.Action("getDataItemList") getDataItemListX: any; // 刷新数据项例表方法

  // 校验规则
  rules = rules;

  // 存储选项
  plainOptions: Array<any> = storageOptions;

  // 关联表单存储选项
  relationBIzOptions: Array<any> = relationBIzOptions;

  code: string = "";

  form: any = "";

  checkedList: any[] = [];

  formCollection: any = {}; // ant 表单收集器收到的数据(编码/名称/数据项)

  postInfo: any = {
    // 即将发送给服务器
    defaultValue: "", // 默认值
    propertyIndex: false, // 是否索引
    propertyEmpty: false, // 是否为空
    relativeCode: "",
    schemaCode: "" // 业务模型
  };

  storageItems: any[] = [];

  dataType: string = "";

  // -1 根据数据项类型切换不同的视图
  saveFlag: number = 0;

  // 判断保存or保存并新增
  defaultDate: any = "";

  propertyArray: Array<string> = ["0", "1", "2", "3", "9", "10"];

  // 子表显示索引与为空的数据类型
  published: boolean = false; // 未发布

  @Prop({
    type: Array
  })
  "templates": Array<Common.DataItems>;

  @Prop({
    type: Array
  })
  "selectCollection": any;

  get defaultValueRule() {
    if (+this.dataType === 2) {
      return {
        rules: [
          {
            pattern: /^\d{1,13}(\.\d{1,2})?$/,
            message: "数值整数最大13位，小数最大2位"
          }
        ]
      };
    }
    return {};
  }

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === "zh";
  }

  get expandCode() {
    return this.$route.params.appCode;
  }

  @Watch("dataType", { deep: true })
  handleDataType(v: any) {
    console.info("watch********dataType", v);
    if (Number(v) === 3) {
      // 自动填充日期
      if (this.editMode === "edit" && this.postInfo.defaultValue !== "") {
        // 编辑
        this.defaultDate = moment(this.postInfo.defaultValue, "YYYY-MM-DD");
      }
    } else if (Number(v) === 8) {
    }
  }

  @Watch("schemaSource")
  setDataItemTypeDisable(v: any) {
    // 子表类型不能切换类型，切换类型时
    if (v.length > 0 && Number(this.dataType) === 8) {
      this.dataItemTypeList.map(el => {
        el.disabled = true;
      });
    } else if (v.length <= 0) {
      this.dataItemTypeList.map(el => {
        el.disabled = false;
      });
    }
  }

  // mounted() {
  //   this.setTypeProperty();
  // }

  /**
   * 编辑时 获取数据详情
   */
  // @Watch('bizPropertyCode')
  setTypeProperty(v: any) {
    // const v = this.bizPropertyCode;
    if (v !== "") {
      // 获取数据项详情
      // this.getDataItemDetails({ bizPropertyCode: this.bizPropertyCode, bizSchemaCode: this.schemaCode });
      this.getDataItemDetails({
        propertyCode: this.bizPropertyCode,
        schemaCode: this.schemaCode
      })
        .then((result: any) => {
          // debugger;
          if (!result) {
            return false;
          }
          // debugger
          const {
            code,
            name,
            propertyType,
            subSchema,
            published,
            name_i18n
          } = result;
          this.published = published;

          const globalName = LanguageTransform.getLang(name, name_i18n);

          const initNameI18n = LanguageTransform.initNameI18n(name, name_i18n);

          this.$nextTick(() => {
            // 设置表单数据
            if (this.form.setFieldsValue) {
              this.form.setFieldsValue({
                code,
                name: globalName,
                propertyType: propertyType.toString()
              });
            }

            // 存在 子表时候
            if (subSchema && Array.isArray(subSchema.properties)) {
              this.schemaSource = subSchema.properties
                .filter(
                  (item: any) =>
                    !["id", "parentId", "sortKey"].includes(item.code)
                )
                .map((item: any, idx: number) => {
                  // debugger
                  const obj = {
                    ...item,
                    propertyType: `${item.propertyType}`,
                    dataId: item.id,
                    id: idx + 1,
                    key: (new Date().getTime() + idx).toString(),
                    name: LanguageTransform.getLang(item.name, item.name_i18n),
                    name_i18n: LanguageTransform.initNameI18n(
                      name,
                      item.name_i18n
                    )
                  };
                  if (+obj.propertyType === 3) {
                    obj.defaultValue = obj.defaultValue
                      ? moment(obj.defaultValue, "YYYY-MM-DD")
                      : null;
                  }

                  return obj;
                });
            } else {
              this.schemaSource = [];
            }
            this.dataType = propertyType; // 触发select
          });

          this.postInfo = {
            defaultValue: result.defaultValue ? result.defaultValue : "",
            propertyIndex: result.propertyIndex,
            propertyEmpty: result.propertyEmpty,
            relativeCode: result.relativeCode,
            appPackageCode: result.appPackageCode,
            appFunctionCode: result.appFunctionCode,
            name_i18n: initNameI18n,
            copyName: result.name
          };

          // setTimeout(() => {
          //   this.postInfo.defaultValue = '3333333333333';
          // },500)

          if (result.propertyEmpty) {
            this.storageItems.push("propertyEmpty");
          }
          if (result.propertyIndex) {
            this.storageItems.push("propertyIndex");
          }
          this.$set(this.postInfo, "id", result.id);
        })
        .catch((err: any) => {});
    } else if (this.editMode === "add") {
      // 新增数据项下拉框默认数据类型为短文本
      this.$nextTick(() => {
        if (this.form.setFieldsValue) {
          this.form.setFieldsValue({
            propertyType: "0"
          });
          this.dataType = "0";
        }
      });
    }
  }

  // 监听drawer
  @Watch("drawerVisible")
  setDrawerVisible(v: any) {
    if (v) {
      // 打开drawer
      console.info("打开drawer::", v);
      // this.setTypeProperty(this.bizPropertyCode);

      // this.getBussinessType({ bizSchemaCode: this.schemaCode }); // 获取业务类型
      if (this.editMode === "add") {
        // 新增数据项下拉框默认数据类型为短文本
        this.$nextTick(() => {
          if (this.form.setFieldsValue) {
            this.form.setFieldsValue({
              propertyType: "0"
            });
            this.dataType = "0";
          }
        });
      }
    } else if (!v) {
      // 关闭drawer
      this.resetForm();
    }
  }

  created() {
    this.setTypeProperty(this.bizPropertyCode);
    this.dataItemTypeList = [...dataItemTypeList, ...dataItemTypeSchema];
    this.schemaCodeTypeList = [...dataItemTypeList];
    this.columns = dataItemColumns;
  }

  beforeDestroy() {
    // Bus.$off();
  }

  resetForm() {
    /* 重置所有数据 */
    // 重置字段（编码/名称/数据类型） this.formCollection
    this.form.resetFields();
    // 重置字段 postInfo
    this.postInfo = {
      defaultValue: "",
      propertyIndex: false,
      propertyEmpty: false,
      relativeCode: "" // 关联表单：数据模型
    };
    this.storageItems = []; // 重置 索引/不为空
    this.schemaSource = []; // 重置 字表数据
    this.dataType = ""; // 重置数据项select
    // this.count = this.schemaSource.length + 1; // 序号重置
  }

  /**
   * 日期转换
   */
  getMoment() {
    // return moment(this.postInfo.defaultValue).format('YYYY-MM-DD');
    return moment(this.postInfo.defaultValue).format("YYYY-MM-DD");
  }

  // 关联表单
  onTreeChange(v: string) {
    this.postInfo.relativeCode = v;
  }

  // 关联表单- 子表选择
  onSchemaTreeChange(v: any, recode: any) {
    recode.relativeCode = v;
    // this.schemaSource[this.selectIndex - 1].relativeCode = v;
  }

  // 删除一行（子表）
  onRowDelete(key: any) {
    const row: any = this.schemaSource.find((res: any) => res.key === key);

    const index: number = this.schemaSource.indexOf(row);

    const { published } = row;
    if (published) {
      this.deleteTips(index);
    } else {
      this.deleteAction(index);
    }
  }

  /**
   * 删除Action
   */
  deleteAction(key: number) {
    const schemaSource = [...this.schemaSource];
    schemaSource.splice(key, 1);
    schemaSource.forEach((res: any, index: number) => {
      res.id = index + 1;
    });
    this.schemaSource = schemaSource;
  }

  // relativeDataCount: number = 0;
  /**
   * 删除已发布子表tips
   */
  deleteTips(key: number) {
    const vm: any = this;
    const { name } = vm.schemaSource[key];
    const params = {
      schemaCode: this.schemaCode
    };
    AppsApi.deleteSchemaDataItem(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$confirm({
          title: `确定要删除数据项“${name}”？`,
          content: `已发布数据项，删除后同时删除数据库中数值，将影响${res.data}条数据，保存后生效`,
          okText: this.$t("languages.Ok"),
          cancelText: this.$t("languages.Cancel").toString(),
          onOk() {
            vm.deleteAction(key);
          }
        });
      }
    });
  }

  // 添加一行（子表）
  onRowAdd() {
    const { schemaSource } = this;
    const newData = {
      name: "",
      code: "",
      propertyType: "0",
      defaultValue: "",
      propertyIndex: false,
      propertyEmpty: false,
      relativeCode: "",
      id: "",
      key: new Date().getTime().toString()
    };

    this.schemaSource = [...schemaSource, newData];

    this.schemaSource.forEach((res: any, index: number) => {
      res.id = index + 1;
    });

    // this.count = count + 1;
    this.$nextTick(() => {
      const schemaEl: any = document.getElementById("schema");
      const aTable: any = schemaEl.getElementsByClassName("ant-table-body")[0];
      aTable.scrollTop = aTable.scrollHeight;
    });
  }

  // 编辑行（子表）
  handleRowChange(value: any, id: any, column: any) {
    const newData = [...this.schemaSource];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      if (column === "name") {
        target[column] = sliceString(value, 50);
      } else {
        target[column] = value;
      }
      this.schemaSource = newData;
    }
  }

  // 下拉选择（子表）
  selectIndex: number = 1;

  changeSelect(v: any, index: any) {
    this.selectIndex = v.id;
  }

  /**
   * 子表数据项类型切换
   */
  handleSubtableSelect(v: any, index: any) {
    // 关联表单 索引默认勾选
    if (+v === 9) {
      this.schemaSource[this.selectIndex - 1].propertyIndex = true;
    }
    this.schemaSource[this.selectIndex - 1].propertyType = v;
  }

  // 索引/为空 change（子表）
  onCheckboxChange(v: any, index: any, column: any) {
    const newData = [...this.schemaSource];

    newData[index][column] = !newData[index][column];
    this.schemaSource = newData;
  }

  getStorageTypes(valueArr: any) {
    this.storageItems = [...valueArr];
    // console.info(this.storageItems);
  }

  /**
   * 数据类型选择器改变---非子表
   */
  handleSelectChange(value: string) {
    // 设置select(表单收集器使用)
    this.dataType = value;
    this.form.setFieldsValue({
      propertyType: this.dataType // fieldDecoratorId必须为字符串
    });

    // 类型切换初始数据
    this.postInfo.defaultValue = "";
    this.storageItems = [];
    // this.count = this.schemaSource.length + 1;

    // 类型为关联表单时，默认索引
    if (+value === 9 && this.storageItems.indexOf("propertyIndex") === -1) {
      this.storageItems.push("propertyIndex");
    }

    if (Number(value) !== 8) {
      this.schemaSource = [];
    } else if (Number(value) === 3) {
      this.postInfo.defaultValue = this.defaultDate;
    }
  }

  // 日期改变（对应默认值）
  dateChange(date: any, dateString: string) {
    console.log(date, dateString);
    this.postInfo.defaultValue = dateString;
  }

  handleSave() {
    this.saveFlag = 0;
  }

  handleSaveContinue() {
    this.saveFlag = 1;
  }

  /**
   * 表单校验
   */
  validateForm() {
    let hasError: boolean = false;
    const list: any[] = [];
    Object.entries(this.$refs).forEach(([key, value]) => {
      if (value && /^form-input/.test(key)) {
        list.push(this.$refs[key]);
      }
    });

    list.forEach((node: any) => {
      node.forEach((res: any) => {
        const unValidated: boolean = res.validateValue({
          target: { value: res.content }
        });
        if (unValidated) {
          hasError = true;
        }
      });
    });
    return hasError;
  }

  // 【Submit】提交
  tesTips: Array<string> = [];

  handleSubmit(e: any) {
    const that: any = this;

    e.preventDefault();
    const numberTest = /^\d{1,13}(\.\d{1,2})?$/;
    // 子表存在的校验
    if (this.schemaSource) {
      if (this.validateForm()) {
        return;
      }
      this.tesTips = [];
      this.schemaSource.forEach((res: any) => {
        // 关联表单不允许为空
        if (res.propertyType === "9" && !res.relativeCode) {
          this.$message.info("关联表单不能为空！", 2);
          // 截断函数执行
          throw "表单验证不通过！";
        }

        if (res.propertyType === "3" && res.defaultValue) {
          res.defaultValue = moment(res.defaultValue).format("YYYY-MM-DD");
        }

        if (res.propertyType === "2"
          && res.defaultValue
          && !numberTest.test(res.defaultValue)) {
          this.$message.info("数值整数最大13位，小数最大2位", 2);
          throw "表单验证不通过！";
        }
      });
    }

    this.form.validateFields((err: any, collection: any) => {
      if (err) {
        return false;
      }
      // 预处理即将发送的数据
      // this.formCollection = this.form.getFieldsValue();
      this.formCollection = collection; // 获取基础字段（编码/名称/数据项）
      this.formCollection.propertyType = Number(
        this.formCollection.propertyType
      ); // 转化回Nmuber类型
      // 获取存储选项
      if (this.storageItems.indexOf("propertyEmpty") > -1) {
        this.postInfo.propertyEmpty = true;
      } else {
        this.postInfo.propertyEmpty = false;
      }
      if (this.storageItems.indexOf("propertyIndex") > -1) {
        this.postInfo.propertyIndex = true;
      } else {
        this.postInfo.propertyIndex = false;
      }
      this.postInfo.schemaCode = this.schemaCode; // 获取并设置schemacode

      // 子表
      // this.postInfo.subSchema.properties = this.schemaSource;
      // 关联表单
      // 组装即将发送的数据
      // debugger
      const info = Object.assign(this.postInfo, this.formCollection);

      if (
        this.formCollection.propertyType === 2 &&
        this.postInfo.defaultValue
      ) {
        if (!numberTest.test(this.postInfo.defaultValue)) {
          that.$message.info("数值整数最大13位，小数最大2位", 2);
          return;
        }
      }

      if (info.propertyType === 9 && !info.relativeCode) {
        that.$message.info("关联业务模型不允许为空", 2);
        return;
      }
      // 是否关闭drawer

      if (this.editMode === "edit") {
        // debugger
        // 业务字段多语言处理
        const obj: any = LanguageTransform.setLang(info.name, info.name_i18n);
        const saveData: any = Object.assign({}, info, obj);

        this.schemaSource.forEach((res: any, index: number) => {
          const schemaObj: any = LanguageTransform.setLang(
            res.name,
            res.name_i18n
          );
          this.schemaSource[index] = Object.assign({}, res, schemaObj);
        });

        // debugger

        this.updateDataItems({
          ...saveData,
          subSchema: {
            properties: this.schemaSource
          }
        }).then((res: any) => {
          if (res.errcode > 0) {
            this.$message.warning(res.errmsg);
            return;
          }
          Bus.$emit("isAddContinue", this.saveFlag);
          this.getDataItemListX().then(() => {
            // 新增数据项成功后，将列表刷新
            this.setFilterDataItemList(this.keyWords);
            /* 保存并新增后，重置表单，保留数据型的数据 */
            if (this.saveFlag) {
              this.form.resetFields();
              this.postInfo.relativeCode = "";
              const type = this.dataType;
              this.dataType = "";
              this.$nextTick(() => {
                this.handleSelectChange(type);
              });
            }
          });
        });
      } else {
        // 业务字段多语言处理
        const obj: any = LanguageTransform.setLang(info.name, info.name_i18n);
        const saveData: any = Object.assign({}, info, obj);

        this.schemaSource.forEach((res: any, index: number) => {
          const schemaObj: any = LanguageTransform.setLang(
            res.name,
            res.name_i18n
          );
          this.schemaSource[index] = Object.assign({}, res, schemaObj);
        });

        this.postDataItem({
          ...saveData,
          subSchema: {
            properties: this.schemaSource
          }
        }).then((res: any) => {
          if (res.errcode > 0) {
            this.$message.warning(res.errmsg);
            return;
          }
          Bus.$emit("isAddContinue", this.saveFlag);
          this.getDataItemListX().then(() => {
            // 新增数据项成功后，将列表刷新
            this.setFilterDataItemList(this.keyWords);

            /* 保存并新增后，重置表单，保留数据型的数据 */
            if (this.saveFlag) {
              this.form.resetFields();
              this.postInfo.relativeCode = "";
              const type = this.dataType;
              this.dataType = "";
              this.schemaSource = [];
              this.$nextTick(() => {
                this.handleSelectChange(type);
              });
            }
            // 等待表格渲染完成 滚动到页面底部
            this.$nextTick(() => {
              const schemaEl: any = document.getElementById("dataitem");
              const aTable: any = schemaEl.getElementsByClassName(
                "ant-table-body"
              )[0];
              aTable.scrollTop = aTable.scrollHeight;
            });
          });
        });
      }
      // 保存成功后 - 待完善。。。
      this.setBizPropertyCode(""); // 设置为空
    });
  }

  schemaSource: any[] = [];

  count: number = 1;

  columns: any[] = []; // 表格头渲染数据

  dataItemTypeList: any[] = []; // 数据项类型列表

  schemaCodeTypeList: any[] = []; // 子表数据项类型列表
}
</script>
