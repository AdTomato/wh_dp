<template>
  <div ref="echartBar" class="echart-bar"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const echarts = require('echarts/lib/echarts');

@Component({
  name: "echart-bar"
  })
export default class EchartBar extends Vue {
  @Prop() options!: Charts.BarOptions;

  chart: any = null;
  chartOptions: Charts.BarOptions = {
    chartTitle: '柱状图',
    barTitle: '展示',
    barColor: '#83bff6',
    x: [],
    y: []
  };

  initCharts() {
    const vm: any = this;
    const container: any = this.$refs.echartBar;
    const chart = echarts.init(container);
    chart.setOption({
      title: {
        text: vm.chartOptions.chartTitle
      },
      tooltip: {},
      xAxis: {
        axisTick: { show: false, },
        data: vm.chartOptions.x,
        axisLabel: {
          inside: true,
          textStyle: {
            color: '#fff',
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          }
        },
        // splitLine: {
        //   show: false,
        //   lineStyle: {
        //     color: '#e8e8e8',
        //   }
        // }
      },
      yAxis: {
        // show: false,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#e8e8e8',
          }
        }
      },
      series: [
        {
          type: 'bar',
          barWidth: 30,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: 'rgba(0, 0, 0, 0.85)'
            }
          },
          itemStyle: {
            normal: {
              /* eslint-disable-next-line */
              color: function(params:any) {
                if (Array.isArray(vm.chartOptions.color)) {
                  return vm.chartOptions.color[params.dataIndex];
                }
                return vm.chartOptions.barColor;
              }
            }
          },
          name: vm.chartOptions.barTitle,
          data: vm.chartOptions.y
        }
      ]
    });
  }

  mounted() {
    this.chartOptions = Object.assign(this.chartOptions, this.options);
    this.initCharts();
  }
}
</script>
<style lang="less" scoped>
.echart-bar {
  height: 500px;
}
</style>
