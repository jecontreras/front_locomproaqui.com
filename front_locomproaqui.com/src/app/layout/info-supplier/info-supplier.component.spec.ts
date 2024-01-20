import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSupplierComponent } from './info-supplier.component';

describe('InfoSupplierComponent', () => {
  let component: InfoSupplierComponent;
  let fixture: ComponentFixture<InfoSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
