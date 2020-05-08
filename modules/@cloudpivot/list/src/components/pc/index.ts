export default {
  ApplicationList: () => import("./application-list.vue"),
  ApplicationCustomIframe: () => import("./application-custom-iframe.vue"),
  ListSelector: () => import("./list-selector.vue"),
  DataUpload: () => import("./components/import/data-upload.vue"),
  DataImport: () => import("./components/import/data-import.vue"),
  DataImportStatus: () => import("./components/import/data-import-status.vue"),
  QueryForm: () => import("./components/query-form.vue"),
  DataExport: () => import("./components/data-export.vue"),
  PrintQrcode: () => import("./components/print-qrcode.vue")
};