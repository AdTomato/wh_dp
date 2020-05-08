declare namespace BizService {
  interface ParamterItem {
    code: string,
    name: string,
    desc: string,
    required: boolean,
    value?: string
  }
  interface AuthItem {
    code: string,
    name: string,
    parameterlist: ParamterItem[]
  }

  interface AdapterConfig {
    code: string,
    name: string,
    config: {
      authList: AuthItem[],
      commonList: ParamterItem[]
    }
  }

  namespace Category {
    interface CreateParams {
      name: string
    }
    interface DeleteParams {
      id: string
    }
    interface Item {
      id: string,
      name: string,
      showPop?: boolean,
    }
    interface UpdateParams extends Item { }
  }

  namespace Service {
    interface CreateParams {
      code: string,
      configJson: string,
      description: string,
      name: string,
      adapterCode: string,
      serviceCategoryId: string,
    }
    interface DeleteParams {
      id: string
    }
    interface ListParams {
      categoryId: string
    }
    interface Item extends CreateParams {
      id: string,
      modifiedTime: string,
      methods?: Method.Item[],
      isRestful?: boolean,
      isSoap?: boolean,
    }
    interface UpdateParams extends CreateParams {
      id: string,
    }
    interface OptionItem {
      code: string,
      name: string,
      id: string,
      modifiedTime: string,
    }
    interface QueryBindBizmethodParams {
      serviceMethodCode?: string,
      serviceCode: string,
    }

    interface GetReferenceParams {
      serviceCode: string,
      serviceMethodCode: string,
    }

    interface RefreshSoapParams {
      serviceCode: string
    }
  }

  namespace Method {
    interface CreateParams {
      code: string,
      configJson: string,
      description: string,
      inputParametersJson: string,
      name: string,
      outputParametersJson: string,
      remarks: string,
      serviceCode: string,
    }
    interface Item extends CreateParams {
      id: string
    }
    interface UpdateParams extends CreateParams {
      id: string
    }
    interface TestParams {
      code: string,
      serviceCode: string,
      testInputParametersMap: object,
    }

    interface DeleteParams {
      id: string
    }
    interface DetailsParams extends DeleteParams { }
    interface ListByCodeParams {
      serviceCode: string
    }

    interface InputParam {
      code: string,
      name: string,
      configJson: {
        position: number
      },
      bizPropertyType: number,
      description: string,
      index?: number,
      sortKey?: string,
    }
    interface OutputParam extends InputParam { }

    interface MethodConfig {
      httpType: number,
      requestBodyType: number,
      url: string
    }
  }
}