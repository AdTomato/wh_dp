
import * as apiMap from './api.mappings';

import { FormApi } from './form.api';

import { WorkflowApi } from './workflow.api';

import { WorkflowCenterApi } from './workflow-center.api';

import { ListApi } from './application.api';

import { UserApi } from './user.api';

import { InitialInstanceApi } from './initial-instances.api';

import { OrganizationApi } from './mobile/organization.api';

import { HomeApi } from './mobile/home.api';

import { ExternalLinkApi } from './externallink.api';

import { BizpropertyApi } from './bizproperty.api';

import { DingTalkApi } from './dingtalk.api';

import { CommonApi } from './common.api'

import { SystemManageApi } from './system-manage.api';


import * as form from './form-params';

import * as bizproperty from './bizproperty-params';

import * as workflow from './workflow-params';

import * as workflowCenter from './workflow-center-params';

import * as listParams from './application';

import * as initialInstanceParams from './initial-instances-params';

import * as mobileHome from './mobile/home-params';

import * as dingTalk from './dingtalk-params';

import * as systemManage from './system-manage-params';

import * as user from './users.typings';


export {
    apiMap,
    form,
    workflow,
    workflowCenter,
    listParams,
    initialInstanceParams,
    mobileHome,
    bizproperty,
    dingTalk,
    systemManage,
    user
};


export const formApi = new FormApi();

export const workflowApi = new WorkflowApi();

export const workflowCenterApi = new WorkflowCenterApi();

export const listApi = new ListApi();

export const userApi = new UserApi();

export const initialInstanceApi = new InitialInstanceApi();

export const organizationApi = new OrganizationApi();

export const homeApi = new HomeApi();

export const externalLinkApi = new ExternalLinkApi();

export const bizpropertyApi = new BizpropertyApi();

export const dingTalkApi = new DingTalkApi();

export const commonApi = new CommonApi();

export const systemManageApi = new SystemManageApi();