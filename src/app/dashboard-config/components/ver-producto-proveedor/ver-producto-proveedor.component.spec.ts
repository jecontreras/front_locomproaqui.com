import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProductoProveedorComponent } from './ver-producto-proveedor.component';

describe('VerProductoProveedorComponent', () => {
  let component: VerProductoProveedorComponent;
  let fixture: ComponentFixture<VerProductoProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerProductoProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerProductoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
