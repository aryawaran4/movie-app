import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//component
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/landing-page',
  },
  { path: 'landing-page', component: LandingPageComponent },
  // {
  //   path: '**',
  //   component: Error404Component,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
