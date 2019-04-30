import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioRunComponent } from './cio-run.component';

describe('CioRunComponent', () => {
  let component: CioRunComponent;
  let fixture: ComponentFixture<CioRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
