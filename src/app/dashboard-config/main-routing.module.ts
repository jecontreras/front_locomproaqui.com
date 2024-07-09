import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthService } from '../services/auth.service';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProvedoresComponent } from './components/provedores/provedores.component';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { CobrosComponent } from './components/cobros/cobros.component';
import { BancosComponent } from './components/bancos/bancos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ReferidosComponent } from './components/referidos/referidos.component';

import { TestimonioComponent } from './components/testimonios/testimonios.component';
import { VentastableComponent } from './table/ventastable/ventastable.component';
import { VentasProveedorComponent } from './components/ventas-proveedor/ventas-proveedor.component';
import { VentasLiderComponent } from './components/ventas-lider/ventas-lider.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { AdminComponent } from './components/admin/admin.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { ControlInventarioComponent } from './components/control-inventario/control-inventario.component';
import { VerCatalagoProveedorComponent } from './components/ver-catalago-proveedor/ver-catalago-proveedor.component';
import { VerProductoProveedorComponent } from './components/ver-producto-proveedor/ver-producto-proveedor.component';
import { VerProveedorComponent } from './components/ver-proveedor/ver-proveedor.component';
import { MisDespachoComponent } from './components/mis-despacho/mis-despacho.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursosViewComponent } from './components/cursosView/cursosView.component';
import { VentasClienteComponent } from './components/ventas-cliente/ventas-cliente.component';
import { ListSizeComponent } from './components/list-size/list-size.component';
import { ListPlatformComponent } from './components/list-platform/list-platform.component';
import { RechargeComponent } from './components/recharge/recharge.component';
import { StoreProductActivatedComponent } from './components/store-product-activated/store-product-activated.component';
import { ListVentasVeraComponent } from './components/list-ventas-vera/list-ventas-vera.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'pedidos', pathMatch: 'full'},
     {path: 'categorias', component: CategoriasComponent},
     {path: 'provedores', component: ProvedoresComponent},
     {path: 'productos', component: ProductosComponent},
     {path: 'usuarios', component: UsuariosComponent},
     {path: 'catalago', component: CatalogoComponent},
     {path: 'ventas', component: VentasComponent},
     {path: 'ventasProveedor', component: VentasProveedorComponent},
     {path: 'ventasLider', component: VentasLiderComponent},
     {path: 'cobros', component: CobrosComponent},
     {path: 'bancos', component: BancosComponent},
     {path: 'perfil', component: PerfilComponent},
     {path: 'referidos', component: ReferidosComponent},
     {path: 'testimonios', component: TestimonioComponent},
     {path: 'tablaventas', component: VentastableComponent},
     {path: 'configuracion', component: ConfiguracionComponent},
     {path: 'controlInventario', component: ControlInventarioComponent },
     {path: 'admin', component: AdminComponent},
     {path: 'verCatalagoProveedor', component: VerCatalagoProveedorComponent},
     {path: 'verProveedor/:id', component: VerProveedorComponent},
     {path: 'verProductoProveedor/:id', component: VerProductoProveedorComponent},
     {path: 'misDespacho', component: MisDespachoComponent},
     {path: 'cursos', component: CursosComponent},
     {path: 'listaTalla', component: ListSizeComponent},
     {path: 'listaPlatform', component: ListPlatformComponent },
     {path: 'ventasPosibles', component: VentasClienteComponent },
     {path: 'ventasVictorVera', component: ListVentasVeraComponent },
     {path: 'storeProductActivated/:idStore', component: StoreProductActivatedComponent},
     {path: 'recharge', component: RechargeComponent },
     {
        path: 'store',
        children: [{
          path: '',
          loadChildren: () => import('./bodega/bodega.module').then(m => m.BodegaModule)
        }]
      },
      {
        path: 'bank',
        children: [{
          path: '',
          loadChildren: () => import('./bank/bank.module').then(m => m.BankModule)
        }]
      },
      {
        path: 'adminF',
        children: [{
          path: '',
          loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule )
        }]
      },
     {path: '**', redirectTo: 'pedidos', pathMatch: 'full'},
     { path: 'cursosView/:id', component : CursosViewComponent },
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainConfigRoutingModule { }
