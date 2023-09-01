import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosGeneralesComponent } from './terminos-generales.component';

describe('TerminosGeneralesComponent', () => {
  let component: TerminosGeneralesComponent;
  let fixture: ComponentFixture<TerminosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
