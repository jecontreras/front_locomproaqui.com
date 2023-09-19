import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from '../components/pedidos/pedidos.component';
import { ProductoViewComponent } from '../components/producto-view/producto-view.component';
import { TestimoniosComponent } from '../components/testimonios/testimonios.component';
import { LoginsComponent } from '../layout/login/login.component';
import { RegistrosComponent } from '../layout/registro/registro.component';
import { TiendaComponent } from './tienda.component';
import { ArticuloComponent } from '../components/articulo/articulo.component';
import { InfoComponent } from '../layout/info/info.component';
import { InfoSupplierComponent } from '../layout/info-supplier/info-supplier.component';
import { PortalComponent } from '../layout/portal/portal.component';
import { SignUpComponent } from '../layout/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaComponent,
    children: [
      { path: '', redirectTo: '/info', pathMatch: 'full' },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'pedidos/inf/:id', component: PedidosComponent },
      { path: 'articulo/:cel', component: ArticuloComponent },
      { path: 'articulo/:cel/:categoria', component: ArticuloComponent },
      //{ path: ':id', component: PedidosComponent },
      { path: 'pedido/:categoria', component: PedidosComponent },
      { path: 'productos/:id', component: ProductoViewComponent },
      { path: 'testimonio', component: TestimoniosComponent },
      { path: 'login', component: LoginsComponent },
      { path: 'login/:id/:cel', component: LoginsComponent },
      //{ path: 'registro', component: RegistrosComponent },
      { path: 'registro', component: SignUpComponent },
      { path: 'registro/:id', component: RegistrosComponent },
      { path: 'info', component: InfoComponent },
      { path: 'infoSupplier', component: InfoSupplierComponent },
      { path: 'portal', component: PortalComponent },
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
