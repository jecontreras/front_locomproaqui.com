import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcrearguiaComponent } from './formcrearguia.component';

describe('FormcrearguiaComponent', () => {
  let component: FormcrearguiaComponent;
  let fixture: ComponentFixture<FormcrearguiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormcrearguiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormcrearguiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
