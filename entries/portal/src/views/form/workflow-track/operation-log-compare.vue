<template>
  <div class="operation-log-compare">
    <div class="header form-header">
      <a
        href="javascript:"
        class="link"
      >
        <img class="yslogo" src="../../../assets/images/yslogo.png" alt="">
      </a>
    </div>

    <div class="c-box">
      <a-tabs>
        <a-tab-pane tab="编辑后" key="1">
          <pc-form-renderer
            :class="{'has-form-border': borderMode}"
            ref="formRenderer"
            :controls="currControls"
          ></pc-form-renderer>
        </a-tab-pane>
        <a-tab-pane tab="编辑前" key="2">
          <pc-form-renderer
            :class="{'has-form-border': borderMode}"
            v-if="preControls"
            ref="formRenderer"
            :controls="preControls"
          ></pc-form-renderer>
          <div v-else>没有历史记录</div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { schema, renderer, runtime } from "@cloudpivot/form";
import { FormRendererHelper } from "@cloudpivot/form/src/renderer/components/form-renderer-helper";
import {
  FormControlType,
  RendererControl,
  RendererFormControl,
  DropdownOptions,
  FormSheet
} from "@cloudpivot/form/src/schema";
import { workflowApi,formApi }  from '@cloudpivot/api';
import {
  Button,Tabs
} from 'h3-antd-vue';

@Component({
  name: 'operation-log-compare',
  components: {
    AButton: Button,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    PcFormRenderer: renderer.components.pc.FormRenderer,
  }
})
export default class OperationLogCompare extends Vue {
  currControls:any = ''
  preControls:any = ''
  formControls:any = ''
  borderMode = false
  mounted () {
    this.getLogs();
  }

  async getLogs(){
    const { logid } = this.$route.params;
    const res:any = await workflowApi.compareOperationLog(logid);
    this.initFrom(res.data);
  }

  async initFrom(data:any){
    const currDataDetail = data.postBizObjectLog?data.postBizObjectLog:'';
    const preDataDetail = data.prevBizObjectLog? data.prevBizObjectLog:'';
    const bizSheet = data.bizSheet;
    const formControls = JSON.parse(bizSheet.publishedAttributesJson);
    const layout = JSON.parse(bizSheet.publishedViewJson) as string[][];

    this.borderMode = !!bizSheet.borderMode
    this.handleApproval(formControls,layout)

    this.currControls = this.buildControl(formControls,layout,currDataDetail,bizSheet)
    if (preDataDetail) {
      this.preControls = this.buildControl(formControls,layout,preDataDetail,bizSheet)
      const [curr, pre] = this.diffControls(this.currControls, this.preControls) // 对比两个表单
    }
  }
  // 构建 渲染表单的 controls
  buildControl(formControls,layout,dataDetail, bizSheet) {
    let _formControls = JSON.parse(JSON.stringify(formControls))
    let _layout = JSON.parse(JSON.stringify(layout))
    let _dataDetail = JSON.parse(JSON.stringify(dataDetail))
    let currData = _dataDetail.bizObjectData.data
    let controls = FormRendererHelper.convertDesign(
      _formControls,
      _layout
    );
    const new_formControls: RendererFormControl[] = [];
    FormRendererHelper.findFormControl(controls, new_formControls);

    const titleControl = new_formControls.find(
      c => c.type === FormControlType.Title
    );
    if (titleControl && currData.name) {
      titleControl.options.name = currData.name;
    }
    this.toFormData(controls,currData,bizSheet,dataDetail.bizObjectData,dataDetail.workItemId)
    FormRendererHelper.mergeValue(new_formControls, currData, true);
    return controls
  }
  // 对比当前controls 和 preControls数据变化
  diffControls(currControls, preControls) {
    if(currControls.length === 0 && preControls.length === 0) return [[],[]]
    let l = Math.max(currControls.length,preControls.length)
    for (let i = 0; i < l; i++) {
      let curr = currControls[i]
      let pre = preControls[i]
      if(curr.type && curr.type === pre.type && curr.key === pre.key) {
        if (curr.value && pre.value) {
          if (typeof curr.value === 'string' || typeof curr.value === 'number' || typeof curr.value === 'boolean') {
            if (curr.value !== pre.value) {
              curr.diff = true
              pre.diff = true
            }
          } else {
            let cType = curr.type
            switch(cType) {
              case FormControlType.CreateBy:
                  if (curr.value.length !== pre.value.length || (curr.value.length && curr.value[0].name !== pre.value[0].name)) {
                    curr.diff = true
                    pre.diff = true
                  }
                  break;
              case FormControlType.Checkbox:
              case FormControlType.Dropdown:
                  if (curr.value.length !== pre.value.length || (curr.value.length && curr.value.join(',') !== pre.value.join(','))) {
                    curr.diff = true
                    pre.diff = true
                  }
                  break;
              case FormControlType.Attachment:
              case FormControlType.Image:
                  if (curr.value.length === pre.value.length && curr.value.length) {
                    let cUid = curr.value.reduce((c,v) =>{return `${c}${v.uid}`}, '')
                    let rUid = pre.value.reduce((c,v) => {return `${c}${v.uid}`},'')
                    if (cUid !== rUid) {
                      curr.diff = true
                      pre.diff = true
                    }
                  } else if (curr.value.length !== pre.value.length) {
                      curr.diff = true
                      pre.diff = true
                  }
                  break;
              case  FormControlType.Location:
                  if (curr.value.address !== pre.value.address) {
                    curr.diff = true
                    pre.diff = true
                  }
                  break;
              case  FormControlType.Signature:
              case  FormControlType.StaffSelector:
              case  FormControlType.StaffMultiSelector:
              case  FormControlType.DepartmentSelector:
              case  FormControlType.DepartmentMultiSelector:
                  if (curr.value.length === pre.value.length && curr.value.length) {
                    var cid = curr.value.reduce((c,v) =>{return `${c}${v.id}`}, '')
                    var rid = pre.value.reduce((c,v) => {return `${c}${v.id}`},'')
                    if (cid !== rid) {
                      curr.diff = true
                      pre.diff = true
                    }
                  } else if(curr.value.length !== pre.value.length) {
                      curr.diff = true
                      pre.diff = true
                  }
                  break;
              case  FormControlType.Sheet:
                console.info('子表对比开始 =>')
                  if (curr.value.length === pre.value.length && curr.value.length ) {
                    let sheet_diff = this._diffSheet(curr, pre, curr.value.length )
                    curr.diff = sheet_diff
                    pre.diff = sheet_diff
                  } else if(curr.value.length !== pre.value.length) {
                    if(curr.value.length&& !pre.value.length) {
                      let sheet_diff:any[] = []
                      for(let a = 0; a < curr.value.length; a++){
                        sheet_diff.push({
                          _rowDiff:true
                        })
                      }
                      curr.diff = sheet_diff
                    } else if (!curr.value.length && pre.value.length) {
                      let sheet_diff:any[] = []
                      for(let a = 0; a < pre.value.length; a++){
                        sheet_diff.push({
                          _rowDiff:true
                        })
                      }
                      pre.diff = sheet_diff
                    } else {
                      let currL = curr.value.length
                      let preL = pre.vaule.length
                      let arrL = Math.min(currL,preL)
                      let sheet_diff = this._diffSheet(curr, pre, arrL)
                      curr.diff = sheet_diff
                      pre.diff = sheet_diff
                      let lenDiff = currL > preL?curr.diff:pre.diff
                      let len = Math.abs(currL-preL);
                      for(let a = 0; a < len; a++) {
                        lenDiff.push({_rowDiff:true})
                      }
                    }
                  }
                  break;
              case  FormControlType.RelevanceForm:
                  var cValue = curr.value[curr.options.displayField || 'name']
                  var pValue = pre.value[curr.options.displayField || 'name']
                  if (JSON.stringify(cValue) !== JSON.stringify(pValue)) {
                    curr.diff = true
                    pre.diff = true
                  }
                  break;
            }
          }
        } else if ((curr.value && !pre.value) || (!curr.value && pre.value)) {
            curr.diff = true
            pre.diff = true
        }
      }
      if(curr.children || pre.children) {
        let [cr,pr] = this.diffControls((curr.children||[]),(pre.children||[]))
        curr.children = cr
        pre.children = pr
      }
    }
    return [currControls, preControls]
  }
  // 子表中 行数据 diff
  _diffSheet(curr, pre, l) {
    let _keys1 = Object.keys(curr.value[0])
    let _keys2 = Object.keys(pre.value[0])
    let keys = new Set(_keys1.concat(_keys2)) // 两个子表 列可能会有差异, 需要去重合并
    var sheet_diff:any[] = []
    tag: for(let a = 0; a < l; a++) {
      let curr_col = curr.value[a]
      let pre_col = pre.value[a]
      let sheet_diff_key = {}
      if (curr_col.id !== pre_col.id) {
        sheet_diff_key['_rowDiff'] = true
      } else {
        for(let k of keys) {
            sheet_diff_key[k] = false

            if((curr_col[k]&&!pre_col[k]) || (!curr_col[k]&&pre_col[k])) {// 两个子表, 列不对称
              sheet_diff_key[k] = true
            } else if (typeof curr_col[k] === 'string' || typeof curr_col[k] === 'number' || typeof curr_col[k] === 'boolean') {
              if (curr_col[k] !== pre_col[k]) {
                sheet_diff_key[k] = true
              }
            } else {
              if(Array.isArray(curr_col[k])) {
                if(curr_col[k].length !== pre_col[k].length) {
                  sheet_diff_key[k] = true
                  continue
                }
                if (!curr_col[k].length && !pre_col[k].length) continue
                if (typeof curr_col[k][0] === 'string') {
                  if(curr_col[k].join('') !== pre_col[k].join('')) {
                    sheet_diff_key[k] = true
                  }
                } else if (curr_col[k][0].id) {
                  var cid = curr_col[k].reduce((c,v) =>{return `${c}${v.id}`}, '')
                  var rid = pre_col[k].reduce((c,v) => {return `${c}${v.id}`},'')
                  if (cid !== rid) {
                    sheet_diff_key[k] = true
                  }
                } else if(curr_col[k][0].uid) {
                  let cUid = curr_col[k].reduce((c,v) =>{return `${c}${v.uid}`}, '')
                  let rUid = pre_col[k].reduce((c,v) => {return `${c}${v.uid}`},'')
                  if (cUid !== rUid) {
                    sheet_diff_key[k] = true
                  }
                } else if (curr_col[k][0].name) {
                  if (curr_col[k][0].name !== pre_col[k][0].name) {
                    sheet_diff_key[k] = true
                  }
                }
              } else{
                // 说明 curr_col[k] 是object,而object 类型目前只有 地址和关联表单
                let curr_item = curr.columns.filter(( val ) => val.key === k)[0]
                let pre_item = pre.columns.filter(( val ) => val.key === k)[0]
                switch (curr_item.type) {
                  case FormControlType.Location:
                    if (curr_col[k].address !== pre_col[k].address) {
                      sheet_diff_key[k] = true
                    }
                    break;
                  case FormControlType.RelevanceForm:
                    let dfield = curr_item.options.displayField || 'name'
                    if (JSON.stringify(curr_col[k][dfield]) !== JSON.stringify(pre_col[k][dfield])) {
                      sheet_diff_key[k] = true
                    }
                    break;
                }
              }
          }
        }
      }
      sheet_diff.push(sheet_diff_key)
    }
    return sheet_diff
  }

    /**
   * 将API数据转换为表单控件数据
   * @param controls
   * @param data
   */
  toFormData(controls: RendererControl[], data: { [key: string]: any },bizSheet:any, biz:any,workItemId) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        for (const item of data[key]) {
          if (Array.isArray(item.departments)) {
            item.parentId = item.departments
              .filter((d: any) => d && d.id)
              .map((d: any) => d.id);
          }
        }
      }
    }

    const formControls: RendererFormControl[] = [];

    FormRendererHelper.findFormControl(controls, formControls);

    const user = renderer.StaffSelectorControl.service.getCurrentUser() as any;

    formControls
      .filter(c => c.type === FormControlType.Sheet)
      .forEach(c => {
        const sheetParams = {
          formCode: bizSheet.code, // 表单编码
          schemaCode: bizSheet.schemaCode, // 模型编码
          objectId: biz.id, // 表单id
          sequenceStatus: biz.sequenceStatus, // 流程状态
          subSchemaCode: c.key,
          workitemId: workItemId
        };
        const sheetValue = data[c.key];
        c.options.sheetParams = sheetParams;
        c.options.editable = false
        c.options.exportable = false
        if (Array.isArray(sheetValue)) {
          sheetValue.forEach(v => this.toFormData((c as any).columns, v,bizSheet,biz,workItemId));
        }
      });

    formControls
      .filter(
        c =>
          c.type === FormControlType.Attachment ||
          c.type === FormControlType.Image
      )
      .forEach(c => {
        const files = data[c.key];
        if (files && Array.isArray(files)) {
          data[c.key] = files.map((f: any) => ({
            uid: f.refId,
            name: f.name,
            status: 2, //UploadStatus.Done
            size: f.fileSize,
            response: {
              data: f
            }
          }));
        }
      });

    formControls
      .filter(
        c =>
          c.type === FormControlType.Checkbox ||
          c.type === FormControlType.Dropdown
      )
      .forEach(c => {
        const str = data[c.key] as string;
        if (
          c.type === FormControlType.Checkbox ||
          (c.type === FormControlType.Dropdown &&
            (c.options as DropdownOptions).multi)
        ) {
          if (typeof str === "string") {
            data[c.key] = str ? str.split(";") : [];
          }
        }
      });

    formControls
      .filter(c => c.type === FormControlType.Location)
      .forEach(c => {
        const str = data[c.key];
        if (str) {
          try {
            data[c.key] = JSON.parse(str);
          } catch (error) {
            console.log(error);
          }
        }
      });

    formControls
      .filter(c => c.type === FormControlType.Date)
      .forEach(c => {
        let str = data[c.key];
        if (typeof str === "string") {
          try {
            // iOS兼容
            str = str.replace(/-/g, "/");
            data[c.key] = new Date(str);
          } catch (error) {
            console.log(error);
          }
        } else if (typeof str === 'number') {
          data[c.key] = new Date(str);
        }
      });

    formControls
      .filter(c => c.type === FormControlType.Address)
      .forEach(c => {
        const str = data[c.key];
        if (typeof str === "string") {
          try {
            // iOS兼容
            data[c.key] = JSON.parse(str);
          } catch (error) {
            console.log(error);
          }
        }
      });

    formControls
      .filter(c => c.type === FormControlType.RelevanceForm)
      .forEach(c => {
        if (data[c.key] && !data[c.key].id) {
          data[c.key] = {};
        }
        const sheetParams = {
          id: biz.id,
          sheetid: bizSheet.id
        };
        c.options.sheetParams = sheetParams;
      });

    formControls
      .filter(c => c.type === FormControlType.ReverseRelevance)
      .forEach(c => {
        const sheetParams = {
          id: biz.id,
          sheetid: bizSheet.id,
          formCode: bizSheet.code,
          schemaCode: bizSheet.schemaCode,
          sequenceStatus: biz.sequenceStatus
        };
        c.options.sheetParams = sheetParams;
      });
  }
  handleApproval(controls: any, layout: string[][]) {
    layout.forEach((row, ri) => {
      row
        .map((col, ci) => {
          const c = controls[col];
          if (c && c.type === FormControlType.ApprovalOpinion) {
            return ci;
          }
          return -1;
        })
        .filter(i => i !== -1)
        .reverse()
        .forEach(i => row.splice(i, 1));
    });

    layout
      .map((row, i) => (row.length === 0 ? i : -1))
      .filter(i => i !== -1)
      .reverse()
      .forEach(i => layout.splice(i, 1));
  }
}
</script>
<style lang='less' scoped>
.operation-log-compare {
  .yslogo {
    width: 72px;
  }
  .c-box {
    width: 1024px;
    margin: 0 auto;
  }
  /deep/.diffControls {
   background-color: rgba(244,69,78,.1);
  }
}
</style>
