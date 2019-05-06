import { Component, OnInit } from '@angular/core';
import { ChartServiceService } from '../../services/chart-service.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-cio-bar',
  templateUrl: './cio-bar.component.html',
  styleUrls: ['./cio-bar.component.scss']
})
export class CioBarComponent implements OnInit {
  private options: echarts.EChartOption;
  private barInstance: echarts.ECharts;

  constructor(private chartService: ChartServiceService) {
    this.options = {
      title: {
        text: 'Automatic&Manual Comparison',
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
          data: ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} H'
          }
        }
      ],
      series: [
        {
          name: 'Automatic',
          type: 'bar',
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
          type: 'bar',
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
      that.barInstance = echarts.getInstanceByDom(document.getElementById(
        'cioBar'
      ) as HTMLDivElement);
    }, 100);

    this.chartService.onResetChart.subscribe(chartOptions => {
      const automaticArray = [];
      const manualArray = [];
      const periodArray = [];

      for (const chartOption of chartOptions) {
        automaticArray.unshift(chartOption.automaticValue);
        manualArray.unshift(chartOption.manualValue);
        periodArray.unshift(chartOption.periodTime);
      }

      this.barInstance.clear();
      this.options.xAxis[0].data = periodArray;
      const chartSeries = this.options.series as echarts.EChartOption.Series;
      chartSeries[0].data = automaticArray;
      chartSeries[1].data = manualArray;
      this.barInstance.setOption(this.options);
    });

    this.chartService.onMonitorChart.subscribe(chartOption => {
      const periodDate = new Date(chartOption.periodTime).toLocaleDateString();

      const currentXAxis = this.options.xAxis[0].data as [];
      const currentIndex = currentXAxis.findIndex(_ => _ === periodDate);
      if (currentIndex > -1) {
        const chartSeries = this.options.series as echarts.EChartOption.Series;

        for (const index in chartSeries[0].data) {
          // tslint:disable-next-line: radix
          if (currentIndex === parseInt(index)) {
            chartSeries[0].data[currentIndex] += chartOption.automatica;
            break;
          }
        }
        for (const index in chartSeries[1].data) {
          // tslint:disable-next-line: radix
          if (currentIndex === parseInt(index)) {
            chartSeries[1].data[currentIndex] += chartOption.manual;
            break;
          }
        }

        this.barInstance.setOption(this.options);
      }
    });
  }
}
