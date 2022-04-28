import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtraRoutingModule } from './extra-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgImageSliderModule } from 'ng-image-slider';
import { DialogconfirmarPedidoComponent } from './dialogconfirmar-pedido/dialogconfirmar-pedido.component';
import { MediosPagosComponent } from './medios-pagos/medios-pagos.component';

@NgModule({
  entryComponents:[
    DialogconfirmarPedidoComponent,
    MediosPagosComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent,
    DialogconfirmarPedidoComponent,
    MediosPagosComponent
  ],
  imports: [
    MyOwnCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ExtraRoutingModule,
    RouterModule,
    CommonModule,
    NgImageSliderModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent
  ]
})
export class ExtraModule { }
