import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSizeDialogComponent } from './select-size-dialog.component';

describe('SelectSizeDialogComponent', () => {
  let component: SelectSizeDialogComponent;
  let fixture: ComponentFixture<SelectSizeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSizeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
