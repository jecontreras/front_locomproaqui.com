import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecktDialogComponent } from './checkt-dialog.component';

describe('ChecktDialogComponent', () => {
  let component: ChecktDialogComponent;
  let fixture: ComponentFixture<ChecktDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecktDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecktDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
