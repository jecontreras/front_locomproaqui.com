import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGaleryLandingComponent } from './list-galery-landing.component';

describe('ListGaleryLandingComponent', () => {
  let component: ListGaleryLandingComponent;
  let fixture: ComponentFixture<ListGaleryLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGaleryLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGaleryLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
