import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { EditorComponent } from './editor/editor.component';
import { NewPublicationComponent } from './new-publication/new-publication.component';
import { PublicationListComponent } from './publication-list/publication-list.component';

@NgModule({
  declarations: [
    EditorComponent,
    NewPublicationComponent,
    ArticleListComponent,
    PublicationListComponent,
    ArticleViewComponent,
  ],
  exports: [EditorComponent, NewPublicationComponent, ArticleListComponent, ArticleViewComponent],
  imports: [FormsModule, CommonModule, RouterModule],
})
export class PublisherModule {}
