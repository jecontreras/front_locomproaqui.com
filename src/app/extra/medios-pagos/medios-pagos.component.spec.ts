import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediosPagosComponent } from './medios-pagos.component';

describe('MediosPagosComponent', () => {
  let component: MediosPagosComponent;
  let fixture: ComponentFixture<MediosPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediosPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediosPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
