import {
  Component, Vue
} from 'vue-property-decorator';
import {VNode} from "vue";

class FormError {
  el: HTMLElement;
  parent:HTMLElement;
  tooltip: HTMLElement;
  tipContext: HTMLElement;
  style: HTMLElement = document.createElement('style');
  created: boolean = false;
  constructor(el: HTMLElement) {
    this.el = el;
    this.parent = el.offsetParent || document.body as any;
    this.tooltip = window.document.createElement('div');
    this.tooltip.className = 'form-tooltip';
    this.tipContext = window.document.createElement('div');
    this.tipContext.className = 'form-tooltip-context';
    this.tooltip.appendChild(this.tipContext);
  }
  initStyle(){
    this.style.innerHTML = '.form-tooltip{\n' +
      '    display: none;\n' +
      '    position: absolute;\n' +
      '    text-align: center;\n' +
      '  }\n' +
      '  .form-validate-error{\n' +
      '    border: 1px solid #F5222D !important;\n' +
      '  }\n' +
      '  .form-validate-error:focus{\n' +
      '    box-shadow: 0 0 4px rgba(245,34,45,0.5);\n' +
      '  }\n' +
      '  .form-tooltip.form-tooltip--show{\n' +
      '    display: block;\n' +
      '    animation: form-tooltip--show .2s forwards;\n' +
      '  }\n' +
      '  .form-tooltip.form-tooltip--hide{\n' +
      '    animation: form-tooltip--hide .2s forwards;\n' +
      '  }\n' +
      '  @keyframes form-tooltip--show {\n' +
      '    from {\n' +
      '      opacity: 0;\n' +
      '      margin-bottom: -5px;\n' +
      '    }\n' +
      '    to {\n' +
      '      opacity: 1;\n' +
      '      margin-top: 0;\n' +
      '    }\n' +
      '  }\n' +
      '  @keyframes form-tooltip--hide {\n' +
      '    from {\n' +
      '      opacity: 1;\n' +
      '    }\n' +
      '    to {\n' +
      '      margin-bottom: -5px;\n' +
      '      opacity: 0;\n' +
      '    }\n' +
      '  }\n' +
      '  .form-tooltip .form-tooltip-context{\n' +
      '    display: inline-block;\n' +
      '    text-align: left;\n' +
      '    background-color: rgba(0, 0, 0, 0.75);\n' +
      '    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n' +
      '    border-radius: 4px;\n' +
      '    padding: 6px 8px;\n' +
      '    color: #FFF;\n' +
      '    font-size: 12px;\n' +
      '    line-height: 20px;\n' +
      '    max-width: 100%;\n' +
      '  }\n' +
      '  .form-tooltip .form-tooltip-context:before{\n' +
      '    content: \' \';\n' +
      '    position: absolute;\n' +
      '    width: 0;\n' +
      '    height: 0;\n' +
      '    top: 100%;\n' +
      '    left: 50%;\n' +
      '    margin-left: -5px;\n' +
      '    border: 5px solid transparent;\n' +
      '    border-top-color: rgba(0, 0, 0, 0.75);\n' +
      '  }';
    (document as any).head.appendChild(this.style);
  }
  setPosition(el: HTMLElement){
    this.tooltip.setAttribute('style', `left:${el.offsetLeft}px;bottom:${this.parent.offsetHeight - el.offsetTop+ 5}px;z-index:100;width:${el.offsetWidth}px`);
  }

  create(value: string){
    this.tipContext.innerText = value;
    if(this.tooltip.parentElement !== this.parent){
      this.created = true;
      this.initStyle();
      this.parent.appendChild(this.tooltip);
      this.tooltipShow();
      this.el.classList.add('form-validate-error');
      this.el.addEventListener('focus', this.tooltipShow.bind(this), false);
      this.el.addEventListener('blur', this.tooltipShowHide.bind(this), false);
    }
  }
  tooltipShow(){
    this.setPosition(this.el);
    this.tooltip.style.display = 'block';
    this.tooltip.classList.remove('form-tooltip--hide');
    this.tooltip.classList.add('form-tooltip--show');
  }
  tooltipShowHide(){
    this.tooltip.classList.add('form-tooltip--hide');
    this.tooltip.classList.remove('form-tooltip--show');
    setTimeout(() => {
      this.tooltip.style.display = 'none';
    }, 200);

  }
  destroy(){
   if(!this.created) return;
    this.created = false;
    (document as any).head.removeChild(this.style);
    this.el.classList.remove('form-validate-error');
    this.el.removeEventListener('focus', this.tooltipShow.bind(this), false);
    this.el.removeEventListener('blur', this.tooltipShowHide.bind(this), false);
    this.parent.removeChild(this.tooltip);
  }
}


@Component
export default class FormValidateHandleMixin extends Vue {
  /**
   * 表单元素验证成功处理
   * @param value
   * @param el
   * @param vnode
   */
  formValidateSuccess(value:string, el:string, vnode: VNode){
    if((el as any)._formError)  {
     const formError:FormError = (el as any)._formError as FormError;
      formError.destroy();
    }
  }

  /**
   * 表单元素验证失败处理
   * @param value
   * @param errMsg
   * @param el
   * @param vnode
   */
  formValidateError(value:string, errMsg:string, el:HTMLElement, vnode: VNode){
    let formError: FormError;
    if((el as any)._formError)  {
      formError = (el as any)._formError as FormError;
    }else{
      formError = (el as any)._formError = new FormError(el);
    }
    formError.create(errMsg);
  }
}
