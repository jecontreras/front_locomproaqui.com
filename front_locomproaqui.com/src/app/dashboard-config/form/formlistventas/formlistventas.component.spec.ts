import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlistventasComponent } from './formlistventas.component';

describe('FormlistventasComponent', () => {
  let component: FormlistventasComponent;
  let fixture: ComponentFixture<FormlistventasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormlistventasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlistventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
