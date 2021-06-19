import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PnlpService } from '@app/@core/pnlp/pnlp.service';
import { Article } from '@app/model/article';
import { ArticleSummary, Publication } from '@app/model/publication';
import { from, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss'],
})
export class ArticleViewComponent implements OnInit {
  article$: Observable<Article>;
  publication$: Observable<Publication>;
  metadata$: Observable<ArticleSummary>;
  response$: Observable<{ article: Article; publication: Publication; author_alias: string }>;
  routeSubscription: Subscription;
  author_alias$: Observable<string>;
  isLoading = false;
  error: string;

  constructor(private pnlpService: PnlpService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const publicationId = params['publication_id'];
      const articleId = params['article_id'];
      this.isLoading = true;
      this.response$ = from(
        this.pnlpService.pnlpClient
          .getArticle(publicationId, articleId)
          .catch((err) => (this.error = err.message || err))
          .finally(() => (this.isLoading = false))
      );
      this.article$ = this.response$.pipe(map((r) => r.article));
      this.publication$ = this.response$.pipe(map((r) => r.publication));
      this.metadata$ = this.publication$.pipe(map((p) => p.articles[articleId]));
      this.author_alias$ = this.response$.pipe(map((r) => r.author_alias));
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
