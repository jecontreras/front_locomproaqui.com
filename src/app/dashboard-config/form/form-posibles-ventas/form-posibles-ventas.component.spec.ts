import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPosiblesVentasComponent } from './form-posibles-ventas.component';

describe('FormPosiblesVentasComponent', () => {
  let component: FormPosiblesVentasComponent;
  let fixture: ComponentFixture<FormPosiblesVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPosiblesVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPosiblesVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
