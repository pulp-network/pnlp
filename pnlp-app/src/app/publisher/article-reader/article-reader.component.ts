import { Component, Input, OnInit } from '@angular/core';
import { Article } from '@app/model/entities/article';
import { ArticleSummary } from '@app/model/entities/publication';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PreferencesService } from '../../@core/preferences/preferences.service';

@Component({
  selector: 'app-article-reader',
  templateUrl: './article-reader.component.html',
  styleUrls: ['./article-reader.component.scss'],
})
export class ArticleReaderComponent implements OnInit {
  @Input() article: Article;
  @Input() summary?: ArticleSummary;
  @Input() author_alias?: string;
  @Input() preview: boolean;

  editorOptions = {
    showPreviewPanel: false,
    scrollPastEnd: 10,
    showBorder: false,
  };

  get etherscanDomain() {
    return environment.etherscanDomain;
  }

  get nerdMode$(): Observable<boolean> {
    return this.preferencesService.observablePreferences.pipe(map((p) => p.nerd_mode));
  }

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit(): void {}
}
