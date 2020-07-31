import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicationService } from '../../@core/publication/publication.service';
import { Publication } from '../../model/Publication';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit {
  routeSubscription: Subscription;
  publicationSlug: string;
  isLoading = false;
  error: string;
  publication$: Observable<Publication>;
  articles$: Observable<
    {
      slug: string;
      ipfs_address: string;
      tx: string;
      title: string;
      timestamp: Date;
    }[]
  >;

  constructor(private publicationService: PublicationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.publicationSlug = params['publication_id'];
      this.isLoading = true;
      this.publication$ = from(
        this.publicationService
          .listArticles(this.publicationSlug)
          .catch((err) => {
            this.error = err?.message || err;
            console.error(err);
            return null;
          })
          .finally(() => (this.isLoading = false))
      );
      this.articles$ = this.publication$.pipe(
        map((p) => {
          return Object.entries(p.articles).map(([slug, article]) => {
            return {
              slug: slug,
              ipfs_address: article.ipfs_address,
              tx: article.tx,
              title: article.title,
              timestamp: article.timestamp,
            };
          });
        })
      );
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
