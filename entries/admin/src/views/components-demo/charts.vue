<template>
  <div class="chart-demo">
    <section class="chart-group">
      <echart-bar class="chart-item" :options="barOptions"/>
      <echart-pie class="chart-item" :options="doughnutOptions"/>
      <echart-pie class="chart-item" :options="pieOptions"/>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

import EchartBar from './charts/bar.vue';
import EchartPie from './charts/pie.vue';

@Component({
  name: "charts-demo",
  components: {
  EchartBar,
  EchartPie,
  }
  })
export default class ChartsDemo extends Vue {
  barOptions: Charts.BarOptions = {
    chartTitle: '柱状图展示',
    barTitle: '销量',
    x: ['冰可乐', '红牛', '冰红茶', '雪碧', '益力多', '乳酸菌', '农夫山泉'],
    y: [5, 8, 9, 6, 45, 2, 52],
    // barColor: '#1890ff',
    color: ['#FFC603', '#F95E49', '#B28FF2', '#00D9BF', '#2975EF', '#DF97E2', '#F95771', '#FF8702', '#36BBBF'],
  };
  doughnutOptions: Charts.PieOptions = {
    chartTitle: '环形图展示',
    radius: ['30%', '70%'],
    color: ['#FFC603', '#F95E49', '#B28FF2', '#00D9BF', '#2975EF', '#DF97E2', '#F95771', '#FF8702', '#36BBBF'],
    list: [
      { value: 14.81, name: '冰可乐', },
      { value: 14.81, name: '红牛', },
      { value: 25.93, name: '雪碧', },
      { value: 7.41, name: '冰红茶', },
      { value: 7.41, name: '益力多', },
      { value: 7.41, name: '乳酸菌', },
      { value: 11.11, name: '东鹏特饮', },
      { value: 3.70, name: '农夫山泉', }]
  };
  pieOptions: Charts.PieOptions = {
    chartTitle: '饼图展示',
    color: ['#FFC603', '#F95E49', '#B28FF2', '#00D9BF', '#2975EF', '#DF97E2', '#F95771', '#FF8702', '#36BBBF'],
    list: [
      { value: 35, name: '冰可乐', },
      { value: 15, name: '红牛', },
      { value: 25, name: '雪碧', },
      { value: 15, name: '冰红茶', },
      { value: 35, name: '益力多', },
      { value: 11, name: '乳酸菌', },
      { value: 55, name: '东鹏特饮', },
      { value: 23, name: '农夫山泉', }]
  }
}
</script>
<style lang="less" scoped>
.chart-demo {
  padding: 0 30px;
  .chart-group {
    padding-top: 30px;
    display: flex;
    flex-wrap: wrap;
    height: 450px;
    /deep/.echart-bar,
    /deep/.echart-pie {
      flex-basis: 50%;
      width: 50%;
      height: 100%;
    }
  }
}
</style>
