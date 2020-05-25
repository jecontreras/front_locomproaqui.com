import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormventasLiderComponent } from './formventas-lider.component';

describe('FormventasLiderComponent', () => {
  let component: FormventasLiderComponent;
  let fixture: ComponentFixture<FormventasLiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormventasLiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormventasLiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
