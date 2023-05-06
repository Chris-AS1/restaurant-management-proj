import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { cashierGuard } from './guards/cashier/cashier.guard';
import { CashierComponent } from './components/cashier/cashier.component';
import { CookComponent } from './components/cook/cook.component';
import { BartenderComponent } from './components/bartender/bartender.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { cookGuard } from './guards/cook/cook.guard';
import { bartenderGuard } from './guards/bartender/bartender.guard';
import { waiterGuard } from './guards/waiter/waiter.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "cashier", component: CashierComponent, canActivate: [authGuard, cashierGuard]},
  {path: "cook", component: CookComponent, canActivate: [authGuard, cookGuard]},
  {path: "bartender", component: BartenderComponent, canActivate: [authGuard, bartenderGuard]},
  {path: "waiter", component: WaiterComponent, canActivate: [authGuard, waiterGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
