import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioPieTypeComponent } from './cio-pie-type.component';

describe('CioPieTypeComponent', () => {
  let component: CioPieTypeComponent;
  let fixture: ComponentFixture<CioPieTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioPieTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioPieTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
