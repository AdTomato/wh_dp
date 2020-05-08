
<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :maskClosable="false"
    :keyboard="false"
    :width="433"
    :visible="visible"
  >
    <div class="h3-message">
      <div class="h3-message__title">
        <a-icon type="check-circle"></a-icon>
        {{ title }}
      </div>
      <div class="h3-message__content">{{ content }}</div>
      <div class="h3-message__timer">
        {{ times }}
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Icon, Modal } from 'h3-antd-vue';

@Component({
  name: 'h3-message',
  components: {
    AModal: Modal,
    AIcon: Icon
  }
})
export default class H3Message extends Vue {
  @Prop()
  duration !: number;

  @Prop()
  title !: string

  @Prop()
  content !: string

  visible = false

  times = 3;

  show() {
    return new Promise<void>((resolve) => {
      this.visible = true;
      this.times = this.duration || 3;
      this.run(resolve);
    });
  }

  run(resolve : (value ?: any) => void) {
    const _this = this;
    setTimeout(() => {
      const t = _this.times - 1;
      if (t === 0) {
        _this.visible = false;
        resolve();
      } else {
        _this.times = t;
        _this.run(resolve);
      }
    }, 1000);
  }
}

</script>

<style lang="less" scoped>

@import "../../../styles/themes/default.less";

/deep/.ant-modal-body{
  padding: 0 !important;
}

.h3-message {
  padding: @base4-padding-md;
  text-align: center;

  &__title {
    font-size: @font-size-16;
    color: @light-color-1;
    margin-bottom: @base4-padding-md;

    & > i {
      color: @success-color;
      margin-right: 8px;
    }
  }

  &__content {
    margin-bottom: @base4-padding-md;
  }

  &__timer {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: @font-size-40;
    color: @primary-color;
    border: 2px solid @primary-color;
  }
}
</style>
