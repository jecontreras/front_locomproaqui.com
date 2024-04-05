import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosViewComponent } from './cursosView.component';

describe('CursosComponent', () => {
  let component: CursosViewComponent;
  let fixture: ComponentFixture<CursosViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
