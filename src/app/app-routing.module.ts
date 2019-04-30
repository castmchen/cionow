import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CioReportComponent } from './cio-report/cio-report.component';

const routes: Routes = [
  {
    path: 'home',
    component: CioReportComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
