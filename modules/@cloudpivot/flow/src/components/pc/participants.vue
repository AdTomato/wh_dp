<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';

import { Popover } from 'h3-antd-vue';
import common from '@cloudpivot/common';
import { WorkflowParticipantType } from '../../typings/workflow-enum';

import { workflow } from '@cloudpivot/api';

@Component({
  name: 'workflow-participants',
  components: {
    UserPopover: common.components.pc.UserPopover
  }
})
export default class WorkflowParticipants extends Vue {
  @Prop({ default: () => [] }) participants!: workflow.Participant[];

  @Prop() pSlot!:any;

  @Prop() i18nData?: any;

  render(h: any) {
    const participantRenders:any[] = [];
    if (this.pSlot) {
      participantRenders.push(h('label', this.pSlot));
    }
    this.participants.forEach((participant: workflow.Participant, index:number) => {
      participantRenders.push(h(
        common.components.pc.UserPopover, {
          props: {
            user: { id: participant.id, name: participant.name }
          }
        }
      ));
      if (participant.workItemType && participant.workItemType !== 5) {
        participantRenders.push(h(
          common.components.pc.UserPopover, {
            props: {
              user: { id: participant.sourceId, name: participant.sourceName }
            }
          }
        ));
        participantRenders.splice(participantRenders.length - 1, 0, '[');

        switch (participant.workItemType) {
          case WorkflowParticipantType.ASSIST:
            if (this.i18nData && this.i18nData.assist) {
              participantRenders.push(this.i18nData.assist);
            } else {
              participantRenders.push(`${this.$t('cloudpivot.flow.pc.Assist')}`);
            }
            break;
          case WorkflowParticipantType.ADD_WORKITEM:
            if (this.i18nData && this.i18nData.addWorkitem) {
              participantRenders.push(this.i18nData.addWorkitem);
            } else {
              participantRenders.push(`${this.$t('cloudpivot.flow.pc.AddWorkitem')}`);
            }
            break;
          case WorkflowParticipantType.CIRCULATE_ITEM:
            if (this.i18nData && this.i18nData.circulate) {
              participantRenders.push(this.i18nData.circulate);
            } else {
              participantRenders.push(`${this.$t('cloudpivot.flow.pc.Circulate')}`);
            }
            break;
          case WorkflowParticipantType.FORWARD:
            if (this.i18nData && this.i18nData.forward) {
              participantRenders.push(this.i18nData.forward);
            } else {
              participantRenders.push(`${this.$t('cloudpivot.flow.pc.Forward')}`);
            }
            break;
          default:
            break;
        }
      }

      if (index !== this.participants.length - 1) {
        participantRenders.push('、');
      }
    });
    return h('div', {
      class: {
        'workflow-participants': true
      }
    }, participantRenders);
  }
}


</script>
