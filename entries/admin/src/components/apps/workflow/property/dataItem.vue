<template>
  <div class="data-item">
    <!-- 数据项头部 -->
    <property-widget
      label="数据项"
    >
      <template>
        <div slot="right" class="check-wrap">
          <div
            v-for="(i,index) in dataHead"
            :key="index"
            class="check-item"
          >
            <a-checkbox
              class="checkbox"
              v-model="i.checked"
              @change="onSelectAll(i)"
            ></a-checkbox>
            <span>{{ i.text }}</span>
          </div>
        </div>
      </template>
    </property-widget>
    <!-- 数据项区域 -->
    <template v-for="(item,key) in this.curActivityProps.dataItem">
      <property-widget
        :key="key"
        :title="item.propertyName"
        :label="item.propertyName"
        :tip="item.propertyEmpty?'数据模型创建数据项的时候如果勾选了“不允许为空”，则该数据项默认是必填状态，不可更改，如果要更改，请前往【数据模型】页面取消对该数据项的不允许为空设置。':false"
      >
        <template>
          <div slot="right" class="check-wrap">
            <div class="check-item">
              <a-checkbox
                v-model="item.visible"
                @change="onSelectChange('visible',item.propertyCode)"
                class="checkbox"
                :disabled="item.propertyEmpty"
              ></a-checkbox>
            </div>
            <div class="check-item">
              <a-checkbox
                v-model="item.editable"
                @change="onSelectChange('editable',item.propertyCode)"
                class="checkbox"
                :disabled="item.propertyEmpty"
              ></a-checkbox>
            </div>
            <div class="check-item">
              <a-checkbox
                v-model="item.required"
                @change="onSelectChange('required',item.propertyCode)"
                class="checkbox"
                :disabled="item.propertyEmpty"
              ></a-checkbox>
            </div>
          </div>
        </template>
      </property-widget>
      <template v-for="(subItem,subKey) in item.subPropertyPermissions">
        <property-widget
          :key="`${item.propertyCode}-${subKey}`"
          :title="`${item.propertyName}.${subItem.propertyName}`"
          :label="`${item.propertyName}.${subItem.propertyName}`"
          :tip="subItem.propertyEmpty?'数据模型创建数据项的时候如果勾选了“不允许为空”，则该数据项默认是必填状态，不可更改，如果要更改，请前往【数据模型】页面取消对该数据项的不允许为空设置。':false"
        >
          <template>
            <div slot="right" class="check-wrap">
              <div class="check-item">
                <a-checkbox
                  v-model="subItem.visible"
                  @change="onSubSelectChange('visible',item)"
                  class="checkbox"
                  :disabled="subItem.propertyEmpty"
                ></a-checkbox>
              </div>
              <div class="check-item">
                <a-checkbox
                  v-model="subItem.editable"
                  @change="onSubSelectChange('editable',item)"
                  class="checkbox"
                  :disabled="subItem.propertyEmpty"
                ></a-checkbox>
              </div>
              <div class="check-item">
                <a-checkbox
                  v-model="subItem.required"
                  @change="onSubSelectChange('required',item)"
                  class="checkbox"
                  :disabled="subItem.propertyEmpty"
                ></a-checkbox>
              </div>
            </div>
          </template>
        </property-widget>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import PropertyWidget from '../base/propertyWidget.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'DataItem',
  components: {
    PropertyWidget
  }
})

export default class DataItem extends Vue {
  @WorkflowModule.State('currentActivity') currentActivity: any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem:any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  dataHead:any = [{
    text: '可见',
    code: 'visible',
    checked: false
  }, {
    text: '可写',
    code: 'editable',
    checked: false
  }, {
    text: '必填',
    code: 'required',
    checked: false
  }];

  beforeMount() {
    this.dataMounted();
  }

  // 根据数据初始化视图
  dataMounted() {
    console.log(this.curActivityProps);
    // 如果数据模型存在数据项且后台数据项为空，则添加默认数据项（拖入新活动节点）
    if (this.WorkflowDataItem.length && !Object.keys(this.curActivityProps.dataItem).length) {
      const value:any = [];
      const dataItem = this.WorkflowDataItem.filter((item:any) => (!item.defaultProperty && item.propertyType !== 7));
      dataItem.forEach((item:any) => {
        if (item) {
          const subItem:any = [];
          if (item.subSchema && Array.isArray(item.subSchema.properties)) {
            item.subSchema.properties.forEach((sub:any) => {
              if (!sub.defaultProperty) {
                subItem.push({
                  editable: sub.propertyEmpty,
                  propertyCode: sub.code,
                  propertyEmpty: sub.propertyEmpty,
                  propertyName: sub.name,
                  required: sub.propertyEmpty,
                  subPropertyPermissions: null,
                  visible: true
                });
              }
            });
          }
          value.push({
            editable: item.propertyEmpty,
            propertyCode: item.code,
            propertyEmpty: item.propertyEmpty,
            propertyName: item.name,
            required: item.propertyEmpty,
            subPropertyPermissions: subItem,
            visible: true
          });
        }
      });
      this.setPropValue({ key: 'dataItem', value });
    } else if (this.WorkflowDataItem.length && Object.keys(this.curActivityProps.dataItem).length) {
      // 如果数据模型存在数据项且后台数据项不为空，则使用数据模型的顺序展示
      const sortValue:any = this.WorkflowDataItem.map((item:any) => {
        const dataItem:any = this.curActivityProps.dataItem.find((data: any) => item.code === data.propertyCode && item.propertyType !== 7);
        if (dataItem) {
          dataItem.propertyName = item.name;
          return dataItem;
        }
      }).filter((item: any) => !!item);
      this.setPropValue({ key: 'dataItem', 'value': sortValue });
    }
    if (Object.keys(this.curActivityProps.dataItem).length) {
      // 视图挂载时判定全选按钮状态
      this.checkStatus('visible');
      this.checkStatus('editable');
      this.checkStatus('required');
    }
  }

  // 数据权限select改变
  onSelectChange(type:string, itemCode?:string, isSelectAll?: boolean) {
    this.curActivityProps.dataItem.forEach((item: any, i:number) => {
      if (type === 'visible' && !item.visible) {
        // 可见取消勾选则可写必填也取消勾选
        this.curActivityProps.dataItem[i].editable = false;
        this.curActivityProps.dataItem[i].required = false;
      }
      if (type === 'editable' && !item.editable) {
        // 可写取消勾选则必填也取消勾选
        this.curActivityProps.dataItem[i].required = false;
      }
      if (type === 'editable' && item.editable) {
        // 勾选可写则可见也需勾选
        this.curActivityProps.dataItem[i].visible = true;
      }
      if (type === 'required' && item.required) {
        // 勾选必填则可写可见也需勾选
        this.curActivityProps.dataItem[i].editable = true;
        this.curActivityProps.dataItem[i].visible = true;
      }
      // ----适应ehr修改逻辑  start---
      // if (Array.isArray(item.subPropertyPermissions) && (itemCode === item.propertyCode || isSelectAll)) {
      //   if (item[type]) {
      //     item.subPropertyPermissions.forEach((subItem:any) => { subItem[type] = true; });
      //   } else {
      //     item.subPropertyPermissions.forEach((subItem:any) => { subItem[type] = false; });
      //   }
      //   this.onSubSelectChange(type, item);
      // }
      // ----适应ehr修改逻辑  end---
    });

    this.checkStatus('visible');
    this.checkStatus('editable');
    this.checkStatus('required');
  }

  // 数据权限全选事件
  onSelectAll(value:any) {
    if (!value) {
      return;
    }
    this.curActivityProps.dataItem.forEach((item: any, i:number) => {
      if (value.checked) {
        item[value.code] = true;
        if (Array.isArray(item.subPropertyPermissions)) {
          item.subPropertyPermissions.forEach((subItem:any) => { subItem[value.code] = true; });
        }
      } else if (!item.propertyEmpty) {
        item[value.code] = false;
        if (Array.isArray(item.subPropertyPermissions)) {
          item.subPropertyPermissions.forEach((subItem:any) => { subItem[value.code] = false; });
        }
      }
    });
    this.onSelectChange(value.code, '', true);
  }

  // 判定全选是否勾选
  checkStatus(type:string) {
    this.curActivityProps.dataItem.some((item: any, l: number) => {
      let flag = true;
      if (Array.isArray(item.subPropertyPermissions)) {
        flag = item.subPropertyPermissions.filter((sub:any) => sub[type]).length === item.subPropertyPermissions.length;
      }
      if (!item[type] || !flag) {
        this.dataHead.forEach((head: any) => {
          if (head.code === type) {
            head.checked = false;
          }
        });
        return true;
      } if (item[type] && l === this.curActivityProps.dataItem.length - 1) {
        this.dataHead.forEach((head: any) => {
          if (head.code === type) {
            head.checked = true;
          }
        });
        return true;
      }
      return false;
    });
  }

  // 子表数据项数据权限select改变
  onSubSelectChange(type:string, item:any) {
    item.subPropertyPermissions.forEach((subItem:any, i:number) => {
      if (type === 'visible' && !subItem.visible) {
        // 可见取消勾选则可写必填也取消勾选
        item.subPropertyPermissions[i].editable = false;
        item.subPropertyPermissions[i].required = false;
      }
      if (type === 'editable' && !subItem.editable) {
        // 可写取消勾选则必填也取消勾选
        item.subPropertyPermissions[i].required = false;
      }
      if (type === 'editable' && subItem.editable) {
        // 勾选可写则可见也需勾选
        item.subPropertyPermissions[i].visible = true;
      }
      if (type === 'required' && subItem.required) {
        // 勾选必填则可写可见也需勾选
        item.subPropertyPermissions[i].editable = true;
        item.subPropertyPermissions[i].visible = true;
      }
    });

    // ----适应ehr修改逻辑  start---
    // this.checkSubStatus('visible', item);
    // this.checkSubStatus('editable', item);
    // this.checkSubStatus('required', item);
    this.checkStatus('visible');
    this.checkStatus('editable');
    this.checkStatus('required');
    // ----适应ehr修改逻辑  end---
  }

  // 判定子表数据项是否勾选
  checkSubStatus(type:string, item:any) {
    item.subPropertyPermissions.some((subItem: any, l: number) => {
      if (subItem[type]) {
        item[type] = true;
        return true;
      } if (!subItem[type] && l === item.subPropertyPermissions.length - 1) {
        item[type] = false;
        return true;
      }
      return false;
    });

    this.checkStatus('visible');
    this.checkStatus('editable');
    this.checkStatus('required');
  }

  @Watch('currentActivity')
  onActivityChange(v: string) {
    this.dataMounted();
  }
}
</script>

<style lang="less" scoped>
.data-item{
  .check-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
    .check-item{
      flex: 1;
      font-size: 14px;
      .checkbox{
        font-size: 14px;
        margin-right: 6px;
      }
    }
  }
}
</style>
