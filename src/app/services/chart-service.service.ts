import { RequestBodyImp } from './../interface/requestBodyImp';
import { PositionImp } from './../interface/positionImp';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {ChartImp} from '../interface/charImp';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };
  private baseUrl = 'http://localhost:18000';
  public onResetChart: EventEmitter<any> = new EventEmitter<any>();
  public onResetChartPie: EventEmitter<any> = new EventEmitter<any>();

  public onMonitorChart: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  public getChartByPositionAndPeriod(filterInfo: RequestBodyImp) {
    const targetUrl = `${this.baseUrl}/chart/filterbypositionandperiod`;
    return this.http.post(targetUrl, filterInfo, this.httpOptions);
  }

  public filterbypositionandperiod()
  {
    const targetUrl = `${this.baseUrl}/chart/filterbypositionandperiod`;
    return this.http.post(targetUrl, this.httpOptions);
  }

  public getLowerLevel(positionInfo: PositionImp) {
    const targetUrl = `${this.baseUrl}/getlowerlevel`;
    const params = new HttpParams({
      fromString: `level=${positionInfo.level}&eid=${positionInfo.eid}`
    });
    return this.http.get(targetUrl,  {params});
  }
  public getLowerLevelTwo() {
    const targetUrl = `http://localhost:18000/getlowerlevel`;
    const params = new HttpParams({
      fromString:`level=0&eid=lili.c.liu`
    });
    return this.http.get(targetUrl, {params});
  }

  public getDefaultLevel() {
    const targetUrl = `${this.baseUrl}/getDefaultlevel`;
    return this.http.get(targetUrl);
  }
  public getPeriodByModel(currentModel) {
    let timePeriod: any[] = [];
    switch (currentModel) {
      case 1: {
        timePeriod = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        break;
      }
      case 2: {
        timePeriod = ['First Week', 'Second Week', 'Third Week', 'Fourth Week'];
        break;
      }
      case 3: {
        timePeriod = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'July',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];
        break;
      }
    }
    return timePeriod;
  }

  public GetchartOptionsArry(chartOptionsArry:Array<ChartImp> )
  {
    var map = {},
    dest = [];
for(var i = 0; i < chartOptionsArry.length; i++){
    var ai = chartOptionsArry[i];
    if(!map[ai.portfolioEid]){
        dest.push({
            id: ai.portfolioEid,
            data: [ai]
        });
        map[ai.portfolioEid] = ai;
    }else{
        for(var j = 0; j < dest.length; j++){
            var dj = dest[j];
            if(dj.id == ai.portfolioEid){
                dj.data.push(ai);
                break;
            }
        }
    }
}
return dest;
  }


  public triggerResetChart(charOptions) {
    this.onResetChart.emit(charOptions);
  }

  public triggerResetChartPie(charOptions) {
    this.onResetChartPie.emit(charOptions);
  }
  public triggerMonitorChart(chartOption) {
    this.onMonitorChart.emit(chartOption);
  }
}
