<template>
  <div class="login-log">
    <div class="login-log__header">
      <div class="clearfix">
        <smart-search @reset="resetParams" @search="query">
          <div slot="search">
            <div class="header__item">
              <span>登录时间:</span>
              <a-range-picker
                class="w"
                :placeholder="['开始时间','结束时间']"
                v-model="params.loginTime"
              />
            </div>
            <div class="header__item">
              <span>登录来源:</span>
              <a-select
                class="login-log__select w"
                v-model="params.loginSourceType"
              >
                <a-select-option
                  v-for="(item, index) in loginSource"
                  :key="index"
                  :value="item.type"
                >{{ item.source }}</a-select-option>
              </a-select>
            </div>
            <div class="header__item">
              <span>用户姓名:</span>
              <staff-selector
                class="w staff-selector-adjust"
                :options="staffSelectorOpts"
                v-model="params.name"
              ></staff-selector>
            </div>

            <div class="header__item">
              <span>ip地址:</span>
              <a-input class="w" v-model="params.ipAddress"/>
            </div>
          </div>
        </smart-search>
      </div>
    </div>
    <div class="login-log__content">
      <div>
        <a-table
          :columns="columns"
          size="small"
          :pagination="false"
          :loading="false"
          :locale="{emptyText: $t('languages.NoRelevantData')}"
          :scroll="{ y: 500 }"
          :dataSource="dataSource"
          rowKey="id"
          class="table"
        >
          <span slot="indexTitle">{{ $t('languages.NO') }}</span>
          <span slot="nameTitle" class="text-ellipsis resize">用户姓名</span>
          <span slot="usernameTitle" class="text-ellipsis resize">用户账号</span>
          <span slot="loginSourceTypeTitle" class="text-ellipsis resize">登录来源</span>
          <span slot="loginTimeTitle" class="text-ellipsis resize">登录时间</span>
          <span slot="browserTitle" class="text-ellipsis resize">浏览器</span>
          <span slot="ipAddressTitle" class="text-ellipsis resize">ip地址</span>

          <span
            class="action right text-ellipsis"
            slot="loginSourceType"
            slot-scope="text, record"
          >
            <span v-if="text === 1">PC门户</span>
            <span v-if="text === 2">钉钉平台</span>
            <span v-if="text === 3">移动平台</span>
            <span v-if="text === 4">其它</span>
          </span>

          <span
            class="action right text-ellipsis"
            slot="browser"
            slot-scope="text, record"
            :title="text"
          >{{ text }}</span>
          <span
            class="action right text-ellipsis"
            slot="ipAddress"
            slot-scope="text, record"
          >{{ text }}</span>

          <span
            class="action right text-ellipsis"
            slot="loginSource"
            slot-scope="text, record"
          >{{ text }}</span>

          <span
            class="action right text-ellipsis"
            slot="loginTime"
            slot-scope="text, record"
          >{{ text }}</span>

          <span
            class="action right text-ellipsis"
            slot="username"
            slot-scope="text, record"
          >{{ text }}</span>
        </a-table>
      </div>
    </div>

    <div class="login-log__footer">
      <div>
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
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';

import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';

import systemApi from '@/apis/system/system-manager.api';

import SmartSearch from '@/components/global/smart-search.vue';


@Component({
  name: 'login-log',
  components: {
    StaffSelector,
    SmartSearch
  }
})

export default class LoginLog extends Vue {
  isShow: boolean = false;

  loginSource = [
    {
      source: '全部',
      type: 0
    },
    {
      source: 'PC门户',
      type: 1
    },
    {
      source: '钉钉平台',
      type: 2
    },
    {
      source: '移动平台',
      type: 3
    },
    {
      source: '其他',
      type: 4
    }
  ]

  pageSizeOptions: Array<string> = [
    '10',
    '20',
    '50',
    '100'
  ]

  // 选人
  staffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    showModel: true,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择'
  }

  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: 60,
      key: 'index',
      align: 'center',
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      width: '16%',
      key: 'name'
    },

    {
      dataIndex: 'username',
      slots: { title: 'usernameTitle' },
      scopedSlots: { customRender: 'username' },
      width: '16%',
      key: 'username'
    },
    // 登录源
    {
      dataIndex: 'loginSourceType',
      slots: { title: 'loginSourceTypeTitle' },
      scopedSlots: { customRender: 'loginSourceType' },
      width: '16%',
      key: 'loginSourceType'
    },
    // 登录时间
    {
      dataIndex: 'loginTime',
      slots: { title: 'loginTimeTitle' },
      scopedSlots: { customRender: 'loginTime' },
      width: '16%',
      key: 'loginTime'
    },
    // 浏览器
    {
      dataIndex: 'browser',
      slots: { title: 'browserTitle' },
      scopedSlots: { customRender: 'browser' },
      key: 'browser',
      width: '16%',
    },
    // ip地址
    {
      dataIndex: 'ipAddress',
      slots: { title: 'ipAddressTitle' },
      scopedSlots: { customRender: 'ipAddress' },
      key: 'ipAddress'
    }
  ]

  dataSource = [];

  totalPage: number = 0; // 分页

  params: any = {
    loginTime: [],
    loginSourceType: 0,
    name: [],
    ipAddress: '',
    page: 0,
    size: 20
  }

  created() {
    const data:any = moment(new Date());
    this.params.loginTime = [data, data];
    this.getLoginLogList();
  }

  query() {
    this.params.page = 0;
    this.getLoginLogList();
  }

  resetParams() {
    this.params.name = [];
    const data:any = moment(new Date());
    this.params.loginTime = [data, data];
    this.params.loginSourceType = 0;
    this.params.ipAddress = '';
    this.getLoginLogList();
  }

  switchShow() {
    this.isShow = !this.isShow;
  }

  getLoginLogList() {
    const vm: any = this;
    const params = {
      startTime: '',
      endTime: '',
      name: '',
      ipAddress: vm.params.ipAddress,
      loginSourceType: vm.params.loginSourceType,
      page: vm.params.page,
      size: vm.params.size
    };

    if (vm.params.loginTime.length > 0) {
      const timer = vm.params.loginTime;
      params.startTime = moment(timer[0]).format('YYYY-MM-DD');
      params.endTime = moment(timer[1]).format('YYYY-MM-DD');
    }

    if (vm.params.name.length > 0) {
      params.name = vm.params.name.map((item: any) => item.name).join(',');
    }

    systemApi.getLoginLog(params).then((res: any) => {
      vm.dataSource = res.data.content;
      vm.dataSource.forEach((item: any, index: number) => {
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
    this.getLoginLogList();
  }

  /**
   * 修改分页大小
   */
  pageSizeChange(current: number, pageSize: number) {
    this.params.page = 0;
    this.params.size = pageSize;
    this.getLoginLogList();
  }

  /**
   * 选人控件placeholder多语言
   */
  placeHolderLang() {
    this.staffSelectorOpts.placeholder = this.$t('Languages.Apps.PlzSelect') as string;
  }

  // 日期控件国际化
  @Watch('$i18n.locale')
  onLanguageChange(val: any) {
    this.placeHolderLang();
  }
}
</script>
<style lang="less" scoped>
.login-log {
  &__header {
    & > div {
      margin: 0 -23px;
      // height: 40px;
      // overflow: hidden;
      .header__item {
        height: 32px;
        margin-bottom: 16px;
        margin-right: 16px;
        float: left;
        font-size: 0;
        > span:first-child {
          display: inline-block;
          vertical-align: middle;
          min-width: 4.2em;
          // line-height: 32px;
          font-size: 14px;
        }
        .w {
          width: 216px;
          margin-left: 8px;
          display: inline-block;
          vertical-align: middle;
        }
        .staff-selector-adjust {
          width: auto!important;
          min-width: 216px;
        }
      }
    }
    .active {
      height: 100px;
    }
  }
  &__content {
    margin-top: 16px;
    // & > div {
    // }
    // /deep/.ant-table-thead span {
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    /deep/.ant-table-body {
      // max-height: 600px !important;
      color: rgba(0, 0, 0, 0.85);
      max-height: calc(100vh - 260px) !important;
      height: calc(100vh - 260px) !important;
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
    border-top: 1px solid rgba(232, 232, 232, 1);
    & > div {
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
  /deep/.ant-pagination-total-text{
    margin-right: @base4-padding-md;
  }
  // 解决外部 .resize display：inline-block 时，引起的表头高度错误问题
  span.resize {
    display: block !important;
  }
}
</style>
