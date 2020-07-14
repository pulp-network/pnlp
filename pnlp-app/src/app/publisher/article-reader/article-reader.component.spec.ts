import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleReaderComponent } from './article-reader.component';

describe('ArticleReaderComponent', () => {
  let component: ArticleReaderComponent;
  let fixture: ComponentFixture<ArticleReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleReaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
