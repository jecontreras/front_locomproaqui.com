import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroduccionComponent } from './components/introduccion/introduccion.component';
import { ImprimirTarjetaComponent } from './extra/imprimir-tarjeta/imprimir-tarjeta.component';
import { PoliticasComponent } from './components/politicas/politicas.component';

const routes: Routes = [
  { path: '',
    children: [{
      path: '',
      loadChildren: () => import('./portada/portada.module').then(m => m.PortadaModule)
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
