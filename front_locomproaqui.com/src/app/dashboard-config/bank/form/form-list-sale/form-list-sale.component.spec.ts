import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListSaleComponent } from './form-list-sale.component';

describe('FormListSaleComponent', () => {
  let component: FormListSaleComponent;
  let fixture: ComponentFixture<FormListSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormListSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
