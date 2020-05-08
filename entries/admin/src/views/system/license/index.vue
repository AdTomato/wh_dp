<template>
  <div class="license">
    <div class="license-header">
      <span>系统信息</span>
    </div>
    <div class="license-content">
      <div class="license-form">

        <a-row class="license-item">
          <a-col :span="layout.left" class="license-left">
            <span>当前版本号:</span>
          </a-col>
          <a-col :span="layout.right" class="license-right">
            <span>{{ licenseInfo.systemVersion }}</span>
          </a-col>
        </a-row>

        <a-row class="license-item">
          <a-col :span="layout.left" class="license-left">
            <span>机器码:</span>
          </a-col>
          <a-col :span="layout.right" class="license-right">
            <span>{{ licenseInfo.machineCodeList }}</span>
          </a-col>
        </a-row>

        <a-row class="license-item">
          <a-col :span="layout.left" class="license-left">
            <span>授权用户数:</span>
          </a-col>
          <a-col :span="layout.right" class="license-right">
            <span>{{ licenseInfo.uesrNumber }}</span>
            <a-button
              v-if="isShowAuBtn"
              @click="showAuthDrawer"
              type="primary"
              class="au-btn">授权用户管理</a-button>
          </a-col>
        </a-row>

        <a-row class="license-item">
          <a-col :span="layout.left" class="license-left">
            <span>有效期:</span>
          </a-col>
          <a-col :span="layout.right" class="license-right">
            <span>{{ licenseInfo.expiration }}</span>
          </a-col>
        </a-row>

        <a-row class="license-item">
          <a-col :span="layout.left" class="license-left">
            <span>授权时间戳:</span>
          </a-col>
          <a-col :span="layout.right" class="license-right">
            <span>{{ licenseInfo.certificate }}</span>
          </a-col>
        </a-row>

        <a-row class="license-item">
          <a-col :span="layout.left" class="license-left">
            <span>更新日志:</span>
          </a-col>
          <a-col :span="layout.right" class="license-right">
            <a :href="licenseInfo.updateLogUrl" target="_blank">{{ licenseInfo.updateLogUrl }}</a>
            <!-- <span>{{ licenseInfo.certificate }}</span> -->
          </a-col>
        </a-row>
      </div>
    </div>

    <a-drawer
      title="用户授权管理"
      width="850px"
      :visible="isShowAuthorization"
      wrapClassName="au-wrapper" 
      @close="onCancel"
      :destroyOnClose="true"
    >
      <div class="au-box">
        <p v-if="isOver" class="over">
          检测到您当前授权用户数超过限制（最大限制{{ permObj.maxAuthorizedUserNum }}人，当前{{ permObj.authorizedUserNum }}人，超出{{ permObj.authorizedUserNum - permObj.maxAuthorizedUserNum }}人），系统已经停止服务，减少授权用户数后才能恢复服务
        </p>
        <p v-else>当前允许登录用户数为{{ permObj.authorizedUserNum }}人，没有超过最大授权用户数，使用正常</p>

        <div class="au-type">
          <div class="au-type-label gray">授权模式</div>
          <div class="au-type-item">
            <a-radio-group @change="onTypeChange" v-model="permObj.permMode">
              <a-radio value="ALL">允许全部用户登录</a-radio>
              <a-radio value="PART">允许部分用户登录</a-radio>
            </a-radio-group>
          </div>
        </div>

        <div class="choose-part" v-show="!isAllowAll">
          <div class="choose-item">
            <div class="choose-label gray">选择角色</div>
            <div class="choose-con">
              <role-select
                :defaultValue="roleDisplay"
                @select="selectRole"
                :multiple="true"
                filterKey="code"
              ></role-select>
            </div>
          </div>
          <!-- 拆成2个  部门  人员 -->
          <div class="choose-item">
            <div class="choose-label gray">选择部门</div>
            <div class="choose-con">
              <staff-selector
                v-model="dept"
                :options="taffSelectorOptsDept"
              ></staff-selector>
            </div>
          </div>

          <div class="choose-item">
            <div class="choose-label gray">选择人员</div>
            <div class="choose-con">
              <staff-selector
                v-model="member"
                :options="taffSelectorOptsMb"
                @change="test"
              ></staff-selector>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" @click="onOk">{{ isAllowAll ? '保存' : '更新授权' }}</a-button>
      </div>
    </a-drawer>

    <a-modal
      v-model="importVisible"
      width="550px"
      height="378px"
      :title="`${permObj.permMode === 'ALL' ? '全部': '部分'}授权执行`"
      :footer="null"
      @cancel="closeAuModal"
      :maskClosable="false"
      :closable="isShowCloseIcon"
    >
      <div class="import-progress">
        <div>
          <a-progress
            type="circle"
            :percent="importPercent"
            :width="100"
            :status="progressStatus"
          ></a-progress>

          <div class="note">{{ auStatus }}</div>

          <div class="import-hint">{{ auHint }}</div>
        </div>
      </div>
    </a-modal>

  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import systemApi from '@/apis/system/system-manager.api';

import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';
import common from '@cloudpivot/common'

@Component({
  name: 'license',
  components: {
    StaffSelector,
    RoleSelect: common.components.pc.RoleSelect
  }
})
export default class License extends Vue {
  layout = {
    left: 3,
    right: 10
  };

  licenseInfo:any = {};

  isShowAuthorization:boolean = false;

  auType:any = 'all';

  role:any = '';
  
  roleDisplay:any = '';

  dept:any = '';

  member:any = '';

  importPercent:number = 0;

  progressStatus:string = 'active';

  importVisible:boolean = false;

  timer:any = '';

  isShowCloseIcon:boolean = false; // 授权过程是否可以关闭

  isShowAuBtn:boolean = false;

  // 选人控件配置项
  taffSelectorOptsDept = {
    selectOrg: true,
    selectUser: false,
    showModel: false,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择部门'
  }

  taffSelectorOptsMb = {
    selectOrg: false,
    selectUser: true,
    showModel: false,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择人员'
  }

  permObj:any = {};

  auHint:string = '当前正在执行批量授权，不可中断关闭页面后仍然会在后台执行';

  auStatus:string = '授权中';

  simulateInterval:any= '';

  isImportEnd:boolean = false;

  // 是否全部允许
  get isAllowAll(){
    return this.permObj.permMode === 'ALL';
  }

  get isOver(){
    const { authorizedUserNum, maxAuthorizedUserNum } = this.permObj;
    return authorizedUserNum > maxAuthorizedUserNum;
  }

  created() {
    this.getLicenseInfo();
    this.getAuGateway();
  }

  getLicenseInfo() {
    systemApi.getLicenseInfo().then((res:any) => {
      if (!res.errcode && res.data) {
        if (Array.isArray(res.data.machineCodeList)) {
          res.data.machineCodeList = res.data.machineCodeList.join(',');
        }
        this.licenseInfo = res.data;
      }
    });
  }

  // 获取用户权限
  async getAuGateway(){
    const res:any = await systemApi.getAuGateway();
    if (res.errcode === 0)  {
      this.isShowAuBtn = res.data.enabled;
    }
  }

  closeAuModal(){
    this.importVisible = false;
    this.isImportEnd = false;
    this.progressStatus = 'active';
    this.auHint = '当前正在执行批量授权，不可中断关闭页面后仍然会在后台执行';
    this.auStatus = '授权中';
    this.importPercent = 0;

    clearTimeout(this.timer);
    clearInterval(this.simulateInterval);
  }


  // 授权模式变化
  onTypeChange(){}

  // 选择角色
  selectRole(roles:any){
    if (roles) {
      this.role = roles.map((role:any) => role.code);
    }
  }

  test(e){
    console.log(e);
  }

  // 展示抽屉
  showAuthDrawer(){
    this.isShowAuthorization = true;
  }

  onCancel(){
    this.isShowAuthorization = false;

    this.roleDisplay = [];
    this.dept = '';
    this.role = '';
    this.member = '';
  }

  paramsFormator(){
    const { role, dept, member } = this;
    const { permMode } = this.permObj;
    const authDeparts = dept ? dept.map((item:any) => item.id) : [];
    const authRoles = role ? role : [];
    const authUsers = member ? member.map((item:any) => item.id) : [];
    const params:BPM.System.PermParams = {
      authDeparts,
      authRoles,
      authUsers,
      permMode: permMode
    }

    return params;
  } 

  async submit(){
    const params:BPM.System.PermParams = this.paramsFormator() as BPM.System.PermParams;
    const res = await systemApi.setPermInfo(params);
    if (res.errcode === 0) {
      this.isImportEnd = true;
      this.progressStatus = 'success';
      this.auHint = '';
      this.auStatus = '授权完成';
      this.importPercent = 100;

      clearTimeout(this.timer);
      this.isShowCloseIcon = true;

      this.getPermInfo();
    } else {
      this.isImportEnd = true;
      this.progressStatus = 'exception';
      this.auHint = res.errcode === 601009 ? '当前选择人数是超出最大限制，请重新选择！' : '网络异常授权失败，请重新执行授权';
      this.auStatus = '';
      this.importPercent = 75;

      clearTimeout(this.timer);
      this.isShowCloseIcon = true;
    }
  }

  /**
   * 产生随机整数
  */
  random(num: number) {
    return Math.ceil(Math.random() * 5);
  }

  /**
   * 模拟导入处理进度
   */
  simulateImport() {
    let percent = 1;
    this.simulateInterval = setInterval(() => {
      if (!this.isImportEnd) {
        if (percent <= 90) {
          percent += this.random(10);
          this.importPercent = percent;
        }
      } else {
        clearInterval(this.simulateInterval);
      }
    }, 500);
  }

  async onOk(){
    const _this = this;
    const hint:string = this.permObj.permMode === 'ALL' ? '全部' : '部分';
    this.$confirm({
      title: `确定执行${hint}授权吗？执行后，只允许授权人员登录`,
      content: '当前组织人员较多时，授权需持续一段时间，请耐心等待',
      onOk() {
        _this.importVisible = true;
        _this.simulateImport();
        _this.timer = setTimeout(() => {
          _this.submit();
        }, 3000);
      },
    });
  }
  
  // 获取授权信息
  async getPermInfo(){
    const res:any = await systemApi.getPermInfo();
    if (res.errcode === 0)  {
      this.permObj = res.data;

      // 数据回写
      const { authDeparts, authRoles, authUsers } = this.permObj;
      if ( authDeparts && authDeparts.length > 0) {
        this.dept = authDeparts.map((item:any) => {
          return {
            type: 1,
            name: item.bizName,
            id: item.bizId
          }
        });
      }

      if (authUsers && authUsers.length > 0)  {
        this.member = authUsers.map((item:any) => {
          return {
            type: 3,
            name: item.bizName,
            id: item.bizId
          }
        });
      }


      if (authRoles && authRoles.length > 0)  {
        this.roleDisplay = authRoles.map((item:any) => item.bizId);
      }
    } else {
      console.error(res);
    }
  }

  @Watch('isShowAuthorization')
  onIsShowAuthorizationChange(v){
    if (v) {
      this.getPermInfo();
    }
  }

}
</script>
<style lang="less" scoped>
  .license{
    margin: 0 24px;
    height: 100%;
    &-header{
      padding: 13px 0;
      text-align: left;
      border-bottom: 1px solid rgba(232,232,232,1);
      span{
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
      }
    }
    &-content{
      .license-form{
        max-width: 700px;
        margin-top: 24px;
        .license-item{
          line-height: 32px;
          margin-bottom: 20px;
          color: rgba(0, 0, 0, 0.65);
          text-align: left;
          .license-right{
            color: rgba(0, 0, 0, 0.85);
            a{
              color: @primary-color;
            }
            .au-btn {
              margin-left: 16px;
            }
          }
        }
      }
    }
  }

  .au-wrapper {
      .au-box {
        & > p {
              color: black;
              opacity: .45;
              margin-top: 12px;
              &.over {
                padding: 12px;
                background-color: rgba(255,251,230,1);
                border-radius: 4px;
                border: 1px solid rgba(255,229,143,1);
                opacity: .85;
              }
            }
        .au-type {
          display: flex;
          margin-top: 40px;
          div.au-type-label {
            width: 88px;
          }
          div.au-type-item {
            margin-left: 20px;
          }
          /deep/.ant-radio-wrapper {
            margin-right: 65px;
          } 
        }
        .choose-part {
          margin-top: 26px;
          .choose-item {
            display: flex;
            margin-bottom: 20px;
            align-items: center;
            .choose-label {
              width: 98px;
            }
            .choose-con {
              flex: 1;
              margin-left: 10px;
              /deep/.role-selector__wrap {
                width: 100%;
              }
              /deep/.role-selector__input {
                width: 100%;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .footer {
        padding: 10px;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9;
        box-shadow: 0px -1px 0px 0px rgba(232, 232, 232, 1);
        &>button{
          margin: 0 8px;
        }
      }
      .gray {
        color: rgba(0, 0, 0, 0.65);
      }
  }

  .import-progress {
    margin: 44px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    &  .note {
      font-size: 16px;
      color: rgba(0, 0, 0, .85);
      margin-top: 10px;
    }
    &  .import-hint {
      margin-top: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
    }
  }
</style>
