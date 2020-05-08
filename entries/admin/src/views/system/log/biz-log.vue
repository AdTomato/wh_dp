<template>
  <div class="biz-log">
    <div class="biz-log__header clearfix">
      <smart-search @reset="resetParams" @search="query">
        <div slot="search">
          <div class="search clearfix">
            <span>业务服务编码:</span>
            <a-input
              v-model.trim="params.code"
              class="w"
              placeholder="请输入"
            />
          </div>

          <div class="search clearfix">
            <span>方法名称:</span>
            <a-input
              v-model.trim="params.methodName"
              class="w"
              placeholder="请输入"
            />
          </div>

          <div class="search clearfix">
            <span>开始时间:</span>
            <a-range-picker
              class="w"
              :placeholder="['开始时间','结束时间']"
              v-model="params.queryTime"
            />
          </div>
        </div>

        <!-- <div class="button clearfix">
          <a-button type="primary" @click="getBizLogList">查询</a-button>
          <a-button @click="resetParams">重置</a-button>
        </div> -->
      </smart-search>
    </div>

    <div class="biz-log__content">
      <a-table
        :columns="columns"
        size="small"
        :pagination="false"
        :loading="false"
        :locale="{emptyText: $t('languages.NoRelevantData')}"
        :scroll="{ y: 500 }"
        :dataSource="dataSource"
        rowKey="id"
      >
        <span slot="indexTitle">{{ $t('languages.NO') }}</span>
        <span slot="codeTitle" class="resize">业务服务编码</span>
        <span slot="nameTitle" class="resize">方法名称</span>
        <span slot="bizServiceStatusTitle" class="resize">是否成功</span>
        <span slot="startTimeTitle" class="resize">开始时间</span>
        <span slot="endTimeTitle" class="resize">结束时间</span>
        <span slot="usedTimeTitle" class="resize">耗时（毫秒）</span>
        <span slot="actionTitle" class="resize">调用信息</span>

        <p
          slot="bizServiceStatus"
          slot-scope="text"
        >
          <span>{{ `${text}` === '1' ? '失败' : '成功' }}</span>
        </p>

        <span
          slot="startTime"
          slot-scope="text"
          class="text-ellipsis">{{ text }}</span>

        <span
          slot="endTime"
          slot-scope="text"
          class="text-ellipsis">{{ text }}</span>

        <a
          href="javascript:void(0)"
          slot="action"
          slot-scope="text, record"
          class="biz-log__link"
          @click="openBizLogInfo(record)"
        >
          打开
        </a>

      </a-table>
    </div>
    <div class="biz-log__footer">
      <div v-show="totalPage > 0">
        <a-pagination
          :defaultPageSize="params.size"
          :total="totalPage"
          :showTotal="total => `共${totalPage}条`"
          :current="params.page + 1"
          :pageSizeOptions="pageSizeOptions"
          showSizeChanger
          showQuickJumper
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        />
      </div>
    </div>
    <!-- 业务服务日志调用信息 -->
    <a-drawer
      wrapClassName="bizlog-info-drawer"
      width="850"
      title="调用信息"
      placement="right"
      v-if="showBizlogInfo"
      :visible="showBizlogInfo"
      :closable="true"
      :destroyOnClose="true"
      @close="closeBizlogInfo"
    >
      <bizlog-info @close="closeBizlogInfo" :bizInfo="bizInfo"/>
    </a-drawer>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';

import systemApi from '@/apis/system/system-manager.api';

import SmartSearch from '@/components/global/smart-search.vue';

import BizlogInfo from './bizlog-info.vue';

@Component({
  name: 'biz-log',
  components: {
    BizlogInfo,
    SmartSearch,
  }
})

export default class BizLog extends Vue {
  columns: Array<Common.TableHead> = [
    // 序号
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: 60,
      key: 'index',
      align: 'center',
    },
    // 业务服务编码
    {
      dataIndex: 'code',
      slots: { title: 'codeTitle' },
      scopedSlots: { customRender: 'code' },
      key: 'code',
      width: '13%',
    },
    // 业务方法
    {
      dataIndex: 'methodName',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      key: 'methodName',
      width: '13%',
    },
    // 是否成功
    {
      dataIndex: 'bizServiceStatus',
      slots: { title: 'bizServiceStatusTitle' },
      scopedSlots: { customRender: 'bizServiceStatus' },
      width: '13%',
      key: 'bizServiceStatus'
    },
    // 开始时间
    {
      dataIndex: 'startTime',
      slots: { title: 'startTimeTitle' },
      scopedSlots: { customRender: 'startTime' },
      key: 'startTime',
      align: 'left',
    },
    // 结束时间
    {
      dataIndex: 'endTime',
      slots: { title: 'endTimeTitle' },
      scopedSlots: { customRender: 'endTime' },
      // width: '13%',
      key: 'endTime',
      align: 'left',
    },
    // 耗时
    {
      dataIndex: 'usedTime',
      slots: { title: 'usedTimeTitle' },
      scopedSlots: { customRender: 'usedTime' },
      width: '13%',
      key: 'usedTime',
      align: 'left',
    },
    // 调用信息
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      key: 'action',
      width: '13%',
      align: 'left',
    },
  ]

   pageSizeOptions: Array<string> = [
     '10',
     '20',
     '50',
     '100'
   ]

  params:any = {
    queryTime: [],
    methodName: '',
    code: '',
    page: 0,
    size: 20
  }

  dataSource = [];

  totalPage: number = 0;

  showBizlogInfo: boolean = false;

  bizInfo: object = {};

  created() {
    this.getBizLogList();
  }

  /**
   * 打开日志详情
   */
  async openBizLogInfo(bizInfo: any) {
    if (bizInfo.callObject) {
      this.bizInfo = bizInfo;
    } else {
      this.bizInfo = await this.getCallInfo(bizInfo);
    }
    this.showBizlogInfo = true;
  }

  /**
   * 获取业务服务日志调用信息
   */
  async getCallInfo(bizInfo: any) {
    let { bizObjectId, schemaCode } = bizInfo;
    console.log('cccc', bizInfo);
    schemaCode = schemaCode.replace('- -','');
    if (!schemaCode) {
      return bizInfo;
    }
    if (bizObjectId) {
      bizObjectId = bizObjectId.replace('- -','');
    }
    const params: BPM.System.GetBizLogCallParams = {
      schemaCode,
      bizObjectId
    };
    const res: any = await systemApi.getBizLogReference(params)
    if (res.errcode === 0) {
      bizInfo.callObject = res.data;
    }
    return bizInfo;
  }

  /**
   * 关闭业务服务日志调用信息
   */
  closeBizlogInfo() {
    this.showBizlogInfo = false;
    this.bizInfo = {};
  }

  /**
   * 重置
   */
  resetParams() {
    this.params.methodName = '';
    this.params.queryTime = [];
    this.params.code = '';
    this.getBizLogList();
  }
  query() {
    this.params.page = 0;
    this.getBizLogList();
  }
  /**
   * 获取列表
   */
  getBizLogList() {
    const vm: any = this;
    const params = {
      startTime: '',
      endTime: '',
      code: vm.params.code,
      methodName: vm.params.methodName,
      page: vm.params.page,
      size: vm.params.size
    };
    if (vm.params.queryTime.length > 0) {
      const timer = vm.params.queryTime;
      params.startTime = moment(timer[0]).format('YYYY-MM-DD');
      params.endTime = moment(timer[1]).format('YYYY-MM-DD');
    }

    systemApi.getBizLog(params).then((res:any) => {
      vm.dataSource = res.data.content;
      vm.dataSource.forEach((item:any, index:number) => {
        item.index = index + 1 + params.page * params.size;
        Object.entries(item).forEach((data:any) => {
          const [key, value] = data;
          if (typeof value !== 'boolean' && !value) {
            item[key] = '- -';
          }
        });
      });
      vm.totalPage = res.data.totalElements;
    });
  }

  // 分页 page change 回调
  pageChange(page: number, pageSize: number) {
    this.params.page = page - 1;
    this.params.size = pageSize;
    this.getBizLogList();
  }

  /**
   * 修改分页大小
   */
  pageSizeChange(current: number, pageSize: number) {
    this.params.page = 0;
    this.params.size = pageSize;
    this.getBizLogList();
  }
}

</script>
<style lang="less" scoped>
.biz-log{
  &__header{
    & > div {
      margin: 0 -23px;
    }
    .search{
      float: left;
      height: 32px;
      margin-bottom: 16px;
      margin-right: 16px;
      > span:first-child {
        display: inline-block;
        vertical-align: middle;
        min-width: 4.2em;
        font-size: 14px;
      }
      .w{
        display: inline-block;
        vertical-align: middle;
        width: 216px;
        margin-left: 8px;
      }
    }
    .button{
      float: right;
      button{
        margin-left: 8px;
      }
    }
  }
  &__content {
    margin-top: 14px;
    // /deep/.ant-table-thead span {
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    /deep/.ant-table-body{
      color: rgba(0,0,0,0.85);
      // max-height: 600px !important;
      max-height: calc(100vh - 255px)!important;
      height: calc(100vh - 255px)!important;
      /deep/.ant-table-row:last-child td {
        border-bottom: none !important;
      }
      // max-height: calc(100vh - 300px)!important;
      // @media screen and (min-width: 1670px) {
      // }
    }
  }
  &__footer {
    margin-left: -23px;
    margin-right: -23px;
    border-top: 1px solid rgba(232,232,232,1);
    &>div{
      float: right;
      padding: 8px 0;
      margin-right: 24px;
    }
    /deep/.ant-pagination-options-quick-jumper input {
      vertical-align: top;
    }
    /deep/.ant-pagination-options{
      height: 32px;
    }
  }
  &__link {
    color: @primary-color;
  }
  /deep/.ant-pagination-total-text{
    margin-right: @base4-padding-md;
  }
}
</style>
