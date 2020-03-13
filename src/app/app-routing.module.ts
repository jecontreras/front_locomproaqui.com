import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ProductoViewComponent } from './components/producto-view/producto-view.component';
import { LoginsComponent } from './layout/login/login.component';
import { RegistrosComponent } from './layout/registro/registro.component';


const routes: Routes = [
  { path: '', component: PedidosComponent, pathMatch: 'full' },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'pedidos/:id', component: PedidosComponent },
  { path: 'productos/:id', component: ProductoViewComponent },
  { path: 'login', component: LoginsComponent },
  { path: 'registro', component: RegistrosComponent },
  { path: 'registro/:id', component: RegistrosComponent },
  //{path: '**', redirectTo: 'pedidos', pathMatch: 'full'},
  {
    path: 'config', 
    children: [{
      path: '',
      loadChildren: () => import('./dashboard-config/config.module').then(m => m.ConfigModule)
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
