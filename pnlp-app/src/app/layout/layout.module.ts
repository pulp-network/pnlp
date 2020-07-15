import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@app/i18n';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UserModule } from '../user';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [HeaderComponent, ErrorComponent, LoaderComponent],
  exports: [HeaderComponent, ErrorComponent, LoaderComponent],
  imports: [CommonModule, TranslateModule, NgbModule, UserModule, I18nModule, RouterModule],
})
export class LayoutModule {}
