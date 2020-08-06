import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { PublicationService } from '../../@core/publication/publication.service';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
})
export class PublicationListComponent implements OnInit {
  publicationList$: Observable<string[]>;
  error: any;

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {
    this.publicationList$ = from(this.publicationService.listPublications().catch((err) => (this.error = err)));
  }
}
