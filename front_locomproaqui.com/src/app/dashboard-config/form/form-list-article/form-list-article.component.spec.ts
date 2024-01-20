import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListArticleComponent } from './form-list-article.component';

describe('FormListArticleComponent', () => {
  let component: FormListArticleComponent;
  let fixture: ComponentFixture<FormListArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormListArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
