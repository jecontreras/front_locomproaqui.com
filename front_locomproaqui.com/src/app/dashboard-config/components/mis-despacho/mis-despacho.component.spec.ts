import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDespachoComponent } from './mis-despacho.component';

describe('MisDespachoComponent', () => {
  let component: MisDespachoComponent;
  let fixture: ComponentFixture<MisDespachoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisDespachoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
