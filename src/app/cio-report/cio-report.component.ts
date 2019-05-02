import { RequestBodyImp } from './../interface/requestBodyImp';
import { PositionImp } from './../interface/positionImp';
import { ChartServiceService } from './../services/chart-service.service';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import 'hammerjs';

@Component({
  selector: 'app-cio-report',
  templateUrl: './cio-report.component.html',
  styleUrls: ['./cio-report.component.scss']
})
export class CioReportComponent implements OnInit {
  public positionList = [];
  public positionMDList: PositionImp[] = [];
  public positionLeaderList: PositionImp[] = [];
  public positionManagerList: PositionImp[] = [];
  public positionPorfolioList: PositionImp[] = [];

  private selectedMD: PositionImp;
  private selectedLeader: PositionImp;
  private selectedManager: PositionImp;
  private selectedPorfolio: PositionImp;
  private currentPeriodModel: number;
  private currentPeriodStart: Date;
  private currentPeriodEnd: Date;

  constructor(private chartService: ChartServiceService) {}

  ngOnInit() {
    this.currentPeriodModel = 1;
    this.calculatePeriod();

    this.chartService.getDefaultLevel().subscribe(result => {
      this.positionList = result as [];
      for (const positionMDItem of this.positionList) {
        this.positionMDList.push({
          level: positionMDItem.level,
          eid: positionMDItem.eid
        } as PositionImp);
      }
      if (this.positionMDList.length > 0) {
        this.selectedMD = this.positionMDList[0];
      }
      this.buildLowerPositions(this.positionList[0]);
    });
  }

  private buildLowerPositions(selectedMD: any) {
    this.positionLeaderList = [];
    this.positionManagerList = [];
    this.positionPorfolioList = [];

    let defaultLeader: any;
    if (
      selectedMD &&
      selectedMD.lowerPositions &&
      selectedMD.lowerPositions.length > 0
    ) {
      defaultLeader = selectedMD.lowerPositions[0];
      for (const positionLeaderItem of selectedMD.lowerPositions) {
        this.positionLeaderList.push({
          level: positionLeaderItem.level,
          eid: positionLeaderItem.eid
        } as PositionImp);
      }

      if (this.positionLeaderList.length > 0) {
        this.selectedLeader = this.positionLeaderList[0];
      }
    }

    let defaultManager: any;
    if (
      defaultLeader &&
      defaultLeader.lowerPositions &&
      defaultLeader.lowerPositions.length > 0
    ) {
      defaultManager = defaultLeader.lowerPositions[0];
      for (const positionManagerItem of defaultLeader.lowerPositions) {
        this.positionManagerList.push({
          level: positionManagerItem.level,
          eid: positionManagerItem.eid
        } as PositionImp);
      }

      if (this.positionManagerList.length > 0) {
        this.selectedManager = this.positionManagerList[0];
      }
    }

    if (
      defaultManager &&
      defaultManager.lowerPositions &&
      defaultManager.lowerPositions.length > 0
    ) {
      defaultManager.lowerPositions.forEach(_ => {
        this.positionPorfolioList.push({
          level: _.level,
          eid: _.eid
        } as PositionImp);
      });
      if (this.positionPorfolioList.length > 0) {
        this.selectedPorfolio = this.positionPorfolioList[0];
      }
    }
  }

  changePosition(event: MatSelectChange) {
    if (event.value) {
      const selectedEid = event.value.eid;
      switch (event.value.level) {
        case 0: {
          this.selectedMD = event.value;
          const selectedMD = this.positionList.find(_ => _.eid === selectedEid);
          this.buildLowerPositions(selectedMD);
          break;
        }
        case 1: {
          this.selectedLeader = event.value;
          const selectedMD = this.positionList.find(
            _ => _.eid === this.selectedMD.eid
          );
          const selectedLeader = selectedMD.lowerPositions.find(
            _ => _.eid === selectedEid
          );

          let defaultManager: any;
          if (
            selectedLeader &&
            selectedLeader.lowerPositions &&
            selectedLeader.lowerPositions.length > 0
          ) {
            defaultManager = selectedLeader.lowerPositions[0];
            this.positionManagerList = [];
            selectedLeader.lowerPositions.forEach(_ => {
              this.positionManagerList.push({
                level: _.level,
                eid: _.eid
              } as PositionImp);
            });
          }

          if (defaultManager && defaultManager.lowerPositions) {
            this.positionPorfolioList = [];
            defaultManager.lowerPositions.forEach(_ => {
              this.positionPorfolioList.push({
                level: _.level,
                eid: _.eid
              } as PositionImp);
            });
          }

          break;
        }
        case 2: {
          this.selectedManager = event.value;
          const selectedMD = this.positionList.find(
            _ => _.eid === this.selectedMD.eid
          );
          const selectedLeader = selectedMD.lowerPositions.find(
            _ => _.eid === this.selectedLeader.eid
          );
          const selectedManager = selectedLeader.lowerPositions.find(
            _ => _.eid === this.selectedManager.eid
          );

          if (selectedManager && selectedManager.lowerPositions) {
            selectedManager.lowerPositions.forEach(_ => {
              this.positionPorfolioList.push({
                level: _.level,
                eid: _.eid
              } as PositionImp);
            });
          }

          break;
        }
        case 4: {
          this.selectedPorfolio = event.value;
          break;
        }
      }
    }
  }

  getChartByPosition() {
    const requestBody: RequestBodyImp = {
      mdEid: this.selectedMD.eid,
      leaderEid: this.selectedLeader.eid,
      managerEid: this.selectedManager.eid,
      portfolioEid: this.selectedPorfolio.eid,
      periodEnd: this.currentPeriodEnd.getTime(),
      periodStart: this.currentPeriodStart.getTime()
    };
    this.chartService.getChartByPositionAndPeriod(requestBody);
  }

  calculatePeriod() {
    switch (this.currentPeriodModel) {
      case 1: {
        // week
        if (this.currentPeriodEnd == null) {
          this.currentPeriodEnd = new Date();
        } else {
          this.currentPeriodEnd = new Date(this.currentPeriodEnd.getDate() - 7);
        }

        this.currentPeriodStart = new Date(this.currentPeriodEnd.getDate() - 7);
        break;
      }
      case 2: {
        // month
        if (this.currentPeriodEnd == null) {
          this.currentPeriodEnd = new Date();
        } else {
          const newEndTimeticks = this.currentPeriodEnd.setDate(
            this.currentPeriodEnd.getMonth() - 1
          );
          this.currentPeriodEnd = new Date(newEndTimeticks);
        }

        const newStartTimeticks = this.currentPeriodStart.setDate(
          this.currentPeriodStart.getMonth() - 1
        );
        this.currentPeriodStart = new Date(newStartTimeticks);
        break;
      }
      case 3: {
        // year
        if (this.currentPeriodEnd == null) {
          this.currentPeriodEnd = new Date();
        } else {
          const newEndTimeTicks = this.currentPeriodEnd.setFullYear(
            this.currentPeriodEnd.getFullYear() - 1
          );
          this.currentPeriodEnd = new Date(newEndTimeTicks);
        }

        const newStartTimeTicks = this.currentPeriodStart.setFullYear(
          this.currentPeriodStart.getFullYear() - 1
        );
        this.currentPeriodStart = new Date(newStartTimeTicks);
        break;
      }
    }
  }

  splitTimeAxis(value: number | null) {
    const selectedOne = document.getElementById(`timeModel_${value}`);
    selectedOne.parentNode.childNodes.forEach(_ => {
      const tempHtml = _ as HTMLElement;
      tempHtml.removeAttribute('style');
    });
    document
      .getElementById(`timeModel_${value}`)
      .setAttribute('style', 'background: #8bab68;');

    this.currentPeriodModel = value;
    switch (value) {
      case 1:
        return 'W';
      case 2:
        return 'M';
      case 3:
        return 'Y';
    }
    return 'W';
  }
}
