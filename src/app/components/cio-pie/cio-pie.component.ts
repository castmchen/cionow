
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { ChartServiceService } from '../../services/chart-service.service';
import { ChartImp } from '../../interface/charImp';

@Component({
  selector: 'app-cio-pie',
  templateUrl: './cio-pie.component.html',
  styleUrls: ['./cio-pie.component.scss']
})
export class CioPieComponent implements OnInit {
  // private options: EChartOption;
  private options: echarts.EChartOption;
  private pieInstance: echarts.ECharts;
  private OptionData = [{value: 1, name: 1}];
  private OptionLegend = [];
  //  = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       data: [820, 932, 901, 934, 1290, 1330, 1320],
  //       type: 'pie'
  //     }
  //   ]
  // };
  constructor(private chartService: ChartServiceService) {
    setTimeout(() => {this.options = {
      tooltip : {
        formatter: '{b} : {c} ({d}%)'
    },
      legend: {
        orient: 'vertical',
        left: 'right',
        data: this.OptionLegend
    },
      series: [

        {
          label: {
            normal: {
                formatter: '  {b}：  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                    a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                    },
                    // abg: {
                    //     backgroundColor: '#333',
                    //     width: '100%',
                    //     align: 'right',
                    //     height: 22,
                    //     borderRadius: [4, 4, 0, 0]
                    // },
                    hr: {
                        borderColor: '#aaa',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                    },
                    b: {
                        fontSize: 16,
                        lineHeight: 33
                    },
                    per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                    }
                }
            }
        },
          data: this.OptionData,
          type: 'pie'
        }
      ]
    };
  }, 100);
}

  ngOnInit() {
    const that = this;
    setTimeout(() => {
      that.pieInstance = echarts.getInstanceByDom(document.getElementById(
        'cioPie'
      ) as HTMLDivElement);
    }, 100);
    this.chartService.onResetChartPie.subscribe(chartOptions => {
      const chartOptionsArry = chartOptions as Array<ChartImp>;
      const map = {};
      const  dest = [];

      for (const ai of chartOptionsArry) {
        if(!map[ai.portfolioEid]){
            dest.push({
                id: ai.portfolioEid,
                data: [ai]
            });
            map[ai.portfolioEid] = ai;
        }
        else
        {
          for(const dj of dest)
          {
            if(dj.id === ai.portfolioEid){
                dj.data.push(ai);
                break;
            }
  
          }
  
        }
        }

      this.OptionData = [];
      dest.forEach(
        p => {
          let a = 0;
          p.data.forEach(element => {
            a = a + parseInt(element.hours);
          });
           this.OptionData.push({value:a,name:p.id});
           this.OptionLegend.push(p.id);
    }
  );
      this.pieInstance.clear();
      const chartSeries = this.options.series as echarts.EChartOption.Series;
      chartSeries[0].legend = this.OptionLegend;
      chartSeries[0].data = this.OptionData;
      this.pieInstance.setOption(this.options);
    });
  }
}
