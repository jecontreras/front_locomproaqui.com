import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTestimonioComponent } from './form-testimonio.component';

describe('FormTestimonioComponent', () => {
  let component: FormTestimonioComponent;
  let fixture: ComponentFixture<FormTestimonioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTestimonioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTestimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
