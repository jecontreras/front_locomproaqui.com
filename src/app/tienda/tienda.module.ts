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


@NgModule({
  entryComponents:[
    LoginComponent,
    ViewProductosComponent,
    TerminosComponent
  ],
  declarations: [
    TiendaComponent,
    PedidosComponent,
    LoginComponent,
    ViewProductosComponent,
    TerminosComponent,
    LoginsComponent,
    RegistrosComponent,
    ContenidoComponent,
    ProductoViewComponent,
    TestimoniosComponent
    
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
    NgxImageZoomModule,
    ConfigModule,
    ExtraModule
  ],
  exports: [
    LoginComponent,
    ViewProductosComponent
  ],
  bootstrap: [TiendaComponent]
})
export class TiendaModule { }
