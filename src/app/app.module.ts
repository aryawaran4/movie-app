import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// plugin
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LottieModule.forRoot({ player: () => player }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
