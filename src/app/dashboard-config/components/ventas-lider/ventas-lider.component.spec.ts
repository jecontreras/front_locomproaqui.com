import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasLiderComponent } from './ventas-lider.component';

describe('VentasLiderComponent', () => {
  let component: VentasLiderComponent;
  let fixture: ComponentFixture<VentasLiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasLiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasLiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
