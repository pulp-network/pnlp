import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, Subscription } from 'rxjs';
import { PublicationService } from '../../@core/publication/publication.service';
import { Article } from '../../model/Article';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss'],
})
export class ArticleViewComponent implements OnInit {
  article$: Observable<Article>;
  routeSubscription: Subscription;
  error: string;

  constructor(private publicationService: PublicationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const publicationId = params['publication_id'];
      const articleId = params['article_id'];
      this.article$ = from(
        this.publicationService.getArticle(publicationId, articleId).catch((err) => (this.error = err))
      );
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
