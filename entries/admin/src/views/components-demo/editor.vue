<template>
  <section class="layout-list">
    <div>
      <a-button type="primary" @click="output">解析编辑器内容</a-button>&nbsp;
      <a-button type="primary" @click="input">生成编辑器内容</a-button>      
      配置信息：
      <pre v-if="outputOpts">{{ outputOpts }}</pre>
      <pre v-else>{{ options }}</pre>
    </div>
    <div>
      <list-designer
        v-if="options"
        ref="editor"
        :options="options" />
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as H3List from '@cloudpivot/h3-list';

import testData from './test';

@Component({
  name: "list-editor",
  components: {
    ListDesigner: H3List.components.Editor
  }
})
export default class ListEditor extends Vue {
  options: H3List.schema.ListOptions | null = null;

  outputOpts: H3List.schema.ListOptions | null = null;

  input() {
    this.outputOpts = null;
    const res:any = testData;
    res.data = {
      ...res.data,
      clientType: "PC",
      queryPresentationType: "LIST",
      publish: 1,
      queryPresentation: {
        htmlJson: JSON.stringify({
          styleJson: `
            .hello-span {
              color: red;
              cursor: drag;
            }
          `,
          scriptJson: `
            function test(){
              document.querySelector('.hello-span').onClick = function() {
                console.log('hello');
              }
            }
          `,
          templateJson: '',
        }),
        actionsJson: JSON.stringify([
          {
            actionCode: 'my',
            attributes: {
              text: '我的按钮',
              class: 'my-button'
            }
          }
        ]),
        columnsJson: JSON.stringify([
          {
            propertyCode: 'name',
            custom: {
              list: `
              <span class="hello-span">hello</span>
              <p>hellll</p>
              `
            }
          }
        ]),
      }
    }
    this.options = res.data;
  }

  output() {
    const editor: any = this.$refs.editor;
    if (editor) {
      setTimeout(async () => {
        try {
          const options = await editor.parseToOptions();
          this.outputOpts = options;
        } catch(err) {
          this.$message.error(err);
        }
      },0)
    }
  }
}
</script>
<style lang="less" scoped>
.layout-list {
  display: flex;
  height: calc(100% - 65px);
  justify-content: flex-start;
  > div {
    flex: 1;
    width: 50%;
    overflow: auto;
  }
}
</style>