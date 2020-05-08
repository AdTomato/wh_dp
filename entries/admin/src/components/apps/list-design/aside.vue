<template>
  <aside class="aside designer-aside-wrap" v-if="isShow">
    <a-tabs defaultActiveKey="1" size="small">
      <a-tab-pane :tab="$t('languages.Apps.ListConfiguration')" key="1">
        <div class="aside-box-wrap">
          <SideBox
            :title="$t('languages.Apps.QueryCriteria')"
            :fieldBlock="0"
            :propDataList="queryList"
          ></SideBox>
          <!-- 展示字段 -->
          <SideBox
            :title="$t('languages.Apps.DisplayFields')"
            :fieldBlock="1"
            :propDataList="showfieldList"
          ></SideBox>
          <!-- 排序 -->
          <SideBox
            :title="$t('languages.Apps.SortField')"
            :fieldBlock="2"
            :propDataList="sortsList"
            @setTargetSortList="setTargetSortList"
          ></SideBox>
          <!-- 列表操作 -->
          <SideBox
            v-show="clientType==='PC'"
            :title="$t('languages.Apps.ListOperation')"
            :fieldBlock="3"
            :propDataList="operationList"
            @setTargetSortList="setOperationList"
          ></SideBox>
        </div>
      </a-tab-pane>
      <a-tab-pane :tab="$t('languages.Apps.ListAttributes')" key="2">
        <list-design />
      </a-tab-pane>
    </a-tabs>
  </aside>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import { getDataItems, updateListData } from '@/apis/list';

import SideBox from './aside-box.vue';

import ListDesign from './list-attribute.vue';

import { oprationCheckedMap, listDesignCommonData, btnPropertyName, queryPresentationPlaceholder } from './typings';

import * as listApi from '@/apis/list/list.api';

import Bus from '@/utils/bus';

const ListdesignModule = namespace('Apps/Listdesign');


@Component({
  name: 'Aside',
  components: {
    SideBox,
    ListDesign
  }
})
export default class Aside extends Vue {
  // --store
  @ListdesignModule.State('saveFlag') saveFlag: any;
  @ListdesignModule.State('name') name: any;
  @ListdesignModule.State('name_i18n') name_i18n: any;
  @ListdesignModule.State('showFieldArray') storeShowFieldArray: any;
  @ListdesignModule.State('sortArray') storeShowSortArray: any;
  @ListdesignModule.State('edit') edit: any;
  @ListdesignModule.State('payloadOptions') payloadOptions: any;
  @ListdesignModule.State('clientType') clientType: any;
  @ListdesignModule.State('presentationType') presentationType: any;
  @ListdesignModule.Mutation('setSaveFlage') mutationSaveFlage: any;
  @ListdesignModule.Mutation('setQueryAction') setQueryAction: any;
  @ListdesignModule.Mutation('setSortArray') setSortArray: any;
  @ListdesignModule.Mutation('onEdit') onEdit: any;
  @ListdesignModule.Mutation('nameChange') nameChange: any;
  @ListdesignModule.Mutation('setFilterTipsFlag') setFilterTipsFlag: any;
  @ListdesignModule.Mutation('setPresentationType') setPresentationType: any;
  @ListdesignModule.Mutation('setClientType') setClientType: any;
  @ListdesignModule.Mutation('setSaveCompleted') setSaveCompleted: any;
  @ListdesignModule.Action('getWorkflowList') getWorkflowList: any;
  @ListdesignModule.Action('gerFormList') gerFormList: any;
  @ListdesignModule.Action('getListTitle') getListTitle: any;

  // --props
  @Prop() designType!: any;

  // --variables
  hasEdited: boolean = false;           // 是否已编辑, 已编辑会在关闭时弹出保存信息; 未编辑直接关闭
  isShow: boolean = true;               // 侧栏是否显示
  originalFieldsData:any[] = [];        // 真-原始数据
  formatedFieldsData:any[] = [];              // 服务器获取的原始数据(经过格式化的原始数据)
  // resoprationCheckedList: any[] = [];
  data: any[] = [];                     // ?
  showfieldList: any[] = [];            // 列表头 thead
  queryList: any[] = [];                // 查询条件
  sortsList: any[] = [];                // 排序条件
  operationList: any[] = [];            // 操作列表
  queryPresentation: object = queryPresentationPlaceholder        // 占位符

  isShowOnPc:boolean = false;
  isShowOnMobile:boolean = false;

  // --methods
  /**
   * 加载已发布的数据项列表
   */
  getAsycDataItems() {
    // TODO: 这个接口似乎有请求两次的情况, 待优化
    return getDataItems(this.schemaCode, true)
    .then(resp=>{
      return resp;
    });
  }
  /* 设置查询字段 */
  setQueryList(val: any) {
    this.queryList = val.map((x: any, i: any) => x).filter((x: any, i: any) => {
      const ignoreType = [1, 6, 7, 8]; // type代表控件类型: 屏蔽长文本、附件、审批意见、子表？
      return !ignoreType.includes(x.type);
    });
  }

  /* 设置展示字段 */
  setShowfieldList(val: any) {
    this.showfieldList = val.map((x: any, i: any) => x).filter((x: any, i: any) => {
      const ignoreType = [7, 8]; // type代表控件类型(暂时放开附件-- 6)
      return !ignoreType.includes(x.type);
    });
    // .filter((x:any, i:any) => {
    //   const ignoreCode = ['name']; // 过滤掉摘要
    //   return !ignoreCode.includes(x.code);
    // });
  }

  /* 设置操作列表 */
  setOperationList(val: any) {
    val.forEach((a:any,i)=>a.sortKey=(i+1));
    this.operationList = val;
  }

  setTargetSortList(data: any) {
    if (data) {
      this.targetSortList = data;
      this.sortListChange(this.storeShowFieldArray);
    }
  }



  targetSortList: Array<any> = [];

  // 后台存储 排序字段信息
  /**
   * 根据展示字段设置可选的排序字段 并处理选择状态
   */
  @Watch('storeShowFieldArray', { deep: true })
  linsenShowfieldList(v: any) {
    this.sortListChange(v);
  }

  /*
  * 更改排序字段的数组
  */
  sortListChange(v: any) {
    if (v.length === 0) return;

    // 过滤出显示字中被选中的
    const data = JSON.parse(JSON.stringify(v)).filter((x: any, i: any) => x.checked);
    for (let i = this.targetSortList.length - 1; i >= 0; i--) {
      const index = data.findIndex((d: any) => d.propertyCode === this.targetSortList[i].propertyCode);
      if (index !== -1) {
        const item = data[index];
        data.splice(index, 1);
        data.unshift(item);
      }
    }
    data.forEach((res: any) => {
      res.checked = false;
      res.id = '';
      this.targetSortList.forEach((r: any) => {
        if (r.propertyCode === res.propertyCode) {
          res.direction = r.direction;
          res.checked = true;
          res.id = r.id ? r.id : '';
        }
      });
    });
    this.sortsList = data.filter((item: any) => item.propertyType !== 1);
    // console.log('展示字段数组：', data);
  }

  SortList: Array<any> = [];

  @Watch('storeShowSortArray', { deep: true })
  linsenSortList(v: any) {
    for (let i = 0; i < v.length; i++) {
      const isExist = this.targetSortList.find((t: any) => t.propertyCode === v[i].propertyCode);
      if (v[i].checked && !isExist) {
        this.targetSortList.push(v[i]);
      } else if (!v[i].checked) {
        const index = JSON.parse(JSON.stringify(this.targetSortList)).findIndex((res: any) => res.propertyCode === v[i].propertyCode);
        this.targetSortList.splice(index, 1);
      }
    }
    // console.log('store--sort:', this.targetSortList);
  }

  generateDesignData() {
    return new Promise((resolve, reject) => {
      // 查询条件
      const queryList: any = this.payloadOptions.filter((el: any) => el.checked === true);

      // 显示字段
      const showfieldList: any = this.storeShowFieldArray.filter((el: any) => el.checked === true);

      // 排序字段
      const sortsList: any = this.storeShowSortArray.filter((el: any) => el.checked === true);

      // 操作按钮
      const operationList: any = JSON.parse(JSON.stringify(this.operationList));
      operationList.forEach((res: any) => {
        // 去掉格式化时注入的 data 字段
        res.data = undefined;
        // 如果name字段为空，取当前语言版本多语言
        if (!res.name) {
          res.name = res.name_i18n ? res.name_i18n[this.$i18n.locale] : '';
        }
        if (res.name_i18n && typeof res.name_i18n === 'object') {
          res.name_i18n = JSON.stringify(res.name_i18n);
        }
      });

      /*  查询条件 */
      queryList.forEach((res: any) => {
        // 去掉格式化时注入的 data 字段
        res.data = undefined;

        res.scopedSlots = typeof res.scopedSlots==='object'? JSON.stringify(res.scopedSlots): res.scopedSlots;
        if (!res.name) {
          res.name = res.name_i18n ? res.name_i18n[this.$i18n.locale] : '';
        }
        if (res.name_i18n && typeof res.name_i18n === 'object') {
          res.name_i18n = JSON.stringify(res.name_i18n);
        }

        // 单据状态的默认值，中文转英文 20190722 by John
        if (res.code === 'sequenceStatus') {
          if (!res.defaultValue) return;
          const vals_zh: Array<string> = res.defaultValue.split(';')
          const vals_en: Array<string> = [];
          vals_zh.forEach((val: string) => {
            switch (val) {
              case '草稿':
                vals_en.push('DRAFT');
                break;
              case '进行中':
                vals_en.push('PROCESSING');
                break
              case '已完成':
                vals_en.push('COMPLETED');
                break
              case '已作废':
                vals_en.push('CANCELED');
                break
              default:
                break;
            }
          });
          res.defaultValue = vals_en.join(';');
        }
      });

      // 显示字段
      showfieldList.forEach((res: any) => {
        // 去掉格式化时注入的 data 字段
        res.data = undefined;
        // FIXME: 多次来回切换html/设计模式后, scopedSlots会膨胀成好几M大小的字符串
        // res.scopedSlots = JSON.stringify(res.scopedSlots);
        res.scopedSlots = typeof res.scopedSlots==='object'? JSON.stringify(res.scopedSlots): res.scopedSlots;
        if (!res.name) {
          res.name = res.name_i18n ? res.name_i18n[this.$i18n.locale] : '';
        }
        if (res.name_i18n && typeof res.name_i18n === 'object') {
          res.name_i18n = JSON.stringify(res.name_i18n);
        }
      });

      // 排序字段
      sortsList.forEach((res: any) => {
        // 去掉格式化时注入的 data 字段
        res.data = undefined;
        res.scopedSlots = typeof res.scopedSlots==='object'? JSON.stringify(res.scopedSlots): res.scopedSlots;
        if (!res.name) {
          res.name = res.name_i18n ? res.name_i18n[this.$i18n.locale] : '';
        }
        if (res.name_i18n && typeof res.name_i18n === 'object') {
          res.name_i18n = JSON.stringify(res.name_i18n);
        }
      });

      if (this.name && this.name.length > 50) {
        this.$message.error(this.$t('languages.Apps.NameRule'));
        this.mutationSaveFlage(false);
        reject();
      }

      let names: any = this.name;
      if (!this.name) {
        names = this.name_i18n ? this.name_i18n[this.$i18n.locale] : '';
      }

      if (!names) {
        this.$message.error('视图名称不能为空！');
        reject();
      }

      const name_i18n = this.name_i18n && typeof this.name_i18n === 'object' ? JSON.stringify(this.name_i18n) : '';


      // WARN: 因为存的是JSON, 数据中包含大量的\n\t, 要小心转换过程中可能存在的坑



      const postData = {
        name: names,
        name_i18n,
        code: this.listCode,
        schemaCode: this.schemaCode,
        queryConditions: queryList,
        queryColumns: showfieldList,
        querySorts: sortsList,
        queryActions: operationList,
        clientType: this.clientType,
        queryPresentationType: this.presentationType,
        queryPresentation:this.queryPresentation
      };
      resolve(postData);
    });
  }

  // 这里有两个地方调用, 一个是当前组件, 一个是listDesign-index.vue通过aside的ref, 具体逻辑看 onSaveFlagChange 方式的注释
  toSaveListDesign() {
    return new Promise(async (resolve, reject) => {
      if (this.clientType === 'PC' && this.isShowOnPc && !this.storeShowFieldArray.filter((el: any) => el.checked === true).length) {
        this.$message.error('当前视图展示字段不能为空');
        this.mutationSaveFlage(false);
        return;
      }

      if (this.clientType === 'APP' && this.isShowOnMobile && !this.storeShowFieldArray.filter((el: any) => el.checked === true).length) {
        this.$message.error('当前视图展示字段不能为空');
        this.mutationSaveFlage(false);
        return;
      }

      this.setSaveCompleted(false);
      const postData = await this.generateDesignData();
      const vm: any = this;
      updateListData(postData).then((res: any) => {
        if (res.errcode === 0) {
          vm.$message.success(this.$t('languages.PublishSuccess'));
          vm.getListInfo(vm.formatedFieldsData);
          vm.getListTitle({schemaCode: this.schemaCode, listCode: this.listCode});
          vm.setSaveCompleted(true);
          vm.onEdit(false);
          resolve();
        } else {
          vm.$message.error(res.errmsg);
          reject();
        }
        this.mutationSaveFlage(false);
      });
    });
  }

  // 保存到服务器: 分两种情况, designType === 'page'|'html'
  // 前者可以直接使用 listInfo 去生成接口可用的参数, 然后上传
  // 后者需要用先经过 listDesign-index 页面的 parseToOptions 方法进行解析, 才能获取最新的 listInfo; 所以 designType==='html'时, 这里不直接调用 toSaveListDesign(), 而是 $emit 到上层 listDesign-index, 等 index 页面解析完毕再通过 ref.aside 来调用这里的 toSaveListDesign
  // TODO: 需要设一个变量 hasEdited, 记录是否已做出更改. 如果未更改, 仍走直接方式; 已更改才走先解析后保存的方式
  // TODO: 在切换到表单设计或者其他地方的时候, 会有提示"是否保存"的弹窗, 这种情况也需要考虑 designType==='html' 的情况
  @Watch('saveFlag')
  onSaveFlagChange(flage:any) {
    if ( !flage ) return;
    if ( this.designType==='html' ) this.$emit('saveFlagInHtmlDesignType', {shouldSaveData: true});
    else this.toSaveListDesign();
  }

  // PC端、移动端切换
  @Watch('clientType')
  onViewTypeChange(v: any) {
    this.reload();
    this.queryPresentation = queryPresentationPlaceholder;
  }

  created() {
    this.init(false);
  }

  mounted() {
    // 注册全局事件
    Bus.$on('saveListDesign', (callback: Function) => {
      if ( this.designType==='html' ) {
        this.$emit('saveFlagInHtmlDesignType', { shouldSaveData: true, callback });
      } else {
        this.toSaveListDesign()
        .then(() => {
          callback(true);
        });
      }
    });
  }

  destroyed() {
    Bus.$off('saveListDesign');
  }

  /*
  * 列表老版本兼容多语言版本
  * 老版本只有英文?
  */
  compatibleOldData(data: any) {
    const localeList: Array<string> = ['en']; // 语言列表
    localeList.forEach((local: string) => {
      if (!data.name_i18n) {
        data.name_i18n = {};
        data.name_i18n[local] = data.name || '';
      } else if (data.name_i18n[local] === '') {
        data.name_i18n[local] = data.name || '';
      }
    });
    return data;
  }

  // 格式化字段基本属性和设置
  setDefaultValue(dataItems: any) {
    if ( dataItems.length < 1 ) return [];
    const sysUserArr = ['creater', 'owner', 'modifier'];
    const sysDeptArr = ['createdDeptId', 'ownerDeptId'];

    const targetDataItems = dataItems.map((res:any, index: number) => {
      // if (res.code === 'owner') {
      //   res.name = '拥有者';
      // } else if (res.code === 'ownerDeptId') {
      //   res.name = '拥有者部门';
      // }
      this.compatibleOldData(res);    // 对老版本做兼容处理

      // 字段基本属性
      let obj: any = {
        // id:res.id,
        name: res.name, // 显示名称
        name_i18n: res.name_i18n, // 国际化名称
        propertyCode: res.code, // 数据项编码
        code: res.code,
        propertyType: res.propertyType, // 数据项类型
        propertyName: res.name, // 数据项名称
        dataIndex: res.code, // 表格 标识编码
        isSystem: res.defaultProperty, // 是否是系统字段
        type: res.propertyType, // 数据项类型
        scopedSlots: { customRender: res.code }, // 显示字段设计需要
        relativeSchemaCode: res.relativeCode,
        data: {}
      };
      // 合并字段基本属性和列表基本数据
      obj = { ...obj, ...listDesignCommonData };
      // 再根据字段类型做区别配置
      switch (res.propertyType) {
        case 0: // 短文本
        case 4: // 逻辑
        case 5: // 选人控件
          obj.width = 162;
          if (obj.propertyCode === 'name') { // 摘要 宽度特殊处理
            obj.width = 296;
          }
          break;
        case 1: // 长文本
        case 9: // 关联表单
          obj.width = 296;
          break;
        case 2: // 数值
          obj.width = 162;
          obj.displayType = 4; // 范围
          break;
        case 3: // 日期
          obj.width = 162;
          obj.displayType = 4; // 范围
          obj.displayFormat = 2; // 日期默认展示时分秒
          break;
        default:
          break;
      }

      // 状态
      if (res.code === 'sequenceStatus') {
        obj.displayType = 3;  // 下拉
        obj.options = '草稿;进行中;已完成;已作废';
        obj.defaultValue = '';
      }

      // 系统选人控件字段固定可选类型
      if (sysUserArr.includes(res.code)) {
        obj.userOptionType = 1;   // 选人控件类型:人员
      } else if (sysDeptArr.includes(res.code)) {
        obj.userOptionType = 2;   // 部门
      }

      // 在data里做备份
      obj.data = { ...obj, data:undefined };

      return obj;
    });

    return targetDataItems;
  }

  init(callByReload?:any) {
    const vm = this;
    // 隐藏过滤条件更改提醒
    vm.setFilterTipsFlag(false);
    // 获取字段数据 fields
    this.getAsycDataItems().then((res) => {
      let resData = res.data;
      if (res.errcode) return this.$message.error(res.errmsg);   // 报错

      // 需要过滤掉的字段
      const filtersCode = ['workflowInstanceId', 'runnigInstanceId', 'ID', 'ownerDeptQueryCode'];
      // 需要过滤掉的数据项类型: 附件(暂时放开-- 6)、审批意见、子表
      const filterPropertyType = [7, 8];
      // 去掉包含上面两个属性的字段
      resData = resData.filter((item: any)=>(
        !filtersCode.includes(item.code) &&
        !filterPropertyType.includes(item.propertyType)
      ));

      // 记录原始数据
      vm.originalFieldsData = [...resData];
      // 初始化字段基本(默认)数据和设置, 初建的表是空白的, 这部分由前端填充?
      vm.formatedFieldsData = [...this.setDefaultValue(resData)];

      return vm.formatedFieldsData;
    })
    .then((formatedFieldsData: any) => {
      // 格式化数据视图信息
      vm.getListInfo(formatedFieldsData);
      // 获取关联表单列表
      vm.gerFormList(this.schemaCode),
      // 获取关联流程列表
      vm.getWorkflowList(this.schemaCode)
    })
  }

  /**
   * 获取列表字段信息
   * 格式化视图信息, 国际化:查询/按钮/排序/显示字段; 注入额外配置:按钮/显示字段;
   */
  async getListInfo(formatedFieldsData: any, editorData?: any) {
    const fromEditor:boolean = !!editorData;

    const vm = this;
    // 查询字段拷贝
    let queryCopy     = formatedFieldsData? JSON.parse(JSON.stringify(formatedFieldsData)): [];
    // 显示字段拷贝
    let showFieldCopy = formatedFieldsData? JSON.parse(JSON.stringify(formatedFieldsData)): [];
    // 按钮(无须拷贝)
    let operationsData = oprationCheckedMap;

    // 处理字段信息, 如果没有从编辑器返回来的数据, 则取接口数据
    let resData:any = editorData;
    // 数据来源, 是否从 api 过来; 如果是, 在 combine 的时候以 api 数据为准, 否则, 以编辑器数据为准
    let dataComesFromApi = !editorData;

    // TODO:是否已经过编辑, 避免无意义的提示
    // 已修改的情况下不重复检测
    if ( !this.hasEdited && !!editorData ) {
      this.hasEdited = Object.entries(this.queryPresentation).some(([k,v]) => {
        return editorData.queryPresentation[k]!==v;
      });
    }



    // 如果没有编辑器数据, 则读取接口, 获取列表配置;
    // ! 如果读取接口出错, 则抛出提示;
    if (!resData) {
      const res = await listApi.getListInfo(this.schemaCode, this.listCode, this.clientType);
      if ( res.errcode!==0 ) {
        this.$emit('onConfigDataReady', res.errmsg);
        return this.$message.error(res.errmsg);
      }
      // console.log( '_______ listInfo' );
      // console.log( res.data );
      // 针对老数据做提示
      else if ( !res.data ) {
        this.$emit('onConfigDataReady', res.errmsg);
        return this.$message.error('无展示字段');
      }
      this.isShowOnPc = res.data.showOnPc;
      this.isShowOnMobile = res.data.showOnMobile;
      resData = res.data;
    }

    // 在 listDesigner-index.vue 中也需要针对列表配置做些判断, 这里用 emit 打通数据
    this.$emit('onListConfigDataChange', resData);


    // 国际化:查询/按钮/排序/显示字段; 注入额外配置:按钮/显示字段;
    if (resData.name_i18n) {
      // 接口返回的是json字符串, 直接从editor转过来是json字符串, 但从经过发布的editor转过来(会调用这里的getListInfo)时成了对象; 所以需要进行判断
      resData.name_i18n = typeof(resData.name_i18n)==='string'? JSON.parse(resData.name_i18n): resData.name_i18n;
    }

    // 将列表名字国际化(显示和当前语言选择相匹配的列表名字)
    vm.nameChange({ name: resData.name, isupdate: true, name_i18n: resData.name_i18n });

    /* 查询条件: (单据状态名)国际化 */
    if (resData.queryConditions) {
      if (Array.isArray(resData.queryConditions)) {
        resData.queryConditions.forEach((d: any) => {
          // 单据状态的默认值，转回来 20190729 by John
          // WONDER: 单据状态的默认值只有英文(老版本), 所以要转成中文?
          if (d.propertyCode==='sequenceStatus' && d.defaultValue) {
            const vals_zh: Array<string> = d.defaultValue.split(';')
            const vals_en: Array<string> = [];
            vals_zh.forEach((val: string) => {
              switch (val) {
                case 'DRAFT':
                  vals_en.push('草稿');
                  break;
                case 'PROCESSING':
                  vals_en.push('进行中');
                  break
                case 'COMPLETED':
                  vals_en.push('已完成');
                  break
                case 'CANCELED':
                  vals_en.push('已作废');
                  break
                default:
                  break;
              }
            });
            d.defaultValue = vals_en.join(';');
          }

          if (!d.name_i18n) {
            d = vm.compatibleOldData(d);
          } else {
            d.name_i18n = typeof(d.name_i18n)==='string'?JSON.parse(d.name_i18n):d.name_i18n;
          }
        });
      }
      const queryArray = resData.queryConditions;
      // queryCopy = dataComesFromApi?
      //   vm.initData(queryCopy, queryArray):
      //   vm.initData(queryArray, queryCopy);

      queryCopy = vm.initData(queryArray, queryCopy);
    }

    /* 操作按钮: 国际化 & 注入基本/默认配置 */
    if (resData.queryActions) {
      if (Array.isArray(resData.queryActions)) {
        resData.queryActions.forEach((d: any) => {
          // FIXME: 目前老列表会出现 name_i18n: ""\"{\\\"en\\\":\\\"新增\\\"}\""" 的情况, 隐患应该在上传时的转换上
          if (!d.name_i18n) {
            d = vm.compatibleOldData(d);
          } else {
            d.name_i18n = typeof(d.name_i18n)==='string'?JSON.parse(d.name_i18n):d.name_i18n;
          }
        });
      }
      const queryBtn = resData.queryActions;
      operationsData = vm.setQueryActions(queryBtn) || [];
    }
    /* 排序字段: 国际化 */
    if (resData.querySorts) {
      if (Array.isArray(resData.querySorts)) {
        resData.querySorts.forEach((d: any) => {
          if (!d.name_i18n) {
            d = vm.compatibleOldData(d);
          } else {
            d.name_i18n = typeof(d.name_i18n)==='string'?JSON.parse(d.name_i18n):d.name_i18n;
          }
        });
      }
      this.targetSortList = resData.querySorts;
    }

    /* 显示字段: 国际化 & 注入基本/默认配置 */
    if (resData.queryColumns) {
      if (Array.isArray(resData.queryColumns)) {
        resData.queryColumns.forEach((d: any) => {
          if (!d.name_i18n) {
            d = vm.compatibleOldData(d);
          } else {
            d.name_i18n = typeof(d.name_i18n)==='string'?JSON.parse(d.name_i18n):d.name_i18n;
          }
        });
      }
      const { queryColumns } = resData;
      // showFieldCopy = dataComesFromApi?
      //   vm.initData( showFieldCopy, queryColumns ):
      //   vm.initData( queryColumns, showFieldCopy );

      showFieldCopy = vm.initData( queryColumns, showFieldCopy );
    }

    // 设置视图信息
    this.setPresentation(resData.queryPresentation);

    // 记录视图类型
    if (resData.queryPresentationType) {
      this.setPresentationType(resData.queryPresentationType);
    }

    // 屏蔽某些查询列表,
    this.setQueryList(queryCopy);
    // 操作列表直接赋值
    this.setOperationList(operationsData);
    // 屏蔽某些展示字段
    this.setShowfieldList(showFieldCopy);

    // 最终必然是可以编辑的, 放在 if 里会阻断html编辑功能
    this.$emit('onConfigDataReady', true);
  }

  /**
   * 设置按钮参数
   */
  setQueryActions(btnArray: Array<any>) {
    btnArray.forEach((res: any) => {
      res.data = {...res, data:undefined};
      res.type = res.propertyType;
      res.code = res.propertyCode;
      res.popover = false;
      res.hoverClass = true;
      res.checked = true;
      const CopyBtnPropertyName = btnPropertyName as any;
      res.propertyName = CopyBtnPropertyName[res.actionCode];
    });
    return btnArray;
  }

  setPresentation(data:object) {
    if ( !data ) return;
    // 做个合并, 编辑器只返回 htmlJson 等3个字段, 接口还包含 id 等字段, 第二次更新时需要id
    this.queryPresentation = { ...this.queryPresentation, ...data };
  }

  /**
   * 初始化后台存储数据
   */
  initData(backData: Array<any>, targetData: Array<any>) {
    const sortBefore: Array<any> = [];
    let sortAfter: Array<any> = [];
    let errorMsg:string[] = [];

    // console.log( backData );
    // console.log( targetData );


    // 合并以 backData 为主
    backData.forEach((res: any) => {

      let target: any = targetData.find((r: any) => res.propertyCode === r.propertyCode);
      if ( !target ) return;
      if ( target.propertyType!==res.propertyType )  errorMsg.push( `${target.name}` );

      // target = Object.assign(target, res);
      // target.data = Object.assign(target.data, res);
      // 上面的写法会引起res.data的不断嵌套复制
      res.data = undefined;
      target = {...target, ...res, data:{...target.data, ...res} };
      target.checked = true;
      sortBefore.push(target);
    });

    if ( errorMsg.length ) {
      this.$emit('onErrorMsgChange', `展示字段与数据项类型不一致: [ ${errorMsg.join(', ')} ]`);
    }

    // 连接以 targetData 为主
    sortAfter = targetData.filter((res: any) => !backData.some(item => item.propertyCode === res.propertyCode));
    return sortBefore.concat(sortAfter);
  }

  /**
   * 业务模型编码
   */
  get schemaCode() {
    return this.$route.params.bizSchemaCode;
  }

  /**
   * 列表编码
   */
  get listCode() {
    return this.$route.params.code;
  }

  /*
  * aside侧边栏重载
  */
  reload() {
    this.isShow = false;
    this.queryPresentation = queryPresentationPlaceholder;
    setTimeout(() => {
      this.isShow = true;
    }, 10)
    this.init(true);
  }

  /**
   * 路由切换 重新请求数据
   */
  @Watch('$route')
  onRouteChange() {
    this.reload();
  }
}

</script>

<style lang="less">
@bar-height: 48px;
.designer-aside-wrap {
  .ant-tabs-bar {
    margin-bottom: 0px;
    background: #fff;
    border-radius: 4px;
    text-align: center;
  }
  .ant-tabs-nav .ant-tabs-tab {
    padding-top: 10px;
    padding-bottom: 9px;
    font-size: 12px;
    font-weight: bold;
  }
}
// .padding-left-right {
//   padding-left: 24px;
//   padding-right: 24px;
// }
.design-wrapper {
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .aside {
    height: 100%;
    &>.ant-tabs{
      height: 100%;
    }
    .ant-tabs-content{
      height: calc(100% - 56px);
      margin-top: 8px;
      .aside-box-wrap{
        overflow: auto;
        height: 100%;
      }
    }
  }
  .aside-box {
    &:first-child {
      margin-top: 0;
    }
    border: 1px solid #fff;
    margin-top: 8px;
    background: #fff;
    border-radius: 4px;
    &-title {
      height: 14px;
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
  .list-box {
    text-align: left;
    li {
      padding: 0 4px;
      padding-right: 0;
      height: 30px;
      line-height: 30px;
      cursor: default;
      .list-icon {
        visibility: hidden;
        .icons {
          margin-left: 9px;
        }
      }
      &.hoverClass {
        background: #e8fcf4;
        .list-icon {
          visibility: visible;
        }
      }
      &:hover {
        background: #e8fcf4;
        .list-icon {
          visibility: visible;
        }
      }
    }
  }
}
</style>
