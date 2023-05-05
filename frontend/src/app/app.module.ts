import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestRouteComponent } from './test-route/test-route.component';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './cashier/cashier.component';

@NgModule({
  declarations: [
    AppComponent,
    TestRouteComponent,
    LoginComponent,
    CashierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
