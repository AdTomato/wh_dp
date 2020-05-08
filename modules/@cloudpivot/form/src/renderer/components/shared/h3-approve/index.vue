<template>
  <div class="h3-approve">
    <h3-textarea
      style="margin-bottom: 12px"
      :title="title"
      :count="2000"
      :rows="4"
      v-model="textValue"
      :maxLength="2000"
      :autoHeight="false">
    </h3-textarea>

    <!-- <div class="h3-approve-switch" v-if="supprotSetting">
      <span>是否设为常用意见</span>
      <h3-switch v-model="isSelected" color="#2970ff" @onClick="onCheckboxChange"></h3-switch>
    </div>

    <div class="h3-approve-select" v-if="supprotSelect">
      <h3-popup-picker
        title="常用审批意见"
        :cancelText="$t('cloudpivot.form.renderer.cancel')"
        :show="showPicker"
        clearText=""
        :confirmText="$t('cloudpivot.form.renderer.ok')"
        @on-show="() => showPicker = true">
          <div class="h3-approve-select-list">
            <div class="h3-approve-select-list-item"
              v-for="item in opinions" :key="item.key"
              @click="onSelectDefault(item)">
              <span class="h3-approve-select-list-item-content">{{ item.name }}</span>
              <span class="h3-approve-select-list-item-check aufontAll"
              :class="{'h-icon-all-check' : defaultapprove === item.key}"></span>
            </div>
          </div>
      </h3-popup-picker>
    </div> -->

    <h3-upload listType="file" v-if="supprotUpload" :action="action" title="附件"></h3-upload>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit, Model} from 'vue-property-decorator';
import { H3Textarea, H3Button, H3Upload, H3Switch, H3PopupPicker } from 'h3-mobile-vue';

@Component({
  name: 'h3-approve',
  components: {
    H3Textarea,
    H3Button,
    H3Upload,
    H3Switch,
    H3PopupPicker,
  }
})
export default class H3Approve extends Vue {
  @Model('input') value!:string;

  @Prop({
    type: String,
    default: '审批意见'
  }) title!: string;

  @Prop({
    type: Array,
    default: () => new Array(),
  }) opinions!: Array<any>;

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

  @Prop()
  action!: string;

  textValue:string = ''
  defaultapprove: string = ''

  isSelected: boolean = false
  showPicker: boolean = false

  mounted() {
    this.textValue = this.value;
  }

  @Watch('value')
  onValueChange(){
    this.textValue = this.value;
  }
  
  onSelectDefault(item:any) {
    this.defaultapprove = item.key;
    this.textValue = item.name;
    this.showPicker = false;
  }

  onCheckboxChange(val:any) {
    this.$emit('onCheckboxChange', this.isSelected);
  }

  @Watch('textValue')
  onChange(val: any) {
    this.$emit('input', val);
  }
}
</script>
<style lang="less">
// @import './style/index.less';

</style>
