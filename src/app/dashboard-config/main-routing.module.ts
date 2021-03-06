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
import { VentasLiderComponent } from './components/ventas-lider/ventas-lider.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { AdminComponent } from './components/admin/admin.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { ControlInventarioComponent } from './components/control-inventario/control-inventario.component';
import { VerCatalagoProveedorComponent } from './components/ver-catalago-proveedor/ver-catalago-proveedor.component';
import { VerProductoProveedorComponent } from './components/ver-producto-proveedor/ver-producto-proveedor.component';
import { VerProveedorComponent } from './components/ver-proveedor/ver-proveedor.component';
import { MisDespachoComponent } from './components/mis-despacho/mis-despacho.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'categorias', pathMatch: 'full'},
     {path: 'categorias', component: CategoriasComponent},
     {path: 'provedores', component: ProvedoresComponent},
     {path: 'productos', component: ProductosComponent},
     {path: 'usuarios', component: UsuariosComponent},
     {path: 'catalago', component: CatalogoComponent},
     {path: 'ventas', component: VentasComponent},
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
     {path: '**', redirectTo: 'categorias', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainConfigRoutingModule { }
