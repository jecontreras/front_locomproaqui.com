import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { AuthService } from 'src/app/services/auth.service';
import { VendorPaymentsComponent } from './component/vendor-payments/vendor-payments.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'vendorpayment', pathMatch: 'full'},
     {path: 'vendorpayment', component: VendorPaymentsComponent},
     {path: '**', redirectTo: 'vendorpayment', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainConfigRoutingModule { }