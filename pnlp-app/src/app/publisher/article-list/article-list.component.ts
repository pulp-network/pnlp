import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListPathItem } from '@textile/buckets-grpc/buckets_pb';
import { from, Observable, Subscription } from 'rxjs';
import { BlockchainService } from '../../@core/persistence/blockchain.service';
import { PublicationService } from '../../@core/publication/publication.service';
import { Publication } from '../../model/Publication';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit {
  articleList$: Observable<{ publication: Publication; article_refs: ListPathItem.AsObject[] }>;
  routeSubscription: Subscription;
  publicationSlug: string;
  isLoading = false;
  error: string;
  transaction$: Observable<string>;

  constructor(
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private blockchainService: BlockchainService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.publicationSlug = params['publication_id'];
      this.isLoading = true;
      this.articleList$ = from(
        this.publicationService
          .listArticles(this.publicationSlug)
          .catch((err) => (this.error = err?.message || err))
          .finally(() => (this.isLoading = false))
      );

      const optional_transaction = params['transaction'];

      if (optional_transaction) {
        this.transaction$ = from(this.blockchainService.awaitTransaction(optional_transaction));
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
