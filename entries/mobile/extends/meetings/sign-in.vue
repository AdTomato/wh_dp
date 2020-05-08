<template>
  <div :class="prefixCls">
    <div :class="[prefixCls + '__from']">
      <h3-input
        :class="[prefixCls + '__col']"
        title="签到人"
        :defaultValue="name"
        :disabled="true"
        type="text"
      ></h3-input>
      <h3-input
        :class="[prefixCls + '__col']"
        title="签到时间"
        :defaultValue="date"
        :disabled="true"
        type="text"
      ></h3-input>
    </div>
    <div :class="[prefixCls + '__actions']">
      <div @click="submit">签到</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Component, Vue
  } from 'vue-property-decorator';
  import {
    H3Input,
    h3Toast
  } from 'h3-mobile-vue';
  import meetingsAPI from './meetings';
  import { utils } from '@cloudpivot/common';

  const dateFormat = utils.DateHandle.dateFormat;

  const prefixCls = 'meetings-sign-in';
  @Component({
    name: 'meetings-sign-in',
    components: {
      H3Input,
      h3Toast
    },
  })
  export default class MeetingsSignIn extends Vue {
    prefixCls = prefixCls;

    name = this.$store.state.userinfo.name;

    id = this.$store.state.userinfo.name;

    date = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');

    /**
     * 提交
     */
    submit() {
      const params = {
        id: this.id,
        name: this.name,
        date: this.date
      };
      this.$h3.toast.show({
        iconType: 'loading'
      });
      meetingsAPI.signIn(params).then((res) => {
        this.$h3.toast.hide();
      }).catch((res) => {
        this.$h3.toast.hide();
        this.$h3.toast.show({
          text: res.message
        });
      });
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/styles/mixins.less";
  @import "~@/styles/mixins/hairline.less";

  .meetings-sign-in {
    display: flex;
    flex-direction: column;
    background-color: #f5f5f9;
    height: 100%;

    &__from {
      flex: 1 1;
    }

    &__col {
      background-color: #ffffff;
    }

    &__actions {
      flex: 0 0;
      .px2rem(flex-basis, 90px);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #2970ff;
      background-color: #fff;
      .px2rem(font-size, 30px);
    }
  }
</style>
