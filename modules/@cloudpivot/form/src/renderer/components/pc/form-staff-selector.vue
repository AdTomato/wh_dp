
<template>

  <staff-selector
    v-if="!readonly"
    v-model="val"
    :options="staffSelectorOpts"
    :onlyForm="true"
    :placeholder="placeholder"
    :disabled="readonlyFormula"
    @change="onValueChange"
  ></staff-selector>

  <div class="form-staff-warp" v-else>

    <template v-if="displayType === 'text'">
      {{ text }}
    </template>

    <template v-else>
      <div class="form-staff" :class="{ expanded : !collapsed }">

        <div
          class="form-staff-item"
          v-for="item in val"
          :key="item.id"
        >

          <a-avatar
            v-if="item.type === 1"
            size="small"
            :src="require('../images/dept.png')"
          ></a-avatar>

          <a-avatar
            v-if="item.type === 3" 
            icon="user"
            size="small"
            :src="item.imgUrl"
          />

          <span class="user-name" :title="item.name">{{ item.name }}</span>

        </div>

      </div>

      <div style="text-align:right">

        <span
          class="form-staff__more"
          v-if="showToggle"
          @click="toggle"
        >
          <span v-show="collapsed">{{ $t('cloudpivot.form.renderer.expand') }}</span>
          <span v-show="!collapsed">{{ $t('cloudpivot.form.renderer.collapse') }}</span>
          <i class="icon aufontAll h-icon-all-down-o" :class="{ expanded : !collapsed }" />
        </span>

      </div>
    
    </template>

  </div>

</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import StaffSelector from "../shared/staff-selector.vue";

import { StaffSelectorOptions } from "../../typings";

import { StaffSelectorControl } from "../../controls";

import { Tag,Icon,Avatar } from "h3-antd-vue";

@Component({
  name: "form-staff-selector",
  components: {
    ATag : Tag,
    AIcon : Icon,
    AAvatar:Avatar,
    StaffSelector
  }
})
export default class FormStaffSelector extends StaffSelectorControl {
  
  showToggle = false;

  collapsed = true;
  
  taskRef: any;

  toggle(){
    this.collapsed = !this.collapsed;
  }

  scroll() {
    const el = this.$el.querySelector('.form-staff') as HTMLDivElement;
    if(el){
      this.showToggle = el.scrollHeight > el.offsetHeight + 3;
      if (el.offsetHeight === 0) {
        clearTimeout(this.taskRef);
        this.taskRef = setTimeout(() => {
          this.scroll();
        }, 1000);
      }
    }
  }

  onValueChange(value : any[]){
    const val = value && value.length > 0 ? value : null;
    this.setValue(val);
  }

  mounted(){
    if(this.readonly){
      this.$nextTick(()=>{
        this.scroll();
      });
    }
  }

}
</script>

<style lang="less" scoped>

// .form-staff-warp{
//   position: relative;
// }

.form-staff{
  max-height: 115px;
  overflow: hidden;
  transition: all 0.15s ease;

  &.expanded{
    max-height: 100rem;
  }

  &__more{
    color:@primary-color;
    // position: absolute;
    display: inline-block;
    right: 0.5em;
    bottom: 0.5em;
    cursor: pointer;

    & > i{
      display: inline-block;
      margin-left:2px;
      font-size: 12px;
      transition: transform 0.24s;

      &.expanded{
        transform: rotate(180deg);
      }

    }

  }

}

.form-staff-item{
  display: inline-flex;
  align-items: center;
  background: #ECEFF2;
  padding:4px 8px;
  border-radius: 4px;
  min-width: 72px;
  min-height: 32px;
  vertical-align: top;
  margin-bottom: 0.5em;

  &:not(:last-child){
    margin-right: 0.5em;
  }

  & > .ant-avatar{
    margin-right: 4px;
  }

  & > .user-name{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 8em;
  }

}
</style>

