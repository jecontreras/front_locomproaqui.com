import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingWhatsappComponent } from './landing-whatsapp.component';

describe('LandingWhatsappComponent', () => {
  let component: LandingWhatsappComponent;
  let fixture: ComponentFixture<LandingWhatsappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingWhatsappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
