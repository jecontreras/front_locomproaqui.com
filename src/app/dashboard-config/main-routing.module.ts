import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthService } from '../services/auth.service';
import { CategoriasComponent } from './components/categorias/categorias.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   //canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'categorias', pathMatch: 'full'},
     {path: 'categorias', component: CategoriasComponent},
     {path: '**', redirectTo: 'categorias', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainConfigRoutingModule { }
