import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './component/main/main.component';
import { VendorPaymentsComponent } from './component/vendor-payments/vendor-payments.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MyOwnCustomMaterialModule } from 'src/app/app.material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxCurrencyModule } from 'ngx-currency';
import { MainConfigRoutingModule } from './main-routing.module';
import { FormPaymentDetailComponent } from './form/form-payment-detail/form-payment-detail.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';



@NgModule({
  entryComponents:[
    FormPaymentDetailComponent
  ],
  declarations: [
    MainComponent,
    VendorPaymentsComponent,
    FormPaymentDetailComponent
  ],
  imports: [
    CommonModule,
    MainConfigRoutingModule,
    AutocompleteLibModule,
    FormsModule,
    NgxSpinnerModule,
    MyOwnCustomMaterialModule,
    InfiniteScrollModule,
    NgxCurrencyModule,
  ]
})
export class AdminModule { }
