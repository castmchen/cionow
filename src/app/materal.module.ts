import { NgModule } from '@angular/core';
import {
  MatIconRegistry,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    BrowserAnimationsModule
  ]
})
export class MateralModule {
  constructor(private matIconRegistry: MatIconRegistry) {
    this.matIconRegistry.registerFontClassAlias('fa');
  }
}
