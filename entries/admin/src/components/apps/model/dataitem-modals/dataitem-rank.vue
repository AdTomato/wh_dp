<template>
  <div class="dataitem-rank clearfix">
    <Draggable
      element="div"
      id="dataitemrank"
      :list="itemList"
      :options="dragItemOptions"
      @end="onSortEnd"
    >
      <div
        v-for="item in itemList"
        :key="item.code"
        class="dataitem-rank__item clearfix"
        @mouseover="itemOver(item)"
        @mouseleave="itemLeave(item)"
      >
        <span class="dataitem-rank__title">{{ item.name }}</span>
        <span v-if="item.hove" class="icon aufontAll">&#xe63e;</span>
      </div>
    </Draggable>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Draggable from "vuedraggable";

@Component({
  name: "dataitem-rank",
  components: {
    Draggable
  }
})
export default class DataItemRank extends Vue {
  @Prop() dataItemList!: any;

  dragItemOptions: any = {
    animation: 150,
    ghostClass: "ghostClass",
    forceFallback: true,
    fallbackClass: "dragClass",
    touchStartThreshold: 20,
    delay: 100
  };

  itemList = [];
  created() {
    this.itemList = this.dataItemList.map((res: any) => {
      const { code, name_i18n, name } = res;
      return {
        code,
        name,
        name_i18n,
        hove: false
      };
    });
  }

  itemOver(item: any) {
    item.hove = true;
  }
  itemLeave(item: any) {
    item.hove = false;
  }

  onSortEnd(evt: any) {
    const codeList = this.itemList.map((res: any) => {
      return res.code;
    });
    this.$emit("sortEnd", codeList);
  }
}
</script>
<style lang="less" scoped>
.dataitem-rank {
  &__item {
    float: left;
    width: 33.33%;
    line-height: 32px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.85);
    cursor: move;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
    .dataitem-rank__title {
      float: left;
      margin-left: 8px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 75%;
    }
    span {
      margin-left: 8px;
    }
    .icon {
      float: right;
      margin-right: 10px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }
    &:hover {
      background: rgba(232, 252, 244, 1);
    }
  }

  .ghostClass {
    opacity: 1;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
    // position:absolute;
    // border: 1px solid @primary-color;
    * {
      opacity: 0;
    }
    &:after {
      display: block;
      height: 30px;
      position: absolute;
      border: 1px dashed @primary-color;
      width: 100%;
      border-radius: 4px;
    }
  }
  .dragClass {
    // display: none;
    background: rgba(232, 252, 244, 1);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    position: absolute;
  }
}
</style>
