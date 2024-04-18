import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
  },
];

@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AccountModule { }