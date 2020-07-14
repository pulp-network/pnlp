import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, Subscription } from 'rxjs';
import { PublicationService } from '../../@core/publication/publication.service';
import { Article, ValidArticleIndex } from '../../model/Article';
import { Publication } from '../../model/Publication';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
})
export class NewArticleComponent implements OnInit {
  publication$: Observable<Publication>;
  routeSubscription: Subscription;
  titleSubscription: Subscription;
  articleForm: FormGroup;
  body: string;
  previewMode = false;
  editorOptions = {
    showPreviewPanel: false,
    showBorder: false,
    hideIcons: ['TogglePreview', 'Image'],
  };
  error: any;
  publicationSubdomain: string;
  isCreating = false;
  isLoading = false;
  previewArticle: Article;

  get indexError() {
    if (!this.articleForm) {
      return '';
    }
    return this.articleForm.controls.indexControl.hasError('pattern')
      ? 'no punctuation besides underscores and dashes please'
      : this.articleForm.controls.indexControl.hasError('maxlength')
      ? 'no more than 48 characters please'
      : this.articleForm.controls.indexControl.hasError('minlength')
      ? 'at least 3 characters please'
      : '';
  }

  get showIndexError() {
    return !this.articleForm.controls.indexControl.valid && this.articleForm.controls.indexControl.dirty;
  }

  constructor(private publicationService: PublicationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.routeSubscription = this.route.queryParamMap.subscribe((queryParams) => {
      this.publicationSubdomain = queryParams.get('publication');
      if (!this.publicationSubdomain) {
        this.router.navigate(['pnlp']);
      }
      this.isLoading = true;
      this.publication$ = from(
        this.publicationService
          .getPublication(this.publicationSubdomain)
          .catch((err) => (this.error = err))
          .finally(() => (this.isLoading = false))
      );
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  public togglePreviewMode() {
    this.previewMode = !this.previewMode;
    this.previewArticle = this.mapFormToArticle();
  }

  public initializeFormGroup() {
    this.articleForm = new FormGroup({
      titleControl: new FormControl('', [Validators.required]),
      subtitleControl: new FormControl('', []),
      indexControl: new FormControl('', [
        Validators.pattern(ValidArticleIndex),
        Validators.maxLength(48),
        Validators.minLength(3),
      ]),
    });
    this.titleSubscription = this.articleForm.controls.titleControl.valueChanges.subscribe((val) => {
      if (!this.articleForm.controls.indexControl.dirty) {
        const suggestedUrl = this.getSuggestedUrl(val);
        this.articleForm.controls.indexControl.setValue(suggestedUrl);
      }
    });
  }

  public async submit() {
    this.error = false;
    this.isCreating = true;
    const article = this.mapFormToArticle();
    this.publicationService
      .createArticle(this.publicationSubdomain, article)
      .then((_) => {
        this.router.navigate(['pnlp', this.publicationSubdomain, article.index]);
      })
      .catch((err) => (this.error = err))
      .finally(() => (this.isCreating = false));
  }

  private mapFormToArticle(): Article {
    return {
      index: this.articleForm.controls.indexControl.value,
      content: {
        title: this.articleForm.controls.titleControl.value,
        subtitle: this.articleForm.controls.subtitleControl.value,
        body: this.body,
      },
    };
  }

  private getSuggestedUrl(title: string): string {
    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() + offset * 60 * 1000);
    const datePrefix = today.toISOString().split('T')[0];
    const titleSuffix = title
      .trim()
      .toLowerCase()
      .replace(/[\.,-\/#!'$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '')
      .replace(/\s+/g, '-');
    return `${datePrefix}-${titleSuffix}`;
  }
}
