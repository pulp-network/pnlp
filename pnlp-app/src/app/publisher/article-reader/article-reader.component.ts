import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../model/Article';

@Component({
  selector: 'app-article-reader',
  templateUrl: './article-reader.component.html',
  styleUrls: ['./article-reader.component.scss'],
})
export class ArticleReaderComponent implements OnInit {
  @Input() article: Article;
  @Input() preview: boolean;

  editorOptions = {
    showPreviewPanel: false,
    scrollPastEnd: 10,
    showBorder: false,
  };

  constructor() {}

  ngOnInit(): void {}
}
