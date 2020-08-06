import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule, CoreModule, SharedModule],
  exports: [HomeComponent],
  declarations: [HomeComponent],
})
export class HomeModule {}
