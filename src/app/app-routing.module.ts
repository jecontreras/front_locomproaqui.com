import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroduccionComponent } from './components/introduccion/introduccion.component';
import { ImprimirTarjetaComponent } from './extra/imprimir-tarjeta/imprimir-tarjeta.component';
import { PoliticasComponent } from './components/politicas/politicas.component';

const routes: Routes = [
  { path: '',
    children: [{
      path: '',
      loadChildren: () => import('./tienda/tienda.module').then(m => m.TiendaModule)
    }],
    pathMatch: 'full'
  },
  {
    path: 'front',
    children: [{
      path: '',
      loadChildren: () => import('./portada/portada.module').then(m => m.PortadaModule)
    }]
  },
  {
    path: 'front/:cell',
    children: [{
      path: '',
      loadChildren: () => import('./portada/portada.module').then(m => m.PortadaModule)
    }]
  },
  { path: 'publico',
    children: [{
      path: '',
      loadChildren: () => import('./publico/publico.module').then(m => m.PublicoModule)
    }],
    pathMatch: 'full'
  },
  { path: 'publico/:id',
    children: [{
      path: '',
      loadChildren: () => import('./publico/publico.module').then(m => m.PublicoModule)
    }],
    pathMatch: 'full'
  },
  {
    path: "introduccion",
    component: IntroduccionComponent
  },
  {
    path: "imprimirTarjeta",
    component: ImprimirTarjetaComponent
  },
  { path: '', redirectTo: "pedidos", pathMatch: 'full' },
  {
    path: "politicas",
    component: PoliticasComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
