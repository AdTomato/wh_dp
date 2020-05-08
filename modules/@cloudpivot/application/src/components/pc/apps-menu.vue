<template>
  <div class="menu-content">
    <a-menu
      theme="dark"
      mode="inline"
      v-if="isLoaded"
      :defaultOpenKeys="defaultOpenKeys"
      v-model="selectKeys"
      @openChange="openChange"
      @click="setSelectedKeys"
    >
      <template v-for="(menu, index) in appTrees">
        <a-sub-menu :key="`${index}`" v-if="menu.type === 'Folder'">
          <span slot="title">
            <i class="icon aufontAll" :class="menu.icon ? menu.icon : 'h-icon-all-folder-open-o'"></i>
            <span :title="isChinese ? menu.name : menu.name_i18n[$i18n.locale]">{{ isChinese ? menu.name : menu.name_i18n[$i18n.locale] }}</span>
          </span>
          <a-menu-item
            v-for="(childMenu, childIndex) in menu.children"
            :key="`${index}-${childIndex}`"
            @click="switchRouter(childMenu)"
            :title="isChinese ? childMenu.name : childMenu.name_i18n[$i18n.locale]"
          >
            <router-link :to="''" v-if="childMenu.type === 'BizModel'">
              <i class="icon aufontAll" :class="childMenu.icon"></i>
              <span>{{ isChinese ? childMenu.name : childMenu.name_i18n[$i18n.locale] }}</span>
            </router-link>
            <a v-else>
              <i class="icon aufontAll" :class="childMenu.icon"></i>
              <span>{{ isChinese ? childMenu.name : childMenu.name_i18n[$i18n.locale] }}</span>
            </a>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item
          :key="`${index}`"
          v-else
          @click="switchRouter(menu)"
          :title="isChinese ? menu.name : menu.name_i18n[$i18n.locale]"
        >
          <router-link :to="''" v-if="menu.type === 'BizModel'">
            <i class="icon aufontAll" :class="menu.icon"></i>
            <span>{{ isChinese ? menu.name : menu.name_i18n[$i18n.locale] }}</span>
          </router-link>
          <a v-else>
            <i class="icon aufontAll" :class="menu.icon"></i>
            <span>{{ isChinese ? menu.name : menu.name_i18n[$i18n.locale] }}</span>
          </a>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Watch
} from 'vue-property-decorator';

import {
  Mutation, namespace
} from 'vuex-class';

import {
  Menu
} from 'h3-antd-vue';

import { listApi, listParams } from '@cloudpivot/api';

import common from '@cloudpivot/common';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: 'AppsMenu',
  components: {
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ASubMenu: Menu.SubMenu
  }
})

export default class AppsMenu extends Vue {
  @WorkflowCenterModule.Mutation('setApplicationPageTitle') setApplicationPageTitle:any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }
 
  // 应用目录
  appTrees:Array<listParams.tree> = [];

  selectKeys:any[] = [];

  defaultOpenKeys:any[] = ['0'];

  isLoaded:boolean = false;

  queryCode:any = '';

  mounted() {
    // this.getFolder();

    // this.$router.afterEach((to,form) => this.getFolder());
  }

  get inApp(){
    return this.$route.path.search('/application') > -1;
  }

  async loadFirstMenu(){

    const appCode = this.appCode;

    if(!appCode || !this.inApp){
      return;
    }

    this.isLoaded = false;

    const params = { appCode, isMobile: false };
    
    const res = await listApi.getFolder(params);
    let _url:string = '';

    if (res.errcode === 0) {
      if (res.data.length <= 0) return;
      // 初始化国际化，兼容老数据
      if (Array.isArray(res.data)) {
        res.data.forEach((data:any) => {
          common.utils.compatible(data, 'name');
          if (data.children && Array.isArray(res.data)) {
            data.children.forEach((childData:any) => {
              common.utils.compatible(childData, 'name');
            });
          }
        });
      }

      this.appTrees = res.data;

      await this.getFolder();
      
      this.isLoaded = true;
  }
  }

  // 根据appCode获取目录
  async getFolder() {

    if(!this.inApp){
      return;
    }
    
    // if (this.$route.query.queryCode) {
    //   this.queryCode = this.$route.query.queryCode;
    // }

    // const { appCode } = this.$route.params;
    // const params = { appCode, isMobile: false };
    // const res = await listApi.getFolder(params);
    // let _url:string = '';

    // if (res.errcode === 0) {
    //   if (res.data.length <= 0) return;
    //   // 初始化国际化，兼容老数据
    //   if (Array.isArray(res.data)) {
    //     res.data.forEach((data:any) => {
    //       common.utils.compatible(data, 'name');
    //       if (data.children && Array.isArray(res.data)) {
    //         data.children.forEach((childData:any) => {
    //           common.utils.compatible(childData, 'name');
    //         });
    //       }
    //     });
    //   }
    //   this.appTrees = res.data;

      // 刷新页面后定位对应列表：如果有参数parentId则默认选中之前打开的模型，否则默认打开第一个模型
      const { query: queryData } = { ...this.$route };
      if (queryData && queryData.parentId && queryData.code) {
        const codes = queryData.code;
        const parentIds = queryData.parentId;
        // 应用下的模型
        if (parentIds === this.appTrees[0].parentId) {
          const index = this.appTrees.findIndex((tree:any) => tree.code === codes);
          if (index !== -1) {
            this.selectKeys = [`${index}`];
            if (!queryData.openMode) {
              const params : any = {
                appCode: this.appTrees[index].appCode
              };

              const code = this.appTrees[index].code;
              if(this.$route.name === 'applicationReport'){
                params.reportCode = code;
              }else{
                params.schemaCode = code;
                if(!code){
                  return;
                }
              }

              this.$router.push({
                name: this.$route.name,
                params,
                query: queryData,
              });
            } else if (queryData.openMode === 'RECENT_PAGE_MODE' && queryData.pcUrl) {
              this.$router.push({
                name: 'applicationDefine',
                params: {
                  url: queryData.pcUrl as any
                },
                query: queryData
              });
            } else if (queryData.pcUrl) {
              this.$router.push({
                path: queryData.pcUrl as any,
                query: queryData
              });
            }
            const _title = this.getNameBySelectedKeys(this.selectKeys);
            this.setApplicationPageTitle(_title);
          }
          return;
        } else {
          // 目录下的模型
          const index = this.appTrees.findIndex((tree:any) => tree.id === parentIds);
          if(index > -1){
            this.openChange([`${index}`], codes, index + 1);
            return;
          }
        }
      } //else { // 第一次打开应用列表逻辑
        // 如果第一级是目录，则展开并选中目录下第一个模型，否则选中第一个
        if (this.appTrees[0].type === 'Folder') {
          this.selectKeys = ['0-0'];
          const _d = this.appTrees[0].children[0];
          this.switchRouter(_d);
          // _url = `/application/${_d.appCode}/application-list/${_d.code}`;
        } else if (this.appTrees[0].type === 'Page') { // 自定义页面
          this.selectKeys = ['0'];
          this.pageGo(this.appTrees[0]);
        } else {
          this.selectKeys = ['0'];
          this.switchRouter(this.appTrees[0]);
          // _url = `/application/${this.appTrees[0].appCode}/application-list/${this.appTrees[0].code}?queryCode=${this.queryCode}`;
          // this.$router.push(_url);
        }
        const _title = this.getNameBySelectedKeys(this.selectKeys);
        this.setApplicationPageTitle(_title);

        this.isLoaded = true;
      //}
  }

  /**
   *@desc 获取当前目录下的模型
   *@params openKeys 当前展开的key,key就是当前的数据的下标
  */
  async openChange(openKeys:string[], schemaCodes?:any, indexKey?:number) {
    
    const _k:number = 0;
    let index:number = -1;
    openKeys.forEach((key:string) => {
      const _idx = parseInt(key, 10);
      if (!this.appTrees[_idx].children || this.appTrees[_idx].children.length <= 0) {
        index = parseInt(key, 10);
      }
    });

    // 只有更新了index才会去加载最新的
    if (index !== -1) {
      const folderId = this.appTrees[index].id;
      const timestamp:number = Date.now();
      const res = await listApi.getModel({ id: folderId });
      if (res.errcode === 0) {
        const diff:number = Date.now() - timestamp;
        if (res.data && res.data.length > 0) {
          // 初始化国际化，兼容老数据
          if (Array.isArray(res.data)) {
            res.data.forEach((data:any) => {
              common.utils.compatible(data, 'name');
            });
          }
          const throttle:number = diff > 280 ? 0 : (280 - diff);

          setTimeout(() => {
            this.appTrees[index].children = res.data;
            this.setDefaultKeys(schemaCodes, indexKey);
          }, throttle);
        }
      }
    } else {
      this.setDefaultKeys(schemaCodes, indexKey);
    }
  }

  setDefaultKeys(schemaCodes:any, indexKey?:number) {
    if (schemaCodes && indexKey) {
      const key = this.appTrees[indexKey - 1].children.findIndex((tree:any) => tree.code === schemaCodes);

      this.defaultOpenKeys = [`${indexKey - 1}`];
      this.selectKeys = [`${indexKey - 1}-${key}`];
      this.isLoaded = true;
      const _d = this.appTrees[indexKey - 1].children[key];
      this.switchRouter(_d);
    }

    const _title = this.getNameBySelectedKeys(this.selectKeys);
    this.setApplicationPageTitle(_title);
  }

  setSelectedKeys(item:any, key:any, keyPath:any) {
    if (typeof item.key === 'number') {
      const k = item.key.toString();
      this.selectKeys = [k];
    } else {
      this.selectKeys = [item.key];
    }
    this.setApplicationPageTitle({});

    const _title = this.getNameBySelectedKeys(this.selectKeys);
    setTimeout(() => { this.setApplicationPageTitle(_title); }, 0);
    
  }

  // 根据key获取当前title
  getNameBySelectedKeys(keys:any) {
    if (!keys) return;
    const _keys = keys[0];
    let _t:any = '';
    if (_keys && _keys.includes('-')) { // 说明是目录下的模型
      const _m = parseInt(_keys.split('-')[0], 10);
      const _c = parseInt(_keys.split('-')[1], 10);

      _t = this.appTrees[_m].children[_c];
    } else { // 说明当前选中就是模型
      const _i = parseInt(_keys, 10);
      _t = this.appTrees[_i];
    }

    return _t;
  }


  /**
   * 目录切换
   */
  switchRouter(menu: any) {
    if (menu.type === 'BizModel') {
      this.bizModelGo(menu);
    } else if (menu.type === 'Report') {
      this.reportGo(menu);
    } else if (menu.pcUrl) {
      this.pageGo(menu);
    } else {
      this.$message.error('页面地址未设置，请联系管理员！');
    }
  }

  pageGo(menu: any) {
    if (menu.openMode === 'RECENT_PAGE_MODE') {
      this.$router.push({
        name: 'applicationDefine',
        params: {
          url: menu.pcUrl
        },
        query: {
          parentId: menu.parentId,
          code: menu.code,
          openMode: menu.openMode,
          pcUrl: menu.pcUrl,
          queryCode: this.queryCode
        },
      });
    } else if (menu.openMode === 'NEW_PAGE_MODE') {
      window.open(menu.pcUrl);
    } else {
      this.$router.push({
        path: menu.pcUrl,
        query: {
          parentId: menu.parentId,
          code: menu.code,
          openMode: menu.openMode,
          pcUrl: menu.pcUrl,
          queryCode: this.queryCode
        },
      });
    }
  }

  bizModelGo(menu: any) {
    this.$router.push({
      name: 'applicationList',
      params: {
        appCode: menu.appCode,
        schemaCode: menu.code
      },
      query: {
        parentId: menu.parentId,
        code: menu.code,
        openMode: menu.openMode,
        pcUrl: menu.pcUrl,
        queryCode: this.queryCode
      },
    });
  }


  reportGo(menu: any) {
    this.$router.push({
      name: 'applicationReport',
      params: {
        appCode: menu.appCode,
        reportCode: menu.code
      },
      query: {
        parentId: menu.parentId,
        code: menu.code,
        openMode: menu.openMode,
        pcUrl: menu.pcUrl,
        queryCode: this.queryCode
      },
    });
  }

  get appCode(){
    return this.$route.params.appCode;
  }

  get schemaCode(){
    return this.$route.params.reportCode || this.$route.params.schemaCode;
  }

  get routeName(){
    return this.$route.name;
  }

  @Watch('appCode',{
    immediate: true
  })
  onAppCodeChange(){
    this.loadFirstMenu();
  }

  @Watch('schemaCode',{
    immediate: true
  })
  onSchemaCodeChange(){
    if(this.isLoaded){
       this.getFolder();
    }
  }
  
  @Watch('routeName',{
    immediate: true
  })
  onRouteNameChange(){
    if(this.isLoaded){
       this.getFolder();
    }
  }

  // @Watch('$route',{
  //   immediate: true
  // })
  // onRouteChange() {
  //   // 路由切换加载对用的目录
  //   const { name } = this.$route;
  //   // if (name === 'application') {
  //     setTimeout(() => {
  //       // this.isLoaded = false;
  //     this.getFolder();
  //     }, 0);
  //   // }
  // }
}
</script>

<style lang="less" scoped>
  @import './style/aside.less';
</style>
