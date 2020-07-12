import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../@core/publication/publication.service';

@Component({
  selector: 'app-new-publication',
  templateUrl: './new-publication.component.html',
  styleUrls: ['./new-publication.component.scss'],
})
export class NewPublicationComponent implements OnInit {
  name: string = 'my-publication';
  description: string = 'my-publication-description';
  subdomain: string = 'my-publication-subdomain';
  links: any;

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {}

  async createPublication(): Promise<void> {
    this.links = this.publicationService.createPublication({
      subdomain: this.subdomain,
      metadata: {
        name: this.name,
        description: this.description,
      },
    });
  }
}
