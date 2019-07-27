import { Component, OnInit, Input } from '@angular/core';
import * as echart from 'echarts';
import { ChartServiceService } from '../../services/chart-service.service';

@Component({
  selector: 'app-cio-pie-type',
  templateUrl: './cio-pie-type.component.html',
  styleUrls: [ './cio-pie-type.component.scss' ]
})
export class CioPieTypeComponent implements OnInit {
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
        'cioPieType'
      ) as HTMLDivElement);
    }, 100);

    this.chartService.onResetChartPie_Type.subscribe(result => {
      const chartSeries = this.options.series as echart.EChartOption.Series;
      chartSeries[ 0 ].data = result;

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


// import { Component, OnInit, Input } from '@angular/core';
// import * as echart from 'echarts';
// import { ChartServiceService } from '../../services/chart-service.service';

// @Component({
//   selector: 'app-cio-pie-type',
//   templateUrl: './cio-pie-type.component.html',
//   styleUrls: [ './cio-pie-type.component.scss' ]
// })
// export class CioPieTypeComponent implements OnInit {
//   options: echart.EChartOption;
//   pieInstance: echart.ECharts;

//   constructor(private chartService: ChartServiceService) {
//     this.options = {
//       tooltip: {
//         trigger: 'item',
//         formatter: '{b} <br/> {c} ({d}%)'
//       },
//       legend: {
//         orient: 'vertical',
//         x: 'right',
//         icon: 'circle',
//         data: []
//       },
//       grid: {
//         top: 'middle'
//       },
//       series: [
//         {
//           name: 'Hours',
//           type: 'pie',
//           selectedMode: 'single',
//           radius: [ 0, '30%' ],
//           label: {
//             normal: {
//               position: 'inner'
//             }
//           },
//           labelLine: {
//             normal: {
//               show: false
//             }
//           },
//           data: []
//         },
//         {
//           name: 'Time Distribute',
//           type: 'pie',
//           radius: [ '40%', '55%' ],
//           label: {
//             normal: {
//               formatter: '{a|{a}} {abg|}\n{hr|}\n  {b|{b}} {per|{d}%}  ',
//               backgroundColor: '#fff',
//               borderColor: '#aaa',
//               borderWidth: 1,
//               borderRadius: 4,
//               shadowBlur: 3,
//               shadowOffsetX: 2,
//               shadowOffsetY: 2,
//               shadowColor: '#999',
//               padding: [ 0, 7 ],
//               rich: {
//                 a: {
//                   color: '#999',
//                   lineHeight: 22,
//                   align: 'center'
//                 },
//                 abg: {
//                   width: '100%',
//                   align: 'right',
//                   height: 22,
//                   borderRadius: [ 4, 4, 0, 0 ]
//                 },
//                 hr: {
//                   borderColor: '#aaa',
//                   width: '100%',
//                   borderWidth: 0.5,
//                   height: 0
//                 },
//                 b: {
//                   fontSize: 12,
//                   lineHeight: 22
//                 },
//                 per: {
//                   color: '#eee',
//                   backgroundColor: '#334455',
//                   padding: [ 2, 4 ],
//                   borderRadius: 2
//                 }
//               }
//             }
//           },
//           data: []
//         }
//       ]
//     };
//   }

//   ngOnInit() {
//     const that = this;
//     setTimeout(() => {
//       that.pieInstance = echart.getInstanceByDom(document.getElementById(
//         'cioPieType'
//       ) as HTMLDivElement);
//     }, 100);

//     this.chartService.onResetChartPie_Type.subscribe(result => {
//       const chartSeries = this.options.series as echart.EChartOption.Series;
//       (this.options.legend as any).data = result.map(_ => _.name);
//       chartSeries[ 0 ].data = result;
//       chartSeries[ 1 ].data = [];
//       result.forEach(pieItem => {
//         pieItem.group.forEach((groupItem: any) => {
//           chartSeries[ 1 ].data.push({ name: `${ groupItem.time } (${ pieItem.name })`, value: groupItem.hours });
//         });
//       });

//       if (typeof this.pieInstance === 'undefined') {
//         this.pieInstance = echart.getInstanceByDom(document.getElementById(
//           'cioPieType'
//         ) as HTMLDivElement);
//       }
//       this.pieInstance.setOption(this.options);
//     });

//     this.chartService.onMonitorChart.subscribe(result => {
//       const chartSeries = this.options.series as echarts.EChartOption.Series;
//       const existIndex = chartSeries[ 0 ].data.findIndex(
//         element => element.name === result.name
//       );
//       if (existIndex === -1) {
//         chartSeries[ 0 ].data.push({
//           name: result.item.automationType,
//           value: parseFloat(result.value),
//           group: [ { time: result.displayTime, hours: parseFloat(result.value) } ]
//         });
//       } else {
//         chartSeries[ 0 ].data[ existIndex ].group.push({ time: result.displayTime, hours: parseFloat(result.value) });
//       }

//       const existTypeIndex = chartSeries[ 1 ].data.findIndex(_ => _.name === `${ result.time } (${ result.item.automationType })`);
//       if (existTypeIndex > -1) {
//         chartSeries[ 1 ].data[ existTypeIndex ].value = parseFloat(chartSeries[ 1 ].data[ existTypeIndex ].value)
//           + parseFloat(result.value);
//       } else {
//         chartSeries[ 1 ].data.push({ name: `${ result.time } (${ result.item.automationType })`, value: result.value });
//       }

//       this.pieInstance.setOption(this.options);
//     });
//   }
// }
