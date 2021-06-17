import { Component, OnInit } from '@angular/core';
import { PnlpService } from '@app/@core/pnlp/pnlp.service';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
})
export class PublicationListComponent implements OnInit {
  publicationList$: Observable<string[]>;
  error: any;

  constructor(private pnlpService: PnlpService) {}

  ngOnInit(): void {
    this.publicationList$ = from(this.pnlpService.pnlpClient.listPublications().catch((err) => (this.error = err)));
  }
}
