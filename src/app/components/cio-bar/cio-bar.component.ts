import { Component, OnInit, Input } from '@angular/core';
import { ChartServiceService } from '../../services/chart-service.service';
import * as echart from 'echarts';

@Component({
  selector: 'app-cio-bar',
  templateUrl: './cio-bar.component.html',
  styleUrls: [ './cio-bar.component.scss' ]
})
export class CioBarComponent implements OnInit {
  @Input() periodModel: string;
  positionLevel: any;
  barInstance: echart.ECharts;
  isShowFlag = false;
  itemStyle = {
    normal: {
    },
    emphasis: {
      barBorderWidth: 1,
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: 'rgba(0,0,0,0.5)'
    }
  };

  private dataContainer: any[];

  constructor(private chartService: ChartServiceService) {
  }



  ngOnInit() {
    this.chartService.onResetChart.subscribe(result => {
      this.isShowFlag = result && result.data.length;
      if (this.isShowFlag) {
        this.positionLevel = result.level;
        this.dataContainer = result.data;
        this.initBarChartForPerson();
      }
    });

    this.chartService.onMonitorChart.subscribe(result => {
      const existOne = this.dataContainer.find(_ => _.name === result.name);
      if (existOne) {
        existOne.group.push({ column: result.item });
      } else {
        this.dataContainer.push({ name: result.name, group: [ { column: result.item } ] });
      }

      const barOptions = this.barInstance.getOption();
      const chartSeries = barOptions.series as echarts.EChartOption.SeriesBar[];
      const xAxis = barOptions.xAxis as echarts.EChartOption.XAxis;

      const eventX = this.fn(new Date(result.item.eventTime))
      const exsitX = xAxis[0].data.find(x => x === eventX);
      if (exsitX) {
        if (barOptions.toolbox[ 0 ].feature.myTool1.title.indexOf('AutomationType') > -1) {
          // person
          const existSeries = chartSeries.find(_ => _.name === result.name);
          if (existSeries) {
            const newExistSeries = [];
            for (let item of existSeries.data) {
              if (item > 0) {
                item = parseFloat(item as any) + parseFloat(result.value);
              }
              newExistSeries.push(item);
            }
            existSeries.data = newExistSeries;
          } else {
            barOptions.legend[ 0 ].data.push(result.name);
            chartSeries.push({
              name: result.name,
              type: 'bar',
              stack: 'one',
              stackFlag: exsitX,
              itemStyle: this.itemStyle,
              barMaxWidth: 100,
              barWidth: 100,
              data: [ 0, 0, 0, 0, 0, 0, 0, parseFloat(result.value) ]
            } as echart.EChartOption.SeriesBar);
          }
        } else {
          // automation
          const existSeries = chartSeries.find(_ => _.name === result.item.automationType);
          if (existSeries) {
            (existSeries.data as any).push(result.value);
          } else {
            barOptions.legend[ 0 ].data.push(result.item.automationType);
            chartSeries.push({
              name: result.item.automationType,
              type: 'bar',
              stack: 'one',
              stackFlag: exsitX,
              itemStyle: this.itemStyle,
              barMaxWidth: 100,
              data: [ 0, 0, 0, 0, 0, 0, 0, parseFloat(result.value) ]
            } as echart.EChartOption.SeriesBar);
          }
        }
      } else {
        barOptions.toolbox[ 0 ].feature.myTool1.title.indexOf('AutomationType') > -1
        ? this.initBarChartForPerson() : this.initBarChartForAutomationType();
      }

      this.barInstance.setOption(barOptions);
    });
  }

  public initChart() {
    if (this.barInstance) {
      this.barInstance.clear();
      this.barInstance.dispose();
    }
    this.barInstance = echarts.init(document.getElementById('cioBar') as HTMLDivElement, 'macarons',
      {
        devicePixelRatio: window.devicePixelRatio,
        width: '1100',
        height: '710'
      });

    const self = this;
    return {
      legend: {
        left: '87%',
        icon: 'circle',
        orient: 'vertical',
        data: []
      },
      grid: {
        show: true,
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 0,
        width: '77%'
      },
      toolbox: {
        left: '3%',
        feature: {
          mark: { show: true },
          magicType: {
            title: { stack: 'Convert To Stack', tiled: 'Convert To Titled' },
            type: [ 'stack', 'tiled' ]
          },
          saveAsImage: { show: true, title: 'Download' },
          myTool1: {
            show: true,
            title: 'Convert To AutomationType',
            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: function () {
              const toolBoxInfo = this;
              return self.changeDataModel(toolBoxInfo.model.option.title);
            }
          }
        }
      },
      tooltip: {},
      xAxis: {
        name: 'X Axis',
        silent: true,
        axisLine: { onZero: false },
        splitLine: { show: false },
        splitArea: { show: false },
        data: []
      },
      yAxis: {
        inverse: false,
        splitArea: { show: false },
        type: 'value',
        axisLabel: {
          formatter: '{value} hours'
        }
      },
      series: [
      ]
    } as echart.EChartOption;
  }

  private fn(now: Date) {
    let y = now.getFullYear();
    let m = now.getMonth();
    let d = now.getDate();
    let h: string | number = now.getHours();
    let mm = now.getMinutes();
    let s = now.getSeconds();
    let str;
    if (h > 12) {
      h -= 12;
      str = 'PM';
    } else {
      str = 'AM';
    }

    if (h < 10) {
      h = '0' + h;
    }
    // h = h < 10 ? "0" + h : h;
    // d = d < 10 ? "0" + d : d;
    // m = m < 10 ? "0" + m : m;
    // mm = mm < 10 ? "0" + mm : mm;
    // s = s < 10 ? "0" + s : s;
    // const xy = y + "/" + m + "/" + d + "," + h + ":" + mm + ":" + s;
    // xy += str;

    return `${ h } ${ str }`;
  };

  public buildBarChartData(isAutomationType) {
    let tempEidKey = '';
    switch (this.positionLevel) {
      case 1:
        tempEidKey = 'mdEid';
        break;
      case 2:
        tempEidKey = 'leaderEid';
        break;
      case 3:
        tempEidKey = 'managerEid';
        break;
      case 4:
        tempEidKey = 'managerEid';
        break;
    }
    const tempArray = [];
    for (const item of this.dataContainer) {
      for (const groupItem of item.group) {
        if (isAutomationType) {
          tempArray.push({ key: groupItem.column.automationType, value: groupItem.column });
        } else {
          for (const columnKey of Object.keys(groupItem.column)) {
            if (tempEidKey === columnKey) {
              tempArray.push({ key: groupItem.column[ tempEidKey ], value: groupItem.column });
              break;
            }
          }
        }
      }
    }

    const newTimeArray = [];
    const timeXForDisplay = [];
    const currentDateTime = new Date();
    const currentTime = currentDateTime.getTime();

    switch (this.periodModel) {
      case '1':
        for (let i = 7; i >= 0; i--) {
          const currentDate = new Date(currentTime - 10800000 * i);
          timeXForDisplay.push(this.fn(currentDate));
          const newTimeItem = [];
          for (const tempMapItem of tempArray) {
            const tempItem = tempMapItem.value;
            if (i === 0 && tempItem.eventTime <= currentTime && new Date(tempItem.eventTime).getHours() >= currentDateTime.getHours()) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            } else if (i === 1
              && tempItem.eventTime > currentTime - 10800000
              && tempItem.eventTime <= currentTime
              && new Date(tempItem.eventTime).getHours() < currentDateTime.getHours()) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            } else if (i > 1 && tempItem.eventTime > currentTime - 10800000 * i
              && tempItem.eventTime <= currentTime - 10800000 * (i - 1)) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            }
          }
          newTimeArray.push(newTimeItem);
        }
        break;
      case '2':
        for (let i = 2; i >= 0; i--) {
          const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate() - i,
            currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds());
          timeXForDisplay.push(`${ currentDate.getMonth() }/${ currentDate.getDate() }`);
          const newTimeItem = [];
          for (const tempMapItem of tempArray) {
            const tempItem = tempMapItem.value;
            if (tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - i,
              currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
                currentDateTime.getDate() - i + 1, currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            }
          }
          newTimeArray.push(newTimeItem);
        }
        break;
      case '3':
        for (let i = 6; i >= 0; i--) {
          const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate() - i,
            currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds());
          timeXForDisplay.push(`${currentDate.getMonth() }/${ currentDate.getDate() }`);
          const newTimeItem = [];
          for (const tempMapItem of tempArray) {
            const tempItem = tempMapItem.value;
            if (tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - (i + 1),
              currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
                currentDateTime.getDate() - i, currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            }
          }
          newTimeArray.push(newTimeItem);
        }
        break;
      case '4':
        for (let i = 3; i >= 0; i--) {
          // const currentDate = i === 0 ? new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate(),
          //   currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()) :
          //   new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate() - i * 7,
          //     currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds());
          const weekStr = i > 0 ? i === 1 ? '1 Week Ago' : i + 'Weeks Ago' : 'Now';
          timeXForDisplay.push(weekStr);
          const newTimeItem = [];
          for (const tempMapItem of tempArray) {
            const tempItem = tempMapItem.value;
            if (i === 0 &&
              tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - 7,
                currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
                currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {

            } else if (tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
              currentDateTime.getDate() - i * 7,
              currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
                currentDateTime.getDate() - (i * 7 - 7), currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            }
          }
          newTimeArray.push(newTimeItem);
        }
        break;
      case '5':
        for (let i = 5; i >= 0; i--) {
          const currentDate = i === 0 ? new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1,
            currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()) :
            new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - i + 1, currentDateTime.getDate(),
              currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds());
          timeXForDisplay.push(`${ currentDate.getMonth() === 0 ?
            12 : currentDate.getMonth() }/${  currentDate.getDate()}/${ currentDate.getFullYear() }`);
          const newTimeItem = [];
          for (const tempMapItem of tempArray) {
            const tempItem = tempMapItem.value;
            if (i === 0 &&
              tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(),
                currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1,
                currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {

            } else if (tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - i,
              currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - i + 1,
                currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            }
          }
          newTimeArray.push(newTimeItem);
        }
        break;
      case '6':
        for (let i = 11; i >= 0; i--) {
          const currentDate = i === 0 ? new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1,
            currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()) :
            new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - i + 1, currentDateTime.getDate(),
              currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds());
          timeXForDisplay.push(`${ currentDate.getMonth() === 0 ?
            12 : currentDate.getMonth() }/${ currentDate.getDate() }`);
          const newTimeItem = [];
          for (const tempMapItem of tempArray) {
            const tempItem = tempMapItem.value;
            if (i === 0 &&
              tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(),
                currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1,
                currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {

            } else if (tempItem.eventTime > new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - i,
              currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(), currentDateTime.getSeconds()).getTime()
              && tempItem.eventTime <= new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - i + 1,
                currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes(),
                currentDateTime.getSeconds())) {
              newTimeItem.push({ key: tempMapItem.key, value: tempItem.hours });
            }
          }
          newTimeArray.push(newTimeItem);
        }
        break;

      default:
        break;
    }

    const newSeriesArray = [];
    const newLegendArray = [];
    newTimeArray.forEach((newArray, index) => {
      newArray.forEach(newItem => {
        const seriesIndex = newSeriesArray.findIndex(_ => _.name === newItem.key && _.stackFlag === timeXForDisplay[ index ]);
        if (seriesIndex > -1) {
          newSeriesArray[ seriesIndex ].data[ 0 ] += parseFloat(newItem.value);
        } else {
          if (newLegendArray.indexOf(newItem.key) === -1) {
            newLegendArray.push(newItem.key);
          }
          newSeriesArray.push({
            name: newItem.key,
            type: 'bar',
            stack: 'one',
            stackFlag: timeXForDisplay[ index ],
            itemStyle: this.itemStyle,
            barMaxWidth: 100,
            data: [ parseFloat(newItem.value) ]
          });
        }
      });
    });

    for (let i = 0; i < timeXForDisplay.length; i++) {
      const existSeries = newSeriesArray.filter(_ => _.stackFlag === timeXForDisplay[ i ]);
      if (existSeries) {
        for (let j = 0; j < timeXForDisplay.length; j++) {
          if (j < i) {
            existSeries.map(existItem => existItem.data.unshift(0));
          } else if (j > i) {
            existSeries.map(existItem => existItem.data.push(0));
          }
        }
      }
    }

    return { xAxis: timeXForDisplay, legend: newLegendArray, series: newSeriesArray };
  }

  public initBarChartForPerson() {
    const barOptions = this.initChart();
    const xAxis = barOptions.xAxis as echart.EChartOption.XAxis;
    const chartSeries = barOptions.series as any[];
    const customToolBox = (barOptions.toolbox as any).feature.myTool1;
    if (customToolBox) {
      customToolBox.title = 'Convert To AutomationType';
    }

    if (this.positionLevel) {
      const newData = this.buildBarChartData(false);
      xAxis.data = newData.xAxis;
      xAxis.name = 'Time';
      (barOptions.legend as any).data = newData.legend;
      barOptions.series = newData.series;
    } else {
      xAxis.data = this.dataContainer.map(_ => _.name);
      xAxis.name = 'Organization/Group';
      for (const item of this.dataContainer) {
        const tempColumArray = [];
        for (const groupItem of item.group) {
          const tempInfo = tempColumArray.find(_ => _.type === groupItem.column.automationType);
          if (tempInfo) {
            tempInfo.value += parseFloat(groupItem.column.hours);
          } else {
            tempColumArray.push({ type: groupItem.column.automationType, value: parseFloat(groupItem.column.hours) });
          }
        }

        tempColumArray.forEach((_, index) => {
          const chartIndex = chartSeries.findIndex(p => p.name === _.type && p.stackFlag === p.name);
          if (chartIndex > -1) {
            (chartSeries[ chartIndex ] as any).data.push(_.value);
          } else {
            (barOptions.legend as any).data.push(_.type);
            chartSeries.push({
              name: _.type,
              type: 'bar',
              stack: 'one',
              stackFlag: item.name,
              itemStyle: this.itemStyle,
              barMaxWidth: 100,
              data: [[item.name,_.value] ]
            });
          }
        });
      }
    }

    this.barInstance.setOption(barOptions);
  }

  public initBarChartForAutomationType() {
    const barOptions = this.initChart();
    const xAxis = barOptions.xAxis as echart.EChartOption.XAxis;
    const customToolBox = (barOptions.toolbox as any).feature.myTool1;
    if (customToolBox) {
      customToolBox.title = 'Convert To PersonType';
    }

    if (this.positionLevel) {
      const newData = this.buildBarChartData(true);
      xAxis.data = newData.xAxis;
      xAxis.name = 'Time';
      (barOptions.legend as any).data = newData.legend;
      barOptions.series = newData.series;
    } else {
      const tempArray = [];
      const tempXArray = [];
      const tempLegendArray = [];
      for (const item of this.dataContainer) {
        for (const groupItem of item.group) {
          const currentColumn = groupItem.column;
          const existInfo = tempArray.find(_ => _.eid === currentColumn.portfolioEid);
          if (existInfo) {
            existInfo.typeGroup.push(currentColumn);
          } else {
            tempArray.push({
              eid: currentColumn.portfolioEid,
              typeGroup: [ currentColumn ]
            });
          }
        }
      }


      for (const item of tempArray) {
        if (tempLegendArray.indexOf(item.eid) < 0) {
          tempLegendArray.push(item.eid);
        }
        for (const typeItem of item.typeGroup) {
          if (tempXArray.indexOf(typeItem.automationType) < 0) {
            tempXArray.push(typeItem.automationType as string);
          }
          const existInfo = (barOptions.series as any).find(_ => _.name === typeItem.portfolioEid && _.stackFlag === typeItem.automationType);
          if (existInfo) {
            if (existInfo.stackFlag === typeItem.automationType) {
              existInfo.data[ 0 ] = parseFloat(existInfo.data[ 0 ]) + parseFloat(typeItem.hours);
            }
          } else {
            barOptions.series.push({
              name: item.eid,
              type: 'bar',
              stack: 'one',
              stackFlag: typeItem.automationType,
              itemStyle: this.itemStyle,
              barMaxWidth: 100,
              data: [ parseFloat(typeItem.hours) ]
            } as echart.EChartOption.SeriesBar);
          }
        }
      }

      for (let i = 0; i < tempXArray.length; i++) {
        const existSeries = barOptions.series.find(_ => (_ as any).stackFlag === tempXArray[ i ]) as any;
        if (existSeries) {
          for (let j = 0; j < tempXArray.length; j++) {
            if (j < i) {
              existSeries.data.unshift(0);
            } else if (j > i) {
              existSeries.data.push(0);
            }
          }
        }
      }

      xAxis.name = 'Automation Type';
      xAxis.data = tempXArray;
      (barOptions.legend as any).data = tempLegendArray;
    }

    this.barInstance.setOption(barOptions);
  }

  public changeDataModel(currentType: string) {
    if (currentType.indexOf('AutomationType') > -1) {
      this.initBarChartForAutomationType();
    } else {
      this.initBarChartForPerson();
    }
  }
}
