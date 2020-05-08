<template>
  <div class="form-design">
    <div class="action">
      <a-radio-group :value="viewType" @change="setView">
        <!--<a-radio-button value="web">web端设计</a-radio-button>-->
        <!--<a-radio-button value="mobile">移动端设计</a-radio-button>-->
        <a-radio-button
          v-for="(item, index) in views"
          :key="index"
          :value="item.value"
        >{{ item.text }}</a-radio-button>
      </a-radio-group>
      <div class="tips">
        <a-alert
          type="warning"
          v-show="isShowTips"
          message="保存成功，发布后方可在门户使用！"
          showIcon
          closable
          @close="isShowTips = true"
        />
      </div>
      <div class="tips publicTips">
        <a-alert
          v-for="(msg,idx) in publicDescription"
          :key="idx"
          type="warning"
          :description="msg"
          showIcon
          closable
          @close="onClosePublicTips"
        />
      </div>
      <span>
        <!-- <a-button @click="restore" icon="reload">还原</a-button> -->
        <a-button @click="preview">
          <i class="icon aufontAll h-icon-all-eye-o"></i>预览
        </a-button>

        <a-button @click="exportForm" icon="upload">导出</a-button>

        <!-- <a-button @click="exportForm" icon="reload">还原</a-button> -->

        <a-button icon="save" @click="onSave">保存</a-button>

        <a-button @click="publish" type="primary">
          <i class="icon aufontAll h-icon-all-plane-o"></i>发布
        </a-button>
      </span>
    </div>
    <div></div>
    <div class="form-design-content">
      <h3-sider :options="leftSider" @resize="onSiderToggle">
        <form-design-panel></form-design-panel>
      </h3-sider>

      <editor
        v-if="viewType === 'editor'"
        ref="editor"
        :options="editorOptions"
        @dataitem-add="onDataitemAdd"
        @dataitem-delete="onDataitemDelete"
      ></editor>
      <designer
        v-show="viewType !== 'editor'"
        ref="designer"
        :class="[this.viewType, 'bgf', 'bdr']"
        :warpCls="`${this.viewType}-view`"
        :controls="controls"
        :initLayout="layout"
        :formData="formData"
        :device="this.viewType"
        :showDragTips="showDragTips"
        @control-add="onControlAdd"
        @control-update="onControlUpdate"
        @control-delete="onControlDelete"
        @control-select="onControlSelect"
        @dataitem-add="onDataitemAdd"
        @dataitem-delete="onDataitemDelete"
      ></designer>
      <h3-sider :options="rightSider" @resize="onSiderToggle">
        <FormProperty 
          :formData="formData"
          :allControls="selectedControl"
          @control-update="onControlUpdate"
          @edit-formdata-attribute="editFormDataAttribute"
          ref="formAttributeLayout"
        ></FormProperty>
      </h3-sider>
    </div>
    <a-modal
      :visible="showUnsaveConfirm"
      :closable="false"
      :maskClosable="false"
      :width="400"
      wrapClassName="unsave-confirm"
    >
      <div class="unsave-confirm--content">
        <i class="icon aufontAll h-icon-all-question-circle"></i>
        <strong>{{ $t("languages.Apps.FormDesignPage.UnsaveContent") }}</strong>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="handleConfirmCancel">{{ $t("languages.Apps.Cancel") }}</a-button>
        <a-button key="unsave" @click="handleConfirmUnsave">{{ $t("languages.Apps.Unsave") }}</a-button>
        <a-button
          key="save"
          type="primary"
          @click="handleConfirmOk"
        >{{ $t("languages.Apps.SaveAndLeave") }}</a-button>
      </template>
    </a-modal>
    <!-- 预览弹窗 -->
    <div class="design__preview" v-if="showPreview">
      <FormPreview @hidePreview="hidePreview" :curview="viewData"></FormPreview>
    </div>
  </div>
</template>


<script lang='ts'>
import { Store } from "vuex";
import { Component, Vue, Prop, Watch, Provide } from "vue-property-decorator";
import * as formApi from "@/apis/form";
import { TemplateExport } from "@/template/templateExport";
import H3Sider from "@/common/sider/sider.vue";
import "@/directives/drag";
import * as dataitemStore from "./stores/data-items.store-helper";
import FormDesignPanel from "./panels/form-design-panel.vue";
import Designer from "./designer/designer.vue";
import FormProperty from "./form-property/form-attribute-layout.vue";
import { DataItemType } from "@cloudpivot/form/schema";
import FormPreview from "@/components/apps/form-preview/form-preview.vue";
import {
  FormControl,
  FormSheet,
  FormSheetColumn,
  FormControlType,
  FormSheetStatistic,
  DataItem,
  ReverseRelevanceOptions,
  DispalyMode
} from "./typings";

import * as ControlFactory from "./typings/control-factory";

import Editor from "./editor/editor.vue";

import { schema } from "@cloudpivot/form";

import { LanguageTransform } from "@/utils";

import { DataItemState } from "./stores/data-items.store";

@Component({
  name: "form-design",
  components: {
    FormDesignPanel,
    Designer,
    FormProperty,
    H3Sider,
    FormPreview,
    Editor: () => import("./editor/editor.vue")
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      (vm as FormDesign).load();
    });
  },

  beforeRouteUpdate(to, from, next) {
    const vm = this as FormDesign;

    const func = () => {
      vm.clean();
      next();
      vm.load();
    };

    if (vm.isEdit()) {
      vm.confirmSave().then(
        () => {
          func();
        },
        () => {
          next(false);
        }
      );
    } else {
      func();
    }
  },

  beforeRouteLeave(to, from, next) {
    const currFormDeleted =
      to.params.bizSchemaCode === from.params.bizSchemaCode &&
      to.query.del_form_code === from.params.sheetCode;

    const vm = this as FormDesign;
    vm.showDragTips = false;
    if (!currFormDeleted && vm.isEdit()) {
      vm.confirmSave().then(
        () => {
          vm.clean();
          next();
        },
        () => {
          next(false);
        }
      );
    } else {
      vm.clean();
      next();
    }
  }
})
export default class FormDesign extends Vue {
  showPreview: boolean = false;
  // 表单预览数据
  viewData: any;
  views: any = [
    {
      value: "web",
      text: "web端设计"
    },
    {
      value: "mobile",
      text: "移动端设计"
    },
    {
      value: "editor",
      text: "HTML"
    }
  ];

  showDragTips: boolean = false;

  isShowTips: boolean = false;

  isShowPublicTips: boolean = false;

  publicDescription:Array<string> = [];

  controls: { [key: string]: FormControl } = {};

  layout: string[][] = [];

  actions: Array<schema.FormAction> = [];

  elements: Array<schema.FormElement> = [];

  dataItemAdds: {
    [code: string]: DataItem;
  } = {} as any;

  dataItemDeletes: string[] = [];
  // 判断是否组件是否需要设置margin
  clacMargin: string[] = ["left", "right"];

  formData: any = {};

  selectedControl = {};

  viewType = "web";

  leftSider = {
    width: 238,
    minWidth: 238,
    maxWidth: 700,
    direction: "left",
    collapsible: true
  };

  rightSider = {
    width: 276,
    minWidth: 276,
    maxWidth: 700,
    direction: "right",
    collapsible: true
  };

  tpl = "";

  editorOptions = {};

  showUnsaveConfirm = false;

  saveConfirmPromiseResolve: Function | null = null;

  saveConfirmPromiseReject: Function | null = null;

  isPublishClick: boolean = false; // 是否点击发布按钮

  get designer() {
    return this.$refs.designer as Designer;
  }

  get isEditorView() {
    return this.viewType === "editor";
  }
  setClacMagin(str: string) {
    let arr = this.clacMargin;
    if (arr.includes(str)) {
      arr = arr.filter(item => item !== str);
    } else {
      arr.push(str);
    }
    this.clacMargin = arr;
  }
  /**
   * @desc 表单设计器控件和控制器显示隐藏回调
   */
  onSiderToggle(str) {
    if (this.isEditorView) {
      const editor = this.$refs.editor as Editor;
      if (editor) {
        editor.resize();
      }
    }
    // 动态设置margin
    this.setClacMagin(str);
  }

  async setView(evt: any) {
    const type = evt.target.value;

    // 从编辑器界面切回设计界面时
    if (this.isEditorView && this.viewType !== type) {
      try {
        await this.parseHTML();
      } catch {
        // 如果有错误停留在编辑器界面
        return;
      }
    }

    this.viewType = type;

    // 从设计界面切到编辑器界面
    if (this.isEditorView) {
      this.initEditorOptions();
    }
  }

  initEditorOptions() {
    const layout = this.designer.getLayout();
    this.editorOptions = {
      layout,
      controls: this.controls,
      actions: this.actions,
      elements: this.elements
    };
  }

  async parseHTML() {
    if (!this.isEditorView) {
      return;
    }

    const editor = this.$refs.editor as Editor;
    if (!editor) {
      return;
    }

    const callOnDataItemAdd = (control: FormControl) => {
      let item = this.findDataItem(control.key, control.parentKey);

      if (item) {
        return;
      }

      item = ControlFactory.buildDataItemOf(
        {
          code: control.key,
          type: control.type,
          name: control.options.name
        },
        control.parentKey
      );
      this.onDataitemAdd(item);
    };

    const checkDataitem = (result: any) => {
      for (const key in result.controls) {
        const control = result.controls[key];
        if (ControlFactory.notDataItemOf(control.type)) {
          continue;
        }

        const isSheet = control.type === FormControlType.Sheet;

        if (!this.controls[key]) {
          callOnDataItemAdd(control);

          if (isSheet) {
            for (const newCol of (control as FormSheet).columns) {
              callOnDataItemAdd(newCol);
            }
          }
        } else if (isSheet) {
          const newSheet = control as FormSheet;
          const oldSheet = this.controls[key] as FormSheet;
          const oldColumnKeys = oldSheet.columns.map(c => c.key);

          for (const newCol of newSheet.columns) {
            if (oldColumnKeys.indexOf(newCol.key) === -1) {
              callOnDataItemAdd(newCol);
            }
          }
        }
      }

      for (const key in this.controls) {
        const control = this.controls[key];
        if (!result.controls[key]) {
          this.onDataitemDelete(control.key, control.parentKey);
        } else if (control.type === FormControlType.Sheet) {
          const newSheet = result.controls[key] as FormSheet;
          const oldSheet = control as FormSheet;
          const newColumnKeys = newSheet.columns.map(c => c.key);

          for (const oldCol of oldSheet.columns) {
            if (newColumnKeys.indexOf(oldCol.key) === -1) {
              this.onDataitemDelete(oldCol.key, oldCol.parentKey);
            }
          }
        }
      }
    };

    const result = await editor.parse();
    checkDataitem(result);

    this.controls = result.controls;
    this.layout = result.layout;
    this.actions = result.actions;
    this.elements = result.elements;
  }

  isEdit() {
    if (
      !this.formData.draftAttributesJson &&
      Object.keys(this.controls).length
    ) {
      return true;
    }

    const layout = this.designer.getLayout();
    if (!this.formData.draftViewJson && layout.length) {
      return true;
    }

    const set = new Set();
    set.add(JSON.stringify(this.controls));

    if (!set.has(this.formData.draftAttributesJson)) {
      return true;
    }

    set.clear();
    set.add(JSON.stringify(layout));

    if (!set.has(this.formData.draftViewJson)) {
      return true;
    }

    return false;
  }

  onDataitemAdd(item: DataItem) {
    if (item.parentCode) {
      let parent = this.dataItemAdds[item.parentCode];
      if (!parent) {
        const temp = this.findDataItem(item.parentCode);
        if (temp) {
          parent = Object.assign({}, temp);
          this.dataItemAdds[item.parentCode] = parent;
        }
      }
      if (parent.properties) {
        if (item.id) {
          const idx = parent.properties.findIndex(x => x.id === item.id);
          parent.properties.splice(idx, 1, item);
        } else {
          const idx = parent.properties.findIndex(x => x.code === item.code);
          if (idx === -1) {
            parent.properties.push(item);
          } else {
            item.id = parent.properties[idx].id;
            parent.properties.splice(idx, 1, item);
          }
        }
      } else {
        parent.properties = [];
        parent.properties.push(item);
      }
    } else {
      this.dataItemAdds[item.code] = item;

      // 将拖拽的表单项添加到内存中
      let newItem: DataItemState = Object.assign(item, {
        used: true
      });
      dataitemStore.addItem(this, newItem);
    }
  }

  onDataitemDelete(code: string, parentCode?: string) {
    // 删除内存中的表单项
    const delIndex = this.items.findIndex(m => m.code === code);
    if (delIndex > -1) {
      const item = this.items[delIndex];
      if(!item.published){
        this.items.splice(delIndex, 1);
      }
    }
    if (parentCode) {
      let parent = this.dataItemAdds[parentCode];
      if (parent) {
        if (parent.properties) {
          const idx = parent.properties.findIndex(p => p.code === code);
          parent.properties.splice(idx, 1);
        }
      }
      parent = this.items.find(x => x.code === parentCode) as any;
      if (parent && parent.properties) {
        const item = parent.properties.find(x => x.code === code);
        if (item && !item.published && !item.isSystem) {
          this.dataItemDeletes.push(`${parentCode}.${code}`);
        }
      }
    } else {
      delete this.dataItemAdds[code];
      const item = this.items.find(x => x.code === code);
      if (item && !item.published && !item.isSystem) {
        this.dataItemDeletes.push(code);
      }
    }
    this.setShowDragTips("delete");
  }

  onControlSelect(control?: FormControl) {
    if (control && control.type !== FormControlType.Html) {
      // const globalName:string =  LanguageTransform.getLang(control.options.name, control.options.name_i18n);
      // control.options.name = globalName;

      let dataItem = this.findUnSaveDataItem(control.key, control.parentKey);

      if (!dataItem) {
        const key =
          control.type === FormControlType.SheetStatistic
            ? (control as FormSheetStatistic).columnKey
            : control.key;
        dataItem = this.findDataItem(key, control.parentKey);
      }
      this.selectedControl = { control, dataItem };
    } else {
      this.selectedControl = {};
    }
  }

  onControlAdd(control: FormControl, copyKey?: string) {
    this.setShowDragTips("add");
    this.controls[control.key] = control;

    if (control.key === ".") {
      return;
    }

    // 如果有数据项，则设置为不可用
    let item = this.findDataItem(control.key);
    if (item) {
      this.switchDataitemUsed(control.key);
      if (control.type === FormControlType.Sheet && item.properties) {
        item.properties.forEach(p => {
          this.switchDataitemUsed(control.key, p.code);
        });
      }
    } else {
      // 只有基础控件和子表需要选择数据项
      if (!(control.type >= 90 && control.type !== FormControlType.Sheet)) {
        if (copyKey) {
          item =
            this.findDataItem(copyKey, control.parentKey) ||
            this.findUnSaveDataItem(copyKey, control.parentKey);
          item = JSON.parse(JSON.stringify(item));
          if (item) {
            item.code = control.key;
            item.published = false;
            item.name += "1";
            delete item.id;
            if (control.type === FormControlType.Sheet && item.properties) {
              item.properties.forEach(p => {
                p.published = false;
                delete p.id;
              });
            }
            this.onDataitemAdd(item);
          }
        }
      }
    }
    this.onControlSelect(control);
  }

  onControlUpdate(
    key: string,
    properties: { [key: string]: any },
    parentKey?: string
  ) {
    let control: any = this.controls[parentKey || key];
    if (!control) {
      return;
    }
    
    // 处理默认值大于最大长度的问题
    if (control.type === 1 && properties.options && properties.options.hasOwnProperty('defaultValue')) {
      let { maxLength } = control.options;
      let { defaultValue } = properties.options;
      if (defaultValue.length > maxLength) {
        properties.options.defaultValue = properties.options.defaultValue.slice(0, maxLength)
      }
    }
    // 子表子控件处理
    if (parentKey && control.type === FormControlType.Sheet) {
      const sheet = control as FormSheet;
      let col;
      if (key.indexOf("stat-") > -1) {
        col = sheet.statistics.find(c => c.key === key);
      } else {
        col = sheet.columns.find(c => c.key === key);
      }
      if (col) {
        control = col;
        if (col.type === FormControlType.Number) {
          let propertys = Object.keys(properties.options);
          if (propertys.includes("format") && sheet.statistics) {
            this.syncSheetNumberAndStatistic(
              key,
              sheet,
              properties.options.format
            );
          }
        }
      }
    }
    let name = control.options.name;
    if (!control) {
      return;
    }

    Object.keys(properties).forEach(k => {
      const c = control as any;
      if (c[k] === undefined) {
        return;
      }
      const prop = properties[k];
      let obj: any;
      if (Array.isArray(prop)) {
        obj = prop.slice();
      } else if (prop && typeof prop === "object") {
        obj = Object.assign({}, (control as any)[k], properties[k]);
      } else {
        obj = prop;
      }
      // this.$set(control, k, obj);
      c[k] = obj;
    });

    if (properties.hasOwnProperty("type")) {
      control.options = ControlFactory.buildControlOptions(
        properties.type,
        control.options
      );

      if (control.parentKey) {
        (control as FormSheetColumn).width = ControlFactory.getSheetColumnWidth(
          control.type
        );
      }
    }

    if (properties.options) {
      if (properties.options.name) {
        // const globalName =  LanguageTransform.setLang(control.options.name, control.options.name_i18n);
        // control.options =  Object.assign({},control.options,globalName);
        const locale = this.$i18n.locale;
        if (locale === "zh") {
          this.updateDataItem(control, "name");
        } else {
          if (name) {
            control.options.name = name;
          }
          if (!control.options.name_i18n) {
            control.options.name_i18n = {};
          }
          control.options.name_i18n[locale] = properties.options.name;
          this.updateDataItem(control, "name_i18n");
        }
      } else if (properties.options.schemaCode) {
        this.updateDataItem(control, "schemaCode", "relativeCode");
      } else if (properties.options.dataItemName) {
        this.updateDataItemCode(control, properties.options.dataItemName);
      }
    }
    this.onControlSelect(control);
  }
  // 同步子表中 数值框格式和统计的格式
  syncSheetNumberAndStatistic(
    numberCode: string,
    sheet: FormSheet,
    newFormat: string
  ) {
    let item = sheet.statistics.find(val => val.columnKey === numberCode);
    if (item) {
      item.options.format = newFormat;
    }
  }

  findDataItem(code: string, parentCode?: string) {
    if (parentCode) {
      const parent = this.items.find(x => x.code === parentCode);
      if (!parent || !parent.properties) {
        return null;
      }
      return parent.properties.find(x => x.code === code);
    }
    return this.items.find(x => x.code === code);
  }

  findUnSaveDataItem(code: string, parentCode?: string) {
    if (parentCode) {
      const parent = this.dataItemAdds[parentCode];
      if (!parent || !parent.properties) {
        return null;
      }
      const item = parent.properties.find(p => p.code === code);
      return item;
    }
    return this.dataItemAdds[code];
  }

  updateDataItem(control: FormControl, key: string, alias?: string) {
    let add: any;

    if (control.parentKey) {
      let item = this.findUnSaveDataItem(control.key, control.parentKey);

      if (item) {
        add = item;
      } else {
        item = this.findDataItem(control.key, control.parentKey);

        if (item && !item.published && !item.isSystem) {
          add = Object.assign({}, item);
          this.onDataitemAdd(add);
        }
      }
    } else {
      add = this.dataItemAdds[control.key];

      if (!add) {
        const item = this.items.find(x => x.code === control.key) as any;
        if (item && !item.published && !item.isSystem) {
          add = Object.assign({}, item);
          this.onDataitemAdd(add);
        }
      }
    }

    if (add) {
      alias = alias || key;
      add[alias] = control.options[key];
    }
  }

  updateDataItemCode(control: FormControl, code: string) {
    if (control.key === code) {
      return false;
    }

    const item = this.findDataItem(control.key, control.parentKey);
    if (item && (item.published || item.isSystem || item.code === code)) {
      return false;
    }

    let item2 = control.parentKey
      ? this.findDataItem(code, control.parentKey)
      : this.findDataItem(code);
    if (!item2) {
      item2 = control.parentKey
        ? this.findUnSaveDataItem(code, control.parentKey)
        : this.findUnSaveDataItem(code);
    }

    if (item2) {
      this.$message.error(`数据项编码重复，请重新输入`);
      return false;
    }

    let updateItem = this.findUnSaveDataItem(control.key, control.parentKey);

    if (updateItem) {
      if (updateItem.code === code) {
        return false;
      }

      if (!updateItem.parentCode) {
        delete this.dataItemAdds[updateItem.code];
        this.dataItemAdds[code] = updateItem;
      }

      updateItem.code = code;
    } else {
      updateItem = Object.assign({}, item);
      updateItem.code = code;
      this.onDataitemAdd(updateItem);
    }

    if (updateItem.properties) {
      updateItem.properties.forEach(x => (x.parentCode = code));
    }

    if (control.type === FormControlType.Sheet) {
      const sheet = control as FormSheet;
      sheet.columns.forEach(c => (c.parentKey = code));
      if (sheet.statistics) {
        sheet.statistics.forEach(c => (c.parentKey = code));
      }
    } else if (control.parentKey) {
      const sheet = this.controls[control.parentKey] as FormSheet;
      if (sheet && sheet.statistics) {
        sheet.statistics
          .filter(c => c.columnKey === control.key)
          .forEach(c => (c.columnKey = code));
      }
    }

    if (control.parentKey) {
      control.key = code;
    } else {
      const [row, col] = this.designer.findIndex(control.key);
      if (row !== -1 && col !== -1) {
        this.$delete(this.controls, control.key);
        control.key = code;
        this.$set(this.controls, code, control);
        this.designer.replace(row, col, code);
      }
    }

    return true;
  }

  onControlDelete(controlKey: string) {
    const control = this.controls[controlKey];
    if (!control) {
      return;
    }

    delete this.controls[controlKey];
    if (control.key === ".") {
      return;
    }

    this.onControlSelect();

    this.cleanControlFormulaBy(this.controls, control);

    if (!ControlFactory.notDataItemOf(control.type)) {
      this.switchDataitemUsed(controlKey);

      if (control.type === FormControlType.Sheet) {
        const item = this.findDataItem(controlKey);
        if (item && item.properties) {
          item.properties.forEach(p => {
            this.switchDataitemUsed(controlKey, p.code);
          });
        }
      }

      this.onDataitemDelete(control.key, control.parentKey);
    }
    this.setShowDragTips("delete");
  }

  cleanControlFormulaBy(controls: any, control: FormControl) {
    for (const key in controls) {
      const c = controls[key];
      const opts = c.options;
      if (!opts) {
        continue;
      }

      const text = control.parentKey
        ? `{${control.parentKey}.${control.key}}`
        : `{${control.key}}`;

      if (opts.displayFormula && opts.displayFormula.indexOf(text) > -1) {
        opts.displayFormula = "";
      }

      if (opts.requiredFormula && opts.requiredFormula.indexOf(text) > -1) {
        opts.requiredFormula = "";
      }

      if (opts.computeFormula && opts.computeFormula.indexOf(text) > -1) {
        opts.computeFormula = "";
      }
      if (opts.verifyFormula && ~opts.verifyFormula.indexOf(control.key)) {
        opts.verifyFormula = "";
      }
    }
  }

  setDataitemUsed(used: boolean, code: string, subCode?: string) {
    dataitemStore.setUsed(this, used, code, subCode);
  }

  switchDataitemUsed(code: string, subCode?: string) {
    dataitemStore.switchUsed(this, code, subCode);
  }

  get items() {
    return dataitemStore.getDataItems(this);
  }

  reload() {
    this.clean();
    this.load();
  }

  clean() {
    // this.viewType = "web";
    this.clearTempDataItem();
    this.formData = {};
    dataitemStore.unregister(this);
  }

  clearTempDataItem() {
    this.dataItemAdds = {};
    this.dataItemDeletes = [];
  }

  load() {
    const hideLoader = (this.$message as any).loading();

    dataitemStore
      .init(this)
      .then(() => this.loadForm())
      .then(
        () => {
          hideLoader();
        },
        res => {
          hideLoader();
          if (res) {
            this.$message.error(res.errmsg);
          }
        }
      );
  }

  /**
   * 加载表单
   */
  loadForm() {
    const sheetCode = this.$route.params.sheetCode;
    const schemaCode = this.$route.params.bizSchemaCode;

    if (!sheetCode || !schemaCode) {
      this.$message.error("缺少参数");
      return Promise.reject(null);
    }

    const _this = this;
    return formApi.get(schemaCode, sheetCode).then((res: any) => {
      _this.formData = res.data;

      if (_this.formData.sheetType) {
        _this.$message.error("无法打开自定义表单");
        return Promise.reject(null);
      }

      if (!res.data.draftAttributesJson && !res.data.publishedAttributesJson) {
        this.autoLayout();
      } else {
        this.initLayout();
      }

      Object.keys(_this.controls).forEach(k => {
        _this.setDataitemUsed(true, k);
        const c = _this.controls[k] as FormSheet;
        if (c.type === FormControlType.Sheet && c.columns) {
          c.columns.forEach(col => _this.setDataitemUsed(true, c.key, col.key));
        }
      });

      return res;
    });
  }

  /**
   * 初始化布局
   */
  initLayout() {
    this.showDragTips = false;
    const controls = JSON.parse(
      this.formData.draftAttributesJson || this.formData.publishedAttributesJson
    );

    const layout: Array<any[]> = JSON.parse(
      this.formData.draftViewJson || this.formData.publishedViewJson
    );

    const actionsJson =
      this.formData.draftActionsJson || this.formData.publishedActionsJson;
    if (actionsJson) {
      this.actions = JSON.parse(actionsJson);
    }

    const elementsJson =
      this.formData.draftHtmlJson || this.formData.publishedHtmlJson;
    if (elementsJson) {
      this.elements = JSON.parse(elementsJson);
    }

    localStorage.setItem('layoutType',this.formData.layoutType)

    const itemCodes = this.items.map(x => x.code);

    const keys = Object.keys(controls);

    const deleteKeys = keys.filter(k => {
      const ct = controls[k].type;

      // 从表单中移除审批意见控件
      if (ct === FormControlType.ApprovalOpinion) {
        return true;
      }

      return !ControlFactory.notDataItemOf(ct) && itemCodes.indexOf(k) === -1;
    });

    for (const row of layout) {
      for (const key of row) {
        if (keys.indexOf(key) === -1) {
          deleteKeys.push(key);
        }
      }
    }

    for (const key of deleteKeys) {
      if (controls[key]) {
        this.cleanControlFormulaBy(controls, controls[key]);
      }
    }

    this.removeControlOf(deleteKeys, controls, layout);

    for (const key in controls) {
      const control = controls[key];

      // 旧数据多语言兼容

      // control.options.name_i18n = LanguageTransform.initNameI18n(control.options.name, control.options.name_i18n);

      // const globalName:string =  LanguageTransform.getLang(control.options.name, control.options.name_i18n);
      // control.options.name = globalName;

      if (control.type === FormControlType.Sheet) {
        const item = this.items.find(x => x.code === control.key);

        if (item && item.properties) {
          // item.properties.forEach((res:any) => {
          //   const globalName:string =  LanguageTransform.getLang(control.name, control.name_i18n);
          //   res.name = globalName;
          // });

          const _deleteKeys = (control as FormSheet).columns
            .filter(
              c => !(item.properties as any).some((p: any) => p.code === c.key)
            )
            .map(c => c.key);
          this.removeSheetControlOf(control, _deleteKeys);
        }
      }
    }
    this.compatibleDateControls(controls); // 旧的最大最小值,兼容新的校验规则

    this.controls = ControlFactory.restoreOptions(controls);

    //初始化时，旧数据兼容到最新版本
    this.formData.draftAttributesJson = JSON.stringify(this.controls);

    this.layout = layout;
  }
  // 兼容 日期控件 旧的 大小值 和 新的校验规则
  // 如果 旧数据 maxDate 和 minDate数据类型不同(一个是固定值,一个是数据项)则在新的校验规则弹框不做处理
  compatibleDateControls(ctr) {
    if (!ctr) return;
    for (let key of Object.keys(ctr)) {
      let val = ctr[key];
      if (val.type === DataItemType.Date) {
        let opt = val.options;
        if (opt.maxDate || opt.minDate) {
          let arr: string[] = [];
          if (opt.maxDate && opt.minDate) {
            if (~opt.maxDate.indexOf("{") && ~opt.minDate.indexOf("{")) {
              // max min 都是数据项
              let maxDateKey = opt.maxDate.replace(/^{|}$/g, "");
              let minDateKey = opt.minDate.replace(/^{|}$/g, "");
              if (ctr[maxDateKey] && ctr[minDateKey]) {
                arr = [
                  `type:2`,
                  `rule:~`,
                  `lSelect:${minDateKey}`,
                  `rSelect:${maxDateKey}`,
                  `day:0`,
                  `defaultPrompt:${opt.name}必须介于${ctr[minDateKey].options.name}~${ctr[maxDateKey].options.name}`
                ];
              }
            } else if (
              !~opt.maxDate.indexOf("{") &&
              !~opt.minDate.indexOf("{")
            ) {
              // max min 都是字符串
              arr = [
                `type:1`,
                `rule:~`,
                `lDate:${opt.minDate}`,
                `rDate:${opt.maxDate}`,
                `defaultPrompt:${opt.name}必须介于${opt.minDate}~${opt.maxDate}`
              ];
            }
          } else if (opt.maxDate && !opt.minDate) {
            if (~opt.maxDate.indexOf("{")) {
              // max 是数据项
              let maxDateKey = opt.maxDate.replace(/^{|}$/g, "");
              if (ctr[maxDateKey]) {
                arr = [
                  `type:2`,
                  `rule:<=`,
                  `select:${opt.maxDate.replace(/^{|}$/g, "")}`,
                  `day:0`,
                  `defaultPrompt:${opt.name}必须小于等于${ctr[maxDateKey].options.name}`
                ];
              }
            } else {
              // max 是字符串
              arr = [
                `type:1`,
                `rule:<=`,
                `date:${opt.maxDate}`,
                `defaultPrompt:${opt.name}必须小于等于${opt.maxDate}`
              ];
            }
          } else if (!opt.maxDate && opt.minDate) {
            if (~opt.minDate.indexOf("{")) {
              // min 是数据项
              let minDateKey = opt.minDate.replace(/^{|}$/g, "");
              if (minDateKey) {
                arr = [
                  `type:2`,
                  `rule:>=`,
                  `select:${opt.minDate.replace(/^{|}$/g, "")}`,
                  `day:0`,
                  `defaultPrompt:${opt.name}必须大于等于${ctr[minDateKey].options.name}`
                ];
              }
            } else {
              // min 是字符串
              arr = [
                `type:1`,
                `rule:>=`,
                `date:${opt.minDate}`,
                `defaultPrompt:${opt.name}必须大于等于${opt.minDate}`
              ];
            }
          }
          let obj = {}
          for (let item of arr) {
            let [k,v] = item.split(':')
            obj[k] = v
          }
          opt.verifyFormula = JSON.stringify(obj);
          opt.maxDate = "";
          opt.minDate = "";
        }
      }
    }
  }

  /**
   * 移除
   */
  removeSheetControlOf(control: FormSheet, deleteKeys: string[]) {
    const idxs = control.columns
      .map((c, i) => (deleteKeys.indexOf(c.key) > -1 ? i : -1))
      .filter(i => i > -1)
      .reverse();

    idxs.forEach(i => {
      const c = control.columns.splice(i, 1)[0];
      if (c.type === FormControlType.Number && control.statistics) {
        const idx = control.statistics.findIndex(s => s.columnKey === c.key);
        control.statistics.splice(idx, 1);
      }
    });
  }

  /**
   * 移除表单控件
   */
  removeControlOf(
    deleteKeys: string[],
    controls: any,
    layout: Array<string[]>
  ) {
    deleteKeys.forEach(k => {
      delete controls[k];
    });

    for (const row of layout) {
      if (typeof row[0] === "string") {
        const idxs = row
          .map((x, i) => (deleteKeys.indexOf(x) > -1 ? i : -1))
          .filter(i => i > -1)
          .reverse();
        if (idxs.length > 0) {
          idxs.forEach(i => row.splice(i, 1));
        }
      }
    }

    const idxs = layout
      .map((x, i) => (x.length === 0 ? i : -1))
      .filter(i => i > -1)
      .reverse();

    if (idxs.length > 0) {
      idxs.forEach(i => layout.splice(i, 1));
    }
  }

  /**
   * 自动布局
   */
  autoLayout() {
    const items = this.items.filter(x => x.published || x.isSystem);
    const bizItems = this.items.filter(x => !x.isSystem);
    if (bizItems.length === 0) {
      this.showDragTips = true;
    }
    if (items.length === 0) {
      return;
    }
    const schemaCode = this.$route.params.bizSchemaCode;

    const [controls, layout] = ControlFactory.autoLayout(this.formData, items);

    this.controls = controls;
    this.layout = layout;
  }

  /**
   * 设置提示控件显示
   */
  setShowDragTips(type: string) {
    if (type === "add") {
      this.showDragTips = false;
    } else {
      if (Object.keys(this.controls).length === 1) {
        this.showDragTips = true;
      }
    }
  }

  editFormDataAttribute(field: string, value: any) {
    let tmp: any = {};
    
    tmp[field] = value;

    if (field === "name") {
      const obj: any = LanguageTransform.setLang(
        value,
        this.formData.name_i18n
      );

      tmp = obj;
    }

    this.formData = Object.assign({}, this.formData, tmp);
  }
  /**
   * 预览
   */
  preview() {

    const controls = JSON.parse(JSON.stringify(this.controls));
    const layout = JSON.parse(JSON.stringify((this.$refs.designer as Designer).getLayout()));

    this.viewData = {
      controls,
      layout,
      layoutType: this.formData.layoutType ? this.formData.layoutType : 'horizontal',
      borderMode: this.formData.borderMode ? this.formData.borderMode : 'close'
    };
    this.showPreview = true;
    // try {
    //   await this.onSave(true);
    // } catch {
    //   // 如果有错误停留在编辑器界面
    //   return;
    // }
    // const sheetCode = this.$route.params.sheetCode;
    // const schemaCode = this.$route.params.bizSchemaCode;
    // const appCode = this.$route.params.appCode;
    // const { href } = this.$router.resolve({
    //   name: "form-preview",
    //   params: {
    //     appCode,
    //     bizSchemaCode: schemaCode,
    //     sheetCode
    //   }
    // });
    // window.open(href, "_blank");
  }
  hidePreview() {
    this.showPreview = false;
  }
  newTemplateExport() {
    return new TemplateExport({
      configure: JSON.parse(JSON.stringify(this.controls)),
      layout: JSON.parse(JSON.stringify(this.layout))
    });
  }

  /**
   * 导出
   */
  exportForm() {
    this.newTemplateExport().getHTMLFile();
  }

  /**
   * 发布
   */
  async publish() {
    try {
      await this.parseHTML();
    } catch {
      // 如果有错误停留在编辑器界面
      return;
    }

    const keys = Object.keys(this.controls);
    for (const key of keys) {
      const control = this.controls[key];
      if (control.type === FormControlType.RelevanceForm) {
        if (!control.options.schemaCode) {
          this.$message.error(`${control.options.name}未选择业务模型`);
          return;
        }
      }

      if (control.type === FormControlType.ReverseRelevance) {
        const opts = control.options as ReverseRelevanceOptions;

        if (!opts.schemaCode) {
          this.$message.error(`${control.options.name}未选择业务模型`);
          return;
        }

        if (!opts.fieldCode) {
          this.$message.error(`${control.options.name}未选择关联字段`);
          return;
        }

        if (opts.displayMode === DispalyMode.List && !opts.listCode) {
          this.$message.error(`${control.options.name}未选择查询列表`);
          return;
        }
      }

      if (control.type === FormControlType.Sheet) {
        const sheet = control as FormSheet;
        for (const col of sheet.columns) {
          if (col.type === FormControlType.RelevanceForm) {
            if (!col.options.schemaCode) {
              this.$message.error(`${col.options.name}未选择业务模型`);
              return;
            }
          }
        }
      }
    }

    // const controls = ControlFactory.trimOptions(this.controls);
    const controls = this.controls;

    this.formData.publishedAttributesJson = JSON.stringify(controls);

    const layout = (this.$refs.designer as Designer).getLayout();
    this.formData.publishedViewJson = JSON.stringify(layout);

    this.formData.draftAttributesJson = this.formData.publishedAttributesJson;
    this.formData.draftViewJson = this.formData.publishedViewJson;
    this.formData.tempAuthSchemaCodes = this.setTempAuthSchemaCodes();

    if (this.actions) {
      this.formData.draftActionsJson = this.formData.publishedActionsJson = JSON.stringify(
        this.actions
      );
    }

    if (this.elements) {
      this.formData.draftHtmlJson = this.formData.publishedHtmlJson = JSON.stringify(
        this.elements
      );
    }

    const msg = this.$t("languages.PublishSuccess").toString();

    this.isPublishClick = true;

    this.updateForm(true, msg).then(() => {
     /* 1.模拟鼠标点击选中控件 2.给选中控件的状态设置为已发布 */
      if(this.selectedControl['dataItem']){ 
        this.onControlSelect((this.selectedControl as any).control);
        this.selectedControl['dataItem'].published=true;
      }
      /* 刷新右侧表单属性 */
      (this.$refs.formAttributeLayout as any).initData();
    });
    
  }

  /**
   * 还原
   */
  restore() {
    const _this = this;
    this.$confirm({
      title: this.$t("languages.Apps.FormDesignPage.RestoreTitle").toString(),
      content: this.$t(
        "languages.Apps.FormDesignPage.RestoreContent"
      ).toString(),
      okText: this.$t("languages.Apps.Ok").toString(),
      cancelText: this.$t("languages.Apps.Cancel").toString(),
      onOk() {
        _this.autoLayout();
        // _this.publish();
      }
    });
  }

  async onSave(throwError = false) {
    try {
      await this.parseHTML();
    } catch {
      if (throwError) {
        throw new Error();
      } else {
        // 如果有错误停留在编辑器界面
        return;
      }
    }

    return this.save().then(() => {
      // setTimeout(() => location.reload(), 1000);
      this.load();
      this.isShowTips = true;
      return;
    });
  }

  /**
   * 保存
   */
  save() {
    // const controls = ControlFactory.trimOptions(this.controls);
    const controls = this.controls;

    this.formData.tempAuthSchemaCodes = this.setTempAuthSchemaCodes();

    this.formData.draftAttributesJson = JSON.stringify(controls);
    this.formData.draftViewJson = JSON.stringify(
      (this.$refs.designer as Designer).getLayout()
    );

    if (this.actions) {
      this.formData.draftActionsJson = JSON.stringify(this.actions);
    }

    if (this.elements) {
      this.formData.draftHtmlJson = JSON.stringify(this.elements);
    }

    const msg = this.$t("languages.SaveSuccess").toString();

    this.isPublishClick = false;

    return this.updateForm(false, msg);
  }
  /**
   * 设置临时授权code
   */
  setTempAuthSchemaCodes(): string {
    const controls = this.controls;
    const relevanceForms: FormControl[] = [];
    for (const key in controls) {
      const ctrl = controls[key];
      if (
        ctrl.type === FormControlType.RelevanceForm &&
        ctrl.options.isAuthorize
      ) {
        relevanceForms.push(controls[key]);
      }

      if (ctrl.type === FormControlType.Sheet) {
        const columns = (ctrl as any).columns;
        columns.forEach(item => {
          // debugger;
          if (item.type === FormControlType.RelevanceForm &&
          item.options.isAuthorize) {
            relevanceForms.push(item);
          }
        })
      }
    }
    return relevanceForms
      .map(res => {
        return `${res.options.schemaCode}_${res.options.queryCode}`;
      })
      .join(",");
  }

  /**
   * 发布或保存表单
   */
  updateForm(isPublish: boolean, msg: string) {
    const _this = this;
    const hideLoader = (this.$message as any).loading();
    const data = this.formData as any;

    if (this.dataItemDeletes.length) {
      data.deleteProperties = this.dataItemDeletes;
    }

    const addCodes = Object.keys(this.dataItemAdds);
    if (addCodes.length) {
      const schemaCode = this.$route.params.bizSchemaCode;

      data.properties = addCodes.map(code => {
        const item = this.dataItemAdds[code];

        const obj: any = {
          schemaCode,
          id: item.id,
          code: item.code,
          name: item.name,
          name_i18n: null,
          propertyType: item.type,
          propertyIndex: item.propertyIndex || false,
          propertyEmpty: item.propertyEmpty || false,
          relativeCode: item.relativeCode,
          subSchema: {
            properties: new Array<any>()
          }
        };

        if (item.name_i18n) {
          if (typeof item.name_i18n === "string") {
            obj.name_i18n = item.name_i18n;
          } else {
            obj.name_i18n = JSON.stringify(item.name_i18n);
          }
        }

        if (!item.properties) {
          return obj;
        }

        obj.subSchema.properties = item.properties.map(p => ({
          schemaCode,
          id: p.id,
          code: p.code,
          name: p.name,
          name_i18n: p.name_i18n,
          relativeCode: p.relativeCode,
          propertyType: p.type,
          propertyIndex: p.propertyIndex || false,
          propertyEmpty: p.propertyEmpty || false
        })) as any;

        return obj;
      });
    } else {
      data.properties = [];
    }

    const p = isPublish ? formApi.publish(data) : formApi.update(data);
    
    return p.then(
      res => {
        hideLoader();
        this.clearTempDataItem();
        this.reload(); // 刷新数据项
         _this.$message.success(msg);
        if( data.properties.length != 0 && this.isPublishClick ){
           this.isPublishClick = false;
          _this.showPublichTips();
        }
        return res;
      },
      res => {
        hideLoader();
        if (
          res.errcode === 301005 &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          _this.clearAndPublish(res.data, isPublish, msg);
        } else if (res.errmsg) {
          _this.$message.error(res.errmsg);
        }
        return Promise.reject(null);
      }
    );
  }

  showPublichTips(){
    this.publicDescription = ["您新增加了数据项，如果在流程中使用请重新发布流程"];
  }  

  onClosePublicTips(){
    this.publicDescription = [];
  }

  /**
   * 清理已被删除的数据项并发布
   */
  clearAndPublish(
    deletedDataItemCodes: string[],
    isPublish: boolean,
    msg: string
  ) {
    const dataItems = this.items;

    const names = deletedDataItemCodes
      .map(code => {
        const idx = code.indexOf(".");
        if (idx === -1) {
          const item = dataItems.find(x => x.code === code);
          return item ? item.name : null;
        }
        const parentCode = code.substring(0, idx);
        const childCode = code.substring(idx + 1);
        const item = dataItems.find(x => x.code === parentCode);
        if (!item || !item.properties) {
          return null;
        }
        const childItem = item.properties.find(p => p.code === childCode);
        if (!childItem) {
          return null;
        }
        return `${item.name}.${childItem.name}`;
      })
      .filter(n => !!n)
      .join("、");

    if (!names) {
      return;
    }

    const _this = this;

    const clear = () => {
      deletedDataItemCodes
        .filter(code => code.indexOf(".") < 0)
        .forEach(code => {
          _this.removeControlOf(
            deletedDataItemCodes,
            _this.controls,
            _this.layout
          );
        });

      deletedDataItemCodes
        .filter(code => code.indexOf(".") > -1)
        .forEach(code => {
          const idx = code.indexOf(".");
          const parentCode = code.substring(0, idx);
          const childCode = code.substring(idx + 1);
          const sheet = _this.controls[parentCode] as FormSheet;
          if (!sheet) {
            return;
          }
          _this.removeSheetControlOf(sheet, [childCode]);
        });
    };

    this.$confirm({
      content: this.$t("languages.Apps.FormDesignPage.PublishError", {
        name: names
      }).toString(),
      okText: this.$t("languages.Apps.Ok").toString(),
      cancelText: this.$t("languages.Apps.Cancel").toString(),
      onOk() {
        clear();
        _this.publish();
      }
    });
  }

  /**
   * 询问是否保存
   */
  confirmSave() {
    const _this = this;
    this.showUnsaveConfirm = true;

    return new Promise((resolve, reject) => {
      this.saveConfirmPromiseResolve = resolve;
      this.saveConfirmPromiseReject = reject;
    });

    // return new Promise((resolve, reject) => {
    //   _this.$confirm({
    //     title: _this.$t("languages.Apps.FormDesignPage.UnsaveContent"),
    //     okText: _this.$t("languages.Apps.SaveAndLeave"),
    //     cancelText: _this.$t("languages.Apps.Unsave"),
    //     onOk() {
    //       _this.save().then(() => resolve(), () => reject());
    //     },
    //     onCancel() {
    //       resolve();
    //     }
    //   });
    // });
  }

  handleConfirmCancel() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseReject) {
      this.saveConfirmPromiseReject();
      this.saveConfirmPromiseReject = null;
    }
  }

  handleConfirmUnsave() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseResolve) {
      this.saveConfirmPromiseResolve();
      this.saveConfirmPromiseResolve = null;
    }
  }

  handleConfirmOk() {
    this.save().then(
      () => {
        this.handleConfirmUnsave();
      },
      () => {
        this.handleConfirmCancel();
      }
    );
  }

  @Watch("$i18n.locale")
  onLanguageChange() {
    if ((this.selectedControl as any).control) {
      this.onControlSelect((this.selectedControl as any).control);
    }
  }

  @Provide()
  getFormControls() {
    return this.controls;
  }
}
</script>

<style lang="less">
@import "./form-design.less";
</style>
<style lang="less" scoped>
.tips {
  width: 300px;
  position: fixed;
  right: 50%;
  margin-right: -150px;
  top: 68px;
  z-index: 800;
}
.publicTips{
  width:500px;
}
.design__preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: #f4f6fc;
}
</style>


