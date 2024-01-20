import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDisbursementComponent } from './form-disbursement.component';

describe('FormDisbursementComponent', () => {
  let component: FormDisbursementComponent;
  let fixture: ComponentFixture<FormDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
