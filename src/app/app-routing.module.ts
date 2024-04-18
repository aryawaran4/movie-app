import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//component
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { AuthGuardService } from './shared/services/auth/auth-guard.service';
import { AuthLoginGuardService } from './shared/services/auth/auth-login-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/landing-page',
  },
  { path: 'landing-page', component: LandingPageComponent, canActivate: [AuthLoginGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [AuthLoginGuardService] },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardService] },
  // {
  //   path: '**',
  //   component: Error404Component,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
