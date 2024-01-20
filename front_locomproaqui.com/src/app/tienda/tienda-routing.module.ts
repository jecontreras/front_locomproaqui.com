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
import { ListArticleComponent } from '../components/list-article/list-article.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaComponent,
    children: [
      { path: '', redirectTo: '/info', pathMatch: 'full' },
      { path: 'realizarventa', component: ArticuloComponent },
      { path: 'realizarventa/:categoria', component: ArticuloComponent },
      { path: 'pedidos', component: ArticuloComponent },
      { path: 'pedidos/:categoria', component: ArticuloComponent },
      { path: 'articulo', component: PedidosComponent },
      //{ path: ':id', component: ArticuloComponent },
      { path: 'productos/:id', component: ProductoViewComponent },
      { path: 'testimonio', component: TestimoniosComponent },
      { path: 'login', component: LoginsComponent },
      { path: 'login/:id/:cel', component: LoginsComponent },
      { path: 'registro', component: RegistrosComponent },
      { path: 'singUp', component: SignUpComponent },
      { path: 'singUp/:type/:cel', component: SignUpComponent },
      { path: 'registro/:id', component: RegistrosComponent },
      { path: 'info', component: InfoComponent },
      { path: 'infoSupplier', component: InfoSupplierComponent },
      { path: 'portal', component: PortalComponent },
      {path: 'listproduct/:idStore', component: ListArticleComponent },
      {path: 'listproduct/categoria/:idCategoria', component: ListArticleComponent },
      {path: 'listproduct', component: ListArticleComponent },
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
