import { RequestBodyImp } from './../interface/requestBodyImp';
import { PositionImp } from './../interface/positionImp';
import { ChartImp } from '../interface/charImp';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  public getChartByPositionAndPeriod(filterInfo: RequestBodyImp) {
    const targetUrl = `${this.baseUrl}/chart/filterbypositionandperiod`;
    return this.http.post(targetUrl, filterInfo, this.httpOptions);
  }

  public getLowerLevel(positionInfo: PositionImp) {
    const targetUrl = `${this.baseUrl}/getlowerlevel`;
    const params = new HttpParams({
      fromString: `level=${positionInfo.level}&eid=${positionInfo.eid}`
    });
    return this.http.get(targetUrl, { params });
  }

  public getDefaultLevel() {
    const targetUrl = `${this.baseUrl}/getDefaultlevel`;
    return this.http.get(targetUrl);
  }
}
