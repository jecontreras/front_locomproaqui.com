import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonioComponent } from './testimonio.component';

describe('TestimonioComponent', () => {
  let component: TestimonioComponent;
  let fixture: ComponentFixture<TestimonioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestimonioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
