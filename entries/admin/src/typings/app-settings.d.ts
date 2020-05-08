declare module AppSettings {
  interface baseForm {
    code: string
    name: string
    enabled: boolean
    logoUrlId?: string
    logoUrl?: string
  }

  interface deployForm {
    appKey: string,
    appSecret: string,
    agentId: string,
  }

  interface uploadParam {
    file: File
  }

  interface uploadResponse {
    errcode?: number,
    errmsg?: string,
    data: {
      fileExtension: string,
      fileSize: number,
      id: string,
      mimeType: string,
      name: string,
      refId: string,
      schemaCode: string,
      storageMethod: string
    }
  }
}