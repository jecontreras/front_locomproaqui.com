import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecktComponent } from './checkt.component';

describe('ChecktComponent', () => {
  let component: ChecktComponent;
  let fixture: ComponentFixture<ChecktComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecktComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
