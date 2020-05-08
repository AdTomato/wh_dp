<template>
  <div class="signatrue">
    <div class="signatrue--row clearfix">
      <div class="row__file" @click="showSignatrue">
        <div class="field__label">
          <div class="required">
            <svg
              v-if="required"
              width="8"
              height="8"
              fill="red"
              name
              viewBox="0 0 200 200"
            >
              <path
                d="M141.362 86.037L104.838 100l36.512 13.963c9.3 3.587 14.675 6.45 16.113 8.6 1.425 2.15 2.15 4.3 2.15 6.45 0 5.737-1.088 8.962-3.263 9.662a20.358 20.358 0 0 1-6.5 1.075c-2.187 0-4.35-.538-6.512-1.613-2.175-1.075-4.7-2.687-7.588-4.837l-33.587-30.075 7.6 45.112c.712 2.15 1.075 4.125 1.075 5.913v3.762c0 4.3-1.075 7.35-3.25 9.125-2.175 1.8-4.7 2.688-7.588 2.688-2.212 0-4.6-.713-7.187-2.15-2.588-1.425-3.863-4.65-3.863-9.663 0-1.425.188-2.862.55-4.3.375-1.425.55-3.225.55-5.375l8.825-45.112L64.65 133.3a121.392 121.392 0 0 1-7.187 4.3c-2.588 1.437-4.963 2.15-7.163 2.15-2.212 0-4.412-.713-6.625-2.15-2.212-1.425-3.312-4.3-3.312-8.6 0-2.863 1.075-5.375 3.225-7.525s7.15-4.65 15.037-7.525L95.175 100 58.65 86.037c-5.012-2.15-9.312-4.112-12.887-5.912-3.588-1.788-5.375-4.838-5.375-9.125 0-3.575 1.075-6.263 3.237-8.063 2.175-1.775 4.325-2.687 6.513-2.687 2.162 0 4.512.537 7.05 1.612 2.512 1.075 4.862 2.688 7.05 4.838l33.6 30.075-7.588-45.113c0-2.15-.187-3.925-.55-5.375a16.822 16.822 0 0 1-.537-4.3c0-2.862 1.075-5.537 3.25-8.062 2.175-2.488 4.712-3.75 7.587-3.75 4.425 0 7.338 1.437 8.838 4.3 1.462 2.862 2.212 5.375 2.212 7.525v4.837c0 1.8-.375 3.4-1.112 4.838l-8.825 45.1L135.325 66.7c2.938-2.863 5.5-4.65 7.725-5.375 2.213-.713 4.413-1.075 6.625-1.075 2.938 0 5.325 1.075 7.163 3.225s2.787 4.662 2.787 7.525c0 2.862-.725 5.2-2.15 6.987-1.45 1.788-6.812 4.475-16.112 8.05z"
              />
            </svg>
          </div>
          <span :style="labelStyle">{{ title }}</span>
        </div>
        <div class="field__content">
          <template v-if="!readonly && !img">{{ $t('cloudpivot.form.renderer.addition') }}</template>
          <span v-if="!readonly" class="icon aufontAll">&#xe89b;</span>
        </div>
      </div>
      <div v-if="img" class="img__wrap">
        <img :src="img" @click="$emit('imageClick')" />
        <div
          class="img__delete"
          @click="deleteImg"
          v-if="!readonly"
        >
          <span class="icon aufontAll">&#xe994;</span>
        </div>
      </div>
    </div>

    <div>
      <h3-modal
        v-control-back
        :popupDirection="'left'"
        :appendToBody="true"
        :show="isFocus"
        type="popup"
        :popupScale="100"
      >
        <div class="signatrue-panel">
          <!-- <div class="signatrue-panel__title">
            <div><span>{{ $t('cloudpivot.form.renderer.addSign') }}</span> </div>
            <div @click="back" class="signatrue-panel__title--back"><span class="icon aufontAll">&#xe895;</span>{{ $t('cloudpivot.form.renderer.back') }}</div>
          </div>-->
          <div class="signatrue-panel__content" ref="signatruewrap">
            <h3-signature
              ref="signature"
              :clip="true"
              :maxWidth="1"
              :maxHeight="1"
              :width="signatrueWidth"
              :height="signatrueHeight"
              :onBegin="onBegin"
              @saveAsPng="saveAsPng"
            ></h3-signature>
          </div>
          <div class="signatrue-panel__footer clearfix">
            <div class="button clearfix">
              <div class="left-btn">
                <h3-button
                  :disabled="isRest"
                  @click="reset"
                >{{ $t('cloudpivot.form.renderer.reset') }}</h3-button>
              </div>
              <div class="right-btn">
                <h3-button type="primary" @click="ok">{{ $t('cloudpivot.form.renderer.ok') }}</h3-button>
              </div>
            </div>
          </div>
        </div>
      </h3-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";
import { H3Modal, H3Signature, H3Button } from "h3-mobile-vue";

import ControlBack from "../../directives/control-back";

@Component({
  name: "signatrue",
  components: {
    H3Modal,
    H3Signature,
    H3Button
  },
  directives: {
    ControlBack
  }
})
export default class Signatrue extends Vue {
  @Model("change")
  value!: string;

  @Prop({
    default: false
  })
  readonly!: boolean;

  @Prop({
    default: "手写签名"
  })
  title!: string;

  @Prop({
    default: false
  })
  required!: boolean;

  @Prop({
    default: () => ({})
  })
  labelStyle!: any;

  isFocus: boolean = false;

  signatrueHeight: number = 0;

  signatrueWidth: number = 0;

  isRest: boolean = true;

  img: string = "";

  signature: any = {};

  mounted() {
    this.img = this.value;
    this.signature = this.$refs.signature;
  }

  show() {
    this.isFocus = true;
  }

  close() {
    this.isFocus = false;
  }

  showSignatrue() {
    if (this.readonly) return;
    this.isFocus ? this.close() : this.show();

    this.$nextTick(() => {
      const content: any = this.$refs.signatruewrap;

      this.signatrueHeight = content.offsetHeight;

      this.signatrueWidth = content.offsetWidth;
    });
  }

  back() {
    this.close();
  }

  reset() {
    this.signature.clear();

    this.isRest = true;
  }

  onBegin() {
    this.isRest = false;
  }

  ok() {
    this.signature.saveAsPng();
  }

  saveAsPng(data: any) {
    // debugger
    this.img = data;

    this.close();

    this.reset();

    this.$emit("change", this.img);
  }

  deleteImg() {
    if (this.readonly) return;
    this.img = "";

    this.isRest = false;

    this.$emit("change", this.img);
  }

  @Watch("value")
  onValueChange(val: string) {
    if (val) {
      this.img = val;
    }
  }
}
</script>
<style lang="less" scoped>
.scale-hairline-common(@color, @top, @right, @bottom, @left) {
  content: "";
  position: absolute;
  background-color: @color;
  display: block;
  z-index: 1;
  top: @top;
  right: @right;
  bottom: @bottom;
  left: @left;
}
.hairline(@direction, @color: @border-color-base) when (@direction = "bottom") {
  border-bottom: 1px solid @color;

  html:not([data-scale]) & {
    @media (min-resolution: 2dppx) {
      border-bottom: none;

      &::after {
        .scale-hairline-common(@color, auto, auto, 0, 0);
        width: 100%;
        height: 1px;
        transform-origin: 50% 100%;
        transform: scaleY(0.5);

        @media (min-resolution: 3dppx) {
          transform: scaleY(0.33);
        }
      }
    }
  }
}

.hairline(@direction, @color: @border-color-base, @radius: 0)
  when
  (@direction = "all") {
  border: 1px solid @color;
  border-radius: @radius;

  html:not([data-scale]) & {
    @media (min-resolution: 2dppx) {
      position: relative;
      border: none;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        border: 1px solid @color;
        border-radius: @radius * 2;
        transform-origin: 0 0;
        transform: scale(0.5);
        box-sizing: border-box;
        pointer-events: none;

        // @media (min-resolution: 3dppx) {
        //   width: 300%;
        //   height: 300%;
        //   border-radius: @radius * 3;
        //   transform: scale(0.33);
        // }
      }
    }
  }
}

.signatrue {
  position: relative;
  .hairline("bottom", #eee);
  text-align: left;
  background: #fff;
  &--row {
    .row__file {
      font-size: 15px;
      padding: 10px 15px;
      display: flex;
      text-align: left;
      .field__label {
        width: 106px;
        flex: none;
        position: relative;
        .required {
          left: -8px;
          top: 0;
          position: absolute;
          //  color:red;
        }
      }
      .field__content {
        color: #999;
        flex: 1;
        .icon {
          font-size: 12px;
          float: right;
          line-height: 15px;
        }
      }
    }

    .img__wrap {
      margin: 0 15px;
      position: relative;
      float: left;
      .hairline("all", rgba(221, 221, 221, 1));
      border-radius: 0.08rem;
      margin-bottom: 0.346rem;
      img {
        width: 2rem;
        height: 2rem;
      }
      .img__delete {
        color: #666;
        width: 0.64rem;
        height: 0.64rem;
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
<style lang="less">
.signatrue-panel {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  &__title {
    flex: none;
    position: relative;
    text-align: center;
    color: #333;
    font-size: 0.48rem;
    font-weight: 500;
    &--back {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 0.42rem;
      color: @primary-color;
      span {
        padding-left: 0.4rem;
        padding-right: 0.16rem;
      }
    }
  }
  &__content {
    overflow: hidden;
    flex: 1;
  }
  &__footer {
    //  display: flex;
    .button {
      float: left;
      z-index: 100;
      width: 100%;
      // display: flex;
      // margin: 0 auto;
      margin-bottom: 0.213rem;
      & > div {
        width: 4rem;
        // float:left;
        flex: 1;
        &.right-btn {
          float: right;
          margin-right: 0.507rem;
        }
        &.left-btn {
          float: left;
          margin-left: 0.507rem;
        }
        .h3-button {
          // margin-left: 0.49rem;
          // margin-right: 0.49rem;
          height: 1.07rem;
          line-height: 1.07rem;
          border-radius: 0.667rem;
          &.h3-button-primary {
            background-color: @primary-color;
          }
          &.h3-button-primary,
          &.h3-button-primary::before {
            border: none;
          }
          &:not(.h3-button-primary) {
            overflow: visible;
          }
          &:not(.h3-button-primary)::before {
            border-radius: 50px !important;
          }
        }
      }
    }
  }
}
</style>

