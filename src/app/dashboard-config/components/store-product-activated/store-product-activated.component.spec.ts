import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductActivatedComponent } from './store-product-activated.component';

describe('StoreProductActivatedComponent', () => {
  let component: StoreProductActivatedComponent;
  let fixture: ComponentFixture<StoreProductActivatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProductActivatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProductActivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
