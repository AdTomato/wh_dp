
import { Route } from 'vue-router';
import { Vue } from "vue-property-decorator";

import dataItemsStore from "./data-items.store";
import { DataItemState } from "./data-items.store";

export function init(vue: Vue) {
    const path = getPath(vue);
    vue.$store.registerModule(path, dataItemsStore as any);
    return loadDataItems(vue);
}

export function unregister(vue: Vue) {
    const path = getPath(vue);
    vue.$store.unregisterModule(path);
}

export function getPath(vue: Vue) {
    const schemaCode = vue.$route.params.bizSchemaCode;
    const sheetCode = vue.$route.params.sheetCode;
    return `app/${schemaCode}/form-design/${sheetCode}/data-item`;
}

export function getDataItems(vue: Vue): DataItemState[] {
    const path = getPath(vue);
    const state = vue.$store.state[path];
    return state ? state.items : [];
}

export function loadDataItems(vue: Vue): Promise<void> {
    const path = getPath(vue) + "/load";
    const schemaCode = vue.$route.params.bizSchemaCode;
    return vue.$store.dispatch(path, schemaCode);
}

export function switchUsed(vue: Vue, code: string, subCode?: string) {
    const name = getPath(vue) + "/switchUsed";
    vue.$store.commit(name, { code, subCode });
}

export function setUsed(vue: Vue, used: boolean, code: string, subCode?: string) {
    const name = getPath(vue) + "/setUsed";
    vue.$store.commit(name, { used, code, subCode });
}

export function addItem(vue: Vue, item: DataItemState) {
    const path = getPath(vue) + "/addItem";
    vue.$store.commit(path, item);
}

export function groupBy(vue: Vue, isSystem: boolean): DataItemState[] {
    const name = getPath(vue) + "/groupBy";
    return vue.$store.getters[name](isSystem);
}

export function deleteUnPublish(vue: Vue, code: string, subCode?: string) {
    const path = getPath(vue) + "/deleteUnPublish";
    const schemaCode = vue.$route.params.bizSchemaCode;
    return vue.$store.dispatch(path, {
        schemaCode,
        code,
        subCode
    });
}
