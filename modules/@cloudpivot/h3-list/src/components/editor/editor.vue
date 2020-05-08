<template>
  <monaco-editor
    v-model="content"
    ref="editor"
    :monacoModule="monacoModule"
    class="list-editor" />
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import MonacoEditor from './monaco-editor.vue';

import * as Converter from './converter';

import { ListOptions } from '../../core/schema';

import { ListHtmlGenerator, ListHtmlParser } from '../../core/class'

@Component({
  name: "ListEditor",
  components: {
    MonacoEditor,
  }
})
export default class ListEditor extends Vue {
  content: string = "";
  _content:string = '';

  @Prop() options!: ListOptions;
  @Prop() monacoModule: any;

	/**
	 * 当视图设计区数据更新时，即时转换为编辑器内容
	 */
  @Watch("options", {
    immediate: true
  })
  async onOptionsChange(options: ListOptions) {
    if ( !options ) return;

    const generator: any = await this.parseToHtml(options);
    const vm: any = this;
    if (generator) {
      vm._content = vm.content = (generator as ListHtmlGenerator).htmlContent || "";
    };
  }

  /**
   * 传入的设计数据转为编辑区内容
   */
  parseToHtml(options: ListOptions) {
    if (!options) {
      this._content = this.content = "";
      return;
    }


    const vm: any = this;

    const loadingModal = vm.$message.loading(vm.$t('languages.Apps.listDesignPage.htmlGenerating'), 0) as any;

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const generator: ListHtmlGenerator = await Converter.objectToHtml(options);
        loadingModal();
        resolve(generator);
      }, 0)
    })
  }

  /**
   * 当前编辑区内容转换为设计区数据
   */
  parseToOptions() {
    const html = this.content;
    const vm: any = this;
    const loadingModal = vm.$message.loading("正在解析HTML...", 0) as any;
    // const loadingModal = vm.$message.loading(vm.$t('languages.Apps.listDesignPage.htmlParsing'), 0) as any;

    // 如果没有做任何改动, 则直接返回传入的options, 不做解析
    // if ( this._content && this._content===html ) {
    //   // 加超时让圈圈稍微转一下
    //   setTimeout(loadingModal,0);
    //   return Promise.resolve(this.options);
    // }

    // 将 html 文本解析成 options
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        Converter.htmlToObject(html, this.options)
        .then((parser:ListHtmlParser)=>{
          loadingModal();
          if (parser && parser.outputOptions) {
            resolve(parser.outputOptions);
          } else {
            resolve();
          }
        })
        .catch(err=>{
          loadingModal();
          reject(err);
        });
      }, 0)
    });
  }

}
</script>
<style lang="less" scoped>
.list-editor {
  display: flex;
  flex-grow: 1;
  text-align: left;
  min-height: 350px;
  min-width: 800px;
}
</style>