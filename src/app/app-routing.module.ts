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
import { SearchResultComponent } from './search-result/search-result.component';
import { Error404Component } from './error404/error404.component';
import { MoviesComponent } from './movies/movies.component';
import { TvComponent } from './tv/tv.component';

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
    path: 'movie',
    loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule)
  },
  {
    path: 'tv',
    loadChildren: () => import('./tv/tv.module').then(m => m.TvModule)
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
