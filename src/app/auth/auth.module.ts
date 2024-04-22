import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

//modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    LottieModule
  ]
})
export class AuthModule { }
