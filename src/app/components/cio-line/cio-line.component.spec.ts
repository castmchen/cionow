import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioLineComponent } from './cio-line.component';

describe('CioLineComponent', () => {
  let component: CioLineComponent;
  let fixture: ComponentFixture<CioLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
