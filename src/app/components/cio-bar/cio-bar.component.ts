import { EChartOption } from 'echarts';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cio-bar',
  templateUrl: './cio-bar.component.html',
  styleUrls: ['./cio-bar.component.scss']
})
export class CioBarComponent implements OnInit {
  private options: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'bar',
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }]
        }
      }
    ]
  };
  constructor() {}

  ngOnInit() {}
}
