import { PositionImp } from './../interface/positionImp';
import { ChartServiceService } from './../services/chart-service.service';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-cio-report',
  templateUrl: './cio-report.component.html',
  styleUrls: ['./cio-report.component.scss']
})
export class CioReportComponent implements OnInit {
  public positionList = [];
  public positionMDList: PositionImp[];
  public positionLeaderList: PositionImp[];
  public positionManagerList: PositionImp[];
  public positionPorfolioList: PositionImp[];

  private selectedMD: PositionImp;
  private selectedLeader: PositionImp;
  private selectedManager: PositionImp;
  private selectedPorfolio: PositionImp;

  constructor(private chartService: ChartServiceService) {}

  ngOnInit() {
    this.chartService.getDefaultLevel().subscribe(result => {
      this.positionList = result as [];
      for (const positionMDItem of this.positionList) {
        this.positionMDList.push({
          level: positionMDItem.level,
          eid: positionMDItem.eid
        } as PositionImp);
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
    }

    if (
      defaultManager &&
      defaultManager.lowerPositions &&
      defaultManager.lowerPositions.length > 0
    ) {
      defaultManager.forEach(_ => {
        this.positionPorfolioList.push({
          level: _.level,
          eid: _.eid
        } as PositionImp);
      });
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

  getChartByPosition() {}
}
