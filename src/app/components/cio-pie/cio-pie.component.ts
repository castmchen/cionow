import { Component, OnInit, Input } from '@angular/core';
import * as echart from 'echarts';
import { ChartServiceService } from '../../services/chart-service.service';

@Component({
  selector: 'app-cio-pie',
  templateUrl: './cio-pie.component.html',
  styleUrls: [ './cio-pie.component.scss' ]
})

export class CioPieComponent implements OnInit {
  options: echart.EChartOption;
  pieInstance: echart.ECharts;

  constructor(private chartService: ChartServiceService) {
    this.options = {
      tooltip: {
        formatter: '{b} <br/> {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        icon: 'circle'
      },
      grid: {
        width: '90%',
        height: '90%'
      },
      series: [
        {
          label: {
            normal: {
              formatter: '  {b} {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 12,
                  lineHeight: 22
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [ 2, 4 ],
                  borderRadius: 3
                }
              }
            }
          },
          type: 'pie'
        }
      ]
    };
  }

  ngOnInit() {
    const that = this;
    setTimeout(() => {
      that.pieInstance = echart.getInstanceByDom(document.getElementById(
        'cioPie'
      ) as HTMLDivElement);
    }, 100);

    this.chartService.onResetChartPie_Position.subscribe(result => {
      const chartSeries = this.options.series as echart.EChartOption.Series;
      const seriesArray = [];
      result.forEach(_ => {
        let simpleName = _.name;
        if (_.name.includes('.')) {
          simpleName = _.name.split('.')[0];
        }
        seriesArray.push({
          name: simpleName,
          value: _.value
        });
      });
      chartSeries[ 0 ].data = seriesArray;

      if (typeof this.pieInstance === 'undefined') {
        this.pieInstance = echart.getInstanceByDom(document.getElementById(
          'cioPie'
        ) as HTMLDivElement);
      }
      this.pieInstance.setOption(this.options);
    });

    this.chartService.onMonitorChart.subscribe(result => {
      const chartSeries = this.options.series as echarts.EChartOption.Series;
      const existIndex = chartSeries[ 0 ].data.findIndex(
        element => element.name === result.name
      );
      if (existIndex > -1) {
        chartSeries[ 0 ].data[ existIndex ].value =
          parseFloat(chartSeries[ 0 ].data[ existIndex ].value) +
          parseFloat(result.value);
      } else {
        chartSeries[ 0 ].data.push({name: result.name, value: parseFloat(result.value)});
        // chartSeries[ 0 ].legend.data.push(result.name);
      }

      this.pieInstance.setOption(this.options);
    });
  }
}
