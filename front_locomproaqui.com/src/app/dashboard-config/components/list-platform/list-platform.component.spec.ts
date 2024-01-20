import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlatformComponent } from './list-platform.component';

describe('ListPlatformComponent', () => {
  let component: ListPlatformComponent;
  let fixture: ComponentFixture<ListPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
