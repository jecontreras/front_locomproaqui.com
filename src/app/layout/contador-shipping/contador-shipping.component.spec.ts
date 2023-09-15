import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorShippingComponent } from './contador-shipping.component';

describe('ContadorShippingComponent', () => {
  let component: ContadorShippingComponent;
  let fixture: ComponentFixture<ContadorShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContadorShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContadorShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
