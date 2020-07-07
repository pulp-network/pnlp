import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@app/auth';
import { I18nModule } from '@app/i18n';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, TranslateModule, NgbModule, AuthModule, I18nModule, RouterModule],
})
export class LayoutModule {}
