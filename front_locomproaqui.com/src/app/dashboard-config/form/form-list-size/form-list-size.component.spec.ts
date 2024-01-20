import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListSizeComponent } from './form-list-size.component';

describe('FormListSizeComponent', () => {
  let component: FormListSizeComponent;
  let fixture: ComponentFixture<FormListSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormListSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
