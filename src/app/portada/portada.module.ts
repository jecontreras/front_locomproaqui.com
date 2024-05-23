import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortadaRoutingModule } from './portada.routing';
import { TiendaComponent } from './tienda/tienda.component';
import { ProductosComponent } from './productos/productos.component';
import { FooterComponent } from './footer/footer.component';
import { MainsComponent } from './main/mains.component';
import { MenuComponent } from './menu/menu.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfoProductoComponent } from './info-producto/info-producto.component';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductosViewComponent } from './producto-view/producto-view.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ContactoComponent } from './contacto/contacto.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ChecktComponent } from './checkt/checkt.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CompletarComponent } from './completar/completar.component';
import { ChecktDialogComponent } from './checkt-dialog/checkt-dialog.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ConfigModule } from '../dashboard-config/config.module';
import { ExtraModule } from '../extra/extra.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { LandingComponent } from './landing/landing.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SelectSizeDialogComponent } from './select-size-dialog/select-size-dialog.component';
import { LandingWhatsappComponent } from './landing-whatsapp/landing-whatsapp.component';


@NgModule({
  entryComponents: [ InfoProductoComponent,ChecktDialogComponent, ],
  declarations: [
    MainsComponent, TiendaComponent, ProductosComponent, FooterComponent, MenuComponent, InfoProductoComponent, ProductosViewComponent, ContactoComponent, ChecktComponent, CarritoComponent, CompletarComponent, ChecktDialogComponent, DetallePedidoComponent, CatalogoComponent, LandingComponent, SelectSizeDialogComponent, LandingWhatsappComponent],
  imports: [
    PortadaRoutingModule,
    CommonModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    FormsModule,
    NgxImageZoomModule,
    NgImageSliderModule,
    MyOwnCustomMaterialModule,
    PortadaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    NgImageSliderModule,
    NgxDropzoneModule,
    NgxImageZoomModule,
    ConfigModule,
    ExtraModule,
    NgxCurrencyModule,
    AutocompleteLibModule
  ],
  exports: [ InfoProductoComponent ]
})
export class PortadaModule { }
