import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPlatformComponent } from './form-platform.component';

describe('FormPlatformComponent', () => {
  let component: FormPlatformComponent;
  let fixture: ComponentFixture<FormPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
