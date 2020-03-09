import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ProductoViewComponent } from './components/producto-view/producto-view.component';


const routes: Routes = [
  { path: '', component: PedidosComponent, pathMatch: 'full' },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'pedidos/:id', component: PedidosComponent },
  { path: 'productos/:id', component: ProductoViewComponent },
  //{path: '**', redirectTo: 'pedidos', pathMatch: 'full'},
  {
    path: 'config', 
    children: [{
      path: '',
      loadChildren: './dashboard-config/config.module#ConfigModule'
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
