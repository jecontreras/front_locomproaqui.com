import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaymentDetailComponent } from './form-payment-detail.component';

describe('FormPaymentDetailComponent', () => {
  let component: FormPaymentDetailComponent;
  let fixture: ComponentFixture<FormPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
