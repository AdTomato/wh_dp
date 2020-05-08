<template>
  <a-modal
    v-model="visible"
    title="添加过滤条件1"
    :width="700"
    :maskClosable="false"
    :keyboard="false"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="ok"
    @cancel="onCancel"
  >
    <!-- 满足以下 -->
    <a-select
      v-model="theConditionType"
      placeholder="请选择类型"
      style="width: 100px"
    > 
      <a-select-option v-for="item in conditionType" :key="item.key">
        {{ item.label }}
      </a-select-option>
    </a-select>
    <!-- 条件 -->
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component({
    name: 'remind-conditions-modal'
})

export default class RemindConditionsModal extends Vue {
  
  @Prop() visible !: boolean

  public theConditionType: string = '1'

  public conditionType: any = [
    { label: '全部', key: '1' },
    { label: '任一', key: '2' }
  ]

  @Emit('ok')
  public ok() {}

  @Emit('onCancel')
  public onCancel() {}
}
</script>

