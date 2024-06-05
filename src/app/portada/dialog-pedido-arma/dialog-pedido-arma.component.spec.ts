import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPedidoArmaComponent } from './dialog-pedido-arma.component';

describe('DialogPedidoArmaComponent', () => {
  let component: DialogPedidoArmaComponent;
  let fixture: ComponentFixture<DialogPedidoArmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPedidoArmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPedidoArmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
