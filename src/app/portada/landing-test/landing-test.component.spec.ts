import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTestComponent } from './landing-test.component';

describe('LandingTestComponent', () => {
  let component: LandingTestComponent;
  let fixture: ComponentFixture<LandingTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
