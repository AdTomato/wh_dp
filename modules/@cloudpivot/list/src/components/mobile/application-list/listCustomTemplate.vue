
<style lang="less">
  @import "~@cloudpivot/common/styles/mixins.less";
  #custom-list-container {
    .px2rem(font-size, 28px);
    text-align:left;
  }
  // 错误信息
  #custom-list-parsing-error {
    color:red;
    .px2rem(font-size, 22px);
  }
  .fields-list-wrapper {
    .px2rem(margin-top, @horizontal-padding-md/2);
    .px2rem(margin-bottom, @horizontal-padding-md/2);
  }
  .custom-list-item {
    .px2rem(margin, @horizontal-padding-md);
    .px2rem(padding, @horizontal-padding-lg);
    .px2rem(border-radius, @border-radius-lg);
    background: @white-background;
    word-break: break-all;

    // layout  -- start
    &-content {
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      // min-height:1.6rem;
    }
    &-status {
      position: relative;
      margin-left:.2rem;
      width: 1.6rem;
    }
    &-info { flex:1; }
    &-creater {
      display:flex;
      justify-content:space-between;
      align-items:center;
      color:#999;
      .px2rem(font-size, 24px);
      &-info-avatar {
        @user-img:56px;
        .px2rem(width, @user-img);
        .px2rem(height, @user-img);
        border-radius: 50%;
        object-fit: cover;
      }
    }
    // layout -- end


    // 图片
    img { max-width:100%; }
    // 标题
    &-title {
      .px2rem(font-size, 32px);
      color: rgba(0, 0, 0, 0.85);
    }

  }
</style>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { listApi, listParams } from '@cloudpivot/api';


// 默认模板
import listCustomTemplateConverter from '@cloudpivot/list/src/components/listCustom/template/mobile/handler'
// 引入vue编译器
const vueCompiler = require('@cloudpivot/list/src/components/mobile/application-list/vueCompiler.build');
// 函数
import common from '@cloudpivot/common';
import { renderer } from '@cloudpivot/form';

const { getRealValue } = common.utils.BusinessFunctions;
// 默认头像
const defaultAvatar = require('./avatar.png') ;


@Component
export default class listCustomTemplate extends Vue{
  @Prop() vm:any;
  @Prop() columns:any;
  @Prop() originalListData:any;
  @Prop() templateString:any;


  // 如果模板字符串改变, compiled 相关也重置
  templateRender:Function|null = null;
  templateStaticRenderFns:Function|null = null;
  @Watch('templateString')
  onTemplateStringChange() {
    this.templateRender = null;
    this.templateStaticRenderFns = null;
  }

  // 渲染
  render(h) {
    const outerVm = this;
    const {vm,columns,originalListData} = outerVm;
    const templateString = outerVm.templateString.trim() || listCustomTemplateConverter.template;

    // 优先使用缓存模板
    if ( !outerVm.templateRender ) {
      let compiled = vueCompiler.compile( templateString  );
      if ( compiled.errors.length ) {
        outerVm.templateParsingError = `Error compiling template:\n\n${templateString}'\n\n${compiled.errors.join('\n')}`;
        return outerVm.errorRender(h);
      }
      outerVm.templateRender = new Function(compiled.render);
      outerVm.templateStaticRenderFns = new Function(compiled.staticRenderFns);
    }

    return h({
      // compiled
      render: outerVm.templateRender,
      staticRenderFns: outerVm.templateStaticRenderFns,
      // 基本属性
      data() {
        return {
          vm,
          columns,
          originalListData
        }
      },
      // 生命周期
      beforeCreate() {
        outerVm.$emit('beforeCreate')
      },
      created() {
        outerVm.$emit('created', this)
      },
      beforeMount() {
        outerVm.$emit('beforeMount', this)
      },
      mounted() {
        this.$nextTick(()=>{
          outerVm.$emit('mounted', this)
        });
      },
      // 计算属性
      computed: {
        // 列表
        listData() {
          // @ts-ignore 忽略ts的检测, 这块东西是运行时
          let z = this.originalListData.map(t=>{
            let item   = { ...t };
            let fields = [];
            Object.entries(t.data).forEach(([k,v])=>{
              // @ts-ignore 忽略ts的检测, 这块东西是运行时
              let c = this.columns.find((col:any)=>col.propertyCode===k);
              if ( c ) {
                let { displayFormat, name, name_i18n, propertyCode, propertyType, sortKey } = c;
                fields.push({
                  displayFormat, name, name_i18n, propertyCode, propertyType, sortKey,
                  // @ts-ignore
                  value:getRealValue(c,t.data[k])
                })
              }
            })
            // @ts-ignore
            item.fields  = fields.sort((c,n)=>c.sortKey-n.sortKey);
            item.creater = t.data.creater[0];
            item.creater.imgUrl = item.creater.imgUrl || defaultAvatar;
            item.status  = outerVm.__parseStatus(t);
            return item;
          })
          return z;
        },
        // 扩展
        extensions() {
          try {
            // @ts-ignore 忽略ts的检测, 这块东西是运行时
            return this.vm.eventHooksHandler.scription.extensions
          } catch(err) {
            return {}
          }
        },
      },
      // 方法
      methods: {
        // 列表详情
        showListItemDetail(item) {
          if ( item.isOpenForm===false ) return;
          listApi.getFormUrl({
            bizObjectId:item.id,
            schemaCode:item.schemaCode
          })
          .then(res=>{
            if ( !res || typeof(res)!=='string' ) throw '跳转失败!';
            // @ts-ignore 忽略ts的检测, 这块东西是运行时
            this.$router.push({ path: res + `&return=${this.$route.fullPath}` });
          })
          .catch(err=>{
            outerVm.$h3.toast.show({
              text:err.toString()
            })
          })
        },
        getAttachmentUrl(file) {
          if ( !file || !file.refId ) return '';
          return renderer.UploadControl.service.getDownloadUrl(file);
        }
      }
    });
  }

  // 模板有错误时, 输出错误信息
  templateParsingError:string = '';
  templateParsingErrorHtml:any;
  errorRender(h) {
    return h(
      'div', {
        attrs: { id:'custom-list-container' }
      },
      [
        h(
          'pre',
          { attrs: { id:'custom-list-parsing-error' } },
          this.templateParsingError
        )
      ]
    );
  };

  // 其他函数
  get __lang() {
    return localStorage.getItem('locale') || 'zh';
  }
  __parseStatus(listItem) {
    let randomIdx: number = 3;
    const sequenceStatus: any = listItem.sequenceStatus || '';
    switch (sequenceStatus) {
      // 本地缓存
      case 'CACHE':
        randomIdx = 4;
        break;
      // 草稿
      case 'DRAFT':
        randomIdx = 0;
        break;
      // 进行中
      case 'PROCESSING':
      case 'null':
      case '':
        // TODO 进行中状态需要调整
        randomIdx = 1;
        break;
      // 完成
      case 'COMPLETED':
        randomIdx = 2;
        break;
      // 作废
      default:
        randomIdx = 3;
        break;
    }

    let value =  [
      'draft',
      'pending',
      'complete',
      'closure',
      'cache'
    ][randomIdx];
    let text = {
      'draft':'草稿',
      'pending':'进行中',
      'complete':'已完成',
      'closure':'已作废',
      'cache':'本地草稿'
    }[value] || '';
    let img = '';
    try {
      img = require(`@/assets/images/${value}${ this.__lang==='zh'? '':'-en' }.png`);
    } catch(err) {
      console.warn('img loading failed!')
    }
    return { value, text, img }
  }
}

</script>
