import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//service
import { AuthGuardService } from './shared/services/auth/auth-guard.service';
import { AuthLoginGuardService } from './shared/services/auth/auth-login-guard.service';

//component
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { MovieComponent } from './details/movie/movie.component';
import { TvComponent } from './details/tv/tv.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: 'landing-page',
    component: LandingPageComponent,
    canActivate: [AuthLoginGuardService],
    loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthLoginGuardService],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'register',
    component: RegisterComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'search',
    component: SearchResultComponent,
    loadChildren: () => import('./search-result/search-result.module').then(m => m.SearchResultModule)
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuardService],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'movie/:id',
    component: MovieComponent,
    loadChildren: () => import('./details/details.module').then(m => m.DetailsModule)
  },
  {
    path: 'tv/:id',
    component: TvComponent,
    loadChildren: () => import('./details/details.module').then(m => m.DetailsModule)
  },
  {
    path: '**',
    component: Error404Component,
    loadChildren: () => import('./error404/error404.module').then(m => m.Error404Module)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
