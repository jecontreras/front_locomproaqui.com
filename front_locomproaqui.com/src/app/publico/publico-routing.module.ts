import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { PublicoComponent } from './publico.component';

const Routes: Routes = [
  {
    path: '',
    component: PublicoComponent,
    children: [
      { path: '', component: CatalogoComponent, pathMatch: 'full' },
      { path: 'catalago', component: CatalogoComponent },
      { path: 'catalago/:id', component: CatalogoComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(Routes)],
  exports: [RouterModule]
})
export class PublicoRoutingModule { }
