import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './component/index/index.component';
import { MainComponent } from '../main.component';
import { StoreComponent } from './component/store/store.component';
import { MyProductsComponent } from './component/my-products/my-products.component';
import { ProductsComponent } from './component/products/products.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   children: [
     {path: '', redirectTo: 'index', pathMatch: 'full'},
     {path: 'index', component: IndexComponent },
     {path: 'store', component: StoreComponent },
     {path: 'myproducts', component: MyProductsComponent },
     {path: 'product', component: ProductsComponent },
     {path: 'product/:idStore', component: ProductsComponent },
     {path: 'product/:id', component: ProductsComponent },
     {path: '**', redirectTo: 'index', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class BodegaRoutingModule { }
