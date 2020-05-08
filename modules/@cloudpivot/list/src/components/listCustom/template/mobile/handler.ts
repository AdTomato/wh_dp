

interface constructorOptions {
  from:string;
  fields?:any;
  html?:string;
}


export default class MobileListTemplate {

  // 统一的报错头
  public static errorLogPrefix = 'ListCustomTemplate Error';
  // 模块选择符
  public static readonly templateSelector = '#customTemplate';

  public static outerTopComment = `\n<!-- 自定义模板: -->\n<!--
    基于 Vue 模板, 定义之前请确保已熟悉相关语法和规则: https://cn.vuejs.org/v2/guide/syntax.html
    @模板引用 vm        : 列表页面实例; 可通过 vm.foo | vm.bar() | vm.filter 等实现对页面数据|函数的复用;
    @模板引用 extensions: 自定义脚本扩展(如有效); 可用于预设默认值|作基本判断或其他扩展, 需要注意的是扩展内this指向它自己, 如不了解不建议使用;
    @模板引用 columns   : 列表展示项, 由后台配置所得; 某些数据(如创建人/创建时间)是固定存在的, 但是否展示应该以后台配置为准;
    @模板引用 listData  : 列表数据; 格式为 [
        {
            name   : 'admin2019-11-05 18:03:07',
            data   : { owner:{...}, shortText1573031389815:'', ... },                              // 列表生数据
            fields : [ { name:'单行文本', value:'', propertyCode:'shortText1573031389815' }, ...],  // 对生数据转换得到的字段数据
            status : { value:'complete', text:'已完成', img:'' },
            creater: { name:'xx', id:'', imgUrl:'', ... },
            ...
        },
        ...
    ];
    @模板函数 showListItemDetail: 跳转详情页的内部逻辑; 不建议改动;
    @模板函数 getAttachmentUrl  : 通过环境变量和附件 id 换取真实附件地址; 不建议改动;
    另: 如需恢复预设模板, 清空模板数据并保存/发布即可. \n-->`;
  public static template = `<!-- 自定义模板容器 -->
    <div id="custom-list-container">
        <ul class="custom-list-wrapper">
            <!-- 列表项 start -->
            <li
                class="custom-list-item"
                v-for="(listItem,listItemIndex) in listData"
                :key='\`list-item-\${listItemIndex}\`'
                @click="showListItemDetail(listItem)"
            >
                <!-- 列表项数据 start -->
                <div class="custom-list-item-content">
                  <div class="custom-list-item-info">
                    <!-- 标题 -->
                    <h3 class="custom-list-item-title">{{listItem.name}}</h3>
                    <!-- 其他字段列表 -->
                    <ul class="fields-list-wrapper">
                        <!-- 展示筛选 -->
                        <template
                            v-if="!!fieldItem.value && ['name','creater','createdTime','sequenceStatus'].indexOf(fieldItem.propertyCode)<0 && columns.some(col=>col.propertyCode===fieldItem.propertyCode)"
                            v-for="(fieldItem,fieldItemIndex) in listItem.fields"
                        >
                            <!-- 字段项 -->
                            <li class="fields-list-item" :key="\`field-item-\${fieldItemIndex}\`">
                                <label>{{fieldItem.name}}: </label>
                                <span>{{fieldItem.value}}</span>
                            </li>
                        </template>
                    </ul>
                  </div>
                  <!-- 列表项状态 -->
                  <div class="custom-list-item-status" v-if="columns.some(col=>col.propertyCode==='sequenceStatus')">
                    <img :src="listItem.status.img">
                  </div>
                </div>
                <!-- 列表项数据 end -->
                <!-- 发起人信息 start -->
                <div class="custom-list-item-creater">
                    <p
                      class="custom-list-item-creater-info"
                      v-if="columns.some(col=>col.propertyCode==='creater')"
                    >
                        <img  class="custom-list-item-creater-info-avatar" :src="listItem.creater.imgUrl">
                        <span class="custom-list-item-creater-info-name" >{{listItem.creater.name}}</span>
                    </p>
                    <p
                      class="custom-list-item-creater-time"
                      v-if="columns.some(col=>col.propertyCode==='createdTime')"
                    >{{listItem.createdTime}}</p>
                </div>
                <!-- 发起人信息 end -->
            </li>
            <!-- 列表项 end -->
        </ul>
    </div>`;

  //
  // private fields:any;
  // private html:string;

  constructor(options:constructorOptions) {
    // let { fields,html } = options
    // this.fields = fields;
    // this.html   = html;
  }

  // ======================================= 转换

  public convertTo(html,type) {
    if ( type==='html' ) return this.generateHtml();
    else return this.parseHtml(html);
  }
  public parseHtml(html:string) {
    // WARN:这里会依赖浏览器原生的 DOMParser, 理论上主流浏览器都会支持, 但具体还不好说, 需要更多测试
    let virtualDom = new (window as any).DOMParser().parseFromString(html,'text/html');
    let templateWrapper = virtualDom.body.querySelector(MobileListTemplate.templateSelector);

    // 如果解析出来的dom不包含特定的模块, 说明
    if ( !templateWrapper ) throw `${MobileListTemplate.errorLogPrefix}: CustomTemplate parsing failed!`;
  }
  public generateHtml() {

  }

  public compile() {

  }
}
