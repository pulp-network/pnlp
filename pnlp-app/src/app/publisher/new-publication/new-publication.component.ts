import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicationService } from '../../@core/publication/publication.service';
import { ValidPublicationSubdomain } from '../../model/Publication';

@Component({
  selector: 'app-new-publication',
  templateUrl: './new-publication.component.html',
  styleUrls: ['./new-publication.component.scss'],
})
export class NewPublicationComponent implements OnInit {
  publicationForm: FormGroup;
  submissionError: string;
  networkRequest = false;

  get subdomainError() {
    if (!this.publicationForm) {
      return '';
    }
    return this.publicationForm.controls.subdomainControl.hasError('pattern')
      ? 'lowercase letters and numbers only please'
      : this.publicationForm.controls.subdomainControl.hasError('maxlength')
      ? 'no more than 24 characters please'
      : this.publicationForm.controls.subdomainControl.hasError('minlength')
      ? 'at least 3 characters please'
      : '';
  }

  get showSubdomainError() {
    return (
      !this.publicationForm.controls.subdomainControl.valid && this.publicationForm.controls.subdomainControl.dirty
    );
  }

  constructor(private publicationService: PublicationService, private router: Router) {}

  ngOnInit(): void {
    this.initializeFormGroup();
  }

  public initializeFormGroup() {
    this.publicationForm = new FormGroup({
      nameControl: new FormControl('', [Validators.required]),
      descriptionControl: new FormControl('', []),
      subdomainControl: new FormControl('', [
        Validators.pattern(ValidPublicationSubdomain),
        Validators.maxLength(24),
        Validators.minLength(3),
      ]),
    });
  }

  public async submit() {
    this.submissionError = null;
    this.networkRequest = true;
    const subdomain = this.publicationForm.controls.subdomainControl.value;
    this.publicationService
      .createPublication({
        subdomain,
        metadata: {
          name: this.publicationForm.controls.nameControl.value,
          description: this.publicationForm.controls.descriptionControl.value,
        },
      })
      .then((_) => {
        this.router.navigate(['pnlp', subdomain]);
      })
      .catch((err) => (this.submissionError = err.message || err))
      .finally(() => (this.networkRequest = false));
  }
}
