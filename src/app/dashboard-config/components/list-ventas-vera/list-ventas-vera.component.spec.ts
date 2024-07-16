import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVentasVeraComponent } from './list-ventas-vera.component';

describe('ListVentasVeraComponent', () => {
  let component: ListVentasVeraComponent;
  let fixture: ComponentFixture<ListVentasVeraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVentasVeraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVentasVeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
