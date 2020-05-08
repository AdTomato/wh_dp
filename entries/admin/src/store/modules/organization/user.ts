import OrganizationApi from '@/apis/organization';

enum UnitType {
  User = 0,
  Deaprtment = 1,
  Company = 2,
}
const state: Organization.Users.State = {
  orgTree: null,
  orgUserList: [],
  dataRef: {},
  unitTitleObj: {
    name: '',
    id: '',
    deptType: 1
  },
  /* 用户信息参数 */
  userInfoParams: {
    id: ''
  },
  eduUserInfoParams: {
    userId: '',
    deptId: ''
  },
  orgUserInfo: null,
  loading: false,
  noUser: true,
  loadCompleted: false,
  searchTitle: ''
};

const mutations = {
  setOrgNode(state: any, dataObj: any) {
    const { deptId, data } = dataObj;
    // 给组织机构tree赋值
    if (!Array.isArray(data) || !data.length) {
      console.log('返回数据不能为空');
      return;
    }

    if (deptId === '') {
      // 组织机构树根节点赋值
      const node = data[0];
      if (!node) {
        console.log('数据错误，节点非法！');
        return;
      }
      state.orgTree = [{
        id: node.id,
        name: node.name,
        type: node.unitType === 1 ? 'org' : 'user',
        orglist: `${node.name} (${node.employees || 0})`,
        title: `${node.name} (${node.employees || 0})`,
        isLeaf: node.leaf,
        hasChild: typeof node.employees !== 'undefined' && node.employees > 0,
        key: node.id,
        deptType: node.deptType,
        sortKey: '0', // ERROR
        children: []
      }];
      state.unitTitleObj = { name: node.name, id: node.id, deptType: node.deptType };
      if (node.children.length !== 0) {
        const nodeChildLength = node.children.length;
        for (let i = 0; i < nodeChildLength; i += 1) {
          state.orgTree[0].children.push({
            id: node.children[i].id,
            name: node.children[i].name,
            hasChild: node.children[i].employees > 0,
            type: 'org',
            orglist: `${node.children[i].name}`,
            title: `${node.children[i].name}`,
            isLeaf: node.children[i].leaf,
            deptType: node.children[i].deptType,
            key: node.children[i].id
          });
        }
      }
    } else {
      // 展开组织机构树节点
      const childNode = data;
      const childNodeLength = childNode.length;
      state.dataRef.children = [];
      for (let j = 0; j < childNodeLength; j += 1) {
        state.dataRef.children.push({
          id: childNode[j].id,
          name: childNode[j].name,
          type: childNode[j].name,
          hasChild: typeof childNode[j].employees !== 'undefined' && (childNode[j].employees > 0),
          orglist: `${childNode[j].name}`,
          title: `${childNode[j].name}`,
          isLeaf: childNode[j].leaf,
          deptType: childNode[j].deptType,
          key: childNode[j].id
        });
      }
      state.orgTree = [...state.orgTree];
    }
  },
  setDataRef(state: any, params: Organization.SelectTreeNode) {
    state.dataRef = params.dataRef;
  },
  changeTitle(state: any, params: Organization.Users.UnitTitleObj) {
    state.unitTitleObj = { name: params.name, id: params.id, deptType: params.deptType };
  },
  clearUserList(state: any) {
    state.orgUserList = [];
  },
  setUserList(state: any, payload: Organization.Users.OrgUserListPayload) {
    const { data, isSearch, params } = payload;
    // 设置组织机构用户列表
    if (data && data.content) {
      // 当用户数据等于100条时显示加载更多
      state.noUser = false;
      // if (!data.content.length && data.first) {
      //   state.noUser = true;
      // }
      // state.loadCompleted = data.last;
      state.searchTitle = `"${params.wd}"相关的搜索结果：共${data.totalElements}个`;
      // if (data.first) {
      //   state.orgUserList = [];
      // }
      const page = params.page;
      if (page === 0) {
        state.orgUserList = data.content;
      } else {
        state.orgUserList = state.orgUserList.concat(data.content);
      }
      if (!state.orgUserList.length) {
        state.noUser = true;
      }

      console.log(data.totalElements, state.orgUserList.length, page);

      if (data.totalElements === state.orgUserList.length) {
        state.loadCompleted = true;
      } else {
        state.loadCompleted = false;
      }
      const admins = state.orgUserList.filter((x: any) => x.leader);
      const rest = state.orgUserList.filter((x: any) => !x.leader);
      state.orgUserList = [
        ...admins,
        ...rest
      ];
      state.orgUserList.forEach((org: any) => {
        Object.entries(org).forEach((item: any) => {
          const [key, value] = item;
          if (typeof value !== 'boolean' && !value) {
            org[key] = '- -';
          }
        });
      });
      state.orgUserList = state.orgUserList.filter((x: any) => x.status !== 'DISABLE');
      const orgUserListLength = state.orgUserList.length;
      for (let i = 0; i < orgUserListLength; i += 1) {
        state.orgUserList[i].index = i + 1;
      }
    } else {
      state.noUser = true;
      console.log('返回数据不能为空');
    }
    state.loading = false;
  },
  assignUserInfoParams(state: any, params: Organization.Users.RequestParams) {
    state.userInfoParams = params;
  },
  setEduUserInfoParams(state: any, params: Organization.Users.EduRequestParams) {
    state.eduUserInfoParams = params;
  },
  setUserInfo(state: any, data: Organization.Users.OrgUserNode) {
    if (data.departmentName) {
      data.otherDepartments = data.departmentName.split(',');
    } else {
      data.otherDepartments = [];
    }
    state.orgUserInfo = data;
  },
  clearUserInfo(state: any) {
    state.orgUserInfo = null;
  }
};

const actions = {
  async getOrgNodes({ commit }: any, params: Organization.Users.OrgTreeParams) {
    const res = await OrganizationApi.getOrgInfo(params);
    commit('setOrgNode', { deptId: params.deptId, data: res.data });
  },
  async getOrgDepartmentNodes({ commit }: any, params: Organization.Users.OrgTreeParams) {
    const res = await OrganizationApi.getOrgDepartmentInfo(params);
    commit('setOrgNode', { deptId: params.deptId, data: res.data });
  },
  async getOrgUserList({ commit, state }: any, paramsObj:any) {
    const { params, isSearch } = paramsObj;
    
    state.loading = true;
    let res:any = {};
    if (isSearch) {
      // 根据用户名搜索请求组织机构用户列表
      state.searchTitle = `"${params.wd}"相关的搜索结果：共0个`;
      res = await OrganizationApi.searchOrgUserList(params);
    } else {
      // 请求组织机构用户列表
      res = await OrganizationApi.getOrgList(params);
    }
    if (res.data && res.errcode === 0) {
      commit('setUserList', { data: res.data, isSearch, params });
    } else {
      state.noUser = true;
      state.loading = false;
    }
  },
  async getOrgUserInfo({ commit, state }: any, isHomeSchool?:boolean) {
    // 根据用户ID获取用户详情信息
    if (isHomeSchool) {
      const res = await OrganizationApi.getEduUserInfo(state.eduUserInfoParams);
      if (res.errcode === 0 && res.data) {
        commit('setUserInfo', res.data);
      }
    } else {
      const res = await OrganizationApi.getOrgUserInfo(state.userInfoParams);
      if (res.errcode === 0 && res.data) {
        commit('setUserInfo', res.data);
      }
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
