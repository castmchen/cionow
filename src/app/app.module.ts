import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MateralModule } from './materal.module';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CioLineComponent } from './components/cio-line/cio-line.component';
import { CioPieComponent } from './components/cio-pie/cio-pie.component';
import { CioBarComponent } from './components/cio-bar/cio-bar.component';
import { CioSphereComponent } from './components/cio-sphere/cio-sphere.component';
import { CioReportComponent } from './cio-report/cio-report.component';
import { CioRunComponent } from './components/cio-run/cio-run.component';
import { CioDropdownComponent } from './controls/cio-dropdown/cio-dropdown.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { CioPieTypeComponent } from './components/cio-pie-type/cio-pie-type.component';

@NgModule({
  declarations: [
    AppComponent,
    CioLineComponent,
    CioPieComponent,
    CioBarComponent,
    CioSphereComponent,
    CioReportComponent,
    CioRunComponent,
    CioDropdownComponent,
    CioPieTypeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxEchartsModule,
    HttpClientModule,
    MateralModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
