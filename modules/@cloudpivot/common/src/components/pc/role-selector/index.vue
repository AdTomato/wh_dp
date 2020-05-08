<template>
  <div class="role-selector__wrap">
    <!-- 输入框 -->
    <div
      class="role-selector__input"
      :class="multiple ? 'auto' : 'fix'"
      @click.self="focusInput"
      @mouseenter="hoverInput"
      @mouseleave="blurInput"
    >
      <span
        v-show="!selectedRoles.length"
        class="role-selector__input--placeholder"
        @click="focusInput"
      >{{ placeholder }}</span>

      <ul
        v-if="selectedRoles.length"
        :class="{'multiple':multiple}"
        class="role-selector__input--tags"
        @click.self="focusInput"
      >
        <li
          v-for="(role,index) in selectedRoles"
          :key="index"
          class="role-selector__span"
          @click.stop="removeRole(role)"
        >
          <i class="aufontAll h-icon-all-user-o"></i>
          <span>{{ showParent ? role.groupName + ' / ' + role.name : role.name }}</span>
          <i v-if="multiple" class="aufontAll h-icon-all-close"></i>
        </li>
      </ul>

      <i
        v-if="multiple && showClear && selectedRoles.length"
        class="aufontAll h-icon-all-close-circle clearer"
        @click.stop="clear"
      ></i>
    </div>
    <!-- 弹窗 -->
    <role-selector
      v-model="selectedRoles"
      ref="roleSelector"
      :title="title"
      :visible="visible"
      :multiple="multiple"
      @hide="hide"
      @input="submit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import RoleSelector from './role-selector.vue';

import * as RoleSelectorTypings from './role-selector.typings';

import { RoleService } from './role-selector.service';

@Component({
  name: "role-select",
  components: {
    RoleSelector
  }
})
export default class RoleSelect extends Vue {

  @Prop() defaultValue?: any;

  @Prop() title?: string;

  @Prop({
    default: false
  }) multiple?: boolean;


@Prop({
    default: 'id'
  }) filterKey?: string;

  @Prop({
    default: true
  }) showParent?: boolean;

  placeholder: string = '请选择';

  visible: boolean = false;

  showClear: boolean = false;

  selectedRoles: Array<RoleSelectorTypings.RoleItem> = [];

  /**
   * 删除已选角色
   */
  removeRole(role: RoleSelectorTypings.RoleItem) {
    if (!this.multiple) {
      this.focusInput();
      return;
    }
    const { filterKey } = this;
    this.selectedRoles = this.selectedRoles.filter((item: any) => item[filterKey as string] !== role[filterKey as string]);
    this.$emit('select', this.selectedRoles);
  }

  /**
   * 清空已选角色
   */
  clear() {
    this.selectedRoles = [];
    this.$emit('select', this.selectedRoles);
  }

  /**
   * 单击输入框，弹出选择角色
   */
  focusInput() {
    this.visible = true;
  }

  /**
   * 鼠标移入输入框
   */
  hoverInput() {
    this.showClear = true;
  }

  /**
   * 鼠标移出输入框
   */
  blurInput() {
    this.showClear = false;
  }

  /**
   * 取消选择，隐藏弹窗
   */
  hide() {
    this.visible = false;
  }

  /**
   * 选择角色完毕
   */
  submit(roles: Array<RoleSelectorTypings.RoleItem>) {
    this.$emit('select', roles);
    this.visible = false;
  }

  /**
   * 渲染默认值
   * 
   * ① 传入对象数组：Array<RoleSelectorTypings.RoleItem>
   * ② 传入code字符串数组：Array<string>
   * ③ 传入单个角色code: string
   */
  async initialSelected(payload?: any) {
    const value: any = payload || this.defaultValue;
    this.selectedRoles = [];
    if (!value) {
      return;
    }

    if (typeof value === 'string') {
      // 只传入了角色code
      let roleInfo: any = await RoleService.getRoleInfoByCode(value);
      if (!roleInfo) {
        return;
      }
      this.selectedRoles = [roleInfo];
      return;
    }

    // 传入的是完整的角色对象数组
    if (Array.isArray(value) && value.length) {
      value.forEach(async (item: any) => {
        if (typeof item === 'string') {
          let roleInfo: any = await RoleService.getRoleInfoByCode(item);
          if (roleInfo) {
            this.selectedRoles.push(roleInfo);
          }
        } else if (['name', 'id', 'code', 'groupId'].every((key: string) => item.hasOwnProperty(key))) {
          this.selectedRoles.push(item);
        }
      });
    }

  }

  mounted() {
    this.initialSelected();
  }

  @Watch('defaultValue')
  onValueChange() {
    this.initialSelected();
  }

}
</script>

<style lang="less" scoped>
.role-selector {
  &__wrap {
    display: inline-block;
  }
  &__input {
    display: inline-block;
    min-width: 180px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 0;
    cursor: pointer;
    position: relative;
    &.fix {
      height: 32px;
      padding: 0 10px;
    }
    &.auto {
      min-height: 32px;
      max-height: 180px;
      padding: 0 5px 4px 5px;
      overflow-y: auto;
      /deep/.role-selector__input--placeholder {
        margin-top: 5px;
        margin-left: 6px;
      }
      /deep/.role-selector__span {
        margin-top: 4px;
        margin-right: 8px;
      }
    }
    &::after {
      content: "";
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
    &:hover,
    &:focus {
      border-color: @primary-color;
    }
    &:focus {
      box-shadow: 0 0 0 2px @primary-light-color;
      outline: 0;
    }
    &--tags {
      display: inline-block;
      vertical-align: middle;
      margin-right: 12px;
      font-size: 0;
      &:not(.multiple) {
        /deep/.role-selector__span {
          background: none;
          border: none;
          padding: 0;
          i {
            display: none;
          }
          span {
            font-size: 14px;
          }
        }
      }
    }
    &--placeholder {
      display: inline-block;
      vertical-align: middle;
      color: rgba(0, 0, 0, 0.25);
      font-size: 14px;
      line-height: 1.5;
    }
    .clearer {
      position: absolute;
      z-index: 9;
      right: 10px;
      top: 6px;
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.25);
      line-height: 1.5;
      &:hover {
        color: #666;
      }
    }
  }
}
</style>

<style lang="less">
.role-selector__span {
  display: inline-block;
  vertical-align: middle;
  height: 22px;
  line-height: 22px;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  font-size: 0;
  cursor: pointer;
  > i {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    color: #bfbfbf;
  }
  > span {
    display: inline-block;
    vertical-align: middle;
    max-width: 200px;
    margin-left: 4px;
    margin-right: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>