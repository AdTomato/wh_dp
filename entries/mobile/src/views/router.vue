<template>
  <router-view/>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'index',
})
export default class Index extends Vue {}
</script>
