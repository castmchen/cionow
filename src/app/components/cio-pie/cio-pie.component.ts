import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-cio-pie',
  templateUrl: './cio-pie.component.html',
  styleUrls: ['./cio-pie.component.scss']
})
export class CioPieComponent implements OnInit {
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
        type: 'pie'
      }
    ]
  };
  constructor() {}

  ngOnInit() {}
}
