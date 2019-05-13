import { Component, OnInit, Input } from '@angular/core';
import { ChartServiceService } from '../../services/chart-service.service';
import * as echartss from 'echarts';
import { ChartImp } from '../../interface/charImp';

@Component({
  selector: 'app-cio-bar',
  templateUrl: './cio-bar.component.html',
  styleUrls: ['./cio-bar.component.scss']
})
export class CioBarComponent implements OnInit {
  @Input() selectedValue: any;
  private options: echartss.EChartOption;
  private barInstance: echartss.ECharts;
  private OptionData = [{value: 1, name: 1}];
  private aaaa = [];
  private bbbb = [];

  constructor(private chartService: ChartServiceService) {
    setTimeout(() => {this.options = {
      title: {
        text: 'Comparison Bar',
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
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        // {
        //   type: 'category',
        //   boundaryGap: true,
        //   data: ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']
        // }
        {
          boundaryGap: true, // x轴数值顶头
          type: 'category',
          data: this.bbbb
          // axisLabel: {
          //   formatter: positionPorfolioList => {
          //     return positionPorfolioList;
          //   }
          // }
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
          data: this.aaaa,
          markPoint: {
            data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }]
          },
          markLine: {
            data: [{ type: 'average', name: 'Average' }]
          }
        }
      ]
    };
    }, 100);
  }

  ngOnInit() {
    const that = this;
    setTimeout(() => {
      that.barInstance = echartss.getInstanceByDom(document.getElementById(
        'cioBar'
      ) as HTMLDivElement);
    }, 100);

    this.chartService.onResetChart.subscribe(chartOption => {
      const chartOptionsArry = chartOption as Array<ChartImp>;
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
          this.OptionData.push({value: a, name: p.id});
    }
  );
      const chartSeries = this.options.series as echartss.EChartOption.Series;
      const xAxis = this.options.xAxis as echartss.EChartOption.Series;
      this.aaaa = [];
      this.bbbb = [];
      this.OptionData.forEach(p => {
        this.aaaa.push(p.value);
        this.bbbb.push(p.name);
      });
      chartSeries[0].data = this.aaaa;
      xAxis[0].data = this.bbbb;
      this.barInstance.setOption(this.options);
    });

    this.chartService.onMonitorChart.subscribe(chartOption => {
    //   const periodDate = new Date(chartOption.periodTime).toLocaleDateString();

    //   const currentXAxis = this.options.xAxis[0].data as any[];
    //   const currentIndex = currentXAxis.findIndex(_ => _ === periodDate);
    //   if (currentIndex > -1) {
    //     const chartSeries = this.options.series as echarts.EChartOption.Series;

    //     for (const index in chartSeries[0].data) {
    //       // tslint:disable-next-line: radix
    //       if (currentIndex === parseInt(index)) {
    //         chartSeries[0].data[currentIndex] += chartOption.automatica;
    //         break;
    //       }
    //     }

    //     this.barInstance.setOption(this.options);
    //   }
    // });
  // }
    const chartOptionsArry = chartOption as Array<ChartImp>;
    const map = {};
    const  dest = [];
    for (const ai of chartOptionsArry) {
      if (!map[ai.portfolioEid]) {
        dest.push({
          id: ai.portfolioEid,
          data: [ai]
        });
        map[ai.portfolioEid] = ai;
      } else {
        for (const dj of dest) {
          if (dj.id === ai.portfolioEid) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }

    this.OptionData = [];
    dest.forEach(p => {
      let a = 0;
      p.data.forEach(element => {
        a = a + parseInt(element.hours);
      });
      this.OptionData.push({value: a, name: p.id});
    }
  );
    this.barInstance.clear();
    const chartSeries = this.options.series as echarts.EChartOption.Series;
    const xAxis = this.options.xAxis as echarts.EChartOption.Series;
    const aaaa = [];
    const bbbb = [];
    this.OptionData.forEach(p => {
      aaaa.push(p.value);
      bbbb.push(p.name);
    });
    chartSeries[0].data = bbbb;
    xAxis[0].data = bbbb;
    this.barInstance.setOption(this.options);
  });
}
}
