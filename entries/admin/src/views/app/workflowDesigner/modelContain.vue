<template>
  <div class="acitivity-model-contain">
    <template v-for="(item,index) in acitivityModel">
      <model-item
        :item="item"
        :key="index"
        v-h3-drag
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import '@/directives/drag';
import ModelItem from './modelItem.vue';

@Component({
  name: 'modelContain',
  components: {
    ModelItem
  }
})

export default class ModelContain extends Vue {
    acitivityModel:any = [];

    setActivityModel() {
      this.acitivityModel = [
        {
          activityName: this.$t('languages.UserAction'),
          name_i18n: {
            en: this.$t('languages.UserAction')
          },
          width: 158,
          height: 40,
          icon: '&#xe935;',
          activityType: 'PARTICIPANT'
        },
        {
          activityName: this.$t('languages.BizAction'),
          name_i18n: {
            en: this.$t('languages.BizAction')
          },
          width: 158,
          height: 40,
          icon: '&#xe947;',
          activityType: 'SYSTEM_ACTIVITY'
        }, {
          activityName: this.$t('languages.SubInstance'),
          name_i18n: {
            en: this.$t('languages.SubInstance')
          },
          width: 158,
          height: 40,
          icon: '&#xe9d5;',
          activityType: 'SUB_INSTANCE'
        }, {
          activityName: this.$t('languages.Connection'),
          name_i18n: {
            en: this.$t('languages.Connection')
          },
          width: 158,
          height: 40,
          icon: '&#xe914;',
          activityType: 'CONNECTION'
        }, {
          activityName: this.$t('languages.Notify'),
          name_i18n: {
            en: this.$t('languages.Notify')
          },
          width: 158,
          height: 40,
          icon: '&#xe910;',
          activityType: 'CIRCULATE'
        }];
    }

    mounted() {
      this.setActivityModel();
    }
}
</script>
