import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtraRoutingModule } from './extra-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent
  ],
  imports: [
    MyOwnCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ExtraRoutingModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent
  ]
})
export class ExtraModule { }
