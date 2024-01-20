import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArticleStoreComponent } from './list-article-store.component';

describe('ListArticleStoreComponent', () => {
  let component: ListArticleStoreComponent;
  let fixture: ComponentFixture<ListArticleStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListArticleStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListArticleStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
