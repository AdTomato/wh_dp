
import { PcFormDetail } from './form-detail';

export default {
    FormActionModal: () => import('./form-action-modal.vue'),
    FormModifyOwnerModal: () => import('./form-modify-owner-modal.vue'),
    FormActions: () => import('./form-actions.vue'),
    FormDetail: PcFormDetail
};