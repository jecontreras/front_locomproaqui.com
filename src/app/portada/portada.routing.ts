import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TiendaComponent } from './tienda/tienda.component';
import { ProductosComponent } from './productos/productos.component';
import { MainsComponent } from './main/mains.component';
import { ProductosViewComponent } from './producto-view/producto-view.component';
import { ContactoComponent } from './contacto/contacto.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ChecktComponent } from './checkt/checkt.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { PedidosComponent } from '../components/pedidos/pedidos.component';
import { LandingComponent } from './landing/landing.component';
import { LandingWhatsappComponent } from './landing-whatsapp/landing-whatsapp.component';
import { LandingTestComponent } from './landing-test/landing-test.component';


const routes: Routes = [
      {
        path: '',
        component: MainsComponent,
        children: [
          {
            path: '',
            component: ProductosComponent
          },
          {
            path: 'index/:id',
            component: ProductosComponent
          },
          {
            path: 'index/:id/:idCategory',
            component: ProductosComponent
          },
          {
            path: 'inicio',
            component: ProductosComponent
          },
          {
            path: 'productos',
            component: ProductosComponent
          },
          {
            path: 'productosView/:id/:cel',
            component: ProductosViewComponent
          },
          {
            path: 'contacto',
            component: ContactoComponent
          },
          {
            path: 'carrito',
            component: CarritoComponent
          },
          {
            path: 'checkouts',
            component: ChecktComponent
          },
          {
            path: 'detallepedido',
            component: DetallePedidoComponent
          },
          {
            path: 'catalogo/:id/:cel',
            component: CatalogoComponent
          },
          {
            path: 'landing',
            component: LandingComponent
          },
          {
            path: 'landingWhatsapp/:code',
            component: LandingWhatsappComponent
          },
          {
            path: 'landingWhatsapp/:code/:number',
            component: LandingWhatsappComponent
          },
          {
            path: 'landingTest',
            component: LandingTestComponent
          },
          {
            path: 'landingTestWhatsapp/:code',
            component: LandingTestComponent
          },
          {
            path: 'landingTestWhatsapp/:code/:number',
            component: LandingTestComponent
          },
        ]
      },
      // {
      //   path: '**',
      //   redirectTo: '',
      //   pathMatch: 'full'
      // },

      /*{
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortadaRoutingModule { }
