import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component'
import { CashierComponent } from './components/cashier/cashier.component';
import { CookComponent } from './components/cook/cook.component';
import { BartenderComponent } from './components/bartender/bartender.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { authGuard } from './auth.guard';
import { cashierGuard } from './guards/cashier/cashier.guard';
import { cookGuard } from './guards/cook/cook.guard';
import { bartenderGuard } from './guards/bartender/bartender.guard';
import { waiterGuard } from './guards/waiter/waiter.guard';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "cashier", component: CashierComponent, canActivate: [authGuard, cashierGuard] },
  { path: "cook", component: CookComponent, canActivate: [authGuard, cookGuard] },
  { path: "bartender", component: BartenderComponent, canActivate: [authGuard, bartenderGuard] },
  { path: "waiter", component: WaiterComponent, canActivate: [authGuard, waiterGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
