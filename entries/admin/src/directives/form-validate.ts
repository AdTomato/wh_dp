import axios from 'axios';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { getStrLen } from '@/utils/stringHandle';


const keyCodes = [8, 35, 36, 37, 38, 39, 40, 45, 46];


/**
 * 默认系统配置， 支持自定义配置
 */
const defaultRuleOptions = Object.assign({
  local: 'cn',    // 语言 默认中文 （暂时不支持）
  errMsg: () => {       // 默认的错误提示
    return {
      required: '字段不能为空',
      noRegexp: '没有找到正则规则'
    }
  },
  cnChart: false,        // 中文字节 true 算两个字节，false算一个字节
  formRegexp: {
  }
}, (window as any).$defaultRuleOptions || {});

interface FormRegexp {
  regexp: RegExp | Function | string // 正则表达式 可以是正则公式，函数或者字符串 函数（value）必须返回bool类型 字符串匹配全局配置项中formRegexp的key 取出正则表达式
  message: string         // 错误提示
}
interface FormEqualTo {
  key: string // FormRules的key值
  message: string         // 错误提示
}
interface FormCustom {
  validate: boolean // 返回结构
  message?: string  // 错误提示
}
interface FormLength {
  len?: number // 字段长度
  cnChart?: boolean        // 中文字节 true 算两个字节，false算一个字节
  message?: string         // 错误提示
}
/**
 * 表单校验规则
 */
interface FormRule {
  key?: string // 校验key
  value?: string                 // 验证值
  required?: boolean | string    // 是否为空，如果有字符串，在非空提示，没有则默认提示不能为空
  ajax?: Function | string // 远程校验地址 支持自定义校验 返回结果 validate 验证结果  错误消息 message
  regexps?: FormRegexp[] | FormRegexp// 正则校验公式 可以用预置的校验公式，也可以自定义校验公式
  equalTo?: FormEqualTo // 均等哪个字段值
  minLength?: FormLength // 最小长度
  maxLength?: FormLength // 最大长度
  success?: Function // 成功处理
  error?: Function   // 失败处理
}
/**
 * 表单验证实例
 */
class FormValidate {
  el: HTMLElement;
  bind: VNodeDirective;
  vnode: VNode;
  trigger: string;
  success: Function | null = defaultRuleOptions.success;
  error: Function | null = defaultRuleOptions.error;
  items: Array<FormItemValidate> = [];
  constructor(el: HTMLElement, bind: VNodeDirective, vnode: VNode) {
    this.el = el;
    this.bind = bind;
    this.vnode = vnode;
    this.trigger = bind.value.trigger;
    this.init();
  }
  init() {
    if (this.bind.value.error instanceof Function) {
      this.error = this.bind.value.error;
    }
    if (this.bind.value.success instanceof Function) {
      this.success = this.bind.value.success;
    }
    const parent: any = this.vnode.context;
    if (this.trigger) {
      parent[this.trigger] = async () => await this.validate();
    }
    (this.el as any)._formValidate = this;
  }
  async validate() {
    const res: any = [];
    for (const i in this.items) {
      const item = this.items[i];
      const validatedStatus = await item.validatedStatus();
      if (!validatedStatus) {
        res.push(item);
      }
    }
    return res.length <= 0;
  }
}
/**
 * 表单属性验证实例
 */
class FormItemValidate {
  el: HTMLElement;
  bind: VNodeDirective;
  vnode: VNode;
  options: any;
  validated: boolean = false;  //是否校验过
  validate: boolean = true;
  parent: any;
  key: string;
  value: string;
  errMsg: string = '';
  error: Function | null = null;
  success: Function | null = null;

  constructor(el: HTMLElement, bind: VNodeDirective, vnode: VNode) {
    this.el = el;
    this.bind = bind;
    this.options = bind.value;
    this.value = bind.value.value;
    this.key = bind.value.key;
    this.vnode = vnode;
    this.parent = this.getParent(this.el);
    this.init();
  }
  init() {
    if (this.parent) {
      this.parent = this.parent._formValidate;
      this.error = this.parent.error;
      this.success = this.parent.success;
      this.parent.items.push(this);
    }
    if (this.options.success instanceof Function) {
      this.success = this.parent.success;
    }
    if (this.options.error instanceof Function) {
      this.error = this.parent.error;
    }

    const rule: FormRule = this.options;
    const maxLength = rule.maxLength;
    if (maxLength) {
      this.el.onkeydown = (evt: KeyboardEvent) => {
        const input = evt.target as HTMLInputElement;
        if (input.value && maxLength.len && input.value.length >= maxLength.len) {
          if (keyCodes.indexOf(evt.keyCode) === -1) {
            evt.preventDefault();
          }
        }
      };
    }
  }

  /**
   * 获取校验的结果
   */
  async validatedStatus() {
    return this.validated ? this.validate : await this.validateItem();
  }

  /**
   * 表单元素校验
   * @param bind
   */
  async validateItem(bind?: VNodeDirective) {
    this.validated = true;
    if (bind) {
      this.bind = bind;     // 重新赋值对象
      this.options = bind.value;     // 重新赋值配置项
      this.value = bind.value.value;// 重新赋值value
    }
    const value = this.value;
    const rule: FormRule = this.options;
    let validate: boolean = true;
    if (rule.required) {
      if (!value || value === '') {
        validate = false;
        this.errMsg = typeof rule.required === "string" ? rule.required : defaultRuleOptions.errMsg().required;
      }
    }
    if (!!value) {
      // 校验元素是否正确
      validate && rule.minLength && (validate = this.lenCheck(rule.minLength));
      validate && rule.maxLength && (validate = this.lenCheck(rule.maxLength, 'max'));
      validate && rule.ajax && (validate = await this.ajaxCheck(rule.ajax));
      validate && rule.regexps && (validate = this.regexpCheck(rule.regexps));
      validate && rule.equalTo && (validate = this.equalToCheck(rule.equalTo));
    }

    // 成功或者失败提示
    validate && this.success && this.success(this.value, this.el, this.vnode);
    !validate && this.error && this.error(this.value, this.errMsg, this.el, this.vnode);
    this.validate = validate;
    return validate;
  }

  /**
   * 均等检查
   * @param equalTo
   */
  equalToCheck(equalTo: FormEqualTo): boolean {
    let toField: any;
    if (this.parent) {
      toField = this.parent.items.find((item: FormItemValidate) => {
        return item.key === equalTo.key;
      });
      return !toField || toField.value === this.value || !(this.errMsg = equalTo.message);
    }
    return true;
  }

  /**
   * 正则检查
   * @param regexps
   */
  regexpCheck(regexps: FormRegexp[] | FormRegexp): boolean {
    if (!(regexps instanceof Array)) {
      regexps = [regexps];
    }
    const res: FormRegexp | undefined = regexps.find((regexp: FormRegexp) => {
      let validate: boolean = true;
      if (typeof regexp.regexp === 'string') {
        const defRegexp: RegExp = defaultRuleOptions.formRegexp[regexp.regexp];
        if (!defRegexp) {
          this.errMsg = defaultRuleOptions.errMsg().noRegexp;
          return true;
        }
        validate = defRegexp.test(this.value);
      } else if (regexp.regexp instanceof RegExp) {
        validate = regexp.regexp.test(this.value);

      } else if (regexp.regexp instanceof Function) {
        validate = regexp.regexp(this.value);
      }
      !validate && (this.errMsg = regexp.message);
      return !validate;
    });
    return !res;
  }
  /**
   * 长度检查
   * @param formLength
   * @param type
   */
  lenCheck(formLength: FormLength, type = 'min'): boolean {
    const cn = typeof formLength.cnChart === 'boolean' ? formLength.cnChart : defaultRuleOptions.cnChart;
    const strLen: number = getStrLen(this.value, cn);

    const res = type === 'min' ? strLen >= (formLength.len || 0) : strLen <= (formLength.len || 0);
    !res && (this.errMsg = formLength.message || '');
    return res;
  }

  /**
   * 异步执行校验检查
   * @param ajax
   */
  ajaxCheck(ajax: any): Promise<any> {
    let resPromise: any;
    if (ajax instanceof Function) {
      resPromise = new Promise((resolve: Function, reject: Function) => {
        ajax(this.value, resolve, reject);
      });
    } else if (typeof ajax === 'string') {
      resPromise = axios.get(ajax, { params: { value: this.value } });
    }
    return resPromise.then((res: FormCustom) => {
      this.errMsg = res.message || '';
      return res.validate;
    }).catch((error: any) => {
      this.errMsg = error.message || '';
      return false;
    });
  }

  /**
   * 获取表单主体
   * @param element
   */
  getParent(element: HTMLElement): any {
    if (element.parentElement && !(element.parentElement as any)._formValidate) {
      return this.getParent(element.parentElement);
    }
    return element.parentElement;
  }

}


export const formItemDirective: DirectiveOptions = {
  inserted(el: HTMLElement, bind: VNodeDirective, vnode: any) {
    (el as any)._formItemValidate = new FormItemValidate(el, bind, vnode);
  },
  update(el: HTMLElement, bind: VNodeDirective, vnode: any) {
    (el as any)._formItemValidate.validateItem(bind);
  }
};

export const formDirective: DirectiveOptions = {
  bind(el: HTMLElement, bind: VNodeDirective, vnode: any) {
    new FormValidate(el, bind, vnode);
  }
};

export default {
  formDirective,
  formItemDirective
};
