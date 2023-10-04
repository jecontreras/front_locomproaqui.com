import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TiendaComponent } from './tienda.component';
import { PedidosComponent } from '../components/pedidos/pedidos.component';
import { LoginComponent } from '../components/login/login.component';
import { ViewProductosComponent } from '../components/view-productos/view-productos.component';
import { TerminosComponent } from '../layout/terminos/terminos.component';
import { LoginsComponent } from '../layout/login/login.component';
import { RegistrosComponent } from '../layout/registro/registro.component';
import { ContenidoComponent } from '../components/contenido/contenido.component';
import { ProductoViewComponent } from '../components/producto-view/producto-view.component';
import { TestimoniosComponent } from '../components/testimonios/testimonios.component';
import { MyOwnCustomMaterialModule } from 'src/app/app.material.module';
import { TiendaRoutingModule } from './tienda-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ConfigModule } from '../dashboard-config/config.module';
import { ExtraModule } from '../extra/extra.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxCurrencyModule } from 'ngx-currency';
import { ArticuloComponent } from '../components/articulo/articulo.component';
import { TerminosGeneralesComponent } from '../layout/terminos-generales/terminos-generales.component';
import { TratamientoDatoComponent } from '../layout/tratamiento-dato/tratamiento-dato.component';
import { InfoComponent } from '../layout/info/info.component';
import { InfoSupplierComponent } from '../layout/info-supplier/info-supplier.component';
import { MenuComponent } from '../layout/menu/menu.component';
import { ContadorShippingComponent } from '../layout/contador-shipping/contador-shipping.component';
import { PortalComponent } from '../layout/portal/portal.component';
import { ListmenuComponent } from '../layout/listmenu/listmenu.component';
import { SignUpComponent } from '../layout/sign-up/sign-up.component';
import { ListArticleComponent } from '../components/list-article/list-article.component';
import { SwiperModule } from "swiper/angular";

@NgModule({
  entryComponents:[
    LoginComponent,
    ViewProductosComponent,
    TerminosComponent,
    TerminosGeneralesComponent,
    TratamientoDatoComponent
  ],
  declarations: [
    TiendaComponent,
    PedidosComponent,
    LoginComponent,
    ViewProductosComponent,
    TerminosComponent,
    TerminosGeneralesComponent,
    TratamientoDatoComponent,
    LoginsComponent,
    RegistrosComponent,
    ContenidoComponent,
    ProductoViewComponent,
    TestimoniosComponent,
    ArticuloComponent,
    InfoComponent,
    InfoSupplierComponent,
    MenuComponent,
    ContadorShippingComponent,
    PortalComponent,
    ListmenuComponent,
    SignUpComponent,
    ListArticleComponent

  ],
  imports: [
    CommonModule,
    MyOwnCustomMaterialModule,
    TiendaRoutingModule,
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
    SwiperModule
  ],
  exports: [
    LoginComponent,
    ViewProductosComponent
  ],
  bootstrap: [TiendaComponent]
})
export class TiendaModule { }
