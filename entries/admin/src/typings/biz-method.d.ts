declare namespace BizMethod {
  interface ListParam {
    schemaCode: string
  }
  interface MethodItem {
    code: string,
    defaultMethod: boolean,
    description: string,
    id: string,
    methodCount: number,
    methodType?: number,
    methodTypeName: string,
    name: string,
    // remarks: string,
    modifiedTime?: string,
    schemaCode: string,
    serviceList?: any[],
  }
  interface CreateParam {
    code: string,
    description: string,
    name: string,
    schemaCode: string,
  }
  interface DeleteParam {
    schemaCode: string,
    methodCode: string,
  }

  interface InputMapping {
    bizCode: string,
    codeType: number,
    codeTypeName: string,
    id: string,
    propertyName: string,
    remarks: string,
    serviceMethodParameterCode: string
  }

  interface OutputMapping extends InputMapping { }

  interface CreateInputMapping {
    bizCode: string,
    codeType: number,
    serviceMethodParameterCode: string,
  }
  interface CreateOutputMapping extends CreateInputMapping { }

  interface CreateBindParam {
    // bizMethodId: string,
    methodCode: string,
    inputMappings: CreateInputMapping[],
    outputMappings: CreateOutputMapping[],
    schemaCode: string,
    serviceMethodCode: string,
    serviceCode: string,
  }

  interface DeleteBindParam {
    id: string
  }

  interface ListBindServicesParam {
    schemaCode: string,
    // bizMethodId: string,
    methodCode: string,
  }

  interface GetBindDetailParam {
    methodMappingId: string,
  }

  interface BindDetailItem extends CreateBindParam {
    id: string,
    serviceName?: string,
    serviceMethodName?: string,
    // remarks?: string,
  }

}