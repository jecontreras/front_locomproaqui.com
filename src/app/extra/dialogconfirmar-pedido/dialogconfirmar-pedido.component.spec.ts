import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogconfirmarPedidoComponent } from './dialogconfirmar-pedido.component';

describe('DialogconfirmarPedidoComponent', () => {
  let component: DialogconfirmarPedidoComponent;
  let fixture: ComponentFixture<DialogconfirmarPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogconfirmarPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogconfirmarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
