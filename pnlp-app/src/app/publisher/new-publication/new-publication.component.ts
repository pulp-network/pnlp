import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService } from '@app/@core/identity/identity.service';
import { PnlpService } from '@app/@core/pnlp/pnlp.service';
import { ValidPublicationSlug } from '@app/model/entities/publication';

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

  constructor(private pnlpService: PnlpService, private router: Router, private identityService: IdentityService) {}

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

  public submit() {
    this.submissionError = null;
    this.networkRequest = true;
    const slug = this.publicationForm.controls.slugControl.value;
    this.pnlpService.pnlpClient
      .createPublication({
        slug,
        owner: this.identityService.identity.value.ethereum_identity,
        name: this.publicationForm.controls.nameControl.value,
        description: this.publicationForm.controls.descriptionControl.value,
        articles: {},
      })
      .then(({ transaction, publication, ipns_address }) => {
        this.router.navigate([`pnlp`, slug], {
          queryParams: {
            ipns: ipns_address,
            transaction: transaction.hash,
            publication_name: publication.name,
          },
        });
      })
      .catch((err) => (this.submissionError = err.message || err))
      .finally(() => (this.networkRequest = false));
  }
}
