import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCatalagoProveedorComponent } from './ver-catalago-proveedor.component';

describe('VerCatalagoProveedorComponent', () => {
  let component: VerCatalagoProveedorComponent;
  let fixture: ComponentFixture<VerCatalagoProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerCatalagoProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCatalagoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
