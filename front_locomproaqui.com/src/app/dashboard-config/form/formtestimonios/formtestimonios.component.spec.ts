import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormtestimoniosComponent } from './formtestimonios.component';

describe('FormtestimoniosComponent', () => {
  let component: FormtestimoniosComponent;
  let fixture: ComponentFixture<FormtestimoniosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormtestimoniosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormtestimoniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
