

import { Vue, Prop, Watch } from "vue-property-decorator";

import {
  StaffSelectorControl,
  UserStatus,
  DepartmentInfo,
  OrganizationType
} from "../../controls"

export abstract class StaffSelectorBase extends Vue {

  @Prop({
    default: () => { }
  })
  options!: any;

  //表单列表多选控件才具有精简功能
  @Prop({
    default: false
  })
  onlyForm!: boolean;

  @Prop({
    default: false
  })
  disabled !: boolean;

  org: any[] = [];

  searchList: any[] = []

  @Prop()
  value!: any[]
  @Prop({default: ''})
  placeholder!: string

  selected: any = []

  currentDept?: DepartmentInfo;

  @Prop({
    default: false
  })
  appManagerFilter?: boolean ;

  get locale() {
    return localStorage.getItem('locale') || 'zh';
  }

  @Watch("value", {
    immediate: true
  })

  setValue(vals: any[]) {

    if (!vals) {
      return;
    }

    this.selected = vals.map(this.convert);
  }

  @Watch('options', {
    immediate: true
  })
  handleFocus(opts: any) {
    if (!opts.showSelect && opts.showModel) {
      this.treeFocus();
    }
  }

  convert(x: any) {
    return ({
      id: x.id || x.key,
      key: x.id || x.key,
      name: x.name,
      type: x.type === 3 ? "user" : "org",
      source: x,
      avatar: x.imgUrl,
    });
  }

  get rootId() {
    let id = '';
    if (
      this.options &&
      this.options.rootNode &&
      this.options.rootNode.length > 0
    ) {
      id = this.options.rootNode[0].id || '';
    }
    return id;
  }

  get rootIds() {
    let resId = '';
    if (
      this.options &&
      this.options.rootNode &&
      this.options.rootNode.length > 0
    ) {
      // resId = this.options.rootNode[0].id || '';
      resId = this.options.rootNode.map((node: any) => node.id as string)
        .filter((id: string) => !!id)
        .join(',');
    }
    return resId;
  }

  get roleId() {
    if (this.options && this.options.role) {
      return this.options.role.value || '';
    }
    return '';
  }
 
  get filterType() {
    if ( this.options.appManagerFilter || this.appManagerFilter) {
      return "admin"
    }else{
      return '';
    }
  }

  treeFocus() {
    this.onClickTrunBack();
  }

  // 树-返回
  onClickTrunBack() {
    this.currentDept = undefined;
    this.getOrgsAndUsers();
  }

  // 树-下一级
  onClickNextHierarchy(val: any) {
    if (val && val.id) {
      this.currentDept = val.source;
      this.getOrgsAndUsers();
    }
  }

  onClickBreadcrumb(val: any) {
    if (val && val.id) {
      this.currentDept = val.source;
      this.getOrgsAndUsers();
    }
  }

  onChange(items?: any[]) {

    let selecteds: any[] = [];
    if (items && items.length > 0) {
      const ids: string[] = items.map(x => x.key);
      selecteds = this.selected.filter((item: any) => ids.indexOf(item.id) > -1);
    }
    let list: any[] = [];
    if (selecteds.length > 0) {
      list = selecteds.map(x => x.source);
    }

    this.$emit("change", list);
  }

  onOk(items: any[]) {

    const list = items.map(x => x.source);
    this.$emit("ok", list);
    this.$emit("change", list);
  }

  onCancle() {
    this.$emit("cancel");
  }

  // 获取该级的树和用户
  getOrgsAndUsers() {
    let promises : any[] = []
    if (this.currentDept) {
      const dept = this.currentDept;
      // if (dept.leaf && dept.employees === 0) {
      //   this.org = [];
      // } else {
      //   if (dept.leaf === false) {
        if(this.options.appManagerFilter || this.appManagerFilter ){
          promises.push(this.getDepts(dept.id,'admin'));
          promises.push(this.getUsers(dept.id,'admin'));
        }else{
          promises.push(this.getDepts(dept.id));
          promises.push(this.getUsers(dept.id));
        }
      
      // }
      // if (dept.employees > 0) {
     
      // }
      // }

    } else {
      const roots = this.options.rootNode;
      if (!roots || roots.length < 2) {
        const rootId = this.rootId;
        if(this.options.appManagerFilter || this.appManagerFilter ){
          promises.push(this.getDepts(rootId,"admin"));
        }else{
          promises.push(this.getDepts(rootId));
        }
        if (rootId) {
          promises.push(this.getUsers(rootId));
        }
      } else if (roots && roots.length > 1) {
        promises.push(this.getDepts(this.rootIds));
      }
    }

    Promise.all(promises).then(res => {
      let orgs: any[] = [];
      res.forEach(x => orgs = orgs.concat(x))
      this.org = orgs;
    });
  }

  async getDepts(deptId?: string,filterType?:string) {
   
    const res = await StaffSelectorControl.service
      .getDepartmentsBy(deptId,filterType);

    const nodes = res.departments;
    const orgTree = this.resetTree(nodes, []);

    let myDepartentTree : any[] = [];
    let exitSameDepartent = true;

    if (res.myDepartment) {
      const myDepartent:any = res.myDepartment;
      // myDepartent. = '';
      myDepartentTree = this.resetTree(myDepartent, []);
      // 增加我的部门显示
      myDepartentTree.forEach(res2 => {
        res2.copyName = '我的部门';
      });

      // 判断我的部门是不是和当前部门一致 一致的话就不现实
      const myDepartentID = myDepartentTree[0].id;
      exitSameDepartent = orgTree.some(i => i.id === myDepartentID);
    }

    return exitSameDepartent ? orgTree : [...orgTree, ...myDepartentTree];
  }

  async getUsers(deptId: string,filterType?:string) {
    const users = await StaffSelectorControl.service.getUsersBy(deptId, this.roleId, filterType);

    // 过滤没激活状态的用户
    const enableUsers = users.filter(u => u.status === UserStatus.Enable);
    const userTree = this.resetTree(enableUsers, []);
    return userTree;
  }

  // 组装接口异步数据
  resetTree(nodes: any, orgTree: Array<any>) {

    nodes.forEach((node: any) => {

      // 是否递归为false，不让进入下级部门
      let hasChild = false;
      if (this.options.recursive === false) {
        hasChild = false;
      }else{
        hasChild = !node.leaf || (node.employees && node.employees > 0);
      }

      orgTree.push({
        id: node.id,
        name: node.name,
        avatar: node.imgUrl,
        type: node.type === OrganizationType.User ? "user" : "org",
        hasChild ,
        orglist: node.parentDepartmentName || '',
        title: `${node.name} (${node.employees || 0})`,
        isLeaf: node.leaf,
        key: node.id,
        sortKey: "0", // ERROR
        parentId: node.parentId,
        children: [],
        source: node
      });
    });
    return orgTree;
  }

  onSearch(name: string) {
    if (!name) {
      return;
    }
 
    StaffSelectorControl.service.search(name, this.rootIds, this.roleId, this.filterType).then(data => {
      const list: any[] = [];
      if (data.departments && this.options.selectOrg) {
        this.resetTree(data.departments, list);
      }
      if (data.users && this.options.selectUser) {
        this.resetTree(data.users, list);
      }
      this.searchList = list;
    });
  }
}