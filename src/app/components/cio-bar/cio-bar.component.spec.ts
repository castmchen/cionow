import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioBarComponent } from './cio-bar.component';

describe('CioBarComponent', () => {
  let component: CioBarComponent;
  let fixture: ComponentFixture<CioBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
