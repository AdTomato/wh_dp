<template>
  <!-- li列表 -->
  <section class="list-box">
    <ul>
      <draggable
        v-model="draggerlistData"
        :options="dragItemOptions"
        @end="onEnd">
        <transition-group>
          <li
            v-for="(el, index) in draggerlistData"
            class="section-bar"
            :class="{hoverClass: el.popover, nobackground: fieldBlock === 3}"
            :key="`${index}-a`"
            @mouseenter="mouseEnter(index)"
          >
            <span :title="el.propertyName" class="bar-title each-title text-ellipsis">{{ el.propertyName || el.name }}</span>
            <span class="bar-right list-icon">
              <!-- 排序按钮 -->
              <span v-if="fieldBlock === 2" class="icons">
                <!-- <i class="aufontAll h-icon-all-setting-o"></i> -->
                <i
                  class="aufontAll"
                  :class="{'h-icon-all-ascending-o': el.direction === 1, 'h-icon-all-descending-o': el.direction !== 1}"
                  @click="handleAscending(el.direction, index)"
                >
                </i>
              </span>
              <!-- 删除按钮 -->
              <span v-if="fieldBlock !== 3" class="icons">
                <a-popconfirm
                  v-if="fieldBlock !== 2"
                  :title="$t('languages.Apps.DeleteItemTips')"
                  :cancelText="$t('languages.Apps.Cancel')"
                  :okText="$t('languages.Apps.Ok')"
                  @confirm="() => handleDelete(index)"
                >
                  <i class="aufontAll h-icon-all-delete-o"></i>
                  <!-- <a-icon type="delete"/> -->
                </a-popconfirm>

                <!-- <a-icon
                  v-else
                  type="delete"
                  @click="handleDelete(index)"/> -->
                <i
                  class="aufontAll h-icon-all-delete-o"
                  v-else
                  @click="handleDelete(index)"
                ></i>
              </span>
              <!-- setting按钮 -->
              <a-popover
                trigger="click"
                v-model="el.popover"
                placement="bottomRight"
                v-if="isShowPopover.includes(fieldBlock)"
              >
                <a slot="content" class = "queryPopover-modal">
                  <div v-if="fieldBlock === 0">
                    <QueryPopover
                      :modalData="el"
                      :index="index"
                      v-if="el.hide"
                      @confirm="comfirmDialog(index,$event)"
                      @cancel="hideLeve2Popoer(index)"
                    ></QueryPopover>
                  </div>
                  <div v-else-if="fieldBlock === 1">
                    <TableSetting
                      :modalData="el"
                      :index="index"
                      v-if="el.hide"
                      @confirm="comfirmDialog(index,$event)"
                      @cancel="hideLeve2Popoer(index)"
                    ></TableSetting>
                  </div>
                  <div v-else-if="fieldBlock === 3">
                    <BtnSetting
                      :modalData="el"
                      :index="index"
                      v-if="el.hide"
                      @confirm="comfirmDialog(index,$event)"
                      @cancel="hideLeve2Popoer(index)"
                    ></BtnSetting>
                  </div>
                </a>

                <span
                  v-if="fieldBlock !== 2"
                  class="icons"
                  @click="settingPopoverShow(index)"
                >
                  <i class="aufontAll h-icon-all-setting-o"></i>
                  <!-- <a-icon type="setting"/> -->
                </span>
              </a-popover>
              <!-- 列表操作 -->
              <!-- <span v-if="fieldBlock === 3" class="icons">
                <i
                  class="icon aufontAll h-icon-all-check-square"
                  :class="{'icon-checked': el.checked}"
                  @click="checkIcon(el.checked, index)"
                ></i>
                <a-checkbox :checked="el.checked" class="checkbox" @click="checkIcon(el.checked, index)"></a-checkbox>
              </span> -->
            </span>
          </li>
        </transition-group>
      </draggable>
    </ul>
  </section>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import Draggable from 'vuedraggable';
import QueryPopover from '@/components/apps/list-design/modals/popover/query-setting/query-index.vue';
import TableSetting from '@/components/apps/list-design/modals/popover/table-setting/table-index.vue';
import BtnSetting from '@/components/apps/list-design/modals/popover/list-btn-setting/btn-index.vue';

import { getDataItems } from '@/apis/list';

import Dialog from './aside-addDialog.vue';
// import appsApi from '@/apis/apps';


const ListdesignModule = namespace('Apps/Listdesign');
// import ListDesignHeader from '@/components/apps/list-design/listDesign-header.vue';


@Component({
  name: 'SideBoxDraggerList',
  components: {
    Draggable,
    QueryPopover,
    TableSetting,
    Dialog,
    BtnSetting
  }
})
export default class SideBoxDraggerList extends Vue {
  @Prop() modalData !: any;

  @ListdesignModule.State('payloadOptions') payloadOptions: any;

  @ListdesignModule.State('thefieldBlock') thefieldBlock: any;

  @ListdesignModule.State('clientType') clientType: any;

  @ListdesignModule.Mutation('setPayloadOptions') mutationPayloadOptions: any;

  @ListdesignModule.Mutation('setFieldBlock') mutationFieldBlock: any;

  @ListdesignModule.Mutation('queryChange') mutationQueryChange: any;

  @ListdesignModule.Mutation('setOperationArray') mutationOperationArray: any;

  @ListdesignModule.Mutation('setShowFieldArray') mutationShowFieldArray: any;

  @ListdesignModule.Mutation('setSortArray') mutationSortArray: any;

  @ListdesignModule.Mutation('onEdit') onEdit: any;

  @ListdesignModule.Mutation('setFilterTipsFlag') setFilterTipsFlag: any;


  @Prop() fieldBlock !: number

  @Prop() propDataList !: Array<any[]>

  @Prop() canShowDatas !: any

  // allraggerlist:any[] = [];
  draggerlistData:any[] = [];

  wrapStyle = { left: '624px' }

  poperList:any[] = [];

  fblock: number = -1;

  index:any = 0;

  isShowPopover = [0, 1, 3];

  dragItemOptions: any = {
    ghostClass: 'ghostClass',
    fallbackClass: 'dragClass',
  }

  /* 排序字段 */
  handleAscending(v:any, i:number) {
    let cur : number;
    if (v === 1) {
      cur = 2;
    } else {
      cur = 1;
    }
    this.draggerlistData[i].direction = cur;
    this.onEdit(true);
  }

  /* 列表操作 */
  checkIcon(v:boolean, index:number) {
    this.draggerlistData[index].checked = !v;
    this.mutationOperationArray(this.draggerlistData);
  }

  settingPopoverShow(index:number) {
    if (this.fieldBlock === 2) {
      return;
    }
    this.draggerlistData.forEach((el:any, num:number) => {
      this.draggerlistData[num].popover = false;
      this.draggerlistData[num].hide = false;
    });
    this.draggerlistData[index].hide = true;
    this.draggerlistData[index].popover = true;
  }

  /**
   * 字段拖拽排序结束
   */
  onEnd() {
    this.onEdit(true);
    this.$emit('setTargetSortList', this.draggerlistData);
  }

  /* li弹窗-确定 */
  comfirmDialog(i:number, val:any) {
    this.onEdit(true);
    new Promise((resolve) => {
      if (this.draggerlistData.length > 0) {
        if (this.fieldBlock === 3) {
          const {
            popover, name, queryActionType, associationType, associationCode, systemAction, icon, name_i18n
          } = val;

          this.draggerlistData[i].popover = popover;
          this.draggerlistData[i].name = name;
          this.draggerlistData[i].name_i18n = name_i18n;
          this.draggerlistData[i].queryActionType = queryActionType;
          this.draggerlistData[i].associationType = associationType;
          this.draggerlistData[i].associationCode = associationCode;
          this.draggerlistData[i].systemAction = systemAction;
          this.draggerlistData[i].icon = icon;
        } else {
          this.draggerlistData[i] = Object.assign(this.draggerlistData[i], val);
          this.draggerlistData[i].checked = true;
          this.draggerlistData[i].data = val;
        }
        this.mutationQueryChange();
      }
      resolve(i);
    }).then((params: any) => {
      this.hideLeve2Popoer(params);
    }).catch((error) => {
      console.log(error);
    });
  }

  /* li弹窗-取消 */
  hideLeve2Popoer(i:number) {
    if (this.draggerlistData.length < 1 || typeof this.draggerlistData[i].popover === 'undefined') {
      return;
    }
    this.draggerlistData[i].popover = false;
    setTimeout(() => {
        this.draggerlistData[i].hide = false;
    }, 300);
  }

  /* 删除-字段 */
  handleDelete(i:any) {
    const newData = [...this.draggerlistData];
    this.index = i;
    this.sethoverClass(i, true);
    // draggerlistData引用propDataList：改变propDataList的checked值
    this.draggerlistData = newData.map((el:any, index:number) => {
      if (index === i) {
        el.checked = false;
        return el;
      }
    });

    this.draggerlistData = newData.filter((el:any, index:number) => index !== i);
    this.onEdit(true);
  }

  /* 设置显隐class */
  sethoverClass(i:any, bol:boolean) {
    if (this.draggerlistData.length < 1 || typeof this.draggerlistData[i].hoverClass === 'undefined') {
      return;
    }
    this.draggerlistData[i].hoverClass = bol;
  }

  mouseEnter(index:any) {
    if (this.fieldBlock !== 3) {
      this.sethoverClass(index, false);
    }
  }

  changeDraggerlistData(v:any) {
    // 查询字段
    if (this.fieldBlock === 0 && v.length > 0) {
      this.draggerlistData = v.filter((el:any) => el.checked === true);
    // 展示字段
    } else if (this.fieldBlock === 1) {
      this.draggerlistData = v.filter((el:any) => el.checked === true);
      this.mutationShowFieldArray(this.draggerlistData);
    // 排序字段
    } else if (this.fieldBlock === 2) {
      this.draggerlistData.forEach((item) => {
        // item.checked = false;
      });
      this.draggerlistData = v.filter((el:any) => el.checked === true);
      this.mutationSortArray(this.draggerlistData);
    // 列表操作
    } else if (this.fieldBlock === 3) {
      this.draggerlistData = v;
      this.mutationOperationArray(this.draggerlistData);
    }
  }

  @Watch('propDataList')
  linstenPropDataListt(v:any) {
    this.draggerlistData = v;
    this.changeDraggerlistData(this.draggerlistData);
  }

  /* 监听li的数据变化 */
  @Watch('draggerlistData')
  linsteningdraggerlistData(v:any) {
    // 查询条件-发生改变时更新store
    if (this.fieldBlock === 0) {
      this.mutationPayloadOptions(v);
      if (this.clientType==='PC') {
        // 只有PC端新增查询条件才出现提示
        const showPop = v.length === 0;
        this.setFilterTipsFlag(showPop);
      }
    // 展示字段-发生改变时更新store
    } else if (this.fieldBlock === 1) {
      this.mutationShowFieldArray(v);
    // 列表操作-发生改变时更新store
    } else if (this.fieldBlock === 3) {
      this.mutationOperationArray(v);
    } else {
      this.mutationSortArray(v);
    }
  }

  @Watch('canShowDatas')
  linstenCanShowDatas(v:any) {
    this.draggerlistData = v;
  }

  created() {
    this.draggerlistData;
    this.fblock = this.fieldBlock;
    // this.showFieldsList = this.propDataList;
  }
}
</script>

<style lang="less" scoped>
.ant-popover-inner-content {
  .bottom-bolck{
    .btn{
      float: right;
      margin-right: 12px;
    }
  }
  min-width: 360px;
    a{
      color: rgba(0, 0, 0, .85);
    }
    a:hover{
      color: rgba(0, 0, 0, .85);
    }
  }
.design-wrapper{
  .each-title{
    font-size: 12px;
  }
}
//气泡title
.ant-popover-title, .ant-popover-arrow{
  display: none;
}
.design-wrapper .list-box li.section-bar{

  &.hoverClass{
    background: #E8FCF4 !important;
  }

  &.nobackground{
    background: #fff !important;
    &:hover{
      background: #E8FCF4 !important;
      cursor: move;
    }
  }
  &:hover{
    background: #E8FCF4 !important;
    cursor: move;
  }

  .icons{
    &:hover{
      color: @primary-color;
    }
  }
}
.queryPopover-modal{
  display: block;
  .popover-wrap{
    max-height: 392px;
    .row-wrap {
      max-height: 168px;
      overflow-y: auto;
    }
  }
}
.btn-group-fixed{
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    height: 54px;
    padding-top: 11px;
    padding-right: 20px;
    background-color: #fff;
  }

.list-box{
  overflow: hidden;
  /deep/.ghostClass {
    opacity: 1;
    background-color: #fff;
    // border: 1px dashed red;
    &.section-bar {
      border: 1px dashed @primary-color;
      background: #fff !important;
    }

    * {
      opacity: 0;
    }
  }
  /deep/.dragClass {
    opacity: 1 !important;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
  }
}
.list-fade-enter-active, .list-fade-leave-active {
  max-height: 100rem;
  // transition: all 3s ease;
  transition: all 0.15s cubic-bezier(0.645, 0.045, 0.355, 1.0) !important;
}

.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
