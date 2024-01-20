import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormempresaComponent } from './formempresa.component';

describe('FormempresaComponent', () => {
  let component: FormempresaComponent;
  let fixture: ComponentFixture<FormempresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormempresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
