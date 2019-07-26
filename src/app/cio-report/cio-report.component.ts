import { environment } from './../../environments/environment';
import { PositionImp } from './../interface/positionImp';
import { ChartServiceService } from './../services/chart-service.service';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import 'hammerjs';
import { ChartImp } from './../interface/charImp';
import { LowerPositions } from '../interface/lowerPosion';

@Component({
  selector: 'app-cio-report',
  templateUrl: './cio-report.component.html',
  styleUrls: [ './cio-report.component.scss' ]
})
export class CioReportComponent implements OnInit {
  public ws: WebSocket;
  public positionPortfolioList: PositionImp[] = [];
  public positionMDList: PositionImp[] = [];
  public positionLeaderList: PositionImp[] = [];
  public positionManagerList: PositionImp[] = [];
  public positionCache: LowerPositions[] = [];

  public selectedPortfolio: PositionImp = null;
  public selectedMD: PositionImp = null;
  public selectedLeader: PositionImp = null;
  public selectedManager: PositionImp = null;
  public currentPeriodModel: string;
  public currentPeriodStart: number;
  public currentPeriodEnd: number;
  public isLoadingFlag: boolean;

  constructor(private chartService: ChartServiceService) { }

  ngOnInit() {
    this.isLoadingFlag = true;

    this.setupPeriod();
    this.chartService.getDefaultLevel().subscribe(result => {
      this.positionCache = result as LowerPositions[];
      for (const positionPortfolioItem of this.positionCache) {
        this.positionPortfolioList.push({
          level: positionPortfolioItem.level,
          eid: positionPortfolioItem.eid
        } as PositionImp);
      }
    });
    this.chartService.filterbypositionandperiod().subscribe(result => {
      this.isLoadingFlag = false;
      if (result !== 'fail') {
        this.setupChartData(result as Array<ChartImp>);
      }
    });

    this.connectWS();
  }

  onClearPositionClick(event) {
    switch (event.level) {
      case 0:
        this.selectedPortfolio = this.selectedMD = this.selectedLeader = this.selectedManager = null;
        this.positionMDList = this.positionLeaderList = this.positionManagerList = [];
        break;
      case 1:
        this.selectedMD = this.selectedLeader = this.selectedManager = null;
        this.positionLeaderList = this.positionManagerList = [];
        break;
      case 2:
        this.selectedLeader = this.selectedManager = null;
        this.positionManagerList = [];
        break;
      case 3:
        this.selectedManager = null;
        this.positionManagerList = [];
        break;
      case 4:
        this.selectedManager = null;
        break;
      default:
        break;
    }
    this.getChartByPosition();
  }

  onCurrentPeriodClick() {
    this.currentPeriodModel = '1';
    this.getChartByPosition();
  }

  connectWS() {
    const that = this;
    if (this.ws != null) {
      this.ws.close();
    }
    this.ws = new WebSocket(environment.wsUrl);
    this.ws.onopen = event => {
      console.log('WS has connected successfully.');
    };

    this.ws.onmessage = event => {
      try {
        if (event.data) {
          console.log('------------ An new data has been refreshed -----------');
          const newChartOption = JSON.parse(event.data);
          console.log(newChartOption);

          let isNeedRefresh =
            that.currentPeriodStart <= newChartOption.eventTime;
          const currentSelectedPositionLevel = that.checkCurrentPositionLevel();
          let tempEid = '';
          switch (currentSelectedPositionLevel) {
            case 0: {
              if (isNeedRefresh) {
                tempEid = newChartOption.portfolioEid;
              }
              break;
            }
            case 1: {
              isNeedRefresh =
                isNeedRefresh &&
                that.selectedPortfolio.eid === newChartOption.portfolioEid;
              if (isNeedRefresh) {
                tempEid = newChartOption.mdEid;
              }
              break;
            }
            case 2: {
              isNeedRefresh =
                isNeedRefresh &&
                (that.selectedPortfolio.eid === newChartOption.portfolioEid &&
                  that.selectedMD.eid === newChartOption.mdEid);
              if (isNeedRefresh) {
                tempEid = newChartOption.leaderEid;
              }
              break;
            }
            case 3: {
              isNeedRefresh =
                isNeedRefresh &&
                (that.selectedPortfolio.eid === newChartOption.portfolioEid &&
                  that.selectedMD.eid === newChartOption.mdEid &&
                  that.selectedLeader.eid === newChartOption.leaderEid);
              if (isNeedRefresh) {
                tempEid = newChartOption.managerEid;
              }
              break;
            }
            case 4: {
              isNeedRefresh =
                isNeedRefresh &&
                (that.selectedPortfolio.eid === newChartOption.portfolioEid &&
                  that.selectedMD.eid === newChartOption.mdEid &&
                  that.selectedLeader.eid === newChartOption.leaderEid &&
                  that.selectedManager.eid === newChartOption.managerEid);
              if (isNeedRefresh) {
                tempEid = newChartOption.clientName;
              }
              break;
            }
          }

          const eventTime = new Date(newChartOption.eventTime);
          const displayTime = this.currentPeriodModel === '1' ? eventTime.getHours() < 24
            ? `${ eventTime.getHours() }-${ eventTime.getHours() + 1 }` : `${ eventTime.getHours() }-0`
            : `${ (eventTime.getMonth() + 1) }-${ eventTime.getDate() }`;
          if (tempEid !== '' && this.currentPeriodModel === '1') {
            that.chartService.triggerMonitorChart({
              name: tempEid,
              value: newChartOption.hours,
              time: displayTime,
              item: newChartOption
            });
          }
        }
      } catch (error) {
        console.error(
          `An error has been occured while getting WS data, Details: ${ error }`
        );
      }
    };
    this.ws.onerror = event => {
      console.log(`An error has occured while connecting WS, Details: ${ event }`);
    };
    this.ws.onclose = event => {
      console.log('WS connection has been closed.');
    };
  }

  private checkCurrentPositionLevel() {
    let currentSelectedPositionLevel: number = null;
    if (this.selectedPortfolio == null) {
      currentSelectedPositionLevel = 0;
    } else if (this.selectedMD == null) {
      currentSelectedPositionLevel = 1;
    } else if (this.selectedLeader == null) {
      currentSelectedPositionLevel = 2;
    } else if (this.selectedManager == null) {
      currentSelectedPositionLevel = 3;
    } else {
      currentSelectedPositionLevel = 4;
    }
    return currentSelectedPositionLevel;
  }

  private setupChartData(callbackChartArray: Array<ChartImp>) {
    const currentSelectedPositionLevel = this.checkCurrentPositionLevel();
    if (currentSelectedPositionLevel == null) {
      return;
    }
    const newChartPositionArray = [];
    const newChartTypeArray = [];
    const newChartArray = { level: currentSelectedPositionLevel, data: [] };

    callbackChartArray.forEach(callbackChartItem => {
      let tempEid = '';
      switch (currentSelectedPositionLevel) {
        case 0: {
          tempEid = callbackChartItem.portfolioEid;
          break;
        }
        case 1: {
          tempEid = callbackChartItem.mdEid;
          break;
        }
        case 2: {
          tempEid = callbackChartItem.leaderEid;
          break;
        }
        case 3: {
          tempEid = callbackChartItem.managerEid;
          break;
        }
        case 4: {
          tempEid = callbackChartItem.clientName;
          break;
        }
      }

      // trigger position pie chart
      const existInfo = newChartPositionArray.find(
        newChartItem => newChartItem.name === tempEid
      );
      if (existInfo) {
        existInfo.value += parseFloat(callbackChartItem.hours);
      } else {
        newChartPositionArray.push({
          name: tempEid,
          value: parseFloat(callbackChartItem.hours)
        });
      }

      // trigger type pie chart
      const existTypeInfo = newChartTypeArray.find(
        newChartItem =>
          newChartItem.name ===
          callbackChartItem.automationType.toLocaleLowerCase()
      );

      const eventTime = new Date(callbackChartItem.eventTime);
      const displayTime = this.currentPeriodModel === '1' ? eventTime.getHours() < 24
        ? `${ eventTime.getHours() }-${ eventTime.getHours() + 1 }` : `${ eventTime.getHours() }-0`
        : `${ (eventTime.getMonth() + 1) }-${ eventTime.getDate() }`;
      if (existTypeInfo) {
        existTypeInfo.value += parseFloat(callbackChartItem.hours);
        if (existTypeInfo.group) {
          const existGroupInfo = existTypeInfo.group.find(_ => _.time === displayTime);
          if (existGroupInfo) {
            existGroupInfo.hours += parseFloat(callbackChartItem.hours);
          } else {
            existTypeInfo.group.push({ time: displayTime, hours: parseFloat(callbackChartItem.hours) });
          }
        }
      } else {
        const timeMap = [ { time: displayTime, hours: parseFloat(callbackChartItem.hours) } ];
        newChartTypeArray.push({
          name: callbackChartItem.automationType,
          value: parseFloat(callbackChartItem.hours),
          group: timeMap
        });
      }

      // group by tempEid and trigger bar chart
      const existGroup = newChartArray.data.find(_ => _.name === tempEid);
      if (existGroup) {
        existGroup.group.push({ column: callbackChartItem });
      } else {
        newChartArray.data.push({ name: tempEid, group: [ { column: callbackChartItem } ] });
      }
    });

    this.chartService.triggerResetPositionChartPie(newChartPositionArray);
    this.chartService.triggerResetTypeChartPie(newChartTypeArray);
    this.chartService.triggerResetChart(newChartArray);
  }

  private setupPeriod() {
    if (this.currentPeriodModel == null) {
      this.currentPeriodModel = '1';
    }

    const periodEndDate = new Date();
    this.currentPeriodEnd = periodEndDate.getTime();
    switch (this.currentPeriodModel) {
      case '1': {
        this.currentPeriodStart = new Date(
          periodEndDate.getFullYear(),
          periodEndDate.getMonth(),
          periodEndDate.getDate() - 1,
          periodEndDate.getHours(),
          periodEndDate.getMinutes(),
          periodEndDate.getSeconds()
        ).getTime();
        break;
      }
      case '2': {
        this.currentPeriodStart = new Date(
          periodEndDate.getFullYear(),
          periodEndDate.getMonth(),
          periodEndDate.getDate() - 3,
          periodEndDate.getHours(),
          periodEndDate.getMinutes(),
          periodEndDate.getSeconds()
        ).getTime();
        break;
      }
      case '3': {
        this.currentPeriodStart = new Date(
          periodEndDate.getFullYear(),
          periodEndDate.getMonth(),
          periodEndDate.getDate() - 7,
          periodEndDate.getHours(),
          periodEndDate.getMinutes(),
          periodEndDate.getSeconds()
        ).getTime();
        break;
      }
      case '4': {
        this.currentPeriodStart = new Date(
          periodEndDate.getFullYear(),
          periodEndDate.getMonth() - 1,
          periodEndDate.getDate(),
          periodEndDate.getHours(),
          periodEndDate.getMinutes(),
          periodEndDate.getSeconds()
        ).getTime();
        break;
      }
      case '5': {
        this.currentPeriodStart = new Date(
          periodEndDate.getFullYear(),
          periodEndDate.getMonth() - 6,
          periodEndDate.getDate(),
          periodEndDate.getHours(),
          periodEndDate.getMinutes(),
          periodEndDate.getSeconds()
        ).getTime();
        break;
      }
      case '6': {
        new Date(
          periodEndDate.getFullYear() - 1,
          periodEndDate.getMonth(),
          periodEndDate.getDate(),
          periodEndDate.getHours(),
          periodEndDate.getMinutes(),
          periodEndDate.getSeconds()
        ).getTime();
        break;
      }
      default: {
        this.currentPeriodStart = this.currentPeriodEnd;
      }
    }
  }

  private setupLowerPositions(
    positions: Array<LowerPositions>,
    currentSelectedInfo: PositionImp,
    outputList: PositionImp[]
  ) {
    if (positions[ 0 ].level === currentSelectedInfo.level) {
      positions.forEach(_ => {
        if (_.eid === currentSelectedInfo.eid) {
          _.lowerPositions.forEach(__ => {
            outputList.push({
              eid: __.eid,
              level: __.level
            } as PositionImp);
          });
        }
      });

      return outputList;
    } else {
      positions.forEach(_ => {
        outputList.concat(
          this.setupLowerPositions(
            _.lowerPositions,
            currentSelectedInfo,
            outputList
          )
        );
      });
      return outputList;
    }
  }

  changePosition(event: MatSelectChange) {
    const paramInfo = event.value as PositionImp;
    if (paramInfo) {
      this.isLoadingFlag = true;

      // const targetPositions = this.setupLowerPositions(
      //   this.positionCache,
      //   paramInfo,
      //   []
      // );

      // tslint:disable-next-line: radix
      switch (parseInt(paramInfo.level)) {
        case 0: {
          this.positionLeaderList = [];
          this.positionManagerList = [];
          this.selectedMD = null;
          this.selectedLeader = null;
          this.selectedManager = null;

          const targetPositions = [];
          this.positionCache.forEach(_ => {
            if (_.eid === paramInfo.eid) {
              _.lowerPositions.forEach(__ => {
                targetPositions.push({
                  eid: __.eid,
                  level: __.level
                } as PositionImp);
              });
            }
          });
          this.positionMDList = targetPositions;
          break;
        }
        case 1: {
          this.positionManagerList = [];
          this.selectedManager = null;
          this.selectedLeader = null;
          const targetPositions = [];
          this.positionCache.forEach(_ => {
            if (_.eid === this.selectedPortfolio.eid) {
              _.lowerPositions.forEach(__ => {
                if (__.eid === this.selectedMD.eid) {
                  __.lowerPositions.forEach(___ => {
                    targetPositions.push({
                      eid: ___.eid,
                      level: ___.level
                    } as PositionImp);
                  });
                }
              });
            }
          });
          this.positionLeaderList = targetPositions;
          break;
        }
        case 2: {
          const targetPositions = [];
          this.positionCache.forEach(_ => {
            if (_.eid === this.selectedPortfolio.eid) {
              _.lowerPositions.forEach(__ => {
                if (__.eid === this.selectedMD.eid) {
                  __.lowerPositions.forEach(___ => {
                    if (___.eid === this.selectedLeader.eid) {
                      ___.lowerPositions.forEach(____ => {
                        targetPositions.push({
                          eid: ____.eid,
                          level: ____.level
                        } as PositionImp);
                      });
                    }
                  });
                }
              });
            }
          });

          this.positionManagerList = targetPositions;
          break;
        }
      }

      this.getChartByPosition();
      this.isLoadingFlag = false;
    }
  }

  getChartByPosition() {
    this.isLoadingFlag = true;
    this.setupPeriod();
    const requestInfo: any = {
      periodEnd: this.currentPeriodEnd,
      periodStart: this.currentPeriodStart
    };
    if (this.selectedPortfolio) {
      requestInfo.portfolioEid = this.selectedPortfolio.eid;
    }
    if (this.selectedMD) {
      requestInfo.mdEid = this.selectedMD.eid;
    }
    if (this.selectedLeader) {
      requestInfo.leaderEid = this.selectedLeader.eid;
    }
    if (this.selectedManager) {
      requestInfo.managerEid = this.selectedManager.eid;
    }

    this.chartService
      .getChartByPositionAndPeriod(requestInfo)
      .subscribe(result => {
        const newChartArray = this.setupChartData(result as any);
        this.isLoadingFlag = false;
      });
  }
}
