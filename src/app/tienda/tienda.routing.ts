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


const routes: Routes = [
      {
        path: '',
        component: MainsComponent,
        children: [
          {
            path: '',
            component: TiendaComponent
          },
          {
            path: 'inicio',
            component: TiendaComponent
          },
          {
            path: 'productos',
            component: ProductosComponent
          },
          {
            path: 'productosView/:id',
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
            path: 'catalogo/:id',
            component: CatalogoComponent
          }
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
export class TiendaRoutingModule { }
