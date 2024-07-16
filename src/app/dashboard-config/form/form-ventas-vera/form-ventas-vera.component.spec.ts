import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVentasVeraComponent } from './form-ventas-vera.component';

describe('FormVentasVeraComponent', () => {
  let component: FormVentasVeraComponent;
  let fixture: ComponentFixture<FormVentasVeraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVentasVeraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVentasVeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
