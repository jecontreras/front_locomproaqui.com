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
import { AlertaGanadorComponent } from './alerta-ganador/alerta-ganador.component';
import { ImprimirTarjetaComponent } from './imprimir-tarjeta/imprimir-tarjeta.component';

@NgModule({
  entryComponents:[
    DialogconfirmarPedidoComponent,
    MediosPagosComponent,
    ImprimirTarjetaComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent,
    DialogconfirmarPedidoComponent,
    MediosPagosComponent,
    AlertaGanadorComponent,
    ImprimirTarjetaComponent,
  ],
  imports: [
    MyOwnCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ExtraRoutingModule,
    RouterModule,
    CommonModule,
    NgImageSliderModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent,
    ImprimirTarjetaComponent
  ]
})
export class ExtraModule { }
