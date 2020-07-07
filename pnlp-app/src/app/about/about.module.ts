import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AboutComponent } from './about.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  exports: [AboutComponent],
  declarations: [AboutComponent],
})
export class AboutModule {}
