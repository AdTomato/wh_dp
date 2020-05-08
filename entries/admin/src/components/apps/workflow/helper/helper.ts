/**
* @description 生成自模板树形结构
* @param dataObj 源数据
* @param level 当前是几级树
* @param type 当前树的类型 只有type为'workflow'才可以被选
* @param parentKey 父级树的key，用于生成当前树的key，第一级时不传
*/
export const SWTreeGenerator = ((dataObj:any, level:number, type:string, parentKey?:string) =>{
  if(!dataObj || dataObj.length === 0) return;
  let tree:Array<any> = [];
  dataObj.forEach((data:any, index:number) => {
    const _key = parentKey ? `${parentKey}-${(index+1).toString()}` : `${(index+1).toString()}`;
    const _type = type === '' ? data.type : type;
    const _value = type === 'workflow' ? `workflow-${data.workflowCode}` : data.code; // 因为流程编码可能与应用编码或其他编码重复，故加前缀
    const _label = type === 'workflow' ? data.workflowName : data.name;
    const _isDisabled = type === 'workflow' ? false : true;
    const _isLeaf = type === 'workflow' ? true : false;
    const _schemaCode = data.schemaCode ? data.schemaCode : '';
    let _icon = '';
      if (level === 1) {
        _icon = 'h-icon-all-folder-o';
      } else {
        _icon = data.icon ? data.icon : 'h-icon-all-folder-o';
      }
    tree.push(
      {
        type: _type,
        key:_key,
        level: level,
        label: _label,
        icon: _icon,
        value: _value,
        schemaCode: _schemaCode,
        disabled: _isDisabled,
        isLeaf: _isLeaf,
        scopedSlots: {
          title: 'title',
        },
        children: []
      }
    );
  });
  return tree;
});


/**
* @description 根据节点类型返回属性面板组件的名称
* @param data 源数据
*/

export const getCompNameByActivityType = (type:string) => {
  if(!type) return;
  let propertyCompName:string = '';
  switch (type) {
    case 'PARTICIPANT':
      propertyCompName = 'UserActivityProperty';
      break;
    case 'SYSTEM_ACTIVITY':
      propertyCompName = 'SystemActivityProperty';
      break;
    case 'SUB_INSTANCE':
      propertyCompName = 'SubInstanceProperty';
      break;
    case 'CONNECTION':
      propertyCompName = 'ConnectionProperty';
      break;
    case 'CIRCULATE':
      propertyCompName = 'CirculateProperty';
      break;
    default:
      break;
  }
  return propertyCompName;
}

/**
* @description 提取出字表数据
* @param data 源数据
*/

export const extractSubDataItem = (data:any) => {
  if(!data) return ;
  data.forEach((w:any) => {
    if (w.subSchema && w.subSchema.properties.length > 0) {
      const subSchemaCode = w.subSchema.code;
      w.subSchema.properties.forEach((wp:any, i:number) => {
        w.subSchema.properties[i].name = `子表-${wp.name}`;
        w.subSchema.properties[i].code = `${subSchemaCode}.${wp.code}`; // 防止vaule相同报重复key
        data.push(w.subSchema.properties[i]);
      });
    }
  });
  // 过滤出字表父级
  return data.filter((item:any) => !item.subSchema)
}

/**
* @description 处理字表展示，并释放出子表数据项
* @param data 源数据
*/

export const releaseSubTableDataItem = (data:any) => {
  let subDataItemArr:Array<any> = [];
  data.forEach((item:any, index:number) => {
    if (item.propertyType === 8) {
      const { subSchema, name, code } = item;
      if (subSchema && subSchema.properties.length > 0) {
        const temArr:Array<any> = subSchema.properties.filter((dataItem:any) => !dataItem.defaultProperty);
        temArr.forEach((subItem:any) => {
          subItem.name = `${name}.${subItem.name}{${subItem.code}}`;
          subItem.code = `${code}.${subItem.code}`;
          subDataItemArr.push(subItem);
        });
      }
    } 
    // else {
    //   item.name = `${item.name}[${item.code}]`;
    // }
  });

  return data.concat(subDataItemArr);
}

