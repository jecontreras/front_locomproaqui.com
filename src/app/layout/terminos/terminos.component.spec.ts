import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosComponent } from './terminos.component';

describe('TerminosComponent', () => {
  let component: TerminosComponent;
  let fixture: ComponentFixture<TerminosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
