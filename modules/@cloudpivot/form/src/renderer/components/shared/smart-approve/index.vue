<template>
  <div
    class="h3-approve"
    :class="prefixCls"
    :style="prefixStyle"
  >
    <div class="h3-approve-main" :class="{ focused:focused }">
      <div class="h3-approve-main-content">
        <textarea
          :placeholder="t.TextPlaceholder"
          :value="textValue"
          @focus="onTextChange"
          @input="onTextChange"
          @blur="onBlur"
        ></textarea>
        <!-- <a-checkbox @change="onCheckboxChange" v-if="supprotSetting">{{ t.SettingTips }}</a-checkbox> -->
      </div>
      <!-- <a-tree-select
        v-if="supprotSelect"
        showSearch
        style="width: 100%"
        class="h3-approve-main-select"
        :value="selectValue"
        :dropdownStyle="{ maxHeight: '180px', overflow: 'auto' }"
        :placeholder="t.SelectPlaceholder"
        allowClear
        treeDefaultExpandAll
        @change="onSelectChange"
        @focus="onSelectFocus"
      >
        <a-tree-select-node
          v-for="i in opinions"
          :title="i.name"
          :key="i.key"
          :value="i.name"
        >
        </a-tree-select-node>
      </a-tree-select> -->
    </div>
    <!-- <div class="h3-approve-upload" v-if="supprotUpload">
      <a-upload
        name="file"
        :multiple="true"
        :action="action"
        :headers="headers"
        :accept="accept"
        :beforeUpload="beforeUpload"
        :fileList="defaultFileList"
        :remove="remove"
        @change="handleChange"
        @preview="handlePreview"
      >
        <a-button>
          <a-icon type="upload"/> {{ t.UploadTitle }}
        </a-button>
      </a-upload>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Model, Provide } from 'vue-property-decorator';
import languages from './locale';

import { Icon, Button, Upload, Modal,TreeSelect,Checkbox } from "h3-antd-vue";

@Component({
  name: 'SmartApprove',
  components: {
    AIcon: Icon,
    AButton: Button,
    AUpload: Upload,
    AModal: Modal,
    ATreeSelect: TreeSelect,
    ATreeSelectNode : TreeSelect.TreeNode,
    ACheckbox : Checkbox
  }
})
export default class SmartApprove extends Vue {
  // prop接口
  @Model('input') value!:string;

  @Prop() prefixCls!: string;
  @Prop() prefixStyle!: string;
  @Prop() selectStyle!: any;
  @Prop({
    type: String,
    default: 'zh',
  }) locale!: string;
  @Prop({
    type: Array,
    default: () => new Array(),
  }) opinions!: Array<any>;
  @Prop({
    type: Array,
    default: () => new Array(),
  }) fileList!: Array<any>;
  @Prop({
    type: Boolean,
    default: true,
  }) supprotSetting!: Boolean;
  @Prop({
    type: Boolean,
    default: true,
  }) supprotSelect!: Boolean;
  @Prop({
    type: Boolean,
    default: true,
  }) supprotUpload!: Boolean;
  @Prop({
    type: Object,
    default: () => {},
  }) headers!: any;
  @Prop({
    type: String,
  }) action!: string;
  @Prop() accept!: string;
  @Prop() uploadMaxSize!: number;
  @Prop() uploadMaxNum!: number;
  @Prop() uploadType!: string;
  @Prop({
    type: Function,
  }) remove!: any;
  @Prop({
    type: Boolean,
    default: false
  }) withCredentials!: boolean;

  textValue:string = '';
  defaultFileList:any = [];
  selectValue:any = '';

  focused = false;

  mounted() {
    this.selectValue = undefined;
    this.textValue = this.value;
    this.defaultFileList = this.fileList;
  }

  @Watch('value')
  onValueChange(){
    this.textValue = this.value;
  }

  get t():any {
    return (languages as any)[this.locale];
  }

  autoHeight(elem:any) {
    elem.style.height = 'auto';
    elem.scrollTop = 0;
    const { scrollHeight } = elem;
    elem.style.height = `${scrollHeight}px`;
  }
  onTextChange(val:any) {
    this.focused = true;
    const text = val.target.value;
    this.textValue = text;
    this.autoHeight(val.target);
  }

  onBlur(){
    this.focused = false;
  }

  onCheckboxChange(val:any) {
    const isChecked = val.target.checked;
    this.$emit('onCheckboxChange', isChecked);
  }
  onSelectChange(val:any) {
    val = val || '';
    this.selectValue = `${val}`;
    this.textValue = `${val}`;
    this.$emit('onSelectChange', val);
  }
  onSelectFocus(){
    this.$emit('onSelectFocus');
  }
  beforeUpload(file:any, fileList:any) {
    // 如果file的大小超出了限制的大小 false
    if (file.size > this.uploadMaxSize) {
      this.$message.error(`${file.name} ${this.t.OverSize}`);
      // this.fileList = [];
      return false;
    }
    // 如果超出了数量也fasle
    if (fileList.length > this.uploadMaxNum) {
      this.$message.error(`${file.name} ${this.t.OverNum}`);
      return false;
    }
    // 如果文件一起超过了大小也false
    // 文件类型判断 不是规定类型返回false
  }
  handleChange(info:any) {
    console.log('hai');
    console.log(info);
    if (info.file.status !== 'uploading') {
      this.$emit('uploading', info);
    }
    if (info.file.status === 'done') {
      this.$emit('done', info);
      this.$message.success(`${info.file.name} ${this.t.success}`);
    } else if (info.file.status === 'error') {
      this.$emit('error', info);
      this.$message.error(`${info.file.name} ${this.t.error}`);
    }
  }
  @Emit()
  handlePreview(file:any) {
  }

  @Watch('textValue')
  onChange(val: any) {
    this.$emit('input', val);
  }
}
</script>

<style lang="less">

@import './style/index.less';
</style>
