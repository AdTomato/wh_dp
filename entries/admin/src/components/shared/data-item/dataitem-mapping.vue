
<template>
  <div>
    <a-row type="flex" class="header">
      <a-col class="col" :span="span">{{ source.title }}</a-col>
      <a-col
        class="col"
        :span="4"
        v-if="!editable"
      >常量</a-col>
      <a-col class="col" :span="span">{{ target.title }}</a-col>
      <a-col
        class="col"
        :span="4"
        v-if="editable"
      >操作</a-col>
    </a-row>

    <a-row
      type="flex"
      v-for="(item,index) in selected"
      :key="index"
    >
      <a-col class="col" :span="span">
        <a-select
          v-if="editable"
          v-model="item.source.code"
          @select="e => findSourceOptionAndDisabled(item.source.code,false)"
          @change="e => onSourceItemChange(item)"
        >
          <a-select-opt-group>
            <span slot="label" class="select-title">业务数据项</span>
            <a-select-option
              v-for="(i,index) in sourceOptions"
              :key="index"
              :value="i.value"
              v-if="!i.isSystem"
            >
              {{ i.label }}
            </a-select-option>
          </a-select-opt-group>
          <a-select-opt-group>
            <span slot="label" class="select-title">系统数据项</span>
            <a-select-option
              v-for="(i,index) in sourceOptions"
              :key="index"
              :value="i.value"
              v-if="i.isSystem"
            >
              {{ i.label }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>

        <template v-else>{{ item.source.name }}</template>
      </a-col>

      <a-col
        class="col"
        :span="4"
        v-if="!editable"
      >
        <a-switch :checked="item.isConst" @change="e => onIsConstChange(e,item)"/>
      </a-col>

      <a-col class="col" :span="span">
        <a-input
          v-if="item.isConst"
          v-model="item.target"
          @change="onChange"
        />

        <a-select
          v-else
          :value="item.target.code"
          :allowClear="!editable"
          :options="sourceTargetOptionsMap[item.source.code]"
          @change="e => onTargetItemChange(e,item)"
        ></a-select>
      </a-col>

      <a-col
        class="col"
        :span="4"
        v-if="editable"
      >
        <a-icon type="delete" @click="remove(index)"></a-icon>
      </a-col>
    </a-row>

    <div class="actions" v-if="editable">
      <a-button
        v-if="canAdd"
        icon="plus"
        @click="add"
      >新增字段</a-button>
    </div>

    <div class="message" v-if="showMsg">
      请检测当前表单是否已发布，或绑定的列表<template v-if="editable">展示字段是否有同类型数据项！</template><template v-else>是否设置了查询条件！</template>
      <!-- 请检查当前表单是否发布或绑定的列表 -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator';

import {
  textDataItemOperators,
  numberDataItemOperators,
  logicDataItemOperators,
  DataItem,
  DateItemOperatorType
} from './data-item';

import { Select, Row, Col } from 'h3-antd-vue';

import { DataItemType, NumberFormatType } from '@cloudpivot/form/schema';

export interface DataitemSource {
  title: string;

  items: DataItem[];
}

export interface DataitemMappingValueItem {
  source: DataItem;
  isConst: boolean;
  target: DataItem | string;
}

interface SelectOption {
  label: string;
  value: string;
  type: DataItemType;
  disabled: boolean;
  item: DataItem;
}

@Component({
  name: 'dataitem-mapping',
  components: {
    ASelect: Select,
    ARow: Row,
    ACol: Col,
    ASelectOption: Select.Option
  }
})
export default class DataitemMapping extends Vue {
  @Prop({
    default: {}
  })
  source!: DataitemSource;

  @Prop({
    default: {}
  })
  target!: DataitemSource;

  @Model('change')
  value!: DataitemMappingValueItem[];

  @Prop({
    default: false
  })
  editable!: boolean;

  selected: DataitemMappingValueItem[] = [];

  sourceOptions: SelectOption[] = [];

  targetOptions: SelectOption[] = [];

  sourceTargetOptionsMap: any = {};

  // canAdd = false;

  showMsg = false;

  get span() {
    // return this.editable ? 10 : 12;
    return 10;
  }

  // getTargetOptions(type: DataItemType) {
  //   return this.targetOptions.filter(p => p.type === type);
  // }

  getTargetOptions(item: DataItem) {
    return this.targetOptions.filter((p) => {
      const sameType = p.type === item.type;
      if (sameType && item.type === DataItemType.RelevanceForm) {
        return item.relativeCode === p.item.relativeCode;
      }
      return sameType;
    });
  }

  mapToOption(x: DataItem) {
    const label = x.parentCode
      ? `${x.name}[${x.parentCode}.${x.code}]`
      : `${x.name}[${x.code}]`;
    return {
      value: x.code,
      label,
      type: x.type,
      disabled: false,
      isSystem: x.isSystem,
      item: x
    };
  }

  mapToDataItem(x: SelectOption): DataItem {
    // return {
    //   code: x.value,
    //   name: x.label,
    //   type: x.type
    // } as any;
    return x.item;
  }

  @Watch('source', {
    immediate: true
  })
  onSourceChange(source: DataitemSource) {
    if (!source) {
      return;
    }
    // console.log('aaa', source);
    this.sourceOptions = source.items.map(this.mapToOption);
    this.onTargetChange(this.target);
    // console.log('ddd', this.sourceOptions);
    // this.canAdd = this.calculateCanAdd();
    this.showMsg = !this.canAdd;
  }

  @Watch('target', {
    immediate: true
  })
  onTargetChange(target: DataitemSource) {
    if (!target) {
      return;
    }
    this.targetOptions = target.items
      .filter((item) => {
        if (this.editable) {
          return !item.isSystem;
        }
        return true;
      })
      .map(this.mapToOption);
  }

  @Watch('value', {
    immediate: true
  })
  onValueChange(val: DataitemMappingValueItem[]) {
    if (val) {
      setTimeout(() => {
        this.selected = JSON.parse(JSON.stringify(val));

        const map = {} as any;

        this.selected.forEach((item) => {
          this.findSourceOptionAndDisabled(item.source.code, true);
          if (typeof item.target !== 'string') {
            this.findTargetOptionAndDisabled(item.target.code, true);
          }
          map[item.source.code] = this.getTargetOptions(item.source);
        });

        this.sourceTargetOptionsMap = map;
      }, 10);
    }
  }

  onIsConstChange(checked: boolean, item: DataitemMappingValueItem) {
    if (checked) {
      item.target = '';
    } else {
      (item as any).target = {};
    }
    item.isConst = checked;
    this.onChange();
  }

  findSourceOptionAndDisabled(code: string, disabled: boolean) {
    const so = this.sourceOptions.find(soItem => soItem.value === code);
    if (so) {
      so.disabled = disabled;
    }
  }

  onSourceItemChange(item: DataitemMappingValueItem) {
    this.findSourceOptionAndDisabled(item.source.code, true);
    const item2 = this.source.items.find(x => x.code === item.source.code);
    if (item2) {
      item.source = Object.assign({}, item2);

      const targetOpts = this.getTargetOptions(item2);

      if (typeof item.target !== 'string') {
        const target = item.target;
        if (
          targetOpts.length &&
          !targetOpts.some(x => x.value === target.code)
        ) {
          this.findTargetOptionAndDisabled(target.code, false);
          item.target = this.mapToDataItem(targetOpts[0]);
        } else {
          this.findTargetOptionAndDisabled(target.code, false);
          item.target = {
            code: ''
          } as any;
        }
      }

      this.sourceTargetOptionsMap[item2.code] = targetOpts;
    }
    this.onChange();
  }

  findTargetOptionAndDisabled(code: string, disabled: boolean) {
    const so = this.targetOptions.find(soItem => soItem.value === code);
    if (so) {
      so.disabled = disabled;
    }
  }

  onTargetItemChange(selectedCode: string, item: DataitemMappingValueItem) {
    // allowClear:true时，点击清楚item.target.code为undefined，
    // 但我们需要将选中的选项disabled设为false

    if (typeof item.target !== 'string') {
      if (item.target.code !== selectedCode) {
        if (item.target.code) {
          this.findTargetOptionAndDisabled(item.target.code, false);
        }
        item.target.code = selectedCode;
      }
    }
    this.onChange();
  }

  findNext() {
    const sourceItems = this.sourceOptions.filter(op => !op.disabled);
    if (sourceItems.length < 0) {
      return;
    }

    let targetItem: any;
    let sourceItem: any;
    for (const option of sourceItems) {
      sourceItem = option;
      targetItem = this.getTargetOptions(option.item).find(x => !x.disabled);
      if (targetItem) {
        break;
      }
    }

    if (!targetItem) {
      return;
    }

    return [sourceItem, targetItem];
  }

  get canAdd() {
    const next = this.findNext();
    return !!next;
  }

  add() {
    const next = this.findNext();
    if (!next) {
      return;
    }

    const sourceItem = next[0];
    const targetItem = next[1];

    sourceItem.disabled = true;
    targetItem.disabled = true;

    this.selected.push({
      source: this.mapToDataItem(sourceItem),
      isConst: false,
      target: this.mapToDataItem(targetItem)
    });

    this.onChange();
  }

  remove(index: number) {
    const item = this.selected[index];
    this.findSourceOptionAndDisabled(item.source.code, false);
    if (typeof item.target !== 'string') {
      this.findTargetOptionAndDisabled(item.target.code, false);
    }
    this.selected.splice(index, 1);
    this.onChange();
  }

  onChange() {
    // this.canAdd = this.calculateCanAdd();
    this.$emit('change', this.selected);
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-row-flex {
  border-bottom: 1px solid #e9e9e9;
}

.header > .col {
  height: 38px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  background: #fafafa;

  &:not(:last-child)::after {
    content: "";
    width: 1px;
    height: 22px;
    background-color: #e8e8e8;
    position: absolute;
    right: 0;
  }
}

.col {
  padding: 3px 16px;
  display: flex;
  align-items: center;

  .ant-select {
    width: 100%;
  }
}

.actions {
  text-align: center;
  & > button {
    border: 0;
  }
}

.message {
  margin-top: 2em;
}
</style>
