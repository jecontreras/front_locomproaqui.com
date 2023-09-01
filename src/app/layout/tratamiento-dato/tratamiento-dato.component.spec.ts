import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientoDatoComponent } from './tratamiento-dato.component';

describe('TratamientoDatoComponent', () => {
  let component: TratamientoDatoComponent;
  let fixture: ComponentFixture<TratamientoDatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TratamientoDatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TratamientoDatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
