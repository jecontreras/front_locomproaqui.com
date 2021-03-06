import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from '../components/pedidos/pedidos.component';
import { ProductoViewComponent } from '../components/producto-view/producto-view.component';
import { TestimoniosComponent } from '../components/testimonios/testimonios.component';
import { LoginsComponent } from '../layout/login/login.component';
import { RegistrosComponent } from '../layout/registro/registro.component';
import { TiendaComponent } from './tienda.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaComponent,
    children: [
      { path: '', component: PedidosComponent, pathMatch: 'full' },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'pedidos/:id', component: PedidosComponent },
      { path: 'pedido/:categoria', component: PedidosComponent },
      { path: 'productos/:id', component: ProductoViewComponent },
      { path: 'testimonio', component: TestimoniosComponent },
      { path: 'login', component: LoginsComponent },
      { path: 'registro', component: RegistrosComponent },
      { path: 'registro/:id', component: RegistrosComponent },
    ]
  },
  {
    path: 'config', 
    children: [{
      path: '',
      loadChildren: () => import('./../dashboard-config/config.module').then(m => m.ConfigModule)
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaRoutingModule { }
