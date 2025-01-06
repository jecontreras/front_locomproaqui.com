import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainsComponent } from './main/mains.component';
import { LandingComponent } from './landing/landing.component';


const routes: Routes = [
      {
        path: '',
        component: MainsComponent,
        children: [
          {
            path: '',
            component: LandingComponent
          },
          {
            path: 'landing',
            component: LandingComponent
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
export class PortadaRoutingModule { }
