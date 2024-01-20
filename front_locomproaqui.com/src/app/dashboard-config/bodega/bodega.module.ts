import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './component/index/index.component';
import { ProductsComponent } from './component/products/products.component';
import { MyProductsComponent } from './component/my-products/my-products.component';
import { StoreComponent } from './component/store/store.component';
import { BodegaRoutingModule } from './bodega.routing';
import { MainComponent } from './component/main/main.component';
import { MyOwnCustomMaterialModule } from 'src/app/app.material.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ExtraModule } from 'src/app/extra/extra.module';



@NgModule({
  declarations: [
      IndexComponent,
      ProductsComponent,
      MyProductsComponent,
      StoreComponent,
      MainComponent
  ],
  imports: [
    CommonModule,
    ExtraModule,
    FormsModule,
    NgxSpinnerModule,
    MyOwnCustomMaterialModule,
    InfiniteScrollModule,
    BodegaRoutingModule
  ]
})
export class BodegaModule { }
