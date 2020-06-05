import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', 
    children: [{
      path: '',
      loadChildren: () => import('./tienda/tienda.module').then(m => m.TiendaModule)
    }], 
    pathMatch: 'full' 
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
  { path: '', redirectTo: "pedidos", pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
