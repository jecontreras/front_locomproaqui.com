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
import { LoginComponent } from '../components/login/login.component';
import { ViewProductosComponent } from '../components/view-productos/view-productos.component';
import { TerminosComponent } from '../layout/terminos/terminos.component';
import { PedidosComponent } from '../components/pedidos/pedidos.component';
import { LoginsComponent } from '../layout/login/login.component';
import { RegistrosComponent } from '../layout/registro/registro.component';
import { ContenidoComponent } from '../components/contenido/contenido.component';
import { ProductoViewComponent } from '../components/producto-view/producto-view.component';
import { TestimoniosComponent } from '../components/testimonios/testimonios.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ConfigModule } from '../dashboard-config/config.module';
import { ExtraModule } from '../extra/extra.module';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  entryComponents: [ InfoProductoComponent,ChecktDialogComponent, ],
  declarations: [
    MainsComponent, TiendaComponent, ProductosComponent, FooterComponent, MenuComponent, InfoProductoComponent, ProductosViewComponent, ContactoComponent, ChecktComponent, CarritoComponent, CompletarComponent, ChecktDialogComponent, DetallePedidoComponent, CatalogoComponent],
  imports: [
    PortadaRoutingModule,
    CommonModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    MyOwnCustomMaterialModule,
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
    NgxCurrencyModule
  ],
  exports: [ InfoProductoComponent ]
})
export class PortadaModule { }
