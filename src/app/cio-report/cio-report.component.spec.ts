import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioReportComponent } from './cio-report.component';

describe('CioReportComponent', () => {
  let component: CioReportComponent;
  let fixture: ComponentFixture<CioReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
