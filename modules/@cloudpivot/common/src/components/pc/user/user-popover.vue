
<template>

  <a-popover
    trigger="click"
  >
    <user-card :userId="user.id" slot="content"></user-card>
    <a class="user-name" @click.stop="() => {}">{{ user.name }}</a>
  </a-popover>

</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Popover } from 'h3-antd-vue';
import UserCard from './user-card.vue';


@Component({
  name: 'user-popover',
  components: {
    APopover: Popover,
    UserCard
  }
})
export default class UserPopover extends Vue {
  @Prop({
    default : {}
  })
  user !: any
}
</script>
