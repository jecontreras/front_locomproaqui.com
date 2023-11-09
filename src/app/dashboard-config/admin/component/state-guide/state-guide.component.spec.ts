import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateGuideComponent } from './state-guide.component';

describe('StateGuideComponent', () => {
  let component: StateGuideComponent;
  let fixture: ComponentFixture<StateGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
