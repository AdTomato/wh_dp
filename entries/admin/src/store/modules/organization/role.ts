import OrganizationApi from '../../../apis/organization';

const state: Organization.Roles.RoleState = {
  orgTree: null,
  orgTreeBySearch: null,
  isRoleSearchResult: false,
  loading: false,
  isLoadMore: false,
  treeParams: {
    groupId: ''
  },
  roleList: [],
  dataRef: {},
  roleTitle: {
    name: '',
    code: '',
    id: ''
  },
  searchTips: false,
};
const mutations = {
  assignTreeParams(state: any, params: Organization.Roles.RequestChildrenTreeParams) {
    state.treeParams.groupId = params.groupId;
  },
  clearRoleList(state: any) {
    state.roleList = [];
  },
  clearOrgTreeBySearch(state: any) {
    state.isRoleSearchResult = false;
    state.searchTips = false;
    state.orgTreeBySearch = [];
  },
  setRoleOrgNode(state: any, params: any) {
    const { tree, index } = params;
    state.orgTree[index].children = [...tree]; // 插入children
    state.orgTree = [...state.orgTree];
  },
  setUserInfo(state: any, data: Array<Organization.OrgNode>) {
    if (data.length > 0) {
      if (data[0].children && data[0].children.length > 0) {
        state.roleTitle.name = data[0].children[0].name;
        state.roleTitle.code = data[0].children[0].code;
        state.roleTitle.id = data[0].children[0].id;
      } else {
        state.roleTitle.name = data[0].name;
        state.roleTitle.code = data[0].code;
        state.roleTitle.id = data[0].id;
      }
      state.roleTitle.roleType = data[0].roleType;
    }
  },
  setOrgNode(state: any, data: Array<Organization.OrgNode>) {
    if (!state.treeParams.groupId) {
      const dataLength: number = data.length;
      const result:any = [];
      for (let j = 0; j < dataLength; j += 1) {
        const node: any = data[j];
        result.push({
          id: node.id,
          value: node.id,
          name: node.name,
          title: `${node.name}`,
          isLeaf: false,
          key: node.id,
          code: node.code,
          roleType: node.roleType
        });
        if (node.children && node.children.length !== 0) {
          result[j].children = [];
          const nodeChildLength = node.children.length;
          for (let i = 0; i < nodeChildLength; i += 1) {
            result[j].children.push({
              id: node.children[i].id,
              value: node.children[i].id,
              name: node.children[i].name,
              title: `${node.children[i].name}`,
              isLeaf: true,
              key: node.children[i].id,
              code: node.children[i].code,
              groupId: node.children[i].groupId,
              roleType: node.children[i].roleType
            });
          }
        }
      }
      // 角色搜索时，赋值给orgTreeBySearch
      if (state.isRoleSearchResult) {
        state.searchTips = !result.length;
        state.orgTreeBySearch = result;
      } else {
        state.orgTree = result;
      }
    } else {
      const childNode = data;
      state.dataRef.children = [];
      const childNodeLength = childNode.length;
      for (let i = 0; i < childNodeLength; i += 1) {
        state.dataRef.children.push({
          id: childNode[i].id,
          value: childNode[i].id,
          name: childNode[i].name,
          title: `${childNode[i].name}`,
          isLeaf: true,
          key: childNode[i].id,
          code: childNode[i].code,
          groupId: childNode[i].groupId,
          roleType: childNode[i].roleType
        });
      }
      // 角色搜索时，赋值给orgTreeBySearch
      if (state.isRoleSearchResult) {
        state.orgTreeBySearch = [...state.orgTreeBySearch];
      } else {
        state.orgTree = [...state.orgTree];
      }
    }
  },
  setEventKey(state: any, params: Organization.SelectTreeNode) {
    state.dataRef = params.dataRef;
  },
  async setOrgRoleList(state: any, result: Organization.Roles.RoleListMutation) {
    // if (result.last) {
    //   state.isLoadMore = true;
    // }
    if (!result.content.length) {
      state.loading = false;
      return;
    }
    let list: any = [];
    if (result.first || result.page === 0) {
      list = result.content;
    } else {
      list = state.roleList.concat(result.content);
    }

    await list.forEach((res: any, index: number) => {
      res.index = index + 1;
      if (Array.isArray(res.ouScope)) {
        res.ouScope = res.ouScope.map((item: any) => {
          return item.name;
        }).join(';');
      }
      Object.entries(res).forEach((dataObj: any) => {
        const [key, value] = dataObj;
        if (!value && key !== 'unitType') {
          res[key] = '- -';
        }
      });
      res.hover = false;
      res.checked = false;
    });
    state.roleList = [].concat(list).map((x: object, idx: number) => ({
      ...x,
      index: idx + 1,
    }));
    state.isLoadMore = state.roleList.length == result.total;
    state.loading = false;
  }
};
const actions = {
  async getOrgRoleNode({ commit, state }: any) {
    const res = await OrganizationApi.getRoleLeveOneInfo();
    commit('clearOrgTreeBySearch');
    commit('setOrgNode', res.data);
    commit('setUserInfo', res.data);
  },
  async searchOrgRoleNode({ commit, state }: any, params:string) {
    const res = await OrganizationApi.searchRoleList(params);
    state.isRoleSearchResult = true;
    if (!res.data) {
      state.searchTips = true;
      return;
    }
    commit('setOrgNode', res.data);
  },
  async getOrgRoleList({ commit, state }: any, obj: any) {
    if (state.loading) {
      return;
    }
    state.loading = true;

    try {
      let res:any = {};
      if (obj.type === 'search') {
        res = await OrganizationApi.searchRoleUserList(obj.params);
      } else {
        res = await OrganizationApi.getOrgRoleList(obj.params);
      }
      commit('setOrgRoleList', {
        content: res.data.content,
        first: res.data.first,
        last: res.data.last,
        total: res.data.totalElements,
        page: obj.params.page,
      });
    } catch (error) {
      state.loading = false;
      state.isLoadMore = true;
    }
  },
  async getChildrenRole({ commit, state }: any) {
    const res = await OrganizationApi.getChildrenRole(state.treeParams);
    commit('setOrgNode', res.data);
  },
  actionTreeOrg({ commit, state }: any, params: any) {
    commit('setRoleOrgNode', params);
    // commit('setOrgNode', params);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
