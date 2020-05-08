<template>
  <div ref="echartPie" class="echart-pie"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import 'echarts/lib/chart/pie';
// import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const echarts = require('echarts/lib/echarts');

@Component({
  name: "echart-pie"
  })
export default class EchartPie extends Vue {
  @Prop() options!: Charts.PieOptions;

  chart: any = null;
  chartOptions: Charts.PieOptions = {
    chartTitle: '柱状图',
    list: []
  };

  initCharts() {
    const vm:any = this;
    const container:any = this.$refs.echartPie;
    const chart:any = echarts.init(container);
    const opts: any = {
      title: {
        text: vm.chartOptions.chartTitle
      },
      // 自定义环形背景色
      // color: ['#FFC603', '#F95E49', '#B28FF2', '#00D9BF', '#2975EF', '#DF97E2', '#F95771', '#FF8702', '#36BBBF'],
      // tooltip: {},
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   data: vm.chartOptions.list.map((item:any) => item.name)
      // },
      series: [
        {
          name: vm.chartOptions.chartTitle,
          type: 'pie',
          radius: vm.chartOptions.radius || '55%',
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'outside',
              formatter: '{b}\n{c}({d}%)',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            smooth: 0.02,
            length: 40,
            length2: 20,
          },
          data: vm.chartOptions.list
        }
      ]
    };
    if (this.options.color) {
      opts.color = this.options.color;
    }
    chart.setOption(opts);
  }

  mounted() {
    this.chartOptions = Object.assign(this.chartOptions, this.options);
    this.initCharts();
  }
}
</script>
<style lang="less" scoped>
.echart-pie {
  height: 500px;
}
</style>
