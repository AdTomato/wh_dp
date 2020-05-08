<template>
  <div class="mapping">
    <a-drawer
      wrapClassName="mapping-drawer"
      title="数据映射关系设置"
      :closable="true"
      :mask="true"
      :width="850"
      :visible="isShowModal"
      @close="onCancel"
    >
      <div class="mapping-box">
        <a-table :dataSource="tableData" :pagination="false">
          <!-- 父流程 -->
          <a-table-column
            key="parentWorfklow"
            dataIndex="parentWorfklow"
          >
            <span
              slot="title"
              class="resize resize-first"
              v-resize.east="{translateX: 16}"
            >父流程</span>
            <template slot-scope="parentWorfklow">
              <a-select
                class="p-w-section"
                v-model="parentWorfklow.val"
                @change="onWorkflowChange"
              >
                <a-select-option
                  v-for="(w, i) in parentWorfklow.list"
                  :key="i"
                  :value="w.code"
                  :itemtype="w.propertyType"
                  :name="w.name"
                  :relativeCode="w.relativeCode"
                  workflowType="parentWorfklow"
                  :index="parentWorfklow.index"
                >{{ `${w.name}` }}</a-select-option>
              </a-select>
            </template>
          </a-table-column>

          <!-- 映射方式 -->
          <a-table-column key="mappingWay" dataIndex="mappingWay">
            <span
              slot="title"
              class="resize"
              v-resize.east="{translateX: 16}"
            >
              映射方式
              <a-tooltip placement="top">
                <span slot="title">父流程和子流程互相映射：父流程传递到子流程，同时子流程结束后将数据回填到父流程(子流程多个时以追加方式传递给父流程)</span>
                <i class="icon aufontAll h-icon-all-question-circle-o"></i>
              </a-tooltip>
            </span>
            <template slot-scope="mappingWay">
              <a-select class="m-w-section" v-model="mappingWay.val">
                <a-select-option
                  v-for="(m, i) in mappingWay.list"
                  :value="m.value"
                  :key="i"
                  :index="mappingWay.index"
                >{{ m.name }}
                </a-select-option>
              </a-select>
            </template>
          </a-table-column>

          <!-- 子流程 -->
          <a-table-column
            key="subWorkflow"
            dataIndex="subWorkflow"
          >
            <span
              slot="title"
              class="resize"
              v-resize.east="{translateX: 16}"
            >子流程</span>
            <template slot-scope="subWorkflow">
              <a-select
                class="s-w-section"
                v-model="subWorkflow.val"
                @change="onWorkflowChange"
              >
                <a-select-option
                  v-for="(s, i) in subWorkflow.list"
                  :key="i"
                  :value="s.code"
                  :name="s.name"
                  :index="subWorkflow.index"
                  :itemtype="s.propertyType"
                  :relativeCode="s.relativeCode"
                  workflowType="subWorkflow"
                >{{ `${s.name}` }}
                </a-select-option>
              </a-select>
            </template>
          </a-table-column>

          <a-table-column
            title=""
            key="operationIndex"
            dataIndex="operationIndex"
          >
            <template slot-scope="text,record">
              <i @click="deleteItem(record)" class="icon aufontAll h-icon-all-delete-o"></i>
            </template>
          </a-table-column>
        </a-table>
        <div
          class="add-item"
          @click="addItem">
          <i class="icon aufontAll h-icon-all-plus-o"></i> 新增数据</div>
      </div>

      <div class="footer">
        <a-button
          type="primary"
          @click="onConfirm"
          :disabled="isSave"
        >保存</a-button>
      </div>
      <a-alert
        v-if="isShowAlert"
        class="warn-alert"
        message="请先完善当前数据映射关系"
        banner
        @close="onClose"
        closable />

      <a-alert
        v-if="isShowErrorAlert"
        class="warn-alert"
        message="业务对象ID是数据记录的唯一标识ID，不允许赋值给业务对象ID"
        banner
        type="error"
        @close="onCloseError"
        closable />
    </a-drawer>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

import { DataItemType } from '@cloudpivot/form/schema';
import * as WorkflowNameSpace from '@/typings/workflow';



import * as Helper from '../helper/helper';


const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'MappingModal'
})
export default class MappingModal extends Vue {
  @Prop() value!: boolean;

  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem:any;

  @WorkflowModule.State('WorkflowDataItem_all') WorkflowDataItem_all:any;

  @WorkflowModule.State('childWorkflowSchemaCode') childWorkflowSchemaCode:any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  @WorkflowModule.Action('getWorkflowDataItem') getWorkflowDataItem:any;

  @WorkflowModule.Action('getWorkflowDataItemNotFiltered') getWorkflowDataItemNotFiltered:any;


  isShowModal:boolean = false;

  tableData:any = [];

  tableDataCopy:any = [];

  subWorkflowList:any = [];

  subWorkflowListCopy:any = [];

  mappingWayList:any = [
    { value: 'IN', name: '从父流程映射到子流程' }, // In
    { value: 'IN_OUT', name: '父流程和子流程互相映射' } // InOut
  ];

  index:number = -1;

  // 20190604 放开附件和表单， 目前只过滤审批意见和子表
  filterArr:Array<number> = [DataItemType.ApprovalOpinion, DataItemType.Sheet];

  isShowAlert:boolean = false;

  isShowErrorAlert:boolean = false

  getOperationIndex() {
    this.index += 1;
    return this.index;
  }

  get WorkflowItemDataCopy() {
    if (!this.WorkflowDataItem) return;
    // 20190724 放开系统数据项
    // let tem_arr = JSON.parse(JSON.stringify(this.WorkflowDataItem));
    let tem_arr = JSON.parse(JSON.stringify(this.WorkflowDataItem_all));
    const isSubTable:boolean = this.curActivityProps.commonSettings.triggerMappingObj.mainTable === 1;
    if (isSubTable) {
      tem_arr = Helper.releaseSubTableDataItem(tem_arr);
    }

    if (isSubTable) {
      const { filterArr } = this;
      tem_arr = tem_arr.filter((item:any) => filterArr.indexOf(item.propertyType) < 0)
                      .map((item:any) => {
                        if (item.code.indexOf('.') > -1) { // 说明是子表数据项
                          const pcode:string = item.code.split('.')[0] as string;
                          if (pcode === this.curActivityProps.commonSettings.triggerMappingObj.code) {
                            return item;
                          }
                        } else {
                          return item;
                        }
                      }).filter((item:any) => item);

      // 取出触发对象之外的子表作为主表数据项
      const subTableArr = this.WorkflowDataItem.filter((d: any) => d.propertyType === 8 && d.code !== this.curActivityProps.commonSettings.triggerMappingObj.code);
      tem_arr = tem_arr.concat(subTableArr);
    } else {
      const filterArr = [DataItemType.ApprovalOpinion]; // 20190722 放开子表
      tem_arr = tem_arr.filter((item:any) => filterArr.indexOf(item.propertyType) < 0);
    }
    return tem_arr;
  }

  get isSave() {
    if (this.tableData.length !== 0) {
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (this.tableData[i].parentWorfklow.val === '' || this.tableData[i].subWorkflow.val === '') {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  // 获取子流程数据项
  async getChildDataItem() {
    // 当没有选择子流程模板时，不执行
    if (!this.curActivityProps.commonSettings.workflowCode) return;
    const params = { schemaCode: this.childWorkflowSchemaCode};
    const data = await this.getWorkflowDataItemNotFiltered(params);
    if (!data || data.length === 0) return;
    // 20190724 放开系统数据项
    // let _list = data.filter((item:any) => (!item.defaultProperty));
    // _list = Helper.releaseSubTableDataItem(_list); // 子流程只支持主表数据项
    let _list = data;
    const isSubTable:boolean = this.curActivityProps.commonSettings.triggerMappingObj.mainTable === 1;
    if (isSubTable) {
      // const { filterArr } = this;
      const filterArr = [DataItemType.ApprovalOpinion]; // 20191203 黄老大需求
      _list = _list.filter((item:any) => filterArr.indexOf(item.propertyType) < 0);
    } else {
      const filterArr = [DataItemType.ApprovalOpinion]; // 20190722 放开子表
      _list = _list.filter((item:any) => filterArr.indexOf(item.propertyType) < 0);
    }
    
    this.subWorkflowListCopy = JSON.parse(JSON.stringify(_list));
    this.subWorkflowList = this.subWorkflowListCopy;

    // 还原数据映射关系
    if (this.curActivityProps.workflowDataMaps && this.curActivityProps.workflowDataMaps.length > 0) {
      const _maps = this.curActivityProps.workflowDataMaps;
      _maps.forEach((map:any, i:number) => {
        // 根据code找到对应的name
        const pDataItems = this.WorkflowItemDataCopy.find((wd:any) => wd.code === map.parentDataName);
        if (!pDataItems) return;
        const _pname = pDataItems ? pDataItems.name : '';

        const sItemsDatas = this.subWorkflowList.find((wd:any) => wd.code === map.childDataName);
        if (!sItemsDatas) return;
        const _sname = sItemsDatas ? sItemsDatas.name : '';
        const list = this.filterWorkflowList();
        if (!list) return;
        const { parentWorkflowList, childWorkflowList } = list;
        let cLists:any = [];
        let pList:any = [];
        if (pDataItems.propertyType === 0 && pDataItems.code === 'id') { // 选择业务对象id 另外一侧有关联表单和短文本
           const handler = (handlingList:any) => {
             const arr:any = [];
             let rCode:string = pDataItems.schemaCode;
             handlingList.forEach((innerList:any) => {
              if (innerList.propertyType === 9) {
                let listRcode:string = innerList.relativeCode;
                if (innerList.code === 'id') {
                  listRcode = innerList.schemaCode;
                }
                if (listRcode === rCode) {
                  arr.push(innerList);
                }
              } else {
                arr.push(innerList);
              }
            });
            return arr;
           }
           // 1. 找出短文本和关联表单
            const temList = childWorkflowList
              .filter((listItem:any) => listItem.propertyType === pDataItems.propertyType || listItem.propertyType === 9);
              
              // 2. 找出合法的关联表单和短文本，并push进数组中
              
            cLists = handler(temList);

            // 处理父流程
            const temPList = parentWorkflowList.filter((listItem:any) => listItem.propertyType === pDataItems.propertyType || (listItem.propertyType === 0 && listItem.code === 'id'));
            pList = handler(temPList);
        } else if (pDataItems.propertyType === 9) { // 如果是关联表单，另一侧是合法的关联表单和业务对象id
            const handler = (handlingList:any) => {
              const arr:any = [];
              let rCode:string = pDataItems.relativeCode;
              if (!handlingList) return ;
              handlingList.forEach((innerList:any) => {
              if (innerList.propertyType === 0 && innerList.code === 'id') { // 业务对象id
                if (rCode === innerList.schemaCode) {
                  arr.push(innerList);
                }
              } else if(innerList.propertyType === 9) {
                if (rCode === innerList.relativeCode) {
                  arr.push(innerList);
                }
              }
             });
             return arr;
            }
            // 1. 找出关联表单和业务对象id
            const temList = childWorkflowList
              .filter((listItem:any) => listItem.propertyType === pDataItems.propertyType || (listItem.propertyType === 0 && listItem.code === 'id'));
            cLists = handler(temList);

            // 处理父流程
            const temPList = parentWorkflowList.filter((listItem:any) => listItem.propertyType === pDataItems.propertyType || (listItem.propertyType === 0 && listItem.code === 'id'));
            pList = handler(temPList);
          } else {
            cLists = childWorkflowList.filter((item:any) => item.propertyType === pDataItems.propertyType);
            pList = parentWorkflowList.filter((item:any) => item.propertyType === pDataItems.propertyType);
          }

        // 20190221 因为附件 inout方式存在问题，故, 当选择附件类型的时候先过滤掉inout方式
        // 20190711 放开限制
        // let _mappingList:any;
        // if (pDataItems.propertyType === 6 || sItemsDatas.propertyType === 6) {
        //   _mappingList = [{ value: 'IN', name: 'In' }];
        // } else {
        //   _mappingList = [
        //     { value: 'IN', name: 'In' },
        //     { value: 'IN_OUT', name: 'InOut' }
        //   ];
        // }

        this.tableData.push({
          parentWorfklow: {
            val: map.parentDataName,
            name: _pname,
            list: pList,
            index: i
          },
          mappingWay: {
            val: map.inOutType,
            list: this.mappingWayList,
            index: i
          },
          subWorkflow: {
            val: map.childDataName,
            name: _sname,
            list: cLists,
            index: i
          },
          operationIndex: i
        });
      });
    } else {
      // 整合父流程和子流程type和code相同的项
      this.WorkflowItemDataCopy.forEach((w:any) => {
        this.subWorkflowList.forEach((s:any) => {
          if ((s.propertyType === w.propertyType) && (s.code === w.code) && !w.defaultProperty && !s.defaultProperty) {
            // 20190221 因为附件 inout方式存在问题，故, 当选择附件类型的时候先过滤掉inout方式
            // 20190711 放开限制
            // let _mappingList:any;
            // if (s.propertyType === 6 || w.propertyType === 6) {
            //   _mappingList = [{ value: 'IN', name: 'In' }];
            // } else {
            //   _mappingList = [
            //     { value: 'IN', name: 'In' },
            //     { value: 'IN_OUT', name: 'InOut' }
            //   ];
            // }
            const _index = this.getOperationIndex();
            this.tableData.push({
              parentWorfklow: {
                val: w.code,
                name: w.name,
                list: [w],
                index: _index
              },
              mappingWay: {
                val: this.mappingWayList[0].value,
                list: this.mappingWayList,
                index: _index
              },
              subWorkflow: {
                val: s.code,
                name: s.name,
                list: [s],
                index: _index
              },
              operationIndex: _index
            });
          }
        });
      });
    }

    if (this.tableData.length === 0) {
      this.addItem();
    }

    this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData));

    this.setIndex();
  }

  /**
   * 对象数组根据某个字段进行排序 - 字符串
   * @params property 排序字段
   * */
  compare(property:string) {
    return (a:any, b:any) => (a[property] as string).localeCompare((b[property] as string));
  }


  /**
   * 父子流程过滤
   * @params data 源数据
   * @params type 区分父子流程 parentWorfklow subWorkflow
   * @params index 当前行
   * @params selectedItemCode 当前选中项的值
   * */
  handleFilter(type:string, selectedItemCode:any, obj:any) {
    let arr:Array<any> = [];
    const workflowObj = type === 'parentWorfklow' ? 'subWorkflow' : 'parentWorfklow';
    const dataCopy = JSON.parse(JSON.stringify(this.tableData));
    const tableDataCopy = JSON.parse(JSON.stringify(this.tableDataCopy));

    const {
      itemtype, index, workflowType, name, relativeCode
    } = obj.data.attrs;

    let _index:number = -1;
    _index = dataCopy.findIndex((item:any) => item.parentWorfklow.index === index); // 对应第几行的数据

    const curRowData = tableDataCopy[_index][type].list.find((item:any) => item.code === selectedItemCode); // 找出当前这行的数据
    if (!curRowData) return;

    // if (curRowData.propertyType === 8) { // 如果是子表，做相关判断
    //   if (!curRowData.subSchema) return;
    //   const curRowSubSchemaProperties = curRowData.subSchema.properties.sort(this.compare('code')); // 当前父流程项字表属性

    //   let mark:string = '';
    //   const markArr:Array<string> = [];
    //   curRowSubSchemaProperties.forEach((p:any) => {
    //     markArr.push(`${p.code}${p.propertyType}`);
    //   });
    //   mark = markArr.join('-'); // 将父流程的所有字段code和type组合成一个标识

    //   // 子流程中类型为字表并且字表字段个数与父流程相同的项
    //   const curRowSubWorkflow = tableDataCopy[_index][workflowObj].list.filter((item:any) => item.propertyType === itemtype && item.subSchema.properties.length === curRowSubSchemaProperties.length);
    //   curRowSubWorkflow.forEach((item:any) => {
    //     let subMark:string = '';
    //     const subMarkArr:Array<string> = [];
    //     if (item.subSchema.properties && item.subSchema.properties.length > 0) {
    //       const subPropertyArr = item.subSchema.properties.sort(this.compare('code'));
    //       subPropertyArr.forEach((subProperty:any) => {
    //         subMarkArr.push(`${subProperty.code}${subProperty.propertyType}`);
    //       });
    //       subMark = subMarkArr.join('-');
    //     }

    //     if (subMark === mark) {
    //       arr.push(item);
    //     }
    //   });
    // } else 

    // 父子流程映射的时候，关联表单关联的是同一个模型才能做映射，否则不允许映射。
    // 业务对象id的schemaCode与关联表单的relativeCode相同才能映射
    // 20190806 迭代18 单独处理业务对象id
    if (curRowData.propertyType === 0 && curRowData.code === 'id') { // 选择业务对象id 另外一侧有关联表单和短文本
      // 1. 找出短文本和关联表单
      const temList = tableDataCopy[_index][workflowObj].list
        .filter((listItem:any) => listItem.propertyType === itemtype || listItem.propertyType === 9);
        let rCode:string = relativeCode;
        if (curRowData.code === 'id') {
          rCode = curRowData.schemaCode;
        }
      // 2. 找出合法的关联表单和短文本，并push进数组中
      temList.forEach((list:any) => {
        if (list.propertyType === 9) {
          let listRcode:string = list.relativeCode;
          if (list.code === 'id') {
            listRcode = list.schemaCode;
          }
          if (listRcode === rCode) {
            arr.push(list);
          }
        } else {
          arr.push(list);
        }
      });
    } else if (curRowData.propertyType === 9) { // 如果是关联表单，另一侧是合法的关联表单和业务对象id
      // 1. 找出关联表单和业务对象id
      const temList = tableDataCopy[_index][workflowObj].list
        .filter((listItem:any) => listItem.propertyType === itemtype || (listItem.propertyType === 0 && listItem.code === 'id'));
      // 2. 找出合法的关联表单和业务对象id
      let rCode:string = relativeCode;
      temList.forEach((list:any) => {
        if (list.propertyType === 0 && list.code === 'id') { // 业务对象id
          if (rCode === list.schemaCode) {
            arr.push(list);
          }
        } else if(list.propertyType === 9) {
          if (rCode === list.relativeCode) {
            arr.push(list);
          }
        }
      })
    } else {
      arr = tableDataCopy[_index][workflowObj].list.filter((item:any) => item.propertyType === itemtype);
    }

    return { data: arr, index: _index };
  }

  onWorkflowChange(value:any, obj:any) {
    if (!value || !obj || this.subWorkflowListCopy.length === 0 || this.WorkflowItemDataCopy.length === 0) return;
    const dataCopy = JSON.parse(JSON.stringify(this.tableData));
    const tableDataCopy = JSON.parse(JSON.stringify(this.tableDataCopy));
    const selectedItemCode = value; // 当前选中的值
    const {
      workflowType, name, itemtype, relativeCode
    } = obj.data.attrs;
    let arr:any = [];
    let _index:number = -1;
    const workflowObj = workflowType === 'parentWorfklow' ? 'subWorkflow' : 'parentWorfklow';
    if (workflowType === 'parentWorfklow') {
      const res = this.handleFilter('parentWorfklow', value, obj) as any;
      arr = res.data;
      _index = res.index;
    } else {
      const res = this.handleFilter('subWorkflow', value, obj) as any;
      arr = res.data;
      _index = res.index;
    }

    // 20190221 因为附件 inout方式存在问题，故, 当选择附件类型的时候先过滤掉inout方式
    // 20190711 放开限制
    // if (itemtype === 6) {
    //   dataCopy[_index].mappingWay.list = [{ value: 'IN', name: 'In' }];
    // } else {
    //   dataCopy[_index].mappingWay.list = [
    //     { value: 'IN', name: 'In' },
    //     { value: 'IN_OUT', name: 'InOut' }
    //   ];
    // }

    // 回写时在选择，类型不同变空值
    const beChangedItem:any = dataCopy[_index][workflowObj].list.find((item:any) => item.code === tableDataCopy[_index][workflowObj].val);
    const beChangedType:number = beChangedItem ? beChangedItem.propertyType as number : -1;
    if( beChangedType !== -1 &&
        itemtype !== DataItemType.RelevanceForm && 
        itemtype !== DataItemType.RelevanceForm && 
        value !== 'id') {
          if (itemtype !== beChangedType) {
            dataCopy[_index][workflowObj].val = '';
          }
        }

    dataCopy[_index][workflowObj].list = arr;
    // dataCopy[_index][workflowObj].val = arr[0] ? arr[0].code : '';
    dataCopy[_index][workflowType].name = name;

    this.tableData = dataCopy;
  }

  setIndex() {
    let data:any = [];
    this.tableData.forEach((item:any, index:number) => {
      item.mappingWay.index = index;
      item.parentWorfklow.index = index;
      item.subWorkflow.index = index;
    });
    this.tableDataCopy.forEach((item:any, index:number) => {
      item.mappingWay.index = index;
      item.parentWorfklow.index = index;
      item.subWorkflow.index = index;
    });
  }


  // 数据项去重
  filterWorkflowList() {
    if (!this.tableData) return;
    const parentWorkflows:Array<string> = [];
    const childWorkflows:Array<string> = [];

    // 找出所有已选的项
    this.tableData.forEach((td:any) => {
      parentWorkflows.push(td.parentWorfklow.val);
      childWorkflows.push(td.subWorkflow.val);
    });

    // 过滤父流程
    const parentWorkflowList = this.WorkflowItemDataCopy.filter((wd:any) => !parentWorkflows.includes(wd.code));
    const childWorkflowList = this.subWorkflowListCopy.filter((wd:any) => !childWorkflows.includes(wd.code));
    if (!parentWorkflowList || !childWorkflowList) return;
    return { parentWorkflowList, childWorkflowList };
  }

  addItem() {
    if (this.isSave) {
      this.isShowAlert = true; 
      return;
    }
    const _index = this.tableData.length > 0 ? this.tableData.length : this.getOperationIndex();

    // 数据项去重
    const list = this.filterWorkflowList();
    if (!list) return;
    const { parentWorkflowList, childWorkflowList } = list;
    const item = {
      parentWorfklow: {
        val: '',
        name: '',
        list: parentWorkflowList,
        index: _index
      },
      mappingWay: {
        val: this.mappingWayList[0].value,
        list: this.mappingWayList,
        index: _index
      },
      subWorkflow: {
        val: '',
        name: '',
        list: childWorkflowList,
        index: _index
      },
      operationIndex: _index
    };
    this.tableData.push(item);
    this.tableDataCopy.push(item);

    this.setIndex();
  }

  deleteItem(record:any) {
    const index = this.tableData.findIndex((item:any) => item.parentWorfklow.val === record.parentWorfklow.val);
    this.tableData.splice(index, 1);
    this.tableDataCopy.splice(index, 1);

    // 将删除的项添加回所有的list中

    // 当前行的code
    const  parentWorkflowCode = record.parentWorfklow.val;
    const childWorkflowCode = record.subWorkflow.val;

    // 当前行对应的流程item
    const parentWorkflow = this.WorkflowItemDataCopy.find((wd:any) => wd.code === parentWorkflowCode);
    const childWorkflow = this.subWorkflowListCopy.find((wd:any) => wd.code === childWorkflowCode);

    if (!parentWorkflow || !childWorkflow) return;
    const parentWorkflowType:number = parentWorkflow.propertyType as number;
    const childkflowType:number = childWorkflow.propertyType as number;
    this.tableData.forEach((td:any) => {
      const isExistParentWorkflow = td.parentWorfklow.list.find((wd:any) => wd.code === parentWorkflowCode);
      let isTypeSame:boolean = true;
      // 每一行的父流程的propertyType
      const _type:number = td.parentWorfklow.list.find((innerItem:any) => innerItem.code === td.parentWorfklow.val).propertyType;
      if (parentWorkflowType === DataItemType.RelevanceForm) { // 关联表单
        const deletedItemRcode:string = parentWorkflow.relativeCode as string; // 被删除行父流程关联表单所关联的模型
        if (_type === DataItemType.RelevanceForm) {
          const curRowItemRcode:string =  td.parentWorfklow.list.find((innerItem:any) => innerItem.code === td.parentWorfklow.val).relativeCode as string;
          if (deletedItemRcode === curRowItemRcode) {
            isTypeSame = true;
          } else {
            isTypeSame = false;
          }
        }
      } else if (parentWorkflowType === DataItemType.ShortText && parentWorkflow.code === 'id') { // 被删除行父流程是业务关联id
        const deletedItemScode:string = parentWorkflow.schemaCode as string; // 被删除行父流程业务对象id的schemaCode
        if (_type === DataItemType.RelevanceForm) {
          const curRowItemRcode:string =  td.parentWorfklow.list.find((innerItem:any) => innerItem.code === td.parentWorfklow.val).relativeCode as string;
          if (deletedItemScode === curRowItemRcode) {
            isTypeSame = true;
          } else {
            isTypeSame = false;
          }
        }
      } else {
        isTypeSame = parentWorkflowType === _type;
      }
      
      if (!isExistParentWorkflow && isTypeSame) {
        td.parentWorfklow.list.push(parentWorkflow);
      }

      const isExistChildWorkflow = td.subWorkflow.list.find((wd:any) => wd.code === childWorkflowCode);
      if (!isExistChildWorkflow && isTypeSame) {
        td.subWorkflow.list.push(childWorkflow);
      }
    });

    this.tableDataCopy.forEach((td:any) => {
      const isExistParentWorkflow = td.parentWorfklow.list.find((wd:any) => wd.code === parentWorkflowCode);
      let isTypeSame:boolean = true;
      // 每一行的父流程的propertyType
      const _type:number = td.parentWorfklow.list.find((innerItem:any) => innerItem.code === td.parentWorfklow.val).propertyType;
      if (parentWorkflowType === DataItemType.RelevanceForm) { // 关联表单
        const deletedItemRcode:string = parentWorkflow.relativeCode as string; // 被删除行父流程关联表单所关联的模型
        if (_type === DataItemType.RelevanceForm) {
          const curRowItemRcode:string =  td.parentWorfklow.list.find((innerItem:any) => innerItem.code === td.parentWorfklow.val).relativeCode as string;
          if (deletedItemRcode === curRowItemRcode) {
            isTypeSame = true;
          } else {
            isTypeSame = false;
          }
        }
      } else if (parentWorkflowType === DataItemType.ShortText && parentWorkflow.code === 'id') { // 被删除行父流程是业务关联id
        const deletedItemScode:string = parentWorkflow.schemaCode as string; // 被删除行父流程业务对象id的schemaCode
        if (_type === DataItemType.RelevanceForm) {
          const curRowItemRcode:string =  td.parentWorfklow.list.find((innerItem:any) => innerItem.code === td.parentWorfklow.val).relativeCode as string;
          if (deletedItemScode === curRowItemRcode) {
            isTypeSame = true;
          } else {
            isTypeSame = false;
          }
        }
      } else {
        isTypeSame = parentWorkflowType === _type;
      }
      
      if (!isExistParentWorkflow && isTypeSame) {
        td.parentWorfklow.list.push(parentWorkflow);
      }

      const isExistChildWorkflow = td.subWorkflow.list.find((wd:any) => wd.code === childWorkflowCode);
      if (!isExistChildWorkflow && isTypeSame) {
        td.subWorkflow.list.push(childWorkflow);
      }
    });


    this.setIndex();
  }

  // 迭代18 校验业务对象id和关联表单映射方式
  // 将inout看成从右到左写入
  // 所有写入业务对象id的映射关系，都是不合法的
  checkTableData():boolean{
    let isOk:boolean = true;
    // 不合法的项
    const IllegalLists:Array<any> = this.tableData.map((data:any) => {
      const inObjectId:boolean = data.subWorkflow.val === 'id' && data.mappingWay.val === 'IN';
      const inOutObjectId:boolean = data.parentWorfklow.val === 'id' && data.mappingWay.val === 'IN_OUT';
      
      if (inObjectId || inOutObjectId) {
        return data;
      }
    }).filter((item:any) => item);
    isOk = IllegalLists.length <= 0;
    return isOk;
  }

  onCancel() {
    this.tableData = [];
    this.subWorkflowListCopy = [];
    this.isShowAlert = false;
    this.isShowErrorAlert = false;
    this.$emit('input', false);
  }

  onConfirm() {
    const isDataOk:boolean = this.checkTableData();
    if (!isDataOk) { // 存在不合法数据
      this.isShowAlert = false;
      this.isShowErrorAlert = true;
      return;
    }
    // 数据合成
    const arr:Array<WorkflowNameSpace.workflowDataMap> = [];
    const mappingStrArr:Array<string> = [];
    this.tableData.forEach((data:any) => {
      const parentWorfklowCode:string = data.parentWorfklow.val;
      const childWorfklowCode:string = data.subWorkflow.val;

      arr.push({
        parentDataName: parentWorfklowCode,
        childDataName: childWorfklowCode,
        inOutType: data.mappingWay.val
      });
      mappingStrArr.push(`${data.parentWorfklow.name}[${data.parentWorfklow.val}]->${data.subWorkflow.name}[${data.subWorkflow.val}]`);
    });

    // 更新数据
    this.setPropValue({ key: 'workflowDataMaps', value: arr });
    this.$emit('confirm', mappingStrArr.join('&'));
    this.onCancel();
  }

  onClose(){
    this.isShowAlert = false;
  }

  onCloseError(){
    this.isShowErrorAlert = false;
  }

  @Watch('value')
  onValueChange(val:any) {
    this.isShowModal = val;
    this.tableData = [];
    if (this.childWorkflowSchemaCode && val) {
      this.getChildDataItem();
    }
  }
}
</script>
<style lang="less" scoped>
.mapping-box {
  max-height: calc( 100% - 35px );
  overflow: auto;
}
  /deep/.ant-table-tbody > tr > td {
    padding: 3px 16px;
    color: rgba(0,0,0,0.85);
  }
  /deep/.ant-table-thead > tr > th {
    padding:  8px 16px;
    font-weight: 600;
    color: rgba(0,0,0,0.65);
  }
  .p-w-section {
    width: 180px;
  }
  .s-w-section {
    width: 180px;
  }
  .m-w-section {
    width: 250px;
  }
  .icon {
    cursor: pointer;
    font-weight: normal;
  }
  .add-item {
    color: @primary-color;
    text-align: center;
    margin-top: 8px;
    user-select: none;
    cursor: pointer;
  }
  .footer{
    text-align: center;
    position: absolute;
    height: 50px;
    line-height: 50px;
    bottom: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #E8E8E8;text-align: center;
  }
  .resize {
    display: inline-block;
    height: 22px;
    width: calc(100% + 32px);
    padding: 0 16px;
    -webkit-transform: translateX(-16px);
    transform: translateX(-16px);
    border-left: 1px solid #e8e8e8;
    font-weight: 600;
  }
  .resize-first {
    border-left: none;
  }

  /deep/.ant-table-placeholder{display: none;}


.ant-drawer-body {
  position: relative;
  .warn-alert {
    position: absolute;
    top: 57px;
    left: 0;
    width: 100%
  }
}

</style>
