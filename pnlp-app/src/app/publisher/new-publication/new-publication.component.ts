import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicationService } from '../../@core/publication/publication.service';
import { ValidPublicationSlug } from '../../model/Publication';

@Component({
  selector: 'app-new-publication',
  templateUrl: './new-publication.component.html',
  styleUrls: ['./new-publication.component.scss'],
})
export class NewPublicationComponent implements OnInit {
  publicationForm: FormGroup;
  submissionError: string;
  networkRequest = false;

  get slugError() {
    if (!this.publicationForm) {
      return '';
    }
    return this.publicationForm.controls.slugControl.hasError('pattern')
      ? 'lowercase letters and numbers only please'
      : this.publicationForm.controls.slugControl.hasError('maxlength')
      ? 'no more than 24 characters please'
      : this.publicationForm.controls.slugControl.hasError('minlength')
      ? 'at least 3 characters please'
      : '';
  }

  get showSlugError() {
    return !this.publicationForm.controls.slugControl.valid && this.publicationForm.controls.slugControl.dirty;
  }

  constructor(private publicationService: PublicationService, private router: Router) {}

  ngOnInit(): void {
    this.initializeFormGroup();
  }

  public initializeFormGroup() {
    this.publicationForm = new FormGroup({
      nameControl: new FormControl('', [Validators.required]),
      descriptionControl: new FormControl('', []),
      slugControl: new FormControl('', [
        Validators.pattern(ValidPublicationSlug),
        Validators.maxLength(24),
        Validators.minLength(3),
      ]),
    });
  }

  public async submit() {
    this.submissionError = null;
    this.networkRequest = true;
    const slug = this.publicationForm.controls.slugControl.value;
    this.publicationService
      .createPublication({
        slug,
        editor: 'TODO:get my ethereum address',
        founded: new Date(),
        name: this.publicationForm.controls.nameControl.value,
        description: this.publicationForm.controls.descriptionControl.value,
        articles: {},
      })
      .then((_) => {
        this.router.navigate(['pnlp', slug]);
      })
      .catch((err) => (this.submissionError = err.message || err))
      .finally(() => (this.networkRequest = false));
  }
}
