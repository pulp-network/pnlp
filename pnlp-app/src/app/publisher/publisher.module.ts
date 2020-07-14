import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleReaderComponent } from './article-reader/article-reader.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { EditorComponent } from './editor/editor.component';
import { NewArticleComponent } from './new-article/new-article.component';
import { NewPublicationComponent } from './new-publication/new-publication.component';
import { PublicationListComponent } from './publication-list/publication-list.component';

@NgModule({
  declarations: [
    EditorComponent,
    NewPublicationComponent,
    ArticleListComponent,
    PublicationListComponent,
    ArticleViewComponent,
    NewArticleComponent,
    ArticleReaderComponent,
  ],
  exports: [EditorComponent, NewPublicationComponent, ArticleListComponent, ArticleViewComponent, NewArticleComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LMarkdownEditorModule,
    MarkdownModule.forChild(),
  ],
})
export class PublisherModule {}
