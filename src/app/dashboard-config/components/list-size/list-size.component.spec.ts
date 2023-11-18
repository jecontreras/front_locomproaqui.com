import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSizeComponent } from './list-size.component';

describe('ListSizeComponent', () => {
  let component: ListSizeComponent;
  let fixture: ComponentFixture<ListSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
