<template>
  <div class="data-item">

    <template v-if="isLoading">
      <div class="loading-icon">
        <a-spin
          size="large"
          :tip="$t('languages.Apps.Loading')"
        />
      </div>
    </template>
    <template v-else>
      <div class="no-data" v-if="dataItemList.length === 0">
        <div class="data-item-tips">
          <span> 模型下的数据项会在数据库中生成字段，创建后可以在表单、流程、列表中使用。 </span>
        </div>
        <div class="no-data-tips">
          <img src="../../../assets/images/userEmpty.png">
          <p class="tips">{{ $t('languages.Apps.AddTips') }}</p>
          <p class="btn">
            <a-button type="primary" @click="addDataItem">
              <i class="icon aufontAll h-icon-all-plus-o"></i>
              {{ $t('languages.Apps.AddNew') }}
            </a-button>
          </p>
        </div>
      </div>
      <div class="data-item-content" v-else>
        <div class="form clearfix">
          <div class="input-group">
            <div>
              <a-input
                :placeholder="$t('languages.PlaceHolder.SearchByCodeOrName')"
                v-model="keyWords"
                @change="filterList"
                class="w240"
              >
                <a-icon
                  slot="prefix"
                  type="search"
                  class="del-icon"
                />
                <a-icon
                  v-if="keyWords"
                  slot="suffix"
                  type="close-circle"
                  @click="clearKeyWords"
                  class="del-icon"
                />
              </a-input>
            </div>
            <div class="title">
              <span>{{ $t('languages.Apps.Summary') }}
                <!-- <a-popover placement="top" title="">
                  <template slot="content">
                    <p class="tips" style="width:254px">摘要设置后作为业务表单和流程的标题，发布后生效</p>
                  </template>
                  <i class="icon aufontAll h-icon-all-info-cirlce-o"></i>
                </a-popover> SummaryTips-->
                <a-tooltip :title="$t('languages.Apps.SummaryTips')">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
                :
              </span>
            </div>
            <div style="line-height: 0.9">
              <data-model-summary  
                v-if="isUpdate"
                class="w320"
              ></data-model-summary>
              <!-- <a-select
                mode="tags"
                :placeholder="$t('languages.PlaceHolder.Select')"
                class="w320"
                @change="summaryChange"
                :notFoundContent="$t('languages.NoRelevantData')"
                :value="defaultSummary"
              >
                <a-select-opt-group>
                  <span slot="label" class="select-title">业务数据项</span>
                  <a-select-option v-for="i in bizSummaryList" :key="i.code">
                    {{ i.name }}
                  </a-select-option>
                </a-select-opt-group>
                <a-select-opt-group>
                  <span slot="label" class="select-title">系统数据项</span>
                  <a-select-option v-for="i in defaultSummaryList" :key="i.code">
                    {{ i.name }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select> -->
            </div>
          </div>
          <div class="btn-group">
            <a-button
              @click="doRank"
              class="btn"
            >
              <i class="icon aufontAll h-icon-all-rank-o"></i>
              排序
            </a-button>

            <a-button
              class="btn"
              @click="addDataItem"
            >
              <i class="icon aufontAll h-icon-all-plus-o"></i>
              {{ $t('languages.Apps.AddNew') }}
            </a-button>
            <a-button
              @click="publishDataItem"
              type="primary"
            >
              <i class="icon aufontAll h-icon-all-plane-o"></i>
              {{ $t('languages.Apps.Publish') }}
            </a-button>

            
          </div>
        </div>
        <div class="data-item-tips">
          <span> 模型下的数据项会在数据库中生成字段，创建后可以在表单、流程、列表中使用。 </span>
        </div>
        <div class="table">
          <a-table
            :columns="columns"
            size="small"
            :pagination="false"
            :loading="false"
            :locale="{emptyText: $t('languages.NoRelevantDataTips')}"
            :scroll="{ y: 500 }"
            :dataSource="filterDataItemList"
            id="dataitem"
          >
            <span slot="indexTitle">{{ $t('languages.NO') }}</span>
            <span
              slot="codeTitle"
              class="resize"
            >{{ $t('languages.Apps.Code') }}</span>
            <span
              slot="nameTitle"
              class="resize"
            >{{ $t('languages.Apps.Name') }}</span>
            <span
              slot="propertyNameTitle"
              class="resize"
            >{{ $t('languages.Apps.DataType') }}</span>
            <span
              slot="defaultValueTitle"
              class="resize"
            >{{ $t('languages.Apps.DefaultValue') }}</span>
            <span
              slot="propertyIndexTitle"
              class="resize"
            >{{ $t('languages.Apps.Index') }}</span>
            <span
              slot="propertyEmptyTitle"
              class="resize"
            >{{ $t('languages.Apps.IsEmpty') }}</span>
            <span
              slot="publishedTitle"
              class="resize"
            >{{ $t('languages.Apps.Publish') }}</span>
            <span
              slot="actionTitle"
              class="resize"
            >{{ $t('languages.Apps.Action') }}</span>
            <!-- 数据插槽 -->
            <p
              slot="index"
              slot-scope="text, record"
              v-if="!record.defaultProperty"
            >
              {{ text }}
            </p>
            <p
              slot="code"
              class="text-ellipsis"
              slot-scope="text, record"
              v-if="!record.defaultProperty"
              :title="text"
            >
              <span v-hight-light="{'keyWords': keyWords, 'value': text }">
              </span>
            </p>
            <p
              slot="name"
              class="text-ellipsis"
              slot-scope="text, record"
              v-if="!record.defaultProperty"
            >
              <span v-hight-light="{'keyWords': keyWords, 'value': text }">
              </span>
            </p>
            <span
              slot="propertyTypeName"
              slot-scope="text,record"
              v-if="!record.defaultProperty"
            >
              {{ text }}
            </span>
            <span
              slot="defaultValue"
              slot-scope="text,record"
              v-if="!(record.propertyType===8) && !record.defaultProperty"
            >
              <template v-if="record.propertyType === 3">
                {{ text | formatDate }}
              </template>
              <template v-else-if="record.propertyType === 9">
                {{ record.relativeName ? record.relativeName : '- -' }}
              </template>
              <template v-else>
                {{ text ? text : '- -' }}
              </template>
            </span>
            <span
              slot="propertyIndex"
              slot-scope="text,record"
              v-if="!(record.propertyType===4 || record.propertyType===6 || record.propertyType===7 || record.propertyType===8) && !record.defaultProperty"
            >
              <!-- <a-checkbox :checked="text" class="checkbox"></a-checkbox> -->
              <i v-if="text" class="icon aufontAll h-icon-all-check-circle theme"></i>
              <i v-else class="icon aufontAll h-icon-all-check-circle-o"></i>
            </span>
            <span
              slot="propertyEmpty"
              slot-scope="text,record"
              v-if="!(record.propertyType===4 ||record.propertyType===6 || record.propertyType===7 || record.propertyType===8) && !record.defaultProperty"
            >
              <!-- <a-checkbox :checked="text" class="checkbox"></a-checkbox> -->
              <i v-if="text" class="icon aufontAll h-icon-all-check-circle theme"></i>
              <i v-else class="icon aufontAll h-icon-all-check-circle-o"></i>
            </span>
            <span
              slot="published"
              slot-scope="text,record"
              v-if="!record.defaultProperty"
            >
              <i v-if="text" class="icon aufontAll h-icon-all-check-circle theme"></i>
              <i v-else class="icon aufontAll h-icon-all-check-circle-o"></i>
            </span>
            <span
              class="action right"
              slot="action"
              slot-scope="text,record"
              v-if="record.isSchema && !record.defaultProperty"
            >
              <i class="icon aufontAll h-icon-all-edit-o" @click="editDataItem(record)"></i>
              <i class="icon aufontAll h-icon-all-delete-o" @click="deleDataItem(record)"></i>
            </span>
          </a-table>
        </div>
      </div>
    </template>
    <!-- 增加数据项 -->
    <a-drawer
      :title="modeTitle"
      width="850"
      placement="right"
      @close="onCloseInfoModal"
      :closable="true"
      :visible="infoVisible"
      v-if="infoVisible"
      wrapClassName="user-info-drawer"
    >
      <DataItemBaseModel></DataItemBaseModel>
    </a-drawer>
    <div class="data-item__tips">
      <a-alert
        type="warning"
        v-show="isShowTips"
        message="删除数据项成功，请重新发布表单！"
        showIcon
        closable
        @close="isShowTips = true"
      />
    </div>


    <a-modal
      width="422px"
      title="提示"
      :visible="visible"
      @ok="handleOk"
      @cancel="visible = !visible"
      okText="前往配置"
      cancelText="暂不配置"
      class="config-tips"
      :maskClosable="false"
      :keyboard="false"
    >
      <p>钉钉信息未配置，无法发布</p>
      <p>请前往 <span class="heighlight">系统管理-常规设置</span> 配置钉钉信息
      </p>
    </a-modal>

    <a-modal
      width="552px"
      title="字段排序"
      :visible="rankShow"
      @ok="rank"
      @cancel="close"
      okText="确定"
      cancelText="取消"
      class="rank-modal"
      :maskClosable="false"
      :keyboard="false"
    >
      <!-- <div v-for="(item,index) in filterDataItemList"
      :key="index"
      class="rank-modal-item"
     >
      {{ item.name }}
     </div> -->
      <dataitem-rank
        v-if="rankShow"
        :dataItemList="filterDataItemList"
        @sortEnd="sortEnd"
      />
    </a-modal>
  </div>
</template>
<style lang="less" >
.config-tips {
  p{
    margin-bottom: 8px;
    .heighlight{
      color: @primary-color;
    }
  }
  .rank-modal{
    .rank-modal-item {
      float: left;
    }
  }
}
</style>

<style lang="less" scoped>
  .data-item{
    text-align: center;
    .data-item-tips {
      text-align: left;
      font-size:12px;
      color:rgba(0,0,0,0.45);
      margin-bottom: 2px;
      line-height: 20px;
    }
    &__tips{
      top: 65px;
      right: 50%;
      margin-right: -151.5px;
      width: 303px;
      position: fixed;
      z-index: 800;
    }
    margin: 24px;
    margin-top: 0;
    // height: calc(100vh - 64px);
    position: relative;
    .loading-icon{
      // position: absolute;
      // top: 50%;
      margin-top: 100px;
      // left: 50%;
    }
    .no-data{
      // display: none;
      &>div.no-data-tips{
        margin-top: 143px;
      }
      .tips{
        font-weight:400;
        margin: 24px 0;
      }
      .btn{
        i{
          padding-right: 3px;
        }
      }
      
    }
    .data-item-content{
     
      position: relative;
      .form{
        margin-top: 16px;
        margin-bottom: 16px;
        .input-group{
         /deep/ .del-icon{
            color: rgba(0,0,0,0.25);
          }
          &>div{
            float: left;
          }
          &>div.title{
            margin-right: 8px;
            line-height: 30px;
            i{
              font-size: 14px;
              // margin-right: 6px;
              color: rgba(0, 0, 0, 0.65);
            }
          }
          float: left;
          /deep/ .w320{
            min-width: 320px;
            max-width: 500px;
            margin-right: 24px;
            .ant-select-selection{
              max-height: 60px;
              overflow-x: auto;
            }
          }
          /deep/ .w240{
            width: 240px;
            margin-right: 24px;
          }
        }
        .btn-group{
          float: right;
          .btn{
            margin-right: 8px;
          }
          i{
            font-size: 14px;
          }
        }
      }
      .table{
        // /deep/.ant-table-thead span {
        //   font-weight: 600;
        //   color: rgba(0,0,0,0.65);
        // }
        /deep/ .ant-table-body{
          color: rgba(0,0,0,0.85);
          max-height: calc(100vh - 250px)!important;
          // &::-webkit-scrollbar{
          //   width: 0;
          // }
          table{

            padding: 0;
            tr[data-row-key="id"],tr[data-row-key="name"],tr[data-row-key="createBy"],tr[data-row-key="createByParentId"],tr[data-row-key="ownerId"],
            tr[data-row-key="ownerIdParentId"],tr[data-row-key="createdTime"],tr[data-row-key="modifiedBy"],
            tr[data-row-key="modifiedTime"],tr[data-row-key="runnigInstanceId"],tr[data-row-key*="-id"],tr[data-row-key*="-parentId"]{
              display: none;
            }
            th,td{
              color: rgba(0,0,0,0.85);
              .disableColor{
                color: rgba(0,0,0,0.25);
              }
              .checkbox{
                 cursor: default;
              }
              .ant-checkbox-wrapper:hover .ant-checkbox-inner,.ant-checkbox-wrapper .ant-checkbox-inner{
                border-color: #d9d9d9;
              }
              .ant-checkbox-wrapper .ant-checkbox-checked .ant-checkbox-inner{
                // border: 0;
                border-color: @primary-color;
              }
              // text-align: center !important;
              .noborder{
                border-left: 0;
              }
              .theme,.highlight{
                color: @primary-color;
              }
              .action{
                i{
                  cursor: pointer;
                  &:nth-child(1){
                    padding-right: 17px;
                  }
                }
              }
            }
            .ant-table-row-level-1 td:first-child {
              // transform: translateX(calc(100% - 16px));
              text-align: right !important;
              padding-right: 0;
              span{
                display: none;
              }
            }
            .ant-table-row-level-1{
              .second-td {
                position: relative;
                z-index: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .ant-table-row-level-0 td:first-child{
              position: relative;
              .ant-table-row-expand-icon {
                position: absolute;
                top: calc(50% - 8px);
                left: calc(100% - 16px);
              }
            }
          }
        }
      }
    }
  }
  .select-title{
    font-weight: 400;
    color: rgba(0,0,0,0.45);
    font-size: 14px !important;
  }

  .second-td {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import DataItemBaseModel from './dataitem-modals/dataItemBaseModel.vue';
import Bus from '../../../utils/bus';

import DataitemRank from './dataitem-modals/dataitem-rank.vue'

import { bizpropertyApi }  from '@cloudpivot/api';

import DataModelSummary from '@/components/shared/data-item/summary.vue';

const DataModelModule = namespace('Apps/DataModel');
@Component({
  name: 'dataItem',
  components: { 
    DataItemBaseModel,
    DataitemRank,
    DataModelSummary
  }
})
export default class DataItem extends Vue {
  @Prop({
    type: String
  }) bizSchemaCode!: string

  // @DataModelModule.State('isLoading') isLoading: any;
  @DataModelModule.State('dataItemList') dataItemList: any;

  @DataModelModule.State('filterDataItemList') filterDataItemList: any;

  @DataModelModule.State('dataItemTypeList') dataItemTypeList: any;

  // 数据项类型
  @DataModelModule.State('bizPropertyModel') bizPropertyModel: any;

  // 新增数据项
  @DataModelModule.State('bizSchemaModelList') bizSchemaModelList: any;

  @DataModelModule.State('summaryList') summaryList:any;

  @DataModelModule.State('targetSummary') targetSummary:any;

  @DataModelModule.State('defaultSummary') defaultSummary:any;

  @DataModelModule.Mutation('setFilterDataItemList') setFilterDataItemList: any;

  @DataModelModule.Mutation('setBizSchemaCode') setBizSchemaCodeX: any;

  @DataModelModule.Mutation('setBizPropertyCode') setBizPropertyCodeX: any;

  @DataModelModule.Mutation('setCurrenEdittMode') setEditMode: any;

  // 编辑或新增模式
  @DataModelModule.Mutation('setDrawerVisible') setDrawerVisible: any;

  @DataModelModule.Mutation('setLang') setLang: any;

  // drawer显示隐藏
  @DataModelModule.Mutation('setSummary') setSummaryX: any;

  @DataModelModule.Mutation('setKeyWords') setKeyWords: any;

  @DataModelModule.Action('deleteDataItem') deleteDataItemX: any;

  @DataModelModule.Action('forceDeleteDataItem') forceDeleteDataItemX: any;

  @DataModelModule.Action('getDataItemList') getDataItemListX: any;

  @DataModelModule.Action('publishDataItem') publishDataItemX: any;

  @DataModelModule.Action('getDataItemType') getDataItemType: any;

  @DataModelModule.Action('getBussinessType') getBussinessType: any;

  @DataModelModule.Action('getSummary') getSummaryX: any;

  @DataModelModule.Action('submitSummary') submitSummaryX: any;

  get defaultSummaryList() {
    return this.summaryList.filter((data:any) => data.defaultProperty);
  }

  get bizSummaryList() {
    return this.summaryList.filter((data:any) => !data.defaultProperty && data.propertyType !== 10 && data.published);
  }

  @Watch('infoVisible', { deep: true })
  setInfoVisible(v: boolean) {
    // console.info('000___', v);
    this.setDrawerVisible(v);
  }

  keyWords:string = '';

  infoVisible: boolean = false;

  isLoading:boolean = true;

  modeTitle:string = '';

  defaultVal:Array<string> = [];

  isShowTips: boolean = false;

  visible: boolean = false;

  rankShow = false;

  isUpdate: boolean = true; // 是否更新组件


  // 表格配置
  columns:Array<Common.TableHead>= [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: 100,
      key: 'index',
      align: 'center',
    },
    {
      dataIndex: 'code',
      key: 'code',
      slots: { title: 'codeTitle' },
      scopedSlots: {
        customRender: 'code'
      },
      align: 'left',
      width: 300
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: {
        customRender: 'name'
      },
      key: 'name',
      align: 'left',
      width: 250
    },
    {
      dataIndex: 'propertyTypeName',
      slots: { title: 'propertyNameTitle' },
      scopedSlots: { customRender: 'propertyTypeName' },
      width: 140,
      key: 'propertyTypeName',
      align: 'left'
    },
    {
      dataIndex: 'defaultValue',
      slots: { title: 'defaultValueTitle' },
      scopedSlots: { customRender: 'defaultValue' },
      key: 'defaultValue',
      width: 200,
      align: 'left'
    },
    {
      dataIndex: 'propertyIndex',
      slots: { title: 'propertyIndexTitle' },
      scopedSlots: { customRender: 'propertyIndex' },
      width: 100,
      key: 'propertyIndex',
      align: 'center',
    },
    {
      dataIndex: 'propertyEmpty',
      slots: { title: 'propertyEmptyTitle' },
      scopedSlots: { customRender: 'propertyEmpty' },
      width: 120,
      key: 'propertyEmpty',
      align: 'center',
    },
    {
      dataIndex: 'published',
      slots: { title: 'publishedTitle' },
      scopedSlots: { customRender: 'published' },
      width: 100,
      key: 'published',
      align: 'center',
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      width: 120,
      key: 'action',
      align: 'right',
    }
  ];

  doRank() {
    this.rankShow = true;
    this.rankList =  this.filterDataItemList.map((res:any) => res.code)
  }

  rank() {
    const vm:any = this;
    const params = {
      schemaCode: this.bizSchemaCode,
      codes: this.rankList.join(',') as string
    }
    bizpropertyApi.sortkeys(params).then(res => {
      if(res.errcode === 0) {
        vm.rankShow = false;
        vm.getDataItemListX().then(() => { // 删除数据后刷新例表
          vm.filterList();
          vm.isLoading = false;
        });
      } else {
        vm.$message.error(res.errmsg);
      }
    })
  }
  
  rankList:string[] = [];
  sortEnd(list:string[]) {
    if(list.length > 0) {
      this.rankList = list;
    }
  }

  close() {
    this.rankShow = false;
    this.rankList = [];
  }

  // 生命周期
  created() {
    this.setBizSchemaCodeX(this.bizSchemaCode);
    this.getDataItemListX().then(() => {
      this.filterList(); // 对请求到数据过滤
      this.isLoading = false;
    });
    this.getDataItemType();
    // this.getBussinessType(); // 业务类型
    this.getSummaryX(); // 获取摘要
  }

  mounted() {
    Bus.$on('isAddContinue', (v: any) => {
      this.infoVisible = !!v; // 数据项是按下【保存】false 还是【保存继续】true
    });
  }

  beforeDestroy() {
    Bus.$off('isAddContinue');
  }

  // 方法
  clearKeyWords() {
    this.keyWords = '';
    this.filterList();
    this.setKeyWords('');
  }

  // 删除数据项
  deleDataItem(e:any) {
    const vm:any = this;
    const { published } = e;
    const content = published ? this.$t('languages.Apps.DeleteTipsContent') : '';
    vm.$confirm({
      title: this.$t('languages.Apps.DeleteTips', { name: e.name }),
      content,
      okText: this.$t('languages.Ok').toString(),
      cancelText: this.$t('languages.Cancel').toString(),
      onOk() {
        if (published) {
          vm.deletePublish(e);
        } else {
          vm.doForceDelete(e);
        }
      }
    });
  }

  /**
   * 删除已发布数据项
   */
  deletePublish(e:any) {
    const vm:any = this;
    const { published } = e;
    vm.deleteDataItemX(e.code).then((res: any) => {
      if (res.errcode === 0) { // 数据项没有关联后台数据
        vm.doDeleteTips(published);
        vm.getSummaryX(); // 跟新摘要
        vm.getDataItemListX().then(() => { // 删除数据后刷新例表
          vm.filterList();
          vm.isLoading = false;
        });
      } else if (res.errcode === 10022) { // 已近关联相关数据
        vm.forceDeleteDataItem(e, res.data);
      } else { // 数据项关联后台数据
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  /**
   *  强制删除api
   */
  doForceDelete(e:any) {
    const { published } = e;
    const vm:any = this;
    vm.forceDeleteDataItemX(e.code).then((res:any) => {
      if (!res.errcode) {
        vm.doDeleteTips(published);
        vm.getDataItemListX().then(() => { // 删除数据后刷新例表
          vm.filterList();
          vm.isLoading = false;
        });
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  // 强制删除数据项
  forceDeleteDataItem(e:any, count:number) {
    const vm:any = this;
    vm.$confirm({
      title: this.$t('languages.Apps.DeleteTips', { name: e.name }),
      content: this.$t('languages.Apps.DeleteDataTips', { count }),
      okText: this.$t('languages.Ok').toString(),
      cancelText: this.$t('languages.Cancel').toString(),
      onOk() {
        vm.doForceDelete(e);
      }
    });
  }

  /**
   * 删除数据项提示
   */
  doDeleteTips(published: boolean) {
    if (published) {
      this.isShowTips = true;
    } else {
      this.$message.success(this.$t('languages.DeleteSuccess'), 2);
    }
  }

  // 发布数据项
  publishDataItem() {
    const that: any = this;
    if (!this.targetSummary.length) {
      that.$message.info(this.$t('languages.Apps.SummaryEmptyTips'), 2);
      return;
    }
    this.publishDataItemX().then((res:any) => {
      if (!res.errcode) {
        that.$message.success(this.$t('languages.PublishSuccess'), 2);
        that.getDataItemListX().then(() => { // 发布完数据项刷新列表
          that.filterList();
          /* 刷新组件 */
          that.isUpdate = false;  // 移除组件
          // 在组件移除后，重新渲染组件 
          that.$nextTick(() => {
              that.isUpdate = true;
          });
          that.isLoading = false;
        });
      } else if (+res.errcode === 10013) {
        that.visible = true;
      } else {
        // debugger;
        that.$message.error(res.errmsg, 2);
      }
    });
  }

  /**
   *  未配置钉钉信息
   */
  handleOk() {
    this.$router.push({
      name: 'commonSetting'
    });
  }

  // 编辑数据项
  editDataItem(e:any) {
    const str:any = this.$t('languages.Apps.EditDataItem');
    this.setBizPropertyCodeX(e.code);
    this.infoVisible = true;
    this.setEditMode('edit'); // edit or add
    this.modeTitle = str;
  }

  // drawer关闭
  onCloseInfoModal() {
    console.log('drawer关闭');
    this.infoVisible = false;
    this.setEditMode('unknow');
    this.setBizPropertyCodeX('');
  }

  addDataItem() {
    const str:any = this.$t('languages.Apps.AddDataItem');
    this.infoVisible = true;
    console.info('0000', this.infoVisible);
    this.setEditMode('add'); // edit or add
    this.setBizPropertyCodeX('');
    this.modeTitle = str;
  }

  // 过滤
  filterList() {
    const that = this;
    setTimeout(() => {
      this.setFilterDataItemList(that.keyWords);
      this.setKeyWords(that.keyWords);
    }, 200);
  }

  // 摘要选择
  summaryChange(val:Array<string>) {
    // debugger
    this.setSummaryX(val);
    this.submitSummaryX();
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setLang();
    // this.lang = localStorage.getItem('locale') || 'zh';
  }
}
</script>
