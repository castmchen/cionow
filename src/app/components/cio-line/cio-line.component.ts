import { Component, OnInit, Input } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-cio-line',
  templateUrl: './cio-line.component.html',
  styleUrls: ['./cio-line.component.scss']
})
export class CioLineComponent implements OnInit {
  private options: EChartOption = {
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
        type: 'line',
        data: [11, 11, 15, 13, 12, 13, 10],
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
        data: [1, -2, 2, 5, 3, 2, 0],
        markPoint: {
          data: [{ name: 'Max', value: -2, xAxis: 1, yAxis: -1.5 }]
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
