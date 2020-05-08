<template>
  <div class="apps-select">
    <a-select
      mode="multiple"
      style="width: 100%"
      @change="onChange"
      placeholder="请选择"
      v-model="selectedCode"
      :filterOption="filterOption"
    >
      <a-select-option
        v-for="option of list"
        :key="option.code" 
        :value="option.code"
      >{{ option.name }}</a-select-option>
    </a-select>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Model, Watch
} from 'vue-property-decorator';
import { TreeSelect } from 'h3-antd-vue';
import appsApi from '@/apis/apps';

const { SHOW_PARENT } = TreeSelect;

@Component({
  name: 'apps-select',
  components: {
  }
})
export default class AppsSelect extends Vue {
  @Model('change') selectData! : Array<string>;

  list :any[] = [];

  value: Array<string> = [];

  treeData:any[] = [];

  selectedCode:any = [];

  created() {
    const vm:any = this;
    appsApi.getAppList().then((res:any) => {
      if (res.data && res.data.length > 0) {
        // 获取接口列表并去重
        const temp = new Map()
        res.data.forEach((r:any) => {  
           temp.set(r.code,{  
            code:r.code,
            name:r.name
          })
        }); 
        // 把新的值给重新赋值给list
        for (var [key, value] of temp) {
          this.list.push(value)
        }
      }
    });
  }

  filterOption(inputVal:string,option:any){
     return (
          option.componentOptions.children[0].text.indexOf(inputVal) >= 0
        );
  } 

  /**
   * 选择后处理数据，返回后台
   */
  onChange(val:any) {
    this.list.filter(x => x.code.indexOf(val) > -1)
    var toEmit:any = [];
    for (var code of val) {
          toEmit.push(this.list.find((r:any) => r.code === code))
    }
    this.$emit('change',toEmit);  
  }
  @Watch('selectData')
  onSelectDataChange() {
    this.value = this.selectData.map((res:any) => res.code);
    this.selectedCode = this.selectData.map((res:any) => res.code ); 
  }
}
</script>
<style lang="less" scoped>
.apps-select{
  &__item{
    width: 100%;
  }
}
</style>

<style lang="less">
</style>