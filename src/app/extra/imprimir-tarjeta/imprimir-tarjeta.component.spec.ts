import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirTarjetaComponent } from './imprimir-tarjeta.component';

describe('ImprimirTarjetaComponent', () => {
  let component: ImprimirTarjetaComponent;
  let fixture: ComponentFixture<ImprimirTarjetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirTarjetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
