import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRechargeComponent } from './form-recharge.component';

describe('FormRechargeComponent', () => {
  let component: FormRechargeComponent;
  let fixture: ComponentFixture<FormRechargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRechargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
