import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListPathItem } from '@textile/buckets-grpc/buckets_pb';
import { from, Observable, Subscription } from 'rxjs';
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
  error: string;

  constructor(private publicationService: PublicationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const publicationId = params['publication_id'];
      this.articleList$ = from(this.publicationService.listArticles(publicationId).catch((err) => (this.error = err)));
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
