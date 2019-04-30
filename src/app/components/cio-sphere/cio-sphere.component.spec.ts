import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioSphereComponent } from './cio-sphere.component';

describe('CioSphereComponent', () => {
  let component: CioSphereComponent;
  let fixture: ComponentFixture<CioSphereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioSphereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioSphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
