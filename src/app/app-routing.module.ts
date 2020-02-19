import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';


const routes: Routes = [
  { path: '', component: PedidosComponent, pathMatch: 'full' },
  { path: 'pedidos', component: PedidosComponent },
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
