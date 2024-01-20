import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBankComponent } from './form/create-bank/create-bank.component';
import { BankComponent } from './component/bank/bank.component';
import { IndexComponent } from './component/index/index.component';
import { MainComponent } from './component/main/main.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MyOwnCustomMaterialModule } from 'src/app/app.material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BankRoutingModule } from './bank.routing';
import { ListPaymentComponent } from './component/list-payment/list-payment.component';
import { FormDisbursementComponent } from './form/form-disbursement/form-disbursement.component';
import { NgxCurrencyModule } from "ngx-currency";
import { FormListSaleComponent } from './form/form-list-sale/form-list-sale.component';


@NgModule({
  entryComponents:[
    CreateBankComponent,
    FormDisbursementComponent,
    FormListSaleComponent
  ],
  declarations: [
      IndexComponent,
      CreateBankComponent,
      BankComponent,
      MainComponent,
      ListPaymentComponent, FormDisbursementComponent, FormListSaleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    MyOwnCustomMaterialModule,
    InfiniteScrollModule,
    NgxCurrencyModule,
    BankRoutingModule,
  ]
})
export class BankModule { }
