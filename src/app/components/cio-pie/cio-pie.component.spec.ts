import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioPieComponent } from './cio-pie.component';

describe('CioPieComponent', () => {
  let component: CioPieComponent;
  let fixture: ComponentFixture<CioPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
