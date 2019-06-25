import { Component, OnInit, Input } from '@angular/core';
import { ChartServiceService } from '../../services/chart-service.service';
import * as echart from 'echarts';

@Component({
  selector: 'app-cio-bar',
  templateUrl: './cio-bar.component.html',
  styleUrls: ['./cio-bar.component.scss']
})
export class CioBarComponent implements OnInit {
  @Input() selectedValue: any;
  options: echart.EChartOption;
  barInstance: echart.ECharts;
  isShowFlag = false;

  constructor(private chartService: ChartServiceService) {
    this.options = {
      title: {
        text: 'Bar Chart',
        subtext: 'Hour Unit'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Automatic']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, title: ' DataView ', readOnly: false },
          magicType : {show: true, title: {line: 'Line Graph', bar: 'Line Graph'}, type: ['line', 'bar']},
          saveAsImage: { show: true, title: 'Download ' },
          }
      },
      xAxis: [
        {
          boundaryGap: true,
          type: 'category'
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
      that.barInstance = echart.getInstanceByDom(document.getElementById(
        'cioBar'
      ) as HTMLDivElement);
    }, 100);

    this.chartService.onResetChart.subscribe(result => {
      this.isShowFlag = result && result.length;
      if (this.isShowFlag) {
        if (!this.barInstance) {
          that.barInstance = echart.getInstanceByDom(document.getElementById(
            'cioBar'
          ) as HTMLDivElement);
          }
        const chartSeries = this.options.series as echart.EChartOption.Series;
        const xAxis = this.options.xAxis as echart.EChartOption.Series;

        xAxis[0].data = result.map(_ => _.name);
        chartSeries[0].data = result.map(_ => _.value);
        this.barInstance.setOption(this.options);
        }
    });

    this.chartService.onMonitorChart.subscribe(result => {
      const chartSeries = this.options.series as echarts.EChartOption.Series;
      const xAxis = this.options.xAxis as echarts.EChartOption.Series;

      const existIndex = xAxis[0].data.findIndex(
        element => element === result.name
      );
      if (existIndex > -1) {
        chartSeries[0].data[existIndex] =
          parseFloat(chartSeries[0].data[existIndex]) +
          parseFloat(result.value);
      } else {
        xAxis[0].data.push(result.name);
        chartSeries[0].data.push(result.value);
      }

      this.barInstance.setOption(this.options);
    });
  }
}
