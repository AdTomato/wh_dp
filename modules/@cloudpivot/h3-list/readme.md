# 传入配置信息数据结构

> 详见类型声明 `ListOptions` ： modules/@cloudpivot/h3-list/src/core/schema/query-design.ts

```js
  //视图类型
  queryPresentationType: QueryPresentationTypes,
  //操作按钮
  queryActions: Array<QueryAction>,
  //列数据
  queryColumns: Array<QueryColumn>,
  //HTML编辑配置信息
  queryPresentation: {
    htmlJson: {
      styleJson: string,
      scriptJson: string,
      templateJson: string, // 如果有这个字段，则不采用预设渲染模板
    },
    actionsJson: [{
      actionCode: string,
      //自定义属性
      attributes: {
        [attry: string]: string
      }
    }],
    columnsJson: [{
      propertyCode: string,
      //每个展示字段各自对应的自定义Html内容
      custom: {
        // 列表视图下单元格的自定义
        list: string,
        // 看板视图下单元格的自定义
        board: string,
        // 日历视图下单元格的自定义
        calendar: string,
      },
    }],
  },
```

# 生成HTML编码结构 -- PC

```html
<style>
  /* 这里编写自定义样式 */
</style>

<section id="actions">
  <action code="add" text="新增"></action>
  <action code="custom" text="自定义" class="my-class"></action>
</section>

<section id="template" type="template">
<!-- 列表 -->
  <l-table>
    <l-thead>
      <l-tr>
        <l-th key="xxx" text="xxx" data-sort="boolean">
          <!-- 此处内容不解析，表头只支持修改展示文字和设置是否为前端排序项(预留项) -->
        </l-th>
      </l-tr>
    </l-thead>
    <l-tbody>
      <l-tr>
        <l-td key="xxx" data-formate="xxx" data-custom-inner="true">
          <!-- 
            data-custom-inner 为 true 时，
            此处内容可自定义，可添加普通html标签，并绑定事件，对应事件在script部分定义 
          -->
          <span class="custom-button">自定义点击按钮</span>
        </l-td>
      </l-tr>
    </l-tbody>
  </l-table>
  <!-- 日历 -->
  <!-- 看板 -->
</section>

<section id="custom" type="template">
  <!-- 用户自己设计的html内容，此处如果有自定义的内容，id=template的部分将忽略，但在设计器上不做渲染 -->
</section>

<script id="customScript">
  (function(list){
    // 数据加载前
    list.on('onLoad', function(data){},'cover');
    // 渲染完成后
    list.on('onRendered', function(data){
      // 自定义脚本事件，list暴露出dataSource列表源数据给用户
      function customEvent() {
        console.log(list.dataSource);
      }
    });
    // 按钮操作前，返回false阻止后续执行
    list.on('onPreAction', function(action,data){});
    // 自定义按钮执行
    list.on('onCustomAction', function(action,data){});
    // 操作完成后
    list.on('onActionDone', function(action,data){});

    
  })
</script>
```