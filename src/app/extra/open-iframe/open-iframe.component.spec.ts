import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenIframeComponent } from './open-iframe.component';

describe('OpenIframeComponent', () => {
  let component: OpenIframeComponent;
  let fixture: ComponentFixture<OpenIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
