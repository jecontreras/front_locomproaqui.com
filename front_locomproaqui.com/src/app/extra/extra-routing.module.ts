import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const dashboardRoutes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class ExtraRoutingModule { }
