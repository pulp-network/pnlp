import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './@core/identity/authentication.guard';
import { HomeComponent } from './home/home.component';
import { extract } from './i18n';
import { ArticleListComponent } from './publisher/article-list/article-list.component';
import { ArticleViewComponent } from './publisher/article-view/article-view.component';
import { NewArticleComponent } from './publisher/new-article/new-article.component';
import { NewPublicationComponent } from './publisher/new-publication/new-publication.component';
import { PublicationListComponent } from './publisher/publication-list/publication-list.component';
import { SignInComponent } from './user/sign-in/sign-in.component';

//TODO:ROADMAP: This is not a scalable pattern for routing, but it is sufficient for early days and easier to keep track of with few routes. It requires us to export components from their respective modules and reference them here. At some point we should switch this over to use seperate routing modules.

//TODO:13: we should nest these routes in more logical structure
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: extract('Home') } },
  { path: 'sign-in', component: SignInComponent, data: { title: extract('Sign In') } },
  { path: 'pnlp', component: PublicationListComponent, data: { title: extract('Publication') } },
  { path: 'pnlp/:publication_id', component: ArticleListComponent, data: { title: extract('pnlp') } },
  { path: 'pnlp/:publication_id/:article_id', component: ArticleViewComponent, data: { title: extract('pnlp') } },
  {
    path: 'write',
    canActivate: [AuthenticationGuard],
    component: NewArticleComponent,
    data: { title: extract('Write') },
  },
  {
    path: 'new',
    canActivate: [AuthenticationGuard],
    component: NewPublicationComponent,
    data: { title: extract('Write') },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
