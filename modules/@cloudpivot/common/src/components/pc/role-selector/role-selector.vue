<template>
  <a-modal
    v-model="modalVisible"
    :bodyStyle="{ padding: 0 }"
    :title="title"
    wrapClassName="role-modal"
    width="700px"
    centered
    :maskClosable="false"
    :keyboard="false"
    @cancel="onCancel"
  >
    <!-- 搜索框 -->
    <div class="role-select__search">
      <i class="aufontAll h-icon-all-search-o"></i>
      <input
        v-model="searchTxt"
        :placeholder="placeholder"
        class="role-select__input"
        @input="searchRole"
      />
      <i
        v-if="searchTxt"
        class="aufontAll h-icon-all-close-circle"
        @click="clearSearch">
      </i>
    </div>
    <!-- 三栏 -->
    <div class="role-select__warp">
      <ul class="role-select__col role-group-list" v-show="!searchTxt">
        <li
          v-for="(group,idx) in roleGroups"
          :key="idx"
          :class="{'selected': selected.groupId === group.id }"
          @click="selectGroup(group)"
        >{{ group.name }}</li>
      </ul>

      <ul
        class="role-select__col role-user-list"
        :class="{ 'searching': searchTxt }"
        ref="rolesBox"
        @scroll="listenScroll"
      >
        <template v-if="searchTxt">
          <li v-for="(role,idx) in searchRoles" :key="idx">
            <a-checkbox :checked="isSelectedRole(role)" @change="selectRole(role,$event)"></a-checkbox>
            <span v-html="role.displayName"></span>
            <span class="role-tag">/{{ role.groupName }}</span>
          </li>
        </template>
        <template v-else>
          <li v-if="multiple">
            <a-checkbox :checked="selectedAll" @change="selectAll"></a-checkbox>
            <span>全选</span>
          </li>
          <li v-for="(role,idx) in roles" :key="idx">
            <a-checkbox :checked="isSelectedRole(role)" @change="selectRole(role,$event)"></a-checkbox>
            <span>{{ role.name }}</span>
          </li>
          <li
            v-if="!loadedGroupAllRoles && roles.length"
            ref="loadSpin"
            class="load-spin"
            @click="loadMoreRoles"
          >加载更多...</li>
        </template>
      </ul>

      <ul class="role-select__col role-select-result">
        <li
          v-for="(item,idx) in selected.roles"
          :key="idx"
          class="role-selector__span"
          @click="unSelectRole(item)"
        >
          <i class="aufontAll h-icon-all-user-o"></i>
          <span>{{ item.name }}</span>
          <i class="aufontAll h-icon-all-close"></i>
        </li>
      </ul>
    </div>
    <!-- 底部栏 -->
    <div slot="footer" class="role-select__footer">
      <p>已选中：{{ selected.roles.length }}</p>
      <div>
        <a-button type="default" @click="onCancel">取消</a-button>
        <a-button type="primary" @click="onSubmit">确定</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import * as RoleSelectorTypings from './role-selector.typings';

import { RoleService } from './role-selector.service';

@Component({
  name: "role-selector"
})
export default class RoleSelector extends Vue {
  @Prop({
    default: () => []
  }) value!: Array<RoleSelectorTypings.RoleItem>;

  @Prop() visible!: boolean;

  @Prop({
    default: '选择角色'
  }) title?: string;

  @Prop({
    default: false
  }) multiple?: boolean;

  @Watch('value', { deep: true })
  onValueChange(arr: Array<RoleSelectorTypings.RoleItem>) {
    this.initSelection(arr);
  }

  @Watch('visible')
  onVisibleValueChange(v: boolean) {
    if (v !== this.modalVisible) {
      this.modalVisible = v;
    }
    if (v) {
      this.initSelection();
    }
  }

  modalVisible: boolean = false;

  placeholder: string = '搜索角色';

  // 搜索角色关键字
  searchTxt: string = '';

  lastSearchTxt: string = '';

  // 角色组列表
  roleGroups: Array<RoleSelectorTypings.RoleGroupItem> = [];

  // 角色列表
  roles: Array<RoleSelectorTypings.RoleItem> = [];

  // 搜索角色列表
  searchRoles: Array<RoleSelectorTypings.RoleItem> = [];

  // 选中的角色组
  selected: any = {
    groupId: null,
    roles: [],
  }

  // 分页获取角色的参数
  groupChildParams: RoleSelectorTypings.GroupRolesParams = {
    groupId: '',
    page: 0,
    size: 20,
  }

  // 是否已加载组下的全部角色
  loadedGroupAllRoles: boolean = false;

  // 是否正在请求角色
  loadingRoles: boolean = false;

  get selectedAll() {
    return this.roles.every((role: RoleSelectorTypings.RoleItem) => this.isSelectedRole(role));
  }

  created() {
    this.getGroups();
  }

  /**
   * 初始化选中结果
   */
  initSelection(roles?: Array<RoleSelectorTypings.RoleItem>) {
    const selected: any = roles || this.value;

    if (!selected || (Array.isArray(selected) && selected.length < 1)) {
      this.selected.roles = [];
      return;
    }

    if (Array.isArray(selected) && selected.length) {
      this.selected.roles = selected;
      // 默认定位到已选第一个角色所属的角色组上
      const [role] = selected;
      const group: any = this.roleGroups.find((gr: RoleSelectorTypings.RoleGroupItem) => gr.id === role.groupId);
      if (group) {
        this.selectGroup(group);
      }
    }
  }

  /**
   * 获取角色组
   */
  async getGroups() {
    this.roleGroups = await RoleService.getGroupList();
    if (this.roleGroups.length) {
      const { id, children } = this.roleGroups[0];
      this.selected.groupId = id;
      this.roles = children;
      this.groupChildParams.groupId = id;
      if (children.length < this.groupChildParams.size) {
        this.roleGroups[0].total = children.length;
        this.loadedGroupAllRoles = true;
      } else {
        this.loadedGroupAllRoles = false;
      }
    }
  }

  /**
   * 根据关键字搜索角色
   */
  async searchRole() {
    if (!this.searchTxt || this.searchTxt === this.lastSearchTxt) {
      return;
    }
    this.searchRoles = [];
    const searchRoles: any = await RoleService.searchRoles(this.searchTxt);
    this.$nextTick(() => {
      this.searchRoles = searchRoles;
      this.lastSearchTxt = this.searchTxt;
    });
  }

  /**
   * 清空搜索内容，同时切换至角色组界面
   */
  clearSearch() {
    this.searchTxt = '';
    this.lastSearchTxt = '';
    this.searchRoles = [];
  }

  /**
   * 选中角色组
   */
  async selectGroup(group: RoleSelectorTypings.RoleGroupItem) {
    if (!group) {
      return;
    }
    this.selected.groupId = group.id;
    this.groupChildParams.groupId = group.id;
    this.groupChildParams.page = 0;
    if (group.total && group.total === group.children.length) {
      // 已加载组下的所有角色
      this.loadedGroupAllRoles = true;
      this.roles = group.children;
    } else {
      const roles: Array<RoleSelectorTypings.RoleItem> = await RoleService.getGroupRoles(this.groupChildParams, group);
      group.children = roles;
      this.roles = roles;
      this.loadedGroupAllRoles = !!(group.total === group.children.length);
    }
  }

  /**
   * 加载角色组下更多角色
   */
  async loadMoreRoles() {
    if (this.loadingRoles) {
      return;
    }
    const { groupId } = this.selected;
    const group: any = this.roleGroups.find((item: RoleSelectorTypings.RoleGroupItem) => item.id === groupId);
    this.loadingRoles = true;
    if (group) {
      if (group.total === group.children.length) {
        this.loadedGroupAllRoles = true;
        this.loadingRoles = false;
        return;
      }
      this.groupChildParams.page += 1;
      const roles: Array<RoleSelectorTypings.RoleItem> = await RoleService.getGroupRoles(this.groupChildParams, group);
      group.children = roles;
      this.roles = roles;
    }
    this.loadingRoles = false;
  }

  /**
   * 监听是否滚动到底部，是则触发加载更多
   */
  listenScroll() {
    const box: any = this.$refs.rolesBox;
    const spin: any = this.$refs.loadSpin;

    if (!box || !spin) {
      return;
    }

    const boxTop = box.getBoundingClientRect().top;
    const spinTop = spin.getBoundingClientRect().top;
    const scrollTop = spinTop - boxTop - box.offsetHeight;

    if (scrollTop < 10) {
      this.loadMoreRoles();
    }
  }

  /**
   * 选中角色
   */
  selectRole(role: RoleSelectorTypings.RoleItem, evt: Event) {
    const checked: boolean = (evt.target as any).checked;
    this.doSelectRole(role, checked);
  }

  /**
   * 执行角色选择
   */
  doSelectRole(role: RoleSelectorTypings.RoleItem, checked: boolean) {
    if (checked) {
      if (this.multiple) {
        if (!this.selected.roles.some((item: RoleSelectorTypings.RoleItem) => item.id === role.id)) {
          this.selected.roles.push(role);
        }
      } else {
        this.selected.roles = [role];
      }
    } else {
      if (this.multiple) {
        this.selected.roles = this.selected.roles.filter((item: RoleSelectorTypings.RoleItem) => item.id !== role.id);
      } else {
        this.selected.roles = [];
      }
    }
  }

  /**
   * 取消选中角色
   */
  unSelectRole(role: RoleSelectorTypings.RoleItem) {
    this.selected.roles = this.selected.roles.filter((item: RoleSelectorTypings.RoleItem) => item.id !== role.id);
  }

  /**
   * 判断角色是否已被选中
   */
  isSelectedRole(role: RoleSelectorTypings.RoleItem) {
    return this.selected.roles.some((item: RoleSelectorTypings.RoleItem) => item.id === role.id);
  }

  /**
   * 选中当前所有角色
   */
  selectAll(evt: Event) {
    if (!this.multiple) {
      return;
    }
    const checked: boolean = (evt.target as any).checked;
    this.roles.forEach((role: RoleSelectorTypings.RoleItem) => {
      this.doSelectRole(role, checked);
    })
  }

  /**
   * 点击取消
   */
  onCancel() {
    this.$emit('hide');
    this.reset();
  }

  /**
   * 点击确定
   */
  onSubmit() {
    this.$emit('input', this.selected.roles);
    this.$nextTick(() => {
      this.reset();
    });
  }

  reset() {
    this.modalVisible = false;
    this.searchTxt = this.lastSearchTxt = '';
    this.searchRoles = [];
    // this.selected.roles = [];
  }

}
</script>
<style lang="less" scoped>
.role-modal {
  .role-select {
    &__search {
      display: flex;
      align-items: center;
      width: 100%;
      height: 46px;
      padding: 12px 24px;
      box-sizing: border-box;
      border-bottom: 1px solid #e8e8e8;
      i {
        flex: none;
        cursor: pointer;
      }
      input {
        flex: 1;
        flex-grow: 1;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 14px;
        border: none;
        caret-color: @primary-color;
      }
      /deep/.h-icon-all-search-o,
      /deep/.h-icon-all-close-circle,
      input::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.25);
      }
      /deep/.h-icon-all-close-circle {
        font-size: 12px;
        &:hover {
          color: #666;
        }
      }
    }
    &__warp {
      width: 100%;
      height: 100%;
      display: flex;
    }
    &__col {
      display: block;
      flex: 1;
      height: 350px;
      max-height: 495px;
      overflow-y: auto;
      box-sizing: content-box;
      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
        > li {
          margin-bottom: 8px;
        }
      }
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
    }
  }

  .role-group-list {
    padding: 4px 0 4px 0;
    > li {
      width: 100%;
      height: 32px;
      line-height: 32px;
      margin-bottom: 8px;
      padding: 0 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .selected {
      // color: #17BC94;
      font-weight: 600;
      background-color: #e8fcf4;
      cursor: default;
    }
  }

  .role-user-list {
    &.searching {
      padding: 8px 24px;
    }
    padding: 8px;
    .role-tag {
      color: rgba(0, 0, 0, 0.45);
    }
    .load-spin {
      font-size: 12px;
      color: @primary-color;
      text-align: center;
      cursor: pointer;
    }
  }

  .role-select-result {
    flex: none;
    width: 310px;
    padding: 8px 16px;
    font-size: 0;
    box-sizing: border-box;
    > li {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }
}
</style>