
<template>
  <div class="iphone-x">
    <div class="iphone-x-view">
      <div class="iphone-x-view-header">
        <span style="padding-top: 3px;">
          chinaNet
        </span>
        <div></div>
        <span>
          <i class="icon aufontAll h-icon-all-singnal"></i>
          <i class="icon aufontAll h-icon-all-wifi1"></i>
          <i class="icon aufontAll h-icon-all-cell"></i>
        </span>
      </div>
      <div class="iphone-x-view-content">
        <slot></slot>
      </div>
      <div class="iphone-x-view-footer">
        <div></div>
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator';

@Component({
  name: "iphone-x"
  })
export default class IphoneX extends Vue {}
</script>


<style lang="less" scoped>
// @import '../../../../node_modules/import StaffSelector from "@cloudpivot/form/src/renderer/components/shared/staff-selector.vue";/src/components/mobile/style/mobile.less';

.iphone-x {
  margin: 8px auto;
  box-shadow: 0 12px 29px 0 rgba(0, 0, 0, 8%);
  background: rgba(0, 0, 0, 0.85);

  .iphone-x-view {
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    position: relative;
    z-index: 99;
    display: flex;
    flex-direction: column;

    &-header {
      display: flex;
      justify-content:space-around;
      padding: 0 1em;
      flex-shrink: 0;

      & > span{
        font-size: 14px;
        display: inline-block;
        transform: scale(0.8);
        i{
          margin-left: 2px;
        }
      }

      & > div{
        width: 50%;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.85);
      }

    }

    &-content {
      overflow: scroll;
      flex-grow: 1;
      &::-webkit-scrollbar {
        width: 0;
      }
    }

    &-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1em;
      flex-shrink: 0;

      & > div{
        height: 3px;
        width: 50%;
        border-radius: 10px;
        background-color: #8e8e8e;
      }

    }
  }
}

// @media screen and (min-device-height: 768px) {

  & .iphone-x {
    width: 384px;
    height: 800px;
    border-radius: 52px;
    padding: 14px;

    .iphone-x-view {
      border-radius: 30px;
      font-size: 14px;
      &-header > div {
        height: 22px;
        border-radius: 0 0 11px 11px;
      }
      &-header > span{
        font-size: 14px;
        transform: scale(0.8);
        i{
          margin-left: 2px;
        }
      }
      &-content{
        // /deep/.h3-panel > .h3-panel-header {
        //   height:45px !important;
        //   line-height:24px;
        // }
      }
    }
  }
// }
// @media screen and (min-device-height: 900px) {
//   @font-size-middle:16px;

//   & .iphone-x {
//     width: 294px;
//     height: 600px;
//     border-radius: 40px;
//     padding: 10px;
//     font-size: @font-size-middle;

//     .iphone-x-view {
//       border-radius: 36px;
//       font-size: @font-size-middle;
//       &-header > div {
//         height: 28px;
//         border-radius: 0 0 14px 14px;
//       }
//       &-header > span{
//         font-size: @font-size-middle;
//         transform: scale(0.9);
//         i{
//           margin-left: 2px;
//         }
//       }
//       &-content{
//         /deep/.h3-panel > .h3-panel-header {
//           height:@lable-height-middle !important;
//           line-height:24px;
//         }
//       }
//     }
//   }
// }
// @media screen and (min-device-height: 1080px) {
//   @font-size-large:17px;

//   & .iphone-x {
//     width: 384px;
//     height: 800px;
//     border-radius: 52px;
//     padding: 14px;
//     font-size: @font-size-large;

//     .iphone-x-view {
//       border-radius: 48px;
//       font-size: @font-size-large;
//       &-header > div {
//         height: 38px;
//         border-radius: 0 0 19px 19px;
//       }
//       &-header > span{
//         font-size: @font-size-large;
//         transform: scale(1);
//         i{
//           margin-left: 4px;
//         }
//       }
//       &-content{
//         /deep/.h3-panel > .h3-panel-header {
//           height:@lable-height-large !important;
//           line-height:30px;
//         }
//       }
//     }
//   }
// }
</style>

