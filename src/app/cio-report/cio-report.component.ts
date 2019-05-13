import { RequestBodyImp } from './../interface/requestBodyImp';
import { PositionImp } from './../interface/positionImp';
import { ChartServiceService } from './../services/chart-service.service';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { map, filter } from 'rxjs/operators';
import 'hammerjs';
import { ChartImp } from './../interface/charImp';
import {LowerPosion} from './../interface/lowerposion';

@Component({
  selector: 'app-cio-report',
  templateUrl: './cio-report.component.html',
  styleUrls: ['./cio-report.component.scss']
})
export class CioReportComponent implements OnInit {
  public ws: WebSocket;
  public positionList = [];
  public lowerLevelList = [];
  public expample: PositionImp[] = [];
  public positionPorfolioList: PositionImp[] = [];
  public positionMDList: PositionImp[] = [];
  public positionLeaderList: PositionImp[] = [];
  public positionManagerList: PositionImp[] = [];
  public axisValue: PositionImp[] = [];
  public selectedEid: string;
  public selectedHour: string;
  public selectedDate: string;

  private selectedPorfolio: PositionImp;
  private selectedMD: PositionImp;
  private selectedLeader: PositionImp;
  private selectedManager: PositionImp;
  private currentPeriodModel: number;
  public allLowerPosion: Array<LowerPosion>;
  private currentPeriodStart: Date;
  private currentPeriodEnd: Date;
  private isLoadingFlag: boolean;
  private selectedTimeAxis: string;


  constructor(private chartService: ChartServiceService) {}

  ngOnInit() {
    this.isLoadingFlag = true;
    this.currentPeriodModel = 1;
    this.calculatePeriod();

    // this.chartService.getDefaultLevel().subscribe(result => {
    //   console.log(result);
    //   this.positionList = result as any[];
    //   console.log(this.positionList);
    //   for (const positionPorfolioItem of this.positionList) {
    //       this.positionPorfolioList.push({
    //         level: positionPorfolioItem.level,
    //         eid: positionPorfolioItem.eid
    //       } as PositionImp);
    //     }
    //   if (this.positionPorfolioList.length > 0) {
    //     this.selectedPorfolio = this.positionPorfolioList[0];
    //   }
    //   this.buildLowerPositions(this.positionList[0]);
    //   this.getChartByPosition();
    // });

    this.chartService.filterbypositionandperiod().pipe().subscribe(result => {
      let a = result as Array<ChartImp>;
      let bb = this.chartService.GetchartOptionsArry(a);
      this.chartService.triggerResetChartPie(result);
      this.chartService.triggerResetChart(result);
      bb.forEach(p => {
        this.positionPorfolioList.push({level: '0', eid: p.id} as PositionImp);
      });
      console.log(this.positionPorfolioList);
      this.isLoadingFlag = false;
    });

    this.connectWS();
    console.log(this.positionList);
  }

  connectWS() {
    if (this.ws != null) {
      this.ws.close();
    }
    this.ws = new WebSocket('ws://localhost:18000/realtime');
    const that = this;
    this.ws.onopen = event => {
      console.log('WS has connected successfully.');
    };

    this.ws.onmessage = event => {
      try {
        if (event.data) {
          console.log(event.data);
          const newChartOption = JSON.parse(event.data);
          if (
            that.selectedPorfolio.eid === newChartOption.portfolioEid &&
            that.selectedMD.eid === newChartOption.mdEid &&
            that.selectedLeader.eid === newChartOption.leaderEid &&
            that.selectedManager.eid === newChartOption.managerEid &&
            that.currentPeriodStart <= newChartOption.eventTime
          ) {
            that.chartService.triggerMonitorChart({
              automatica: newChartOption.hours,
              manual: 10,
              periodTime: newChartOption.eventTime
            });
          }
        }
      } catch (error) {
        console.error(
          `An error has been occured while getting WS data, Details: ${error}`
        );
      }
    };
    this.ws.onerror = event => {
      console.log(
        `An error has occured while connecting WS, Details: ${event}`
      );
    };
    this.ws.onclose = event => {
      console.log('WS connection has been closed.');
    };
  }

  private buildLowerPositions(selectedPorfolio: any) {
    this.positionMDList = [];
    this.positionLeaderList = [];
    this.positionManagerList = [];

    let defaultMD: any;
    if (
      selectedPorfolio &&
      selectedPorfolio.lowerPositions &&
      selectedPorfolio.lowerPositions.length > 0
    ) {
      defaultMD = selectedPorfolio.lowerPositions[0];
      for (const positionMDItem of selectedPorfolio.lowerPositions) {
        this.positionMDList.push({
          level: positionMDItem.level,
          eid: positionMDItem.eid
        } as PositionImp);
      }

      if (this.positionMDList.length > 0) {
        this.selectedMD = this.positionMDList[0];
      }
    }

    let defaultLeader: any;
    if (
      defaultMD &&
      defaultMD.lowerPositions &&
      defaultMD.lowerPositions.length > 0
    ) {
      defaultLeader = defaultMD.lowerPositions[0];
      for (const positionLeaderItem of defaultMD.lowerPositions) {
        this.positionLeaderList.push({
          level: positionLeaderItem.level,
          eid: positionLeaderItem.eid
        } as PositionImp);
      }

      if (this.positionLeaderList.length > 0) {
        this.selectedLeader = this.positionLeaderList[0];
      }
    }

    if (
      defaultLeader &&
      defaultLeader.lowerPositions &&
      defaultLeader.lowerPositions.length > 0
    ) {
      defaultLeader.lowerPositions.forEach(_ => {
        this.positionManagerList.push({
          level: _.level,
          eid: _.eid
        } as PositionImp);
      });
      if (this.positionManagerList.length > 0) {
        this.selectedManager = this.positionManagerList[0];
      }
    }

  }

  changeTimeAxis(event: MatSelectChange) {
    if (event.value) {
      const selectedTimeAxis = event.value;
      switch (event.value) {
        case 'hour': {
          // this.selectedHour = event.value;
          this.currentPeriodModel = 1;
          break;
        }
        case 'day': {
          // this.selectedDate = event.value;
          this.currentPeriodModel = 2;
          break;
        }
        case 'week': {
          // this.selectedWeek = event.value;
          this.currentPeriodModel = 3;
          break;
        }
        case 'month': {
          this.currentPeriodModel = 4;
          break;
        }
        case 'year': {
          this.currentPeriodModel = 5;
          break;
        }
      }
    }
    this.calculatePeriod();
  }

  changePosition(event: MatSelectChange) {
    if (event.value) {
      switch (event.value.level) {
        case '0': {
          this.allLowerPosion = [];
          this.positionMDList = [];
          this.positionLeaderList = [];
          this.positionManagerList = [];
          this.chartService.getLowerLevel(event.value as PositionImp).subscribe(result => {
            let vvv = result;
            this.allLowerPosion = result as Array<LowerPosion>;
            this.allLowerPosion.forEach(p => p.lowerPositions.forEach(i => {
              this.expample.push({
                level: '1',
                eid: i.eid
              });
            }));
            let aa = this.expample;
            const hash = {};
            aa = aa.reduce(function(item, next) {
              hash[next.eid] ? '' : hash[next.eid] = true && item.push(next);
              return item;
            }, []);
            this.positionMDList = aa;
            this.expample = [];
         }
        );
          break;
      }
      case '1': {
        this.positionLeaderList = [];
        this.positionManagerList = [];
        this.allLowerPosion.forEach(p => {
          if (p.eid === this.selectedPorfolio.eid) {
            p.lowerPositions.forEach(i => {
              if (i.eid === this.selectedMD.eid) {
                i.lowerPositions.forEach(q => {
                  this.expample.push({
                    level: '2',
                    eid: q.eid
                  });
                });
              }
            });
          }
        });
        let aa = this.expample;
        var hash = {};
        aa = aa.reduce(function(item, next) {
          hash[next.eid] ? '' : hash[next.eid] = true && item.push(next);
          return item;
        }, []);
        this.positionLeaderList = aa;
        this.expample = [];
        break;
      }
      case '2': {
        this.positionManagerList = [];
        this.allLowerPosion.forEach(p => {
          if (p.eid === this.selectedPorfolio.eid) {
            p.lowerPositions.forEach(i => {
              if (i.eid === this.selectedMD.eid) {
                i.lowerPositions.forEach(o => {
                 if (o.eid === this.selectedLeader.eid) {
                  o.lowerPositions.forEach(q => {
                    this.expample.push({
                      level: '4',
                      eid: q.eid
                    });
                  });
                }
              });
            }
          });
        }
      });
        let aa = this.expample;
        var hash = {};
        aa = aa.reduce(function(item, next) {
          hash[next.eid] ? '' : hash[next.eid] = true && item.push(next);
          return item;
        }, []);
        this.positionManagerList = aa;
        this.expample = [];
        break;
      }
    }
  }
}

  getChartByPosition() {
    this.isLoadingFlag = true;

    const requestBody: RequestBodyImp = {
        portfolioEid: this.selectedPorfolio.eid,
        mdEid: this.selectedMD.eid,
        leaderEid: this.selectedLeader.eid,
        managerEid: this.selectedManager.eid,
        periodEnd: this.currentPeriodEnd.getTime(),
        periodStart: this.currentPeriodStart.getTime()
    };
    console.log(requestBody);
    this.chartService
      .getChartByPositionAndPeriod(requestBody)
      .pipe(
        map(_ => {
          const chartArray = [];

          // let initPeriodEnd = this.currentPeriodEnd.getTime();
          // for (let i = 0; i < 7; i++) {
          //   const initTime = new Date(initPeriodEnd);
          //   const initDate = `${initTime.getFullYear()}/${initTime.getMonth() +
          //     1}/${initTime.getDate()}`;
          //   chartArray.push({
          //     periodTime: initDate,
          //     automaticValue: 0
          //   });
          //   initPeriodEnd -= 1000 * 60 * 60 * 24;
          // }

          chartArray.push({
            automaticValue: 0,
            eids: this.axisValue.length > 0 ? this.axisValue : this.positionPorfolioList
          });

          for (const chartInfo of _ as any) {
            console.log(chartInfo);
            // const existChart = chartArray.find(chartItem => {
            //   if (typeof chartItem !== 'undefined') {
            //     return chartItem.periodTime === callbackDate;
            //   }
            // });
            if (chartInfo) {
              // tslint:disable-next-line: radix
              if (
                chartInfo.eventTime >= this.currentPeriodStart.getTime() &&
                chartInfo.eventTime <= this.currentPeriodEnd.getTime()
              ) {
                chartArray.forEach(e => {
                  e.automaticValue += parseInt(chartInfo.hours, 10);
                });
              }
              // existChart.triggerTime = chartInfo.eventTime;
            } else {
              chartArray.push({
                automaticValue: chartInfo.hours,
                eidArray: this.axisValue
              });
            }
          }
          return chartArray;
        })
      )
      .subscribe(result => {
        this.chartService.triggerResetChart(result);
        this.isLoadingFlag = false;
      });
  }

  calculatePeriod() {
    switch (this.currentPeriodModel) {
      case 1: {
        // hour
        if (this.currentPeriodEnd == null) {
          this.currentPeriodEnd = new Date();
          const defaultTime = new Date();

          const defaultStartTimeticks = defaultTime.setHours(
            defaultTime.getHours() - 1
          );
          this.currentPeriodStart = new Date(defaultStartTimeticks);
        } else {
          const newEndTimeticks = this.currentPeriodEnd.setHours(
            this.currentPeriodEnd.getHours()
          );
          this.currentPeriodEnd = new Date(newEndTimeticks);

          const newStartTimeticks = this.currentPeriodStart.setHours(
            this.currentPeriodStart.getHours() - 1
          );
          this.currentPeriodStart = new Date(newStartTimeticks);
        }

        break;
      }
      case 2: {
        // day
        if (this.currentPeriodEnd == null) {
          this.currentPeriodEnd = new Date();
          const defaultTime = new Date();

          const defaultStartTimeticks = defaultTime.setDate(
            defaultTime.getDate() - 1
          );
          this.currentPeriodStart = new Date(defaultStartTimeticks);
        } else {
          const newEndTimeticks = this.currentPeriodEnd.setDate(
            this.currentPeriodEnd.getDate()
          );
          this.currentPeriodEnd = new Date(newEndTimeticks);

          const newStartTimeticks = this.currentPeriodStart.setDate(
            this.currentPeriodStart.getDate() - 1
          );
          this.currentPeriodStart = new Date(newStartTimeticks);
        }
        break;
      }
      case 3: {
        // week
        if (this.currentPeriodEnd == null) {
          this.currentPeriodEnd = new Date();
          const defaultTime = new Date();

          const defaultStartTimeticks = defaultTime.setDate(
            defaultTime.getDate() - 7
          );
          this.currentPeriodStart = new Date(defaultStartTimeticks);
        } else {
          const newEndTimeticks = this.currentPeriodEnd.setDate(
            this.currentPeriodEnd.getDate()
          );
          this.currentPeriodEnd = new Date(newEndTimeticks);

          const newStartTimeticks = this.currentPeriodStart.setDate(
            this.currentPeriodStart.getDate() - 7
          );
          this.currentPeriodStart = new Date(newStartTimeticks);
        }
        break;
      }
      case 4: {
        // month
        const newEndTimeticks = this.currentPeriodEnd.setDate(
          this.currentPeriodEnd.getMonth() - 1
        );
        this.currentPeriodEnd = new Date(newEndTimeticks);

        const newStartTimeticks = this.currentPeriodStart.setDate(
          this.currentPeriodStart.getMonth() - 1
        );
        this.currentPeriodStart = new Date(newStartTimeticks);
        break;
      }
      case 5: {
        // year
        const newEndTimeTicks = this.currentPeriodEnd.setFullYear(
          this.currentPeriodEnd.getFullYear() - 1
        );
        this.currentPeriodEnd = new Date(newEndTimeTicks);

        const newStartTimeTicks = this.currentPeriodStart.setFullYear(
          this.currentPeriodStart.getFullYear() - 1
        );
        this.currentPeriodStart = new Date(newStartTimeTicks);
        break;
      }
    }
    // this.transferHour =
  }
}
