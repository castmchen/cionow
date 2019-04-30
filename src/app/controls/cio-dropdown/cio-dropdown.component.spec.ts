import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioDropdownComponent } from './cio-dropdown.component';

describe('CioDropdownComponent', () => {
  let component: CioDropdownComponent;
  let fixture: ComponentFixture<CioDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
