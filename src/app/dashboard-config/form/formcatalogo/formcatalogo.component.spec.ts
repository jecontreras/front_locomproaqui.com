import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcatalogoComponent } from './formcatalogo.component';

describe('FormcatalogoComponent', () => {
  let component: FormcatalogoComponent;
  let fixture: ComponentFixture<FormcatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormcatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormcatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
