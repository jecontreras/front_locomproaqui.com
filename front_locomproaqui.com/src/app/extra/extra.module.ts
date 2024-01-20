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
import { TableProductComponent } from './table-product/table-product.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OpenIframeComponent } from './open-iframe/open-iframe.component';
import { ListArticleStoreComponent } from './list-article-store/list-article-store.component';
import { SliderComponent } from './slider/slider.component';
import { SwiperModule } from 'swiper/angular';
import { ListDispatchComponent } from './list-dispatch/list-dispatch.component';

@NgModule({
  entryComponents:[
    DialogconfirmarPedidoComponent,
    MediosPagosComponent,
    ImprimirTarjetaComponent,
    OpenIframeComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent,
    DialogconfirmarPedidoComponent,
    MediosPagosComponent,
    AlertaGanadorComponent,
    ImprimirTarjetaComponent,
    TableProductComponent,
    OpenIframeComponent,
    ListArticleStoreComponent,
    SliderComponent,
    ListDispatchComponent
  ],
  imports: [
    MyOwnCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ExtraRoutingModule,
    RouterModule,
    CommonModule,
    NgxSpinnerModule,
    NgImageSliderModule,
    AutocompleteLibModule,
    InfiniteScrollModule,
    SwiperModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuLateralComponent,
    ImprimirTarjetaComponent,
    TableProductComponent,
    ListArticleStoreComponent,
    SliderComponent,
    ListDispatchComponent
  ]
})
export class ExtraModule { }
