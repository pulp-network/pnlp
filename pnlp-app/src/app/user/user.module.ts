import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from '@app/user/about/about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../i18n';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserHomeComponent } from './user-home/user-home.component';

// TODO: delete user module
@NgModule({
  declarations: [SignInComponent, UserHomeComponent, AboutComponent],
  exports: [SignInComponent, UserHomeComponent, AboutComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NgbModule, I18nModule],
})
export class UserModule {}
