<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  Modal, Button
} from 'h3-antd-vue';

@Component({
  name: 'form-confirm'
})
/**
 * 表单确认窗体
 */
export default class FormConfirm extends Vue {
  @Prop() title!: string;// 标题

  @Prop() content!: string | Function;// 内容

  @Prop() width!: number;// 宽度

  @Prop({ default: () => ['cancel', 'ok'] }) buttons!: string[];

  @Prop({ default: () => ['取消', '确定'] }) buttonsText!: string[];

  @Prop() align!: string;// 文字对齐方式

  @Prop({ default: true }) oKDestoryed!: boolean;

  render(h:any) {
    console.log(this.$route);
    const self: this = this;
    const buttonsRender:any = [];
    let cops: any = null;

    if (typeof self.content === 'function') {
      cops = self.content(
        (...options: any) => {
          if (options[1]) {
            if (options[1] instanceof Object && options[1] instanceof Array) {
              options.splice(1, 0, { ref: 'content' });
            } else {
              options[1].ref = 'content';
            }
          } else {
            options[1] = { ref: 'content' };
          }
          return h(...options);
        }
      );
    } else {
      cops = h('p', {  class: self.align, ref: 'content' }, self.content);
    }
    if (this.buttons.length) {
      this.buttons.forEach((name: string) => {
        switch (name) {
          case 'ok':
            buttonsRender.push(h(Button, {
              props: {
                type: 'primary'
              },
              on: {
                click: (e: any) => {
                  if (self.oKDestoryed) {
                    self.$emit('ok', e, self.$refs.content);
                    self.$destroy();
                  } else {
                    self.$emit('oKCallBack', self);
                    self.$emit('ok', e, self.$refs.content);
                  }
                }
              }
            }, this.buttonsText[1]));
            break;
          case 'cancel':
            buttonsRender.push(h(Button, {
              on: {
                click: (e: any) => {
                  self.$emit('cancel', e, self.$refs.content);
                  self.$destroy();
                }
              }
            }, this.buttonsText[0]));
            break;
          default:
            break;
        }
      });
    }
    return h(
      Modal,
      {
        class: {
          'form-confirm': true
        },
        props: {
          title: self.title,
          visible: true,
          maskClosable: false,
          width: self.width || 432,
          okText: '确定',
          cancelText: '取消',
          footer: () => buttonsRender
        },
        on: {
          cancel: (e: any) => {
            self.$emit('cancel', e, self.$refs.content);
            self.$destroy();
          }
        }
      }, [cops]
    );
  }

  destroyed() {
    this.$emit('destroy');
  }
}
</script>
<style lang="less">
// @import "../../../styles/themes/default.less";
.form-confirm{
  .ant-modal-header,
  .ant-modal-footer
  {
    padding: 0 @base4-padding-lg;
    height: 56px;
    border: 0;
  }
  .ant-modal-header{
    .ant-modal-title{
      line-height: 56px;
      color: @light-color-1;
      font-size: @font-size-16;
      font-weight:@font-weight-lg;
    }
  }
  .ant-modal-body{
      min-height: 114px;
    .center{
      text-align: center;
    }
    .left{
      text-align: left;
    }
    .right{
      text-align: right;
    }
  }
}
</style>
