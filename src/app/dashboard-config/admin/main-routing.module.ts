import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { AuthService } from 'src/app/services/auth.service';
import { VendorPaymentsComponent } from './component/vendor-payments/vendor-payments.component';
import { StateGuideComponent } from './component/state-guide/state-guide.component';
import { RechargeComponent } from './component/recharge/recharge.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'vendorpayment', pathMatch: 'full'},
     {path: 'vendorpayment', component: VendorPaymentsComponent},
     {path: 'stateGuia', component: StateGuideComponent},
     {path: 'recharge', component: RechargeComponent},
     {path: '**', redirectTo: 'vendorpayment', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainConfigRoutingModule { }
