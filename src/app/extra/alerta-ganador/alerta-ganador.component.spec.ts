import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaGanadorComponent } from './alerta-ganador.component';

describe('AlertaGanadorComponent', () => {
  let component: AlertaGanadorComponent;
  let fixture: ComponentFixture<AlertaGanadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaGanadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaGanadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
