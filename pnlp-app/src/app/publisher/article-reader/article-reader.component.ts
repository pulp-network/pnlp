import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PreferencesService } from '../../@core/preferences/preferences.service';
import { Article } from '../../model/Article';
import { ArticleSummary } from '../../model/Publication';

@Component({
  selector: 'app-article-reader',
  templateUrl: './article-reader.component.html',
  styleUrls: ['./article-reader.component.scss'],
})
export class ArticleReaderComponent implements OnInit {
  @Input() article: Article;
  @Input() summary?: ArticleSummary;
  @Input() preview: boolean;

  editorOptions = {
    showPreviewPanel: false,
    scrollPastEnd: 10,
    showBorder: false,
  };

  get nerdMode$(): Observable<boolean> {
    return this.preferencesService.observablePreferences.pipe(map((p) => p.nerd_mode));
  }

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {}
}
