import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockchainService, PublicationRecord } from '../../@core/persistence/blockchain.service';
import { PreferencesService } from '../../@core/preferences/preferences.service';
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
  transaction$: Observable<string>;
  publication$: Observable<Publication>;
  metadata$: Observable<PublicationRecord>;
  ipnsUrl$: Observable<string>;
  response$: Observable<{ publication: Publication; metadata: PublicationRecord }>;
  articles$: Observable<
    {
      slug: string;
      ipfs_address: string;
      author: string;
      tx: string;
      title: string;
      timestamp: Date;
    }[]
  >;

  constructor(
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private blockchainService: BlockchainService,
    private preferencesService: PreferencesService
  ) {}

  get nerdMode$(): Observable<boolean> {
    return this.preferencesService.observablePreferences.pipe(map((p) => p.nerd_mode));
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.publicationSlug = params['publication_id'];
      this.isLoading = true;
      this.response$ = from(
        this.publicationService
          .listArticles(this.publicationSlug)
          .catch((err) => {
            this.error = err?.message || err;
            console.error(err);
            return null;
          })
          .finally(() => (this.isLoading = false))
      );

      const transaction_param = params['transaction'];

      if (transaction_param) {
        // TODO:AWAIT_TRANSACTION; not exactly sure if it should look like this or not.
        // this.transaction$ = from(this.blockchainService.awaitTransaction(optional_transaction));
      }
      this.publication$ = this.response$.pipe(map((r) => r.publication));
      this.metadata$ = this.response$.pipe(map((r) => r.metadata));
      this.articles$ = this.response$.pipe(
        map((p) => {
          return Object.entries(p.publication.articles).map(([slug, article]) => {
            return {
              slug: slug,
              ipfs_address: article.ipfs_address,
              tx: article.tx,
              title: article.title,
              timestamp: article.timestamp,
              author: article.author,
            };
          });
        })
      );
      this.ipnsUrl$ = this.response$.pipe(
        map((r) => `https://${r.metadata.ipns_hash.value}.ipns.hub.textile.io/${r.publication.slug}`)
      );
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
