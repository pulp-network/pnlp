import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PnlpService } from '@app/@core/pnlp/pnlp.service';
import { providers } from 'ethers';
import { from, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BlockchainService, PublicationRecord } from '../../@core/persistence/blockchain.service';
import { PreferencesService } from '../../@core/preferences/preferences.service';
import { Publication } from '../../model/publication';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit {
  routeSubscription: Subscription;
  queryParamSubscription: Subscription;
  publicationSlug: string;
  isLoading = false;
  isPending = false;
  error: string;
  transaction$: Observable<string>;
  publication$: Observable<Publication>;
  metadata$: Observable<PublicationRecord>;
  transactionReceipt$: Observable<providers.TransactionReceipt>;
  transactionHash$: Observable<string>; // for open transactions
  ipnsUrl$: Observable<string>;
  response$: Observable<{
    publication: Publication;
    metadata: PublicationRecord;
    author_alias_map: { [key: string]: string };
  }>;
  articles$: Observable<
    {
      slug: string;
      ipfs_address: string;
      author: string;
      alias: string;
      tx: string;
      subtitle: string;
      title: string;
      timestamp: string;
    }[]
  >;

  constructor(
    private pnlpService: PnlpService,
    private blockchainService: BlockchainService,
    private route: ActivatedRoute,
    private preferencesService: PreferencesService,
    private router: Router
  ) {}

  get etherscanDomain() {
    return environment.etherscanDomain;
  }

  get nerdMode$(): Observable<boolean> {
    return this.preferencesService.observablePreferences.pipe(map((p) => p.nerd_mode));
  }

  get pendingUrl(): Observable<string> {
    return this.transactionHash$.pipe(map((tx) => `https://${environment.etherscanDomain}/tx/${tx}`));
  }

  ngOnInit(): void {
    this.transactionHash$ = this.route.queryParams.pipe(map((p) => p['transaction']));

    this.routeSubscription = this.route.params.subscribe((params) => {
      this.queryParamSubscription = this.route.queryParams.subscribe((queryParams) => {
        this.publicationSlug = params['publication_id'];
        const transaction_param = queryParams['transaction'];

        if (transaction_param) {
          this.isPending = true;
          this.blockchainService.awaitTransaction(transaction_param).then((receipt) => {
            this.isPending = false;
            console.log(this.router.url.split('?')[0]);
            this.router.navigate([this.router.url.split('?')[0]]);
          });
        } else {
          console.debug('no transaction param, loading entities directly');
          this.loadEntities(this.publicationSlug);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  loadEntities(publicationSlug: string) {
    this.isLoading = true;
    this.response$ = from(
      this.pnlpService.pnlpClient
        .listArticles(this.publicationSlug)
        .catch((err) => {
          this.error = err?.message || err;
          console.error(err);
          return null;
        })
        .finally(() => (this.isLoading = false))
    );
    this.publication$ = this.response$.pipe(map((r) => r.publication));
    this.metadata$ = this.response$.pipe(map((r) => r.metadata));
    this.articles$ = this.response$.pipe(
      map((p) => {
        const articles = Object.entries(p.publication.articles).map(([slug, article]) => {
          return {
            slug: slug,
            ipfs_address: article.ipfs_address,
            tx: article.tx,
            subtitle: article.subtitle,
            title: article.title,
            timestamp: (article.timestamp as any) as string,
            author: article.author,
            alias: p.author_alias_map[article.author],
          };
        });
        if (articles) {
          articles.sort((a, b) => {
            return b.timestamp.localeCompare(a.timestamp);
          });
          return articles;
        } else {
          return [];
        }
      })
    );
    this.ipnsUrl$ = this.response$.pipe(
      map((r) => `https://${r.metadata.ipns_hash}.ipns.hub.textile.io/${r.publication.slug}`)
    );
  }
}
