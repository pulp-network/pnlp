import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityService } from '../../@core/identity/identity.service';
import { PublicationService } from '../../@core/publication/publication.service';
import { Article, ValidArticleSlug } from '../../model/Article';
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
  publicationSubdomain: string;
  isCreating = false;
  isLoading = false;
  previewArticle: Article;
  submissionError: string;
  loadingError: string;

  static MAX_SLUG_LENGTH = 48;
  static MIN_SLUG_LENGTH = 3;

  get slugError() {
    if (!this.articleForm) {
      return '';
    }
    return this.articleForm.controls.slugControl.hasError('pattern')
      ? 'no punctuation besides underscores and dashes please'
      : this.articleForm.controls.slugControl.hasError('maxlength')
      ? 'no more than 48 characters please'
      : this.articleForm.controls.slugControl.hasError('minlength')
      ? 'at least 3 characters please'
      : '';
  }

  get showSlugError() {
    return !this.articleForm.controls.slugControl.valid && this.articleForm.controls.slugControl.dirty;
  }

  get authorAlias$() {
    return this.identityService.observableIdentity.pipe(map((i) => i.ens_alias || i.ethereum_identity.value));
  }

  constructor(
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private identityService: IdentityService
  ) {}

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
          .catch((err) => (this.loadingError = err.message || err))
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
      slugControl: new FormControl('', [
        Validators.pattern(ValidArticleSlug),
        Validators.maxLength(NewArticleComponent.MAX_SLUG_LENGTH),
        Validators.minLength(NewArticleComponent.MIN_SLUG_LENGTH),
      ]),
    });
    this.titleSubscription = this.articleForm.controls.titleControl.valueChanges.subscribe((val) => {
      if (!this.articleForm.controls.slugControl.dirty) {
        const suggestedUrl = this.getSuggestedUrl(val);
        this.articleForm.controls.slugControl.setValue(suggestedUrl);
      }
    });
  }

  public async submit() {
    const article = this.mapFormToArticle();
    this.isCreating = true;
    this.submissionError = null;
    this.publicationService
      .createArticle(this.publicationSubdomain, article)
      .then((_) => {
        this.router.navigate(['pnlp', this.publicationSubdomain, article.slug]);
      })
      .catch((err) => (this.submissionError = err))
      .finally(() => (this.isCreating = false));
  }

  private mapFormToArticle(): Article {
    return {
      slug: this.articleForm.controls.slugControl.value,
      timestamp: new Date(),
      author: this.identityService.identity.value.ethereum_identity.value,
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

    const full_slug = `${datePrefix}-${titleSuffix}`;

    if (full_slug.length > NewArticleComponent.MAX_SLUG_LENGTH) {
      return full_slug.slice(0, NewArticleComponent.MAX_SLUG_LENGTH - 1);
    } else {
      return full_slug;
    }
  }
}
