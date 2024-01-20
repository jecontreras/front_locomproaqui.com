import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentastableComponent } from './ventastable.component';

describe('VentastableComponent', () => {
  let component: VentastableComponent;
  let fixture: ComponentFixture<VentastableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentastableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentastableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
