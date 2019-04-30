import { EChartOption } from 'echarts';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cio-bar',
  templateUrl: './cio-bar.component.html',
  styleUrls: ['./cio-bar.component.scss']
})
export class CioBarComponent implements OnInit {
  private options: EChartOption = {
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
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
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
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6],
        markPoint: {
          data: [
            {
              name: 'Max',
              value: 182.2,
              xAxis: 7,
              yAxis: 183,
              symbolSize: 18
            },
            { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Average' }]
        }
      }
    ]
  };

  constructor() {}

  ngOnInit() {}
}
