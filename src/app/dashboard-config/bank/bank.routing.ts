import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './component/index/index.component';
import { MainComponent } from './component/main/main.component';
import { BankComponent } from './component/bank/bank.component';
import { ListPaymentComponent } from './component/list-payment/list-payment.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   children: [
     {path: '', redirectTo: 'index', pathMatch: 'full'},
     { path: 'index', component: IndexComponent },
     { path: 'bank', component: BankComponent },
     { path: 'listPayment', component: ListPaymentComponent },
     {path: '**', redirectTo: 'index', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
