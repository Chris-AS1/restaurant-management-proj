import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CashierComponent } from './components/cashier/cashier.component';
import { CookComponent } from './components/cook/cook.component';
import { BartenderComponent } from './components/bartender/bartender.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule} from "./material/material.module";
import { UncookedComponent } from './components/shared/uncooked/uncooked.component';
import { OrderarrayComponent } from './components/shared/orderarray/orderarray.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CashierComponent,
    HomeComponent,
    CookComponent,
    BartenderComponent,
    WaiterComponent,
    UncookedComponent,
    OrderarrayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
