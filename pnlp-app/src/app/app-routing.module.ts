import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login.component';
import { HomeComponent } from './home/home.component';
import { extract } from './i18n';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: extract('Home') } },
  { path: 'about', component: AboutComponent, data: { title: extract('About') } },
  { path: 'login', component: LoginComponent, data: { title: extract('Login') } },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
