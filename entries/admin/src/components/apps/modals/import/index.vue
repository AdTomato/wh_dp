<template>
  <a-modal
    class="import-container"
    v-model="visible"
    :title="$t('languages.Apps.Import')"
    :width="552"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="import-layout">
      <div class="steps">
        <a-steps
          size="small"
          :current="curStep"
          :status="curStepStatus"
        >
          <a-step :title="$t('languages.Apps.UploadFile')"></a-step>
          <a-step :title="$t('languages.Apps.VerifyFile')">
            <a-icon
              v-if="curStep === 1 && !isValidated"
              type="loading"
              slot="icon"
            />
          </a-step>
          <a-step :title="$t('languages.Apps.Import')"></a-step>
        </a-steps>
      </div>
      <div class="step-content">
        <file-import
          :percent="importPercent"
          :isImportEnd="isImportEnd"
          :importStatus="importStatus"
          v-if="isImport"
        />

        <file-upload
          :accept="accept"
          :action="action"
          :clearFileList="clearFileList"
          :defaultFolder="defaultFolder"
          @setFileName="setFileName"
          @setFolderId="setFolderId"
          v-if="isUpload"
        />
        <file-validate
          :isShowUpdateCode="isShowUpdateCode"
          :validateStatus="validateStatus"
          :schemaCode="schemaCode"
          :schemaName="schemaName"
          :errorType="errorType"
          :errorInfo="errorInfo"
          :isShowValidateError="isShowValidateError"
          :subSchemaCodes="subSchemaCodes"
          :subSchemaNames="subSchemaNames"
          :errorSheetList="errorSheetList"
          :referAndChildMap="referAndChildMap"
          :isShowCodeTips="isShowCodeTips"
          :appFunctionModel="appFunctionModel"
          :appPackageModel="appPackageModel"
          @setCode="setCode"
          @validate="setIsValidateOk"
          v-if="isValidate"
        />


        <!-- <component
          :is="curStepComponent"
          :isShowUpdateCode="isShowUpdateCode"
          :accept="accept"
          :action="action"
          @setFileName="setFileName"
          @setFolderId="setFolderId"
          :validateStatus="validateStatus"
          :percent="importPercent"
          :isImportEnd="isImportEnd"
          :importStatus="importStatus"
          :clearFileList="clearFileList"
          :schemaCode="schemaCode"
          :subSchemaCodes="subSchemaCodes"
          :schemaName="schemaName"
          :errorType="errorType"
          :errorInfo="errorInfo"
          :referAndChildMap="referAndChildMap"
          :errorSheetList="errorSheetList"
          :floders="floders"
          :isShowValidateError="isShowValidateError"
          :defaultFolder="defaultFolder"
          :isShowCodeTips="isShowCodeTips"
          :appFunctionModel="appFunctionModel"
          :appPackageModel="appPackageModel"
          @setCode="setCode"
          @validate="setIsValidateOk"
        >
        </component> -->
      </div>
    </div>

    <template slot="footer">
      <div v-if="curStep === 0">
        <a-button
          type="primary"
          :disabled="nextDisabled"
          @click="nextStep"
        >{{ $t('languages.Apps.NextStep') }}</a-button>
      </div>

      <div v-if="curStep === 1" class="wwwww">
        <a-button @click="handleCancel" v-show="validateStatus === 'referCode'"> {{ $t('languages.Apps.Cancel') }} </a-button>
        <template v-if="validateStatus === 'repeat'">
          <!-- 上一步 -->
          <a-button v-if="isShowUpdateCode" @click="preStep">{{ $t('languages.Apps.PreStep') }}</a-button>
          <!-- 修改编码 -->
          <a-button v-else @click="updateCode">{{ $t('languages.Apps.EditCode') }}</a-button>
        </template>
        
        <!-- validateStatus === 'repeat' -->
        <!-- 编码重复 -->
        <template v-if="validateStatus === 'repeat'">
          <a-button
            v-if="isShowUpdateCode"
            type="primary"
            @click="modifySchemaCodesImport"
            :disabled="!isValidatedOk"
          >{{ $t('languages.Apps.Import') }}</a-button>
          <a-button
            v-else
            type="primary"
            @click="importAndCover"
            :disabled="!isValidatedOk"
          >{{ $t('languages.Apps.ImportAndCover') }}</a-button>

          <!-- 点击导入并覆盖弹窗 -->
          <a-modal 
            title="提示" 
            v-model="isRepeat" 
            @ok="repeatOk" 
            @cancel="repeatCancel($event)" 
            okText="是" 
            cancelText="否" >
            <p>{{ $t('languages.Apps.ImportAndCoverTips') }}</p>
          </a-modal>

        </template>
        <!-- 校验错误 -->
        <!-- @click="" -->
        <a-button
          v-else-if="validateStatus === 'error'"
          type="primary"
          @click="handleCancel"
          :disabled="!isValidatedOk"
        >{{ $t('languages.Apps.Ok') }}</a-button>
        <!-- 直接导入 -->
        <!-- @click="" -->
        <a-button
          v-else
          type="primary"
          @click="doImport"
          :disabled="!isValidatedOk"
        >{{ $t('languages.Apps.Import') }}</a-button>
      </div>


      <div v-if="curStep === 2">
        <!-- 完成 -->
        <a-button
          type="primary"
          @click="handleCancel"
          :disabled="!isImportEnd"
        >{{ $t('languages.Apps.Finish') }}</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import { Modal, Steps, Button } from 'h3-antd-vue';

import AppsApi from '@/apis/apps';
import * as FileValidateNS from '@/typings/app-error';

import FileUpload from './file-upload.vue';
import FileValidate from './file-validate.vue';
import FileImport from './file-import.vue';

const MenuModule = namespace('Apps/AppItem');
const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'DataImport',
  components: {
    AModal: Modal,
    ASteps: Steps,
    AStep: Steps.Step,
    AButton: Button,
    FileUpload,
    FileValidate,
    FileImport
  }
})

export default class DataImport extends Vue {
  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.State('floders') floders: any;

  @MenuModule.State('menuId') menuId: any;

  @MenuModule.Action('getFolders') getFolders: any;


  @Prop() value!: any;

  @Prop() accept!: any;

  @Prop() action!: any;

  visible: boolean = false;

  curStep: number = 0; // 当前步骤

  curStepStatus:string = 'process'; // 当前步骤状态

  nextDisabled:boolean = true; // 下一步按钮状态

  isShowUpdateCode:boolean = false; // 是否显示修改编码框

  fileName:string = ''; // 文件名

  isValidated:boolean = false; // 是否校验完成

  isValidatedOk:boolean = true; // 是否校验成功

  validateStatus:string = ''; // 校验状态

  importPercent:number = 0; // 导入进度

  isImportEnd:boolean = false; // 是否导入完成

  importStatus:string = 'process'; // 导入状态 process success error

  clearFileList:string = '';

  schemaCode:string = ''; // 业务模型编码

  subSchemaCodes: any = null; // 业务模型子表编码

  subSchemaNames: any = null; // 业务模型子表名称

  schemaCodeChanged:string = ''; // 修改后的schemaCode

  schemaName:string = ''; // 业务模型名称

  errorType:number = -1; // 导入错误对应的类型

  errorInfo:string = ''; // 数据项错误时的错误文案

  folderId:string = ''; // 文件夹id

  simulateInterval:any = ''; // 模拟动画定时器

  defaultFolder:string = ''; // 默认目录

  isShowValidateError:boolean = false; // 是否展示校验错误

  isCoverable:boolean = false; // 是否覆盖

  referAndChildMap:any = null;

  appFunctionModel: any = null; // 所在目录

  appPackageModel: any = null; // 所在应用

  isRepeat:boolean = false; // 导入校验是否模型重复

  isImportDataRule:any = null; // 是否导入数据规则


  /**
   * 文件校验按钮文字, 根据是否展示修改编码内容变化
   */
  // get btnTxt() {
  //   return this.isShowUpdateCode ? this.$t('languages.Apps.PreStep') : this.$t('languages.Apps.EditCode');
  // }

  // get btnConfirmTxt() {
  //   if (this.validateStatus === 'repeat') {
  //     return this.isShowUpdateCode ? this.$t('languages.Apps.Import') : this.$t('languages.Apps.ImportAndCover');
  //   } if (this.validateStatus === 'error') {
  //     return this.$t('languages.Apps.Ok');
  //   }
  //   return this.$t('languages.Apps.Import');
  // }

  // 当前步骤内容
  // get curStepComponent() {
  //   switch (this.curStep) {
  //     case 0:
  //       return 'file-upload';
  //     case 1:
  //       return 'file-validate';
  //     case 2:
  //       return 'file-import';
  //     default:
  //       return '';
  //   }
  // }

  /**
   * 关闭弹窗重置
   */
  reset() {
    this.curStep = 0;
    this.curStepStatus = 'process';
    this.nextDisabled = true;
    this.isShowUpdateCode = false;
    this.fileName = '';
    this.isValidated = false;
    this.isValidatedOk = true;
    this.validateStatus = '';
    this.importPercent = 0;
    this.isImportEnd = false;
    this.importStatus = 'process';
    this.clearFileList = '';
    this.folderId = '';
    this.importPercent = 0;
    this.isCoverable = false;
    this.isShowValidateError = false;
    this.ignoreCode = false;
    this.errorSheetList = null;
    this.subSchemaCodes = null;
    this.subSchemaNames = null;
    this.isShowCodeTips = false;
    this.referAndChildMap = null;
    this.schemaCodeChanged = '';
    this.appPackageModel = null;
    this.isImportDataRule = null;
    clearInterval(this.simulateInterval);
  }

  isShowCodeTips = false;

  /**
   * 关闭弹窗
   */
  handleCancel() {
    this.$emit('input', false);
    this.clearFileList = 'clear';
    if (this.importStatus === FileValidateNS.ImportStatus.ImportSuccess) {
      this.$emit('importEnd', true);
    }
    setTimeout(() => {
      this.reset();
    }, 300);
  }


  /**
   * 文件上传成功之后保存后台返回的文件名备用
   * 同时，当后台返回文件名的时候，才可以点击下一步
   */
  setFileName(name:string) {
    this.fileName = name;
    this.nextDisabled = !name;
  }


  /**
   * 设置文件夹id
   */
  setFolderId(id:string) {
    if (!id) return;
    this.folderId = id;
  }

  /**
   * 设置修改后的编码
   */
  setCode(code:string | object) {
    // debugger
    if (typeof code === 'string') {
      this.schemaCodeChanged = code;
    } else if (typeof code === 'object' && code !== null) {
      // debugger
      this.subSchemaCodes = code;
    }
  }

  setIsValidateOk(v:boolean) {
    this.isValidatedOk = v;
  }


  /**
   * 文件上传 点击下一步
   */
  nextStep() {
    this.curStep = 1;
    // 文件校验
    const fileName = this.fileName;
    const schemaCode:string = this.schemaCodeChanged;
    this.checkPackage(schemaCode,fileName,false);

    // AppsApi.check_package({ fileName, schemaCode, coverAble: false }).then((res:any) => {
    //   debugger
    //    this.isValidated = true;
    //   if (res && res.errcode === 0) {
    //   const { data } = res;

    //   this.isShowCodeTips = !!data.schemaCode;
    //     // debugger
    //     if (data.result) { // 校验成功
    //       if (data.repeated) { // 编码重复
    //         this.validateStatus = FileValidateNS.FileValidateStatus.CodeRepeat;

    //       } else if (data.referAndChildMap) {
    //         this.ignoreCode = true;
    //         this.validateStatus = FileValidateNS.FileValidateStatus.referCodesError;
    //         this.referAndChildMap = data.referAndChildMap;
    //       } else if (!data.repeated && !data.referAndChildMap) {
    //         // 执行导入操作
    //         this.import();
    //       } else {
    //         this.validateStatus = FileValidateNS.FileValidateStatus.ValidateOk;
    //       }
    //       // debugger
    //       this.subSchemaCodes = data.subSchemaCodes;
    //       this.schemaCode = data.schemaCode;
    //       this.schemaName = data.name;

    //       this.appFunctionModel =  data.appFunctionModel; // 所在目录

    //       this.appPackageModel = data.appPackageModel; // 所在应用

    //     } else { // 校验失败
    //       this.validateStatus = FileValidateNS.FileValidateStatus.ValidateError;
    //       this.errorType = data.errorType;
    //       this.errorInfo = data.resultInfo;
    //     }
    //   }

    // })
    // debugger
   
  }

  /**
   * 文件校验
   * @parms
   * fileName 文件名称
   * coverAble 是否覆盖
   * schemaCode 模型编码
   */
  checkPackage(schemaCode:string,fileName:string,coverAble:boolean) {
    const vm:any = this;
    const params = {
      schemaCode,
      fileName,
      coverAble,
      isImportDataRule:this.isImportDataRule
    }
    this.checkApi(params).then((res:any)=> {
      // debugger
      vm.isValidated = true;
      const data = res.data;
      vm.isShowCodeTips = !!data.schemaCode;

      if (res.errcode === 0) {
        if(data.result) {

          vm.subSchemaCodes = data.subSchemaCodes; // 子表数据项
          vm.subSchemaNames = data.subSchemaNames; // 子表数据项名称
          vm.schemaCode = data.schemaCode;
          vm.schemaName = data.name; 
          vm.appFunctionModel =  data.appFunctionModel; // 所在目录
          vm.appPackageModel = data.appPackageModel; // 所在应用
          
          if (data.repeated) { // 编码重复
            vm.validateStatus = FileValidateNS.FileValidateStatus.CodeRepeat;
            return;
          }
          // 存在关联模型或者关联表单
          if (data.referAndChildMap) {
            this.validateStatus = FileValidateNS.FileValidateStatus.referCodesError;
            this.referAndChildMap = data.referAndChildMap;
            this.showValidated();
            this.ignoreCode = true;
            return;
          }

          if(data.errorType === 0) {
            this.validateStatus = FileValidateNS.FileValidateStatus.ValidateOk;
          }
        
        } else { // 校验失败
          this.validateStatus = FileValidateNS.FileValidateStatus.ValidateError;
          this.errorType = data.errorType;
          this.errorInfo = data.resultInfo;
        }

        // 文件校验成功
      }
    })
    // AppsApi.check_package(params).then((res:any) => {
    //   // debugger
      
    // })
  }
  /**
   * 文件校验后直接导入
   * @parms
   * fileName 文件名称
   * coverAble 是否覆盖
   * schemaCode 模型编码
   */
  checkAndImport(schemaCode:string,fileName:string,coverAble:boolean,isImportDataRule:any) {
    const map:any = this.subSchemaCodes;

    const vm:any = this;
    
    const params = {
      schemaCode,
      fileName,
      coverAble,
      map,
      isImportDataRule:this.isImportDataRule
    }

    this.checkApi(params).then((res:any)=> {
      // debugger
      vm.isValidated = true;
      if (res.errcode === 0) {
        const data = res.data;
        if (data.result) {
          if( data.errorType === 7){
             this.isRepeat = true;
          }
          if (data.errorType === 0) {
            // 校验成功
            vm.importFile(schemaCode,fileName,coverAble);
            return;
          } else if (data.repeated) {
            //仍有重复
            if (data.schemaCode) {
              this.isShowValidateError = true;
              this.errorInfo = '编码仍然有重名';
            }

            if (data.subSchemaCodes) {
              this.errorSheetList = data.subSchemaCodes;
              if (!this.subSchemaCodes) {
                this.subSchemaCodes = data.subSchemaCodes;
                this.subSchemaNames = data.subSchemaNames;
              }
            }
          } else if (data.referAndChildMap) {
            this.isShowCodeTips = false;
            this.validateStatus = FileValidateNS.FileValidateStatus.referCodesError;
            this.referAndChildMap = data.referAndChildMap;
            this.showValidated();
            this.ignoreCode = true;
          }
        } else { // 校验错误直接弹出错误
          this.isShowValidateError = false;
          this.validateStatus = FileValidateNS.FileValidateStatus.ValidateError;
          this.errorType = data.errorType;
          this.errorInfo = data.resultInfo;
        }
      }

    })
    // AppsApi.check_package(params).then((res:any) => {
     
      
    // })
  }
  checkApi(params:any) {
    return new Promise((resolve, reject) => {
       AppsApi.check_package(params).then((res:any) => {
        resolve(res);
       })
    });
  }

  /**
   * 直接导入
   */

  doImport() { 
    
    this.importFile(this.schemaCodeChanged,this.fileName,this.isCoverable,this.isImportDataRule);
  }


  /**
   * 文件校验步骤按钮
  */
  // hadnleBtnClick() {
  //   // debugger
  //   if (this.isShowUpdateCode) {
  //     this.showRepeatCode();
  //   } else {
  //     this.updateCode();
  //   }
  // }

  /**
   * 上一步
   */
  preStep() {
    this.showRepeatCode();
  }


  /**
   * 修改编码
   */
  updateCode() {
    this.isShowUpdateCode = true;
  }

  /**
   * 文件校验点击上一步
   */
  showRepeatCode() {
    // debugger
    this.isShowUpdateCode = false;
    this.isValidatedOk = true;
  }

  showValidated() {
    this.isShowUpdateCode = false;
    this.isValidatedOk = true;
  }


  /**
   * 文件校验根据类型执行不同函数
   */
  handleConfirmClick() {
    // debugger
    const vStatus = this.validateStatus;
    switch (vStatus) {
      case FileValidateNS.FileValidateStatus.ValidateOk:
        this.fileImport();
        break;
      case FileValidateNS.FileValidateStatus.CodeRepeat:
      case FileValidateNS.FileValidateStatus.referCodesError:
        this.fileImport();
        break;
      case FileValidateNS.FileValidateStatus.ValidateError:
        this.handleCancel();
        break;
      default: break;
    }
  }
  /**
   * 覆盖导入
   */
  // 点击"是"
  repeatOk(){
    this.isImportDataRule = true;
    this.checkAndImport('',this.fileName,true,this.isImportDataRule);  
  }
  // 点击"否"
  repeatCancel(e){
    if(e.currentTarget.innerText === "否"){
      this.isImportDataRule = false;
      this.checkAndImport('',this.fileName,true,this.isImportDataRule)
    }else{
      this.isRepeat = false;
    }
  }
  
  importAndCover() {
    //this.checkAndImport('',this.fileName,true)
    /* 只有当点击导入并覆盖按钮且errorType为7时才弹窗 */
     this.isCoverable = true;
    this.checkAndImport('',this.fileName,true,this.isImportDataRule)
    
  }
  /**
   * 修改编码导入
   */
  modifySchemaCodesImport() {
    this.checkAndImport(this.schemaCodeChanged,this.fileName,false,this.isImportDataRule)
  }

  /**
   * 文件校验点击导入
   */

  /**
   * 导入逻辑
   */
  errorSheetList:any = null;


  ignoreCode:boolean = false;

  fileImport() {
    // debugger
    // 导入前先校验
    // const { fileName } = this;
    // const schemaCode:string = this.schemaCodeChanged;
    // const map:any = this.subSchemaCodes;
    // let coverAble:boolean = false;
    // if (this.validateStatus === FileValidateNS.FileValidateStatus.CodeRepeat && !this.isShowUpdateCode) {
    //   coverAble = true;
    // }

    // // 先赋默认值，触发watch
    // this.isShowValidateError = false;
    // this.errorInfo = '';
    // this.errorSheetList = null;
    // AppsApi.check_package({
    //   fileName, schemaCode, coverAble, map
    // }).then((res:any) => {
    //   if (res.errcode === 0) {
    //   // debugger
    //     const { data } = res;
    //     this.isShowCodeTips = !!data.schemaCode;
    //     // debugger
    //     // isShowCodeTips
    //     if (data.result) {
    //       if (!data.repeated && !data.referAndChildMap) {
    //       // 执行导入操作
    //         this.import();
    //       } else if (data.repeated) {
    //       // debugger
    //         if (data.schemaCode) {
    //           this.isShowValidateError = true;
    //           this.errorInfo = '编码仍然有重名';
    //         }

    //         if (data.subSchemaCodes) {
    //           this.errorSheetList = data.subSchemaCodes;
    //           if (!this.subSchemaCodes) {
    //             this.subSchemaCodes = data.subSchemaCodes;
    //           }
    //         }
    //       } else if (data.referAndChildMap) {
    //         if (this.ignoreCode) {
    //           this.import();
    //           return;
    //         }
    //         this.validateStatus = FileValidateNS.FileValidateStatus.referCodesError;
    //         this.referAndChildMap = data.referAndChildMap;
    //         this.showValidated();
    //         this.ignoreCode = true;
    //       } else {
    //         this.import();
    //       }
    //     } else { // 校验错误直接弹出错误
    //       this.isShowValidateError = false;
    //       this.validateStatus = FileValidateNS.FileValidateStatus.ValidateError;
    //       this.errorType = data.errorType;
    //       this.errorInfo = data.resultInfo;
    //     }
    //   }
    // });
  }


  /**
   * 导入操作
   */
  import() {
    this.curStep = 2;
    if (this.validateStatus === FileValidateNS.FileValidateStatus.ValidateOk) {
      this.isCoverable = false;
    } else if (this.validateStatus === FileValidateNS.FileValidateStatus.CodeRepeat) {
      this.isCoverable = !this.isShowUpdateCode;
    } else {
      this.isCoverable = false;
    }
    const params:Apps.AppItem.ImportModelParams = {
      schemaCode: this.schemaCodeChanged,
      fileName: this.fileName,
      coverAble: this.isCoverable,
      parentId: this.folderId
    };
    this.simulateImport();
    setTimeout(async () => {
      const importRes = await AppsApi.import_package(params);
      this.isImportEnd = true;
      if (importRes.errcode === 0) {
        const { data } = importRes;
        if (data.result) {
          this.importPercent = 100;
          this.importStatus = FileValidateNS.ImportStatus.ImportSuccess;
        } else {
          this.importPercent = 75;
          this.importStatus = FileValidateNS.ImportStatus.ImportError;
        }
      } else {
        this.importPercent = 75;
        this.importStatus = FileValidateNS.ImportStatus.ImportError;
      }
    }, 5000);
  }

  /**
   * 文件导入
   * @parms
   * fileName 文件名称
   * coverAble 是否覆盖
   * schemaCode 模型编码
   */

  importFile(schemaCode:string,fileName:string,coverAble:boolean,isImportDataRule:any) {
    // debugger
    const map:any = this.subSchemaCodes;
    
    // importFile
    // debugger
    this.curStep = 2;
    
    const params:any = {
      schemaCode,
      fileName,
      coverAble,
      parentId: this.folderId,
      subCodes: map,
      isImportDataRule: this.isImportDataRule
    };
    // 进度条
    this.simulateImport();

    setTimeout(() => {
      AppsApi.import_package(params).then((importRes:any) => {
        this.isImportEnd = true;
        if (importRes.errcode === 0) {
          const { data } = importRes;
          if (data.result) {
            this.importPercent = 100;
            this.importStatus = FileValidateNS.ImportStatus.ImportSuccess;
          } else {
            this.importPercent = 75;
            this.importStatus = FileValidateNS.ImportStatus.ImportError;
          }
        } else {
          this.importPercent = 75;
          this.importStatus = FileValidateNS.ImportStatus.ImportError;
        }
      });
      // this.isImportEnd = true;
      
    }, 5000);

  }



  /**
   * 模拟导入处理进度
   */
  simulateImport() {
    let percent = 1;
    this.simulateInterval = setInterval(() => {
      if (!this.isImportEnd) {
        if (percent <= 90) {
          percent += this.random(5);
          this.importPercent = percent;
        }
      } else {
        clearInterval(this.simulateInterval);
      }
    }, 1500);
  }


  /**
   * 产生随机整数
  */
  random(num: number) {
    return Math.ceil(Math.random() * 5);
  }


  /**
   * 关闭弹窗
   */
  closeModal() {
    this.$emit('input', false);
  }


  // todo: 数据存store，统一调用
  @Watch('value')
  onValueChange(v:any) {
    // debugger
    this.visible = v;
    if (v) {
      this.getFolders(this.appInfo);
      if (this.menuId) {
        this.defaultFolder = this.menuId;
      } else {
        this.defaultFolder = this.appDetails.id;
      }
      this.folderId = this.defaultFolder;
    }
  }

  /**
   * 监听步进控制组件显隐
   */

  isUpload = true;
  isValidate = false;
  isImport = false;
  @Watch('curStep')
  onCurStepChange(v:number) {
    switch (v) {
      case 0:
        this.isUpload = true;
        this.isValidate = false;
        this.isImport = false;
        break;
        // return 'file-upload';
      case 1:
        this.isUpload = false;
        this.isValidate = true;
        this.isImport = false;
        break;
        // return 'file-validate';
      case 2:
        this.isUpload = false;
        this.isValidate = false;
        this.isImport = true;
        break;
        // return 'file-import';
      default:
        break;
    }
  }

  
}
</script>

<style lang="less">
  .import-container {
    & .import-layout {
      & .steps {
        margin-bottom: 24px;
      }
    }
  }
</style>
