<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';

// import * as monacoModule from 'monaco-editor';

@Component({
  name: 'monaco-editor'
})

export default class MonacoEditor extends Vue {

	@Model('change') value !: string

  @Prop({ default: 'html' }) language!: string;

  @Prop({ default: 'vs' }) theme!: string;

  @Prop() monacoModule: any;

  editor:any = null;

  /**
   * 监听传入内容更新
   * @param val
   */
  @Watch('value', {
    immediate: true
  })
  onValueChange(val: string = '') {
    if (this.editor) {
      this.editor.setValue(val)
    }
  }

  // /**
  //  * 设置主题
  //  * @param theme
  //  */
  // @Watch('theme',{
  // 	immediate: true
  // })
  // onThemeChange(theme:string) {
  // 	if(this.editor && theme) {
  // 		this.editor.setTheme(theme);
  // 	}
  // }
  //
  // /**
  //  * 设置编程预研
  //  * @param language
  //  */
  // @Watch('language',{
  // 	immediate: true
  // })
  // onLanguageChange(language: string) {
  // 	if(this.editor && language) {
  // 		this.editor.setModelLanguage(language);
  // 	}
  // }

  /**
   * 视图缩放
   */
  resize() {
    if (this.editor) {
      this.editor.layout();
    }
  }

  // 如果外部没有传入monaco(用以提升加载速度)模块, 则动态加载
  async loadMonacoModuleAsync() {
    let win = window as any;
    let key = '__module__monaco__in__component__h3List';
    return win[key] || (win[key]=await import('monaco-editor'));
  }


  async mounted() {
    // 获取模块
    let monacoModule = this.monacoModule || (await this.loadMonacoModuleAsync());

    this.$nextTick(() => {
      //初始化编辑器
      this.editor = monacoModule.editor.create(this.$el as HTMLElement, {
        value: this.value,
        language: this.language,
        theme: this.theme,
        scrollbar: {
          horizontalScrollbarSize: 7,
          verticalScrollbarSize: 7,
        }
      });

      //离开编辑器时保存内容
      this.editor.onDidBlurEditorWidget(() => {
        if (this.editor) {
          const val = this.editor.getValue();
          this.$emit('change', val);
        }
      })
    })
  }

  destoryed() {
    if (this.editor) {
      this.editor.dispose()
    }
  }
}
</script>
