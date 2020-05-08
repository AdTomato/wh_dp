
const base = {
  'border-color': '#d9d9d9', // 边框色
  'background-color': 'rgba(41,112,255,0.1)', // 背景色
  'primary-light-color': 'rgba(41, 112, 255, 0.2)', // 边框色

  'error-bd-color': '#e0b4b4', // 错误边框色
  'error-bg-color': '#fff6f6', // 错误背景色
  'error-color': '#F4454E', //错误字体色
  'danger-color':'#F5222D',
  'normal-color': '#d9d9d9',
  'primary-color': '#2970ff', // 全局主色
  'success-color': '#32B683',
  'warning-color ': '#FAAD14',

  'base-border-color': '#E6EBF6',
  
  'base10-padding-lg': '30px', // base10 paddings 10的倍数
  'base10-padding-md': '20px',
  'base10-padding-sm': '10px', // base
  'base4-padding-base': '4px', // base
  'base4-padding-lg': '24px', // containers
  'base4-padding-md': '16px', // small containers and buttons
  'base4-padding-sm': '12px', // Form controls and items
  'base4-padding-xs': '8px', // small items
  
  'border-radius-base': '8px',
  'border-radius-lg': '16px',
  
  'code-family': '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  
  'dark-color-1': 'rgba(255,255,255,1)', // 强调字体颜色
  'dark-color-2': 'rgba(255,255,255,0.85)', // 主字体颜色
  'dark-color-3': 'rgba(255,255,255,0.65)', // 次字体颜色
  'dark-color-4': 'rgba(255,255,255,0.45)', // 禁止字体颜色
  
  'font-family': '"Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  
  'font-size-10': '10px',
  'font-size-12': '12px',
  'font-size-13': '13px',
  'font-size-14': '14px',
  'font-size-16': '16px',
  'font-size-18': '18px',
  'font-size-20': '20px',
  'font-size-22': '22px',
  'font-size-24': '24px',
  'font-size-30': '30px',
  'font-size-38': '38px',
  'font-size-40': '40px',
  
  'font-size-base': '30px',
  
  'font-size-lg': '34px',
  'font-size-md': '32px',
  'font-size-sm': '28px',
  'font-size-xl': '36px',
  'font-size-xs': '26px',
  'font-size-xxl': '48px',
  'font-size-xxs': '24px',
  'font-size-xxxs': '20px',
  
  'font-weight-base': 400,
  'font-weight-lg': 600,
  'font-weight-md': 500,
  
  'horizontal-padding-lg': '30px',
  'horizontal-padding-md': '20px',
  'horizontal-padding-sm': '10px',
  
  'light-color-1': 'rgba(0,0,0,0.85)', // 主字体颜色
  'light-color-2': 'rgba(0,0,0,0.65)', // 次字体颜色
  'light-color-3': 'rgba(0,0,0,0.45)', // 提示性字体颜色
  'light-color-4': 'rgba(0,0,0,0.25)', // 禁止字体颜色
  
  'line-height-1': '46px',
  'line-height-2': '38px',
  'line-height-3': '32px',
  'line-height-4': '30px',
  'line-height-5': '28px',
  'line-height-6': '24px',
  'line-height-7': '22px',
  'line-height-8': '40px',
  'line-height-9': '36px',
  'line-height-10': '36px',
  'line-height-11': '20px',
  'line-height-12': '18px',
  'line-height-base': '46px',
  'line-height-lg': '50px',
  'line-height-md': '48px',
  'line-height-sm': '44px',
  'line-height-xl': '56px',
  'line-height-xs': '42px',
  'line-height-xxl': '72px',
  'line-height-xxs': '40px',
  'line-height-xxxs': '36px',
  
  'main-background': '#F4F6FC',
  'white-background': '#fff',
  
  'random-color-1': '#40A9FF',
  'random-color-2': '#36CFC9',
  'random-color-3': '#73D13D',
  'random-color-4': '#FFA940',
  'random-color-5': '#FF6851',
  
  'text-color-describe': '#999',
  'text-color-disabled': '#ccc',
  'text-color-main': '#333',
  'text-color-secondary': '#666',
  'text-color-selected': '#000',
  'text-color-white': '#fff',
  
  'vertical-padding-base': '4px',
  'vertical-padding-lg': '24px',
  'vertical-padding-md': '16px',
  'vertical-padding-sm': '12px',
  'vertical-padding-xs': '8px',
  
  // 'link-color': '#1890ff',                            // 链接色
  // 'font-size-base': '14px',                          // 主字号
  // 'heading-color': 'rgba(0, 0, 0, .85)',             // 标题色
  // 'text-color': 'rgba(0, 0, 0, .65)',               // 主文本色
  // 'text-color-secondary': 'rgba(0, 0, 0, .45)',     // 次文本色
  // 'disabled-color': 'rgba(0, 0, 0, .25)',            // 失效色
  // 'border-radius-base': '4px',                        // 组件/浮层圆角
  // 'border-color-base': '#d9d9d9' ,                   // 边框色
  // 'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)'  // 浮层阴影
}

const mobile = Object.assign({}, base, {
  'layout-min-width': '1024px',

  'random-color-1': '#1CC972',
  'random-color-2': '#FFA228',
  'random-color-3': '#606BFF',
  'random-color-4': '#19A7FB',
  'random-color-5': '#FF6851',

  'font-family': '"Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',

  'border-radius-base': '8px',
  'border-radius-lg': '16px',
})

const pc = Object.assign({}, base, {
  'base4-padding-md': '16px',

  'font-size-base': '14px',
  'font-size-lg': '17px',
  'font-size-md': '16px',
  'font-size-sm': '12px',
  'font-size-xl': '18px',
  'font-size-xs': '21px',
  'font-size-xxl': '24px',
  'font-size-xxs': '24px',
  'font-size-xxxs': '20px',

  'line-height-base': '1.5',
  'line-height-lg': '25px',
  'line-height-md': '24px',
  'line-height-sm': '22px',
  'line-height-xl': '28px',
  'line-height-xs': '21px',
  'line-height-xxl': '36px',
  'line-height-xxs': '20px',
  'line-height-xxxs': '18px',

  'layout-min-width': '1024px',

  'base-border-color': '#EAEDF3',

  'random-color-1': '#40A9FF',
  'random-color-2': '#36CFC9',
  'random-color-3': '#73D13D',
  'random-color-4': '#FFA940',
  'random-color-5': '#FF6851',

  'font-family': "12px/1.5 tahoma,arial,'Hiragino Sans GB', sans-serif",

  'border-radius-base': '4px',
  'border-radius-lg': '4px',
})

const admin = Object.assign({}, pc, {
  'primary-color': '#17BC94', // 全局主色
  'primary-light-color': 'rgba(23, 188, 148, 0.2)', // 边框色
});

module.exports = {
  base,
  mobile,
  pc,
  admin
}