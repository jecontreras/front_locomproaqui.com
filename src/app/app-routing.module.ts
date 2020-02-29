import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';


const routes: Routes = [
  { path: '', component: PedidosComponent, pathMatch: 'full' },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'pedidos/:id', component: PedidosComponent },
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
