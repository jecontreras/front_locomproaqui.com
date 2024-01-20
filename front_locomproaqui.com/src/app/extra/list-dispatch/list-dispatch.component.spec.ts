import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDispatchComponent } from './list-dispatch.component';

describe('ListDispatchComponent', () => {
  let component: ListDispatchComponent;
  let fixture: ComponentFixture<ListDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
