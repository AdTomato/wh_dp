<template>
  <div></div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Model,Watch } from "vue-property-decorator";

import * as monaco  from 'monaco-editor';

@Component({
    name : 'monaco-editor'
})
export default class MonacoEditor extends Vue {

    @Model('change')
    value !: string

    @Prop({
        default : 'html'
    })
    language !: string

    @Prop({
        default : 'vs'
    })
    theme !: string

    codeEditor ?: monaco.editor.IStandaloneCodeEditor

    @Watch('value',{
        immediate : true 
    })
    onValueChange(val : string){
        if(this.codeEditor){
            this.codeEditor.setValue(val || '');
        }
    }

    
    // @Watch('theme',{
    //     immediate : true 
    // })
    // onThemeChange(theme : string){
    //     if(this.codeEditor && theme){
    //         this.codeEditor.setTheme(theme);
    //     }
    // }

    // @Watch('language',{
    //     immediate : true 
    // })
    // onLanguageChange(language : string){
    //     if(this.codeEditor && language){
    //         this.codeEditor.setModelLanguage(language);
    //     }
    // }
    
    resize(){
        if(this.codeEditor){
            this.codeEditor.layout();
        }
    }


    mounted(){
        this.$nextTick(()=>{
            this.codeEditor = monaco.editor.create(
                this.$el as HTMLElement,
                {
                value : this.value,
                language: this.language,
                scrollbar:{
                    horizontalScrollbarSize:7,
                    verticalScrollbarSize: 7
                }
            });

            this.codeEditor.onDidBlurEditorWidget(()=>{
            if(this.codeEditor){
                    const val = this.codeEditor.getValue();
                    this.$emit('change',val);
            }
                });
        });
    }

    destoryed(){
        if(this.codeEditor){
            this.codeEditor.dispose();
        }
    }

}


</script>

<style lang="less" scoped>
</style>
