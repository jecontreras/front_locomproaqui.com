import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosOrdenarComponent } from './productos-ordenar.component';

describe('ProductosOrdenarComponent', () => {
  let component: ProductosOrdenarComponent;
  let fixture: ComponentFixture<ProductosOrdenarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosOrdenarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosOrdenarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
