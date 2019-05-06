import { Component, OnInit, Input } from '@angular/core';
import { ChartServiceService } from '../../services/chart-service.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-cio-line',
  templateUrl: './cio-line.component.html',
  styleUrls: ['./cio-line.component.scss']
})
export class CioLineComponent implements OnInit {
  private options: echarts.EChartOption;
  private lineInstance: echarts.ECharts;

  constructor(private chartService: ChartServiceService) {
    this.options = {
      title: {
        text: 'Automatic&Manual Sparklines',
        subtext: 'Hour Unit'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Automatic', 'Manual']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          splitLine: {
            show: false
          },
          data: ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} H'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Automatic',
          type: 'line',
          data: [1, 1, 1, 1, 1, 1, 1],
          markPoint: {
            data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }]
          },
          markLine: {
            data: [{ type: 'average', name: 'Average' }]
          }
        },
        {
          name: 'Manual',
          type: 'line',
          data: [10, 10, 10, 10, 10, 10, 10],
          markPoint: {
            data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }]
          },
          markLine: {
            data: [{ type: 'average', name: 'Average' }]
          }
        }
      ]
    };
  }

  ngOnInit() {
    const that = this;
    setTimeout(() => {
      that.lineInstance = echarts.getInstanceByDom(document.getElementById(
        'cioLine'
      ) as HTMLDivElement);
    }, 100);

    this.chartService.onResetChart.subscribe(chartOptions => {
      const automaticArray = [];
      const manualArray = [];
      const periodArray = [];

      for (const chartOption of chartOptions) {
        if (
          typeof chartOption.triggerTime !== 'undefined' &&
          chartOption.triggerTime
        ) {
          automaticArray.unshift(chartOption.automaticValue);
          manualArray.unshift(chartOption.manualValue);
          periodArray.unshift(
            new Date(chartOption.triggerTime)
              .toLocaleString()
              .replace(/T/, ' ')
              .replace(/\..+/, '')
          );
        }
      }

      this.lineInstance.clear();
      this.options.xAxis[0].data = periodArray;
      const chartSeries = this.options.series as echarts.EChartOption.Series;
      chartSeries[0].data = automaticArray;
      chartSeries[1].data = manualArray;
      this.lineInstance.setOption(this.options);
    });

    this.chartService.onMonitorChart.subscribe(chartOption => {
      const currentXAxis = this.options.xAxis[0].data as any[];
      const chartSeries = this.options.series as echarts.EChartOption.Series;
      const newValue = new Date(chartOption.periodTime)
        .toLocaleString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
      if (currentXAxis.length > 15) {
        chartSeries[0].data.shift();
        chartSeries[1].data.shift();
        currentXAxis.shift();
      }
      currentXAxis.push(newValue);
      chartSeries[0].data.push(chartOption.automatica);
      chartSeries[1].data.push(chartOption.manual);

      this.lineInstance.setOption(this.options);
    });
  }
}
