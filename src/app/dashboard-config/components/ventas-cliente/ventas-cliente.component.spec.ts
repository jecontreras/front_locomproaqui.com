import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasClienteComponent } from './ventas-cliente.component';

describe('VentasClienteComponent', () => {
  let component: VentasClienteComponent;
  let fixture: ComponentFixture<VentasClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
