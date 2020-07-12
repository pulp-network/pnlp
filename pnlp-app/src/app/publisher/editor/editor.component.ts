import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../@core/publication/publication.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  selected_publication: string = 'my-publication-subdomain';
  title: string = 'my-1st-article-title';
  subtitle: string = 'my-1st-article-subtitle';
  content: string = 'my-1st-article-content';
  index: string = 'my-1st-article-index';
  links: any;

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {}

  public async publish() {
    this.links = await this.publicationService.createArticle(this.selected_publication, {
      index: this.index,
      content: {
        title: this.title,
        subtitle: this.subtitle,
        body: this.content,
      },
    });
  }
}
