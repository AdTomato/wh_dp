
<template>
  <div :id="selectId" ref="editor"></div>
</template>


<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Inject,
  Model
} from "vue-property-decorator";

import tinymce from 'tinymce/tinymce'

import 'tinymce/themes/silver/theme'

import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
// import 'tinymce/plugins/code'
import 'tinymce/plugins/table'

import 'tinymce/plugins/fullscreen'

import './tinymcelib/css/custom-editor.css'
// import 'tinymce/plugins/lists'
// import 'tinymce/plugins/contextmenu'
// import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'

// let vm:any = null;

@Component({
  name: "h3-editor",
  components: {
  }     
})
export default class H3Editor extends Vue {
  @Prop() 
  id! : string;

  @Prop({
    default: 'zh'
  })
  locale!: string;

  @Prop({
    default: false
  })
  disabled!: boolean;

  @Model("change")
  value!: string;

  @Watch("value", {
			immediate: true
	})
	valOnchange(){
			this.onValueChange(this.value)
  }

  inputting = false;
  
  defaultConfig = {
    selector: `#${this.id}`
  }

  selectId = '';

  vm = this;

  // lists image code table colorpicker textcolor wordcount contextmenu

  init:any = {
    // target: {},
    skin_url: '/tinymcelib/skins/ui/oxide',
    height: 300,
    plugins: 'link table image fullscreen',
    // content_css : '/tinymcelib/css/custom-editor.css',
    toolbar:
      'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
    branding: false,
    selector: '',
    menubar: true,
    init_instance_callback: function (editor) {
      editor.on('SetContent', function (e) {
      });
    },
  }
  editor_zh_config = {
    language_url: '/tinymcelib/langs/zh_CN.js',
    language: 'zh_CN'
  }

  myValue = ''
  editor:any = null;

  created() {
    this.selectId = `${this.id}${+new Date()}`;
    // this.selectId = `${this.id}`
  }
  mounted() {
    /**
     * 多语言处理
     */
    if(this.locale === 'zh') {
      this.init = Object.assign({}, this.init, this.editor_zh_config);
    }

    this.init.selector = `#${this.selectId}`;

    if (this.disabled) {
      this.init.readonly = 1;
      this.init.content_style = "p {color:rgba(34,47,62,.5)}"
    }

    tinymce.init(this.init).then((editors) => {
      this.onValueChange(this.value);
    });
    this.editor = tinymce;
    const editor = this.editor.get(this.selectId);
    editor.on('Change', this.onChange);
    editor.on('focus', this.onFocus);
    editor.on('blur', this.onBlur);
    // 处理onChange事件没有触发的问题
    editor.on('keyup', this.keyUp)
  }
  keyUp(e) {
    this.onChange();
  }
  onFocus() {
    this.inputting = true;
  }
  onBlur() {
    this.inputting = false;
  }
 
  beforeDestroy() {
    this.editor.remove(`${this.selectId}`);
  }

  onChange() {
    const editor = this.editor.get(this.selectId);
    const val = editor.getContent() as string;
    this.$emit("change", val);
  }

  destroyed() {
     
  }

  clearVal() {

  }

  // @Watch('value')
  onValueChange(val) {
    if (!this.selectId) return;
    if (this.inputting) return;
    const editor = this.editor.get(this.selectId);
    editor.setContent(val);
  }
}
</script>

<style lang="less">
.textarea .tox .tox-menubar{
  background-color: #f5f5f5;
}
.textarea .tox .tox-toolbar__primary {
  background-color: #f5f5f5;
}
</style>

