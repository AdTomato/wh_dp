<template>
  <div class="form-approval-details">
    <div
      v-for="(user, i) in users"
      :key="i"
      class="form-approval-details__user"
    >
      <h3-avatar :src="user.imgUrl"></h3-avatar>
      <div class="form-approval-details__info">
        <label>{{ user.name }}</label>
        <span>{{ user.dept || $t('languages.common.unknown') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Watch, Prop
} from 'vue-property-decorator';

import {
  H3Avatar
} from 'h3-mobile-vue';
// import { setTitle } from '@/utils/dingtalk';

import * as platform from '@cloudpivot/platform';

@Component({
  name: 'form-approral',
  components: {
    H3Avatar
  },
})
export default class FormApprovalDetails extends Vue {
  users = [];

  created() {
    const params: any = this.$route.params as any;
    // setTitle(params.title);
    platform.service.setTitle(params.title);
    this.users = params.approvaler;
  }
}

</script>
<style lang="less" scoped>
@import "~@/styles/mixins.less";
@import "~@/styles/mixins/hairline.less";
.form-approval-details{
  height: 100%;
  border-color: #F7F8FC;
  &__user{
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    .hairline("bottom", #eeeeee);
    position: relative;
    .px2rem(height, 150px);
    img {
      .px2rem(padding, 30px);
    }
  }
  &__info{
    display: flex;
    flex-direction: column;
    text-align: left;
    label{
      color: #333;
      font-weight: bold;
      .px2rem(font-size, 32px);
      .px2rem(margin-bottom, 16px);
    }
    span{
      color: rgba(0,0,0,0.65);
      .px2rem(font-size, 26px);
    }
  }
}
</style>
