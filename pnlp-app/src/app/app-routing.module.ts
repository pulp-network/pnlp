import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { extract } from './i18n';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserHomeComponent } from './user/user-home/user-home.component';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: extract('Home') } },
  { path: 'sign-in', component: SignInComponent, data: { title: extract('Sign In') } },
  { path: 'user-home', component: UserHomeComponent, data: { title: extract('User Home') } },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
