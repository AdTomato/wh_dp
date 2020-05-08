<template>
  <a-modal
    title="默认值"
    visible
    width="536px"
    @cancel="closeModal"
    @ok="backData"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    :maskClosable="false"
    :keyboard="false"
  >
    <div>
      <div class="rdv-row" style="margin-bottom: 22px;" v-show="relevance_dateItem.length">
        <div class="rdv-row-first rdv-row-title">关联表单数据项</div>
        <div class="rdv-row-second rdv-row-title">函数</div>
        <div class="rdv-row-third rdv-row-title">当前表单数据项</div>
      </div>
      <div
        class="rdv-row"
        v-show="relevance_dateItem.length"
        v-for="(item, index) of relevance_dateItem"
        :key="item.code">
        <div class="rdv-row-first">
          <a-select :defaultValue="relevance_dateItem[index].code" style="width:100%" @change="(val) => relevanceOptHandleChange(val,index)">
            <a-select-opt-group>
              <span slot="label">业务数据项</span>
              <a-select-option :value="d.code" v-for="d of relevance_operationDateItem" :key="d.code">{{ d.name+'['+d.code+']' }}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group label="系统数据项">
              <a-select-option :value="d.code" v-for="d of relevance_systemDateItem" :key="d.code">{{ d.name+'['+d.code+']' }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
        <div class="rdv-row-second">
          <a-select :defaultValue="relevance_dateItem[index].op" style="width:100%" @change="(val) => selectHandleChange(index,'op',val)">
            <a-select-option :value="fnType_item.value" v-for="fnType_item of fnType[index]" :key="fnType_item.value">{{ fnType_item.key }}</a-select-option>
          </a-select>
        </div>
        <div class="rdv-row-third">
          <a-select :defaultValue="relevance_dateItem[index].value" style="width:152px" @change="(val) => selectHandleChange(index,'value',val)">
            <a-select-option :value="match_item.code" v-for="match_item of matchDataArr[index]" :key="match_item.code">{{ match_item.name+'['+(match_item.parentCode?match_item.parentCode+'.':'')+match_item.code+']' }}</a-select-option>
          </a-select>
          <span @click="deleteMatchData(index)"> <a-icon type="delete" /></span>
        </div>
      </div>
      <div class="rdv-row addRow">
        <span>
          <i style="width: 12px;height: 12px; color:#17BC94" class="icon aufontAll h-icon-all-plus-o"></i>
        </span>
        <span @click="addRow" class="addRow-text">新增查询条件</span>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import * as dataitemStore from "../stores/data-items.store-helper";
import { DataItemType,FormControlType } from "@cloudpivot/form/schema";
import appsApi from "@/apis/apps";
const fnType = [
  {
    key:'等于',
    value: 'Eq'
  },
  {
    key: '不等于',
    value: 'NotEq'
  },
  {
    key:'包含',
    value: 'Like'
  },
  {
    key:'不包含',
    value: 'NotLike'
  },
  {
    key:'大于',
    value: 'Gt'
  },
  {
    key: '小于',
    value: 'Lt'
  }
]
@Component({
  name: 'RelevanceFormDefaultVal'
})
export default class RelevanceFormDefaultVal extends Vue {
  @Prop({
    default: {}
  })
  modalData!: any;
  @Prop()
  getFormControls!: any

  @Prop()
  dataItem!: any

  relevance_systemDateItem:any[] = [] // 关联模型 系统数据项
  relevance_operationDateItem:any[] = [] // 关联模型 业务数据项
  self_formControls: any[] = [] // 本模型数据项
  fnType:any[] = [] // 函数数组
  relevance_dateItem: any[] = [] // 关联模型 数据
  allCtrl:any[] = []
  matchDataArr:any[] =[]
  closeModal() {
    this.$emit("closeModal");
  }
  backData() {
    if (this.relevance_dateItem.length && this.relevance_operationDateItem.length) {
      let res = this.relevance_dateItem.map((val) => ({
        propertyCode: val.code,
        propertyValue: val.value,
        op: val.op,
        propertyType: val.propertyType
      }))
      this.$emit("backData", {value: JSON.stringify(res)});
    }else {
       this.$emit("backData", {value: ''});
    }
  }
  // 新增数据项
  addRow() {
    if (!!this.modalData.data.schemaCode) {
      let sys_group = []
      let ope_group = []
      let len = this.relevance_dateItem.length
      if (this.relevance_operationDateItem.length) {
        let f = this.filterFnType(this.relevance_operationDateItem[0].type)
        this.$set(this.fnType,this.fnType.length,f)
        let f1 = this.filterSelfModalDateItem(this.relevance_operationDateItem[0].type)
        this.$set(this.matchDataArr,this.matchDataArr.length,f1)
        this.relevance_dateItem.push({
          propertyType: this.relevance_operationDateItem[0].type,
          code: this.relevance_operationDateItem[0].code,
          op: f[0].value,
          value: f1[0] ? f1[0].code:''
        })
      } else if (this.relevance_systemDateItem.length) {
        let f = this.filterFnType(this.relevance_systemDateItem[0].type)
        this.$set(this.fnType,this.fnType.length,f)
        let f1 = this.filterSelfModalDateItem(this.relevance_operationDateItem[0].type)
        this.$set(this.matchDataArr,this.matchDataArr.length,f1)
        this.relevance_dateItem.push({
          propertyType: this.relevance_systemDateItem[0].type,
          code: this.relevance_systemDateItem[0].code,
          op: f[0].value,
          value: f1[0] ? f1[0].code:''
        })
      }
    } else {
      this.fnType.push({})
      this.matchDataArr.push([])
      this.relevance_dateItem.push({
          propertyType: '',
          code: '',
          op: '',
          value: ''
      })
    }
  }
  // 获取函数类型
  filterFnType (type: number) {
    let arr = [
      {
        key:'等于',
        value: 'Eq'
      },
      {
        key: '不等于',
        value: 'NotEq'
      },
      {
        key:'包含',
        value: 'Like'
      },
      {
        key:'不包含',
        value: 'NotLike'
      },
    ]
    if (+type === DataItemType.Number) {
      arr = arr.concat([{key:'大于',value: 'Gt'},{key:'小于',value:'Lt'}])
    }
    return arr
  }
  // 根据关联数据模型 获取当前匹配的数据模型
  filterSelfModalDateItem(type: number) {
    let arr:any[] = []
    switch(+type) {
      case DataItemType.StaffSelector:
        arr = this.allCtrl.filter((val) => (val.type == DataItemType.StaffSelector))
        break
      case DataItemType.Number:
        arr = this.allCtrl.filter((val) => (val.type == DataItemType.Number))
        break
      case DataItemType.ShortText:
      case DataItemType.LongText:
        arr = this.allCtrl.filter((val) => (val.type == DataItemType.ShortText ||
        val.type == DataItemType.LongText))
        break
    }
    return arr
  }
  // 业务类型变化
  relevanceOptHandleChange(value, index) {
    this.relevance_dateItem[index].code = value
    let dateItem = this.relevance_operationDateItem.filter((val) => {
      return val.code == value
    })[0]
    if (!dateItem) {
      dateItem = this.relevance_systemDateItem.filter((val) => {
      return val.code == value
    })[0]
    }
    let f = this.filterFnType(dateItem.type)
    this.$set(this.fnType,index,f)
    let f1 = this.filterSelfModalDateItem(dateItem.type)
    this.$set(this.matchDataArr,index,f1)
    this.relevance_dateItem[index].op = f[0].value
    this.relevance_dateItem[index].value = f1[0] ? f1[0].code:''
    this.relevance_dateItem[index].propertyType = dateItem.type
  }
  selectHandleChange(index, key, val) {
    this.relevance_dateItem[index][key] = val
  }
  // 删除数据项
  deleteMatchData(index) {
    this.fnType.splice(index,1)
    this.matchDataArr.splice(index,1)
    this.relevance_dateItem.splice(index,1)
  }
  created() {
    const schemaCode = this.modalData.data.schemaCode;
    const dataItem = this.modalData.data.dataItem;
    console.log(!!schemaCode)
    !!schemaCode&&appsApi.getDataItemList({
        schemaCode,
        isPublish: true
    }).then(({data}) => {
      const map = (x: any) => ({
        code: x.propertyCode || x.code,
        type: x.propertyType,
        name: x.name,
        relativeCode: x.relativeCode || x.relativeSchemaCode,
        isSystem: x.defaultProperty
      });
      const items = dataitemStore.getDataItems(this).filter(x => x.used);

        var target = {
          items
        };
        var mappingTarget:{items:any[]} = {
          items: []
        }
        if (dataItem.parentCode) {
          const sheet = items.find(x => x.code === dataItem.parentCode);
          if (sheet && sheet.properties) {
            const sheetItems = sheet.properties.filter(
              (x: any) => x.used && x.code !== dataItem.code
            );

            mappingTarget = {
              items: sheetItems
            };

            target = {
              items: (target.items as any).concat(sheetItems)
            };
          }
        } else {
          mappingTarget = {
            items: items.filter(x => x.code !== dataItem.code)
          };
        }

      const types = mappingTarget.items.map(x => x.type);
      const msItems = data
        .filter(
          (x: any) =>
            x.propertyType === DataItemType.LongText ||
            x.propertyType === DataItemType.ShortText ||
            x.propertyType === DataItemType.Number ||
            x.propertyType === DataItemType.StaffSelector
        )
        .map(map);
      for(let item of msItems) {
        if(item.isSystem) {
          this.relevance_systemDateItem.push(item)
        } else {
          this.relevance_operationDateItem.push(item)
        }
      }
      for(let item of target.items) {
        this.allCtrl.push(item)
      }
      if (this.modalData.data.value.mapping && this.modalData.data.value.mapping.length) {
        let val = JSON.parse(this.modalData.data.value.mapping)
        for(let item of val) {
          let f = this.filterFnType(+item.propertyType)
          this.$set(this.fnType,this.fnType.length,f)
          let f1 = this.filterSelfModalDateItem(+item.propertyType)
          this.$set(this.matchDataArr,this.matchDataArr.length,f1)
          this.relevance_dateItem.push({
            code: item.propertyCode,
            op: item.op,
            value:item.propertyValue,
            propertyType: item.propertyType
          })
        }
      }
    })
  }
}
</script>
<style lang="less">
  .rdv-row {
    display: flex;
    flex-flow: row;
  }
  .rdv-row-title {
    font-size: 14px;
    color:rgba(0,0,0,0.65);
    line-height:22px;
  }
  .rdv-row-first {
    width: 166px;
  }
  .rdv-row-second {
    width: 106px;
    margin: 0 16px;
  }
  .rdv-row-third {
    display: flex;
    width: 178px;
    align-items: center;
    &> span {
      font-size: 14px;
      margin-left: 12px;
      color:rgba(0,0,0,0.65);
      cursor: pointer;
    }
  }
  .addRow {
    justify-content: center;
    margin-top: 20px;
    span {
      color:#17BC94;
      line-height: 14px;
    }
  }
  .addRow-text {
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
  }
</style>