import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicationService } from '../../@core/publication/publication.service';

@Component({
  selector: 'app-new-publication',
  templateUrl: './new-publication.component.html',
  styleUrls: ['./new-publication.component.scss'],
})
export class NewPublicationComponent implements OnInit {
  publicationForm: FormGroup;
  name: string;
  description: string;
  subdomain: string;
  error: any;
  networkRequest = false;

  get subdomainError() {
    if (!this.publicationForm) {
      return '';
    }
    return this.publicationForm.get('subdomainControl').hasError('pattern')
      ? 'lowercase letters and numbers only please'
      : this.publicationForm.get('subdomainControl').hasError('maxlength')
      ? 'no more than 24 characters please'
      : 'at least 3 characters please';
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
        Validators.pattern(/^[a-z0-9]+$/),
        Validators.maxLength(24),
        Validators.minLength(3),
      ]),
    });
  }

  public async submit() {
    this.error = false;
    this.networkRequest = true;
    const subdomain = this.publicationForm.get('subdomainControl').value;
    this.publicationService
      .createPublication({
        subdomain,
        metadata: {
          name: this.publicationForm.get('nameControl').value,
          description: this.publicationForm.get('descriptionControl').value,
        },
      })
      .then((_) => {
        this.router.navigate(['pnlp', subdomain]);
      })
      .catch((err) => (this.error = err))
      .finally(() => (this.networkRequest = false));
  }
}
