import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogLocationComponent } from './alert-dialog-location.component';

describe('AlertDialogLocationComponent', () => {
  let component: AlertDialogLocationComponent;
  let fixture: ComponentFixture<AlertDialogLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDialogLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
