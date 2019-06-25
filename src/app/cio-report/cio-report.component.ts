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
  styleUrls: ['./cio-report.component.scss']
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

  constructor(private chartService: ChartServiceService) {}

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
      if (result != 'fail') {
        const charData = this.setupChartData(result as Array<ChartImp>);
        this.chartService.triggerResetChart(charData);
      }
    });

    this.connectWS();
  }

  connectWS() {
    const that = this;
    if (this.ws != null) {
      this.ws.close();
    }
    this.ws = new WebSocket('ws://cionowapi.azurewebsites.net/realtime');
    this.ws.onopen = event => {
      console.log('WS has connected successfully.');
    };

    this.ws.onmessage = event => {
      try {
        if (event.data) {
          console.log(
            '------------ An new data has been refreshed -----------'
          );
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

          if (tempEid !== '') {
            that.chartService.triggerMonitorChart({
              name: tempEid,
              value: newChartOption.hours
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
    const newChartArray = [];
    if (currentSelectedPositionLevel == null) {
      return newChartArray;
    }

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

      const existInfo = newChartArray.find(
        newChartItem => newChartItem.name === tempEid
      );
      if (existInfo) {
        existInfo.value += parseFloat(callbackChartItem.hours);
      } else {
        newChartArray.push({
          name: tempEid,
          value: parseFloat(callbackChartItem.hours)
        });
      }
    });

    return newChartArray;
  }

  private setupPeriod() {
    if (this.currentPeriodModel == null) {
      this.currentPeriodModel = '1';
    }

    const periodEndDate = new Date();
    this.currentPeriodEnd = periodEndDate.getTime();
    switch (this.currentPeriodModel) {
      case '1': {
        this.currentPeriodStart = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth(), periodEndDate.getDate() - 1,
         periodEndDate.getHours(), periodEndDate.getMilliseconds(), periodEndDate.getSeconds()).getTime();
        break;
      }
      case '2': {
        this.currentPeriodStart = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth(), periodEndDate.getDate() - 3,
        periodEndDate.getHours(), periodEndDate.getMilliseconds(), periodEndDate.getSeconds()).getTime();
        break;
      }
      case '3': {
        this.currentPeriodStart = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth(), periodEndDate.getDate() - 7,
        periodEndDate.getHours(), periodEndDate.getMilliseconds(), periodEndDate.getSeconds()).getTime();
        break;
      }
      case '4': {
        this.currentPeriodStart = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth() - 1, periodEndDate.getDate(),
        periodEndDate.getHours(), periodEndDate.getMilliseconds(), periodEndDate.getSeconds()).getTime();
        break;
      }
      case '5': {
        this.currentPeriodStart = new Date(periodEndDate.getFullYear(), periodEndDate.getMonth() - 6, periodEndDate.getDate(),
        periodEndDate.getHours(), periodEndDate.getMilliseconds(), periodEndDate.getSeconds()).getTime();
        break;
      }
      case '6': {
        new Date(periodEndDate.getFullYear() - 1, periodEndDate.getMonth(), periodEndDate.getDate(),
         periodEndDate.getHours(), periodEndDate.getMilliseconds(), periodEndDate.getSeconds()).getTime();
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
    if (positions[0].level === currentSelectedInfo.level) {
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
        this.chartService.triggerResetChart(newChartArray);

        this.isLoadingFlag = false;
      });
  }
}
