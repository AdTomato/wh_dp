<template>
  <div class="file-storage">
    <div class="guide">
      <div class="file-storage__header">
        <span>文件储存</span>
      </div>
      <div class="file-storage__form">
        <a-row
          class="file-storage__item"
        >
          <a-col :span="layout.left" class="file-storage__left">
            <span class="required">*</span>
            <span>存储方法:</span>
          </a-col>
          <a-col :span="layout.right" class="file-storage__right">
            <span class="check-dingtalk__right--edit">{{ storageWay[storageType].title }}</span>
            <!-- <a-radio-group
              v-else
              name="radioGroup"
              v-model="storageType"
              @change="storageTypeChange"
            >
              <a-radio
                v-for="(option, index) in storageWay"
                :key="index"
                :value="option.value">{{ option.title }}</a-radio>
            </a-radio-group> -->

          </a-col>
        </a-row>
        <a-row
          class="file-storage__item"
          v-for="(item, index) in fileStorage"
          :key="index"
        >
          <a-col :span="layout.left" class="file-storage__left">
            <span v-if="item.required" class="required">*</span>
            <span>{{ item.title }}:</span>
          </a-col>
          <a-col :span="layout.right" class="file-storage__right">
            <div v-if="item.type==='input'">
              <span v-if="edit" class="check-dingtalk__right--edit">
                <template v-if="['ftpPassword','keySecret'].includes(item.code)">
                  <password-span :value="item.value"/>
                </template>
                <template v-else>
                  {{ item.value }}
                </template>
              </span>
              <a-input v-else v-model="item.value"/>
            </div>

            <div v-if="item.type==='radio'">
              <a-radio-group name="radioGroup" :defaultValue="1">
                <a-radio
                  v-for="(option, index) in item.options"
                  :key="index"
                  :value="option.value"
                >{{ option.title }}</a-radio>
              </a-radio-group>
            </div>

          </a-col>
        </a-row>
      </div>
    </div>
    <a-row class="file-storage__item">
      <a-col :span="layout.left" class="file-storage__left"></a-col>
      <a-col :span="layout.right" class="file-storage__right">
        <div class="btn-group">
          <a-button
            type="primary"
            @click="save"
            class="btn-group__btn"
          >{{ btnText[0] }}</a-button>
          <a-button @click="connect">{{ btnText[1] }}</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import BtnGroup from './btn-group.vue';

import systemApi from '@/apis/system/system-manager.api';

import PasswordSpan from '@/components/global/password-span.vue';


@Component({
  name: 'file-storage',
  components: {
    BtnGroup,
    PasswordSpan
  }
})
export default class FileStorage extends Vue {
  layout = {
    left: 5,
    right: 10
  }

  params = {
    keyId: '', // 唯一标识
    keySecret: '', // 密钥
    endPoint: '', // 上传节点
    bucket: '' // 存储空间
  }

  edit: boolean = false;
  btnText = [
    '保存',
    '连接测试'
  ]
  // 文件存储方式
  storageType = 0;
  storageWay = [
    {
      value: 0,
      title: 'OSS'
    },
    {
      value: 1,
      title: 'SFTP'
    }
  ]
  fileStorage:Array<any> = [];
  ossConfigVO = [
    {
      required: true,
      value: '',
      title: 'AccessKeyId',
      code: 'keyId',
      type: 'input'
    },
    {
      required: true,
      value: '',
      title: 'AccessKeySecret',
      code: 'keySecret',
      type: 'input'
    },
    {
      required: true,
      value: '',
      title: '阿里云EndPoint',
      code: 'endPoint',
      type: 'input'
    },
    {
      required: true,
      value: '',
      title: '储存空间Bucket',
      code: 'bucket',
      type: 'input'
    }
  ]
  ftpConfigVO = [
    {
      required: true,
      value: '',
      title: '服务器',
      code: 'ftpServer',
      type: 'input'
    },
    {
      required: true,
      value: '21',
      title: '端口号',
      code: 'ftpPort',
      type: 'input'
    },
    {
      required: true,
      value: '',
      title: '账号',
      code: 'ftpAccount',
      type: 'input'
    },
    {
      required: true,
      value: '',
      title: '密码',
      code: 'ftpPassword',
      type: 'input'
    },
    {
      required: false,
      value: '',
      title: '目录',
      code: 'ftpFilePath',
      type: 'input'
    }
  ]
  storageTypeOptios = [
    this.ossConfigVO,
    this.ftpConfigVO
  ]


  storageTypeChange() {
    this.fileStorage = this.storageTypeOptios[this.storageType];
  }

  created() {
    const vm: any = this;
    vm.fileStorage = vm.ossConfigVO;
    systemApi.getOss().then((res: any) => {
      if (res.data) {
        if (res.data.ftpConfigVO || res.data.ossConfigVO) {
          vm.storageType = res.data.ftpConfigVO ? Number(res.data.ftpConfigVO.checked) : 0;
        }

        vm.storageTypeChange();
        if (res.data.ossConfigVO) {
          vm.ossConfigVO.forEach((fileItem:any) => {
            fileItem.value = res.data.ossConfigVO[fileItem.code];
          });
        }
        if (res.data.ftpConfigVO) {
          vm.ftpConfigVO.forEach((fileItem:any) => {
            fileItem.value = res.data.ftpConfigVO[fileItem.code];
          });
        }
        vm.edit = true;
        vm.btnText[0] = '编辑';
      }
    });
  }

  // 保持配置数据
  save() {
    const vm: any = this;
    if (vm.edit) {
      vm.edit = false;
      vm.btnText[0] = '保存';
      return;
    }

    const params = this.setParams();

    systemApi.createdOss(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('保存成功!', 2);
        vm.edit = true;
        vm.btnText[0] = '编辑';
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  // 连接测试
  connect() {
    const vm: any = this;
    const params:any = vm.setParams();
    // params.storageMode = vm.storageType;
    // vm.fileStorage.forEach((res:any) => {
    //   params[res.code] = res.value;
    // })
    systemApi.checkOss(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('连接成功！', 2);
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }
  /**
   * 处理保存数据
   */
  setParams() {
    let ftpConfigVO: any = new Object();
    let ossConfigVO: any = new Object();

    const ftpConfigVOF = this.ftpConfigVO.some((res:any) => res.value !== '');

    const ossConfigVOF = this.ossConfigVO.some((res:any) => res.value !== '');

    if (ftpConfigVOF || this.storageType) {
      this.ftpConfigVO.forEach((res:any) => {
        ftpConfigVO[res.code] = res.value;
      });
      ftpConfigVO.checked = Boolean(this.storageType);
    } else {
      ftpConfigVO = null;
    }

    if (ossConfigVOF || !this.storageType) {
      this.ossConfigVO.forEach((res:any) => {
        ossConfigVO[res.code] = res.value;
      });
      ossConfigVO.checked = !this.storageType;
    } else {
      ossConfigVO = null;
    }

    return { ftpConfigVO, ossConfigVO };
  }
}

</script>

<style lang="less" scoped>
.file-storage {
  text-align: left;
  &__header {
    padding-bottom: 20px;
    position: relative;
    // font-size:18px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    span {
      line-height: 26px;
      height: 26px;
    }
  }
  &__form {
    .file-storage__item {
      margin-bottom: 20px;
      // div {
      //   float: left;
      // }
      .file-storage__left {
        span {
          color: rgba(0, 0, 0, 0.65);
        }
        position: relative;
        .required {
          left: -6px;
          color: #f5222d;
          position: absolute;
        }
        line-height: 32px;
      }
      .file-storage__right {
        line-height: 32px;
        &--edit {
          line-height: 32px;
        }
      }
    }
  }
}
</style>
