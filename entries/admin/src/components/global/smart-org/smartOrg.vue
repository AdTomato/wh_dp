<template>
  <div
    class="h3-organization"
    :class="prefixCls"
    :style="prefixStyle"
  >
    <a-select
      v-show="showSelect"
      mode="tags"
      :placeholder="selectPlaceholder"
      :showArrow="false"
      v-model="selectValue"
      :style="selectStyle"
      style="width:100%"
      @focus="focus"
      @deselect="onDeselect"
      ref="select"
      :labelInValue="true"
      dropdownClassName="dropdownClassName"
    >
      <i
        slot="suffixIcon"
        class="aufontAll h-icon-all-department-o"
      ></i>
      <a-select-option v-for="i in selectedData" :key="i.key">
        <i
          class="aufontAll h3-organization-select"
          :class="[i.type === 'org' ? 'h-icon-all-team-o' : 'h-icon-all-user-o']"
        ></i>
        {{ i.name }}
      </a-select-option>
    </a-select>

    <a-modal
      v-model="visible"
      width="700px"
      :bodyStyle="{padding: 0}"
      :title="title !=='' ? title : defaultTitle"
      @cancel="onClickCancle"
      centered
      :maskClosable="false"
      :keyboard="false"
    >
      <!-- 主体-->
      <div class="h3-organization-body">
        <!--左边 选中组织区域-->
        <div class="h3-organization-body-left">
          <!--搜索框 -->
          <div class="h3-organization-body-search">
            <a-icon
              type="search"
              class="h3-organization-body-search_icon"
              @click="onSearch"
            />
            <input
              class="h3-organization-body-search_input"
              ref="searchInput"
              v-model="searchKey"
              :placeholder="placeholder"
              @keyup.enter="onSearch"
              @focus="searchFocus"
              @change="searchChange"
              @blur="searchBlur"
            />
            <div
              v-if="searchList.length > 0"
              class="h3-organization-body-search-result"
            >
              <div class="h3-organization-search-title">
                <span>{{ `${t.SearchResult}: ${searchUserNum}${t.Users}` }}，{{ `${searchOrgNum}${t.Orgs}` }}</span>
                <span>{{ `${searchList.length} ${t.ResultNum}` }}</span>
              </div>
              <div class="h3-organization-search-content" @scroll.passive="onScrollSearch">
                <div
                  v-for="item in searchList"
                  :key="item.key"
                  class="h3-organization-search-content-item"
                  @click="onSelecte(item)"
                >
                  <div class="h3-organization-search-content-item_checkbox">
                    <a-checkbox :checked="!!item.isSelected"></a-checkbox>
                  </div>
                  <div class="h3-organization-search-item-info">
                    <span
                      v-if="item.type === 'user'"
                      class="h3-organization-search-item-info_avatar"
                    >
                      <img v-if="!!item.avatar" src="item.avatar"/>
                      <template v-else>{{ item.name }}</template>
                    </span>
                    <div class="h3-organization-search-item-info-main">
                      <span>{{ item.name }}</span>
                      <span>{{ item.orglist }}</span>
                    </div>
                  </div>
                </div>
                <slot name="searchFooter"></slot>
              </div>
            </div>
            <div
              v-if="isSearching && searchList.length === 0"
              class="h3-organization-body-search-result h3-organization-body-search-result--nodata"
            >
              {{ t.NoInformations }}
            </div>
          </div>
          <!-- 组织树-->
          <div class="h3-organization-body-org">
            <!-- 面包屑导航-->
            <div
              class="h3-organization-body-org-breadcrumb"
              v-if="breadcrumbList.length > 0"
            >
              <div class="ant-breadcrumb">
                <span
                  style="color: @primary-color"
                  @click="onClickTrunBack"
                >
                  <span class="ant-breadcrumb-link">
                    <i class="aufontAll h-icon-all-rollback-o"></i>
                    {{ t.TurnBack }}
                  </span>
                  <span class="ant-breadcrumb-separator">/</span>
                </span>
                <span
                  v-for="(breadcrumb, index) in breadcrumbList"
                  :key="index"
                  @click="onClickBreadcrumb(breadcrumb)"
                  class="testbread"
                >
                  <span class="ant-breadcrumb-link">{{ breadcrumb.name }}</span>
                  <span class="ant-breadcrumb-separator">/</span>
                </span>
              </div>
            </div>
            <!-- 组织树本树-->
            <div
              class="h3-organization-body-org-tree"
              @scroll.passive="onScrollChanged"
            >
              <a-checkbox
                :indeterminate="indeterminate"
                @change="onCheckAllChange"
                :checked="checkAll"
                v-if="isMulpitle"
              >{{ t.CheckAll }}
              </a-checkbox>
              <div
                v-for="o in currentPageOrg"
                :key="o.key"
                class="h3-organization-tree-item"
              >
                <div class="h3-organization-tree-item_checkbox">
                  <a-checkbox
                    :checked="!!o.isSelected"
                    @change="onSelecte(o, arguments)"
                    v-if="o.type === 'org' && selectOrg"
                  >
                    {{ o.name }}
                  </a-checkbox>
                  <div
                    v-if="o.type === 'org' && !selectOrg"
                    style="display: inline-block;"
                  >{{ o.name }}</div>
                  <a-checkbox
                    :checked="!!o.isSelected"
                    @change="onSelecte(o, arguments)"
                    v-if="o.type === 'user' && selectUser"
                  >
                    <img v-if="!!o.avatar" src="o.avatar"/>
                    <a-avatar
                      :size="20"
                      v-else
                      icon="icon"
                    />
                    {{ o.name }}
                  </a-checkbox>
                </div>
                <div
                  v-if="o.type === 'org' && o.hasChild"
                  class="h3-organization-tree-item_child"
                  :class="[!!o.isSelected && !allowRecursion ? 'h3-organization-tree-item_child--selected' : '']"
                  @click="onClickNextHierarchy(o)"
                >
                  <i class="aufontAll h-icon-all-subordinate-o"></i>{{ t.Subordinate }}
                </div>
              </div>
              <slot name="orgTreeFooter"></slot>
            </div>
          </div>
        </div>
        <!--右边 显示已选中的数据区域-->
        <div class="h3-organization-body-right">
          <div
            v-for="o in selectedList"
            :key="o.key"
            class="h3-organization-selected"
          >
            <i
              class="aufontAll"
              :class="[o.type === 'org' ? 'h-icon-all-team-o' : 'h-icon-all-user-o']"
            ></i>
            <div class="h3-organization-selected-name">{{ o.name }}</div>
            <i class="aufontAll h-icon-all-close" @click="onDelectItem(o)"></i>
          </div>
        </div>
      </div>
      <!-- 尾部统计和按钮事件-->
      <div slot="footer" class="h3-organization-footer">
        <div>
          <a-button type="default" @click="onClickCancle">{{ t.Cancel }}</a-button>
          <a-button type="primary" @click="ok">{{ t.Confirm }}</a-button>
        </div>
        <div v-if="selectedList.length > 0">
          {{ `${t.HasBeenselected} ${selectedOrgNum} ${t.Orgs}, ${selectedUserNum} ${t.Users}` }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Model } from 'vue-property-decorator';
import languages from './locale/index';

@Component({
  name: 'SmartOrg',
  components: {
  }
})
export default class SmartOrg extends Vue {
  // prop接口

  @Prop() prefixCls!: string;
  @Prop() prefixStyle!: string;
  @Prop() selectStyle!: any;

  @Prop({
    type: Boolean,
    default: true,
  }) showSelect!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  }) showModel!: boolean;
  @Prop({
    type: String,
    default: '',
  }) title!: string;
  @Prop({
    type: String,
    default: '搜索组织、姓名、角色',
  }) placeholder!: string;
  @Prop({
    type: String,
    default: '',
  }) orgName!: string;
  @Prop({
    type: String,
    default: '',
  }) selectPlaceholder!: string;
  @Prop({
    type: Array,
    default: [],
  }) org!: Array<any>;
  @Prop({
    type: Array,
    default: [],
  }) searchData!: Array<any>;
  @Prop({
    type: Array,
    default: [],
  }) selectedData!: Array<any>;
  @Prop({
    type: String,
    default: 'zh',
  }) locale!: string;
  @Prop({
    type: Boolean,
    default: true,
  }) isMulpitle!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  }) selectUser!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  }) selectOrg!: boolean;
  @Prop({
    type: Boolean,
    default: true,
  }) allowRecursion !: boolean;

  visible: boolean = false;
  searchKey: any = '';
  checkAll: boolean = false;
  language: any = languages;

  breadcrumbList: Array<any> = [];
  selectedList: Array<any> = [];
  orgTreeList: Array<any> = [];
  currentPageOrg: Array<any> = [];
  searchList: Array<any> = [];
  isSearching: boolean = false;

  mounted() {
    this.currentPageOrg = this.deepClone(this.org);
    this.selectedList = this.deepClone(this.selectedData);
    this.initSelectItem(this.currentPageTarget);
  }
  get t():any {
    return (languages as any)[this.locale];
  }
  get selectValue():any {
    return this.selectedData;
  }
  set selectValue(val:any) {
    this.$emit('change', val);
  }
  get indeterminate():boolean {
    const hasSelectItem = this.currentPageTarget.filter((i:any) => i.isSelected) || [];
    return hasSelectItem.length > 0 && hasSelectItem.length < this.currentPageTarget.length;
  }
  get selectedOrgNum():number|string {
    return this.countNumber(this.selectedList, 'org');
  }
  get selectedUserNum():number|string {
    return this.countNumber(this.selectedList, 'user');
  }
  get searchOrgNum():number|string {
    return this.countNumber(this.searchList, 'org');
  }
  get searchUserNum():number|string {
    return this.countNumber(this.searchList, 'user');
  }
  get defaultTitle():string {
    return this.selectUser ? this.selectOrg ? this.t.UserAndOrg : this.t.SelectUser
      : this.t.SelectOrg;
  }
  get currentPageUsers():any {
    return this.currentPageOrg.filter(i => i.type === 'user');
  }
  get currentPageDepartment():any {
    return this.currentPageOrg.filter(i => i.type === 'org');
  }
  get currentPageTarget():any {
    if (this.selectUser && !this.selectOrg) {
      return this.currentPageUsers;
    } else if (!this.selectUser && this.selectOrg) {
      return this.currentPageDepartment;
    } else if (this.selectUser && this.selectOrg) {
      return this.currentPageOrg;
    }
    return [];
  }

  // 工具函数
  deepClone(obj:any) {
    const objClone:any = Array.isArray(obj) ? []:{};
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = this.deepClone(obj[key]);
          } else {
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  }
  filterSelect(pushObj:any, targetObj:any = this.selectedList) {
    return pushObj.filter((pushItem:any) => {
      return  !targetObj.some((item:any) => item.key === pushItem.key)
    })
  }
  setSelectList(targetObj:any, push:boolean = true) {
    if (push) {
      const pushItem = this.filterSelect(this.deepClone(targetObj));
      this.selectedList = [...this.selectedList, ...pushItem];
    } else {
      targetObj.forEach((item:any) => {
        this.delectItem(item, this.selectedList);
      });
    }
    targetObj.forEach((i:any) => i.isSelected = push);
  }
  setSingleItem(item:any) {
    this.selectedList.every((i:any) => i.isSelected = false);
    this.onDeselect(this.currentPageTarget.find((o:any) => !!o.isSelected && o.key !== item.key));
    this.selectedList = [item];
  }
  delectItem(item:any, list:Array<any> = [], length = 1, above: boolean = false) {
    if (list.length === 0) return;
    const index = list.findIndex((i:any) => i.key === item.key);
    const end = list.length - index;
    if (above) {
      list.splice(index + 1, end);
    } else {
      list.splice(index, length);
    }
  }
  countNumber(targetList: Array<any> = [], type: string) {
    const num = targetList.filter((i:any) => i.type === type).length;
    if (num > 999) {
      return `${num / 10000}万`;
    }
    return num;
  }
  initSelectItem(targetList: Array<any> = []) {
    targetList.forEach((i:any) => {
      const selected = this.selectedList.some((o:any) => o.key === i.key);
      if (selected) {
        this.$set(i, 'isSelected', true);
      } else {
        this.$set(i, 'isSelected', false);
      }
    });
  }
  // 销毁时充值搜索
  distory() {
    this.isSearching = false;
    this.searchKey = '';
    this.searchList = [];
  }
  // Dom操作绑定函数
  focus() {
    this.$emit('focus', this.orgName);
    // this.$emit('focus', this.$refs.select);
    this.visible = true;
    // eslint-disable-next-line
    (this.$refs.select as any).blur();
  }
    //删除已选中的目标时同时更新搜索和当前页的list
  onDeselect(value:any) {
    if (!value) return;
    const deselectItem = this.currentPageTarget.find((o:any) => value.key === o.key);
    const deselectItemSearch = this.searchList.find((o:any) => value.key === o.key);
    if (deselectItem) {
      deselectItem.isSelected = false;
    }
    if (deselectItemSearch) {
      deselectItemSearch.isSelected = false;
    }
  }
  onCheckAllChange(value:any) {
    this.checkAll = value.target.checked;
    if (this.checkAll) {
      this.setSelectList(this.currentPageTarget);
    } else {
      this.setSelectList(this.currentPageTarget, false);
    }
  }
  onSelecte(item:any, val:any) {
    if (item.isSelected) {
      this.$set(item, 'isSelected', false);
      this.delectItem(item, this.selectedList);
    } else {
      this.$set(item, 'isSelected', true);
      if (this.isMulpitle) {
        this.selectedList.push(item);
      } else {
        this.setSingleItem(item);
      }
    }
    this.checkAll = this.currentPageTarget.every((i:any) => i.isSelected);
  }
  onDelectItem(item:any) {
    this.delectItem(item, this.selectedList);
    this.onDeselect(item);
    this.checkAll = this.currentPageTarget.every((i:any) => i.isSelected);
  }

  // 接口事件
  @Emit('searchFocus')
  searchFocus(val:any) {
    return val;
  }
  // @Emit('searchChange')
  searchChange(val:any) {
    if (this.searchKey === '') {
      this.searchList = [];
    }
    this.$emit('searchChange', this.searchKey);
    // return this.searchKey;
  }
  // @Emit('onSearch')
  onSearch(val:any) {
    if (this.searchKey === '') {
      return;
    }
    this.isSearching = true;
    (this.$refs.searchInput as any).blur();
    this.$emit('onSearch', this.searchKey);
    // return this.searchKey;
  }
  @Emit('searchBlur')
  searchBlur(val:any) {
    // this.isSearching = false;
    return val;
  }
  @Emit('cancle')
  onClickCancle() {
    this.breadcrumbList = [];
    this.visible = false;
    this.distory();
    this.selectedList = this.deepClone(this.selectedData);
    this.initSelectItem(this.currentPageTarget);
  }
  // @Emit('ok')
  ok() {
    this.breadcrumbList = [];
    this.visible = false;
    this.distory();
    this.$emit('ok', this.selectedList);
    // return this.selectedList;
  }
  @Emit('onClickTrunBack')
  onClickTrunBack() {
    this.breadcrumbList = [];
  }
  // @Emit('onClickBreadcrumb')
  onClickBreadcrumb(item:any) {
    this.delectItem(item, this.breadcrumbList, this.breadcrumbList.length, true);
    this.$emit('onClickBreadcrumb', item);
    return item;
  }
  @Emit('onOrgTreeScroll')
  onScrollChanged(val:any) {
  }
  @Emit('onSearchListScroll')
  onScrollSearch(val:any) {
  }
  // @Emit('onClickNextHierarchy')
  onClickNextHierarchy(val:any) {
    // 如果设置允许递归则展示
    if (!this.allowRecursion) return;
    this.breadcrumbList.push(val);
    this.$emit('onClickNextHierarchy', val);
    // return val;
  }

  @Watch('org')
  onOrgChanged(val:any, oldVal:any) {
    this.currentPageOrg = this.deepClone(val);
    this.initSelectItem(this.currentPageTarget);
  }

  @Watch('searchData')
  onSearchListChanged(val:any, oldVal:any) {
    this.searchList = this.deepClone(val);
    // 在改变之前筛选已经被选中的元素 设置isSelecte
    this.initSelectItem(this.searchList);
  }
  @Watch('selectedData')
  initSelectedList(val:any, oldVal:any) {
    this.selectedList = this.deepClone(val);
  }
  @Watch('showModel')
  changeModelStatus(val:any, oldVal:any) {
    this.visible = val;
  }
  @Watch('currentPageOrg')
  selectAll(val:any, oldVal:any) {
    const isSelectAll = val.every((item:any) => item.isSelected);
    this.checkAll = isSelectAll;
  }
  @Watch('searchKey')
  clearSearchKey(val:any, oldVal:any) {
    if (val === '') this.distory();
  }
}
</script>

<style lang="less">
@import './style/index.less';
</style>
