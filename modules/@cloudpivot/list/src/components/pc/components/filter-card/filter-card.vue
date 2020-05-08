<template>
  <span class="filter-card mr16" v-if="source.length === 1">

    <template v-if="sourceSingle.type === 4">
      <span class="item-title" :title="isChinese ? sourceSingle.name : JSON.parse(sourceSingle.name_i18n)[$i18n.locale]">{{ isChinese ? sourceSingle.name : JSON.parse(sourceSingle.name_i18n)[$i18n.locale] }}:  </span>
      <img
        class="logic-img"
        v-if="sourceSingle.content"
        src="./images/on.png"
        alt=""
      />
      <img
        class="logic-img"
        v-else
        src="./images/off.png"
        alt=""
      />
      <i 
        class="icon aufontAll  h-icon-all-close"
        @click.stop="clear"
        style="vertical-align: unset">
      </i>
    </template>

    <template v-else>
      <span class="item-title-all" :title="isChinese ? sourceSingle.name : JSON.parse(sourceSingle.name_i18n)[$i18n.locale] + ': ' + contentHandler(sourceSingle.type)">{{ isChinese ? sourceSingle.name : JSON.parse(sourceSingle.name_i18n)[$i18n.locale] }}: {{ contentHandler(sourceSingle.type) }}</span>
      <i class="icon aufontAll  h-icon-all-close" @click.stop="clear"></i>
      <!-- <span class="item-num" v-if="sourceSingle.type === -2" :title="sourceSingle.content[$i18n.locale]">{{ sourceSingle.content[$i18n.locale] }}</span>
      <span class="item-num" v-else-if="sourceSingle.type === -10" :title="isChinese ? sourceSingle.content.name : sourceSingle.content.name_i18n[$i18n.locale]">{{ isChinese ? sourceSingle.content.name : sourceSingle.content.name_i18n[$i18n.locale] }}</span>
      <span class="item-num" v-else :title="">{{ getContent(sourceSingle.content, sourceSingle.type) }} </span>   -->
    </template>
  </span>

  <span class="filter-card" v-else-if="source.length > 1"> 
    <span @click="itemClick">
      <i class="icon aufontAll  h-icon-all-filter-o" ></i> 
      {{ source.length }} {{ $t('cloudpivot.flowCenter.pc.item') }}
    </span> 
    <i class="icon aufontAll  h-icon-all-close" @click="clear"></i>
  </span>
</template>

<script lang='ts'>
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { DataItemType } from '@cloudpivot/form/schema';
  interface Source {
    name: string,
    name_i18n: string,
    type: number,
    content: string
  }

  @Component({
  name: "FilterCard",
  })
  export default class FilterCard extends Vue {
    @Prop() source !: Array<Source>;

    get sourceSingle(){
      return this.source[0];
    }

    get isChinese() {
      return this.$i18n.locale === 'zh';
    }

    contentHandler(type:number) {
      if (type === -2) {
        return this.sourceSingle.content[this.$i18n.locale];
      } else if (type === -10) {
        return this.isChinese ? (this.sourceSingle.content as any).name : (this.sourceSingle.content as any).name_i18n[this.$i18n.locale]
      } else {
        return this.getContent(this.sourceSingle.content, this.sourceSingle.type)
      }
    }

    getContent(content:string, type: number){
      switch(type){
        case DataItemType.StaffSelector:
          const c:any = JSON.parse(content)[0];
          return c.name;
        case DataItemType.Address:
          const address:any = JSON.parse(content);
          return `${address.provinceName}${address.cityName}${address.districtName}`;
        case DataItemType.Number:
          return content.split(';').join('-');
        case DataItemType.Date:
          return content.split(';').join('-');
        default:
          return content;

      }
    }

    clear(){
      this.$emit('clear');
    }

    itemClick(){
      this.$emit('item-click');
    }
    created() {
      console.log('filter card 1231231')
    }

  }
</script>

<style lang="less">
.filter-card {
  display: inline-block;
  padding: 0 8px;
  color: @primary-color;
  border: 1px solid @primary-color;
  border-radius: 4px;
  cursor: pointer;
  .icon {
    font-size: 12px;
    display: inline-block;
    vertical-align: text-bottom;
  }
  .logic-img {
    margin: 0 8px;
  }
  &.mr16 {
    margin-right: 16px;
  }
  .item-title {
    display: inline-block;
    max-width: 96px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 22px;
    line-height: 22px;
    vertical-align: middle;
    &-all {
      display: inline-block;
      margin-right: 4px;
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 22px;
      line-height: 22px;
      vertical-align: bottom;
    }
  }
  .item-num {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin-right: 8px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }
}
</style>

