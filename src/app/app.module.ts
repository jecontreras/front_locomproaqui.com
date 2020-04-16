import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//config
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyOwnCustomMaterialModule } from './app.material.module';
import { ConfigModule } from './dashboard-config/config.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ViewProductosComponent } from './components/view-productos/view-productos.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './redux/app';
import { environment } from 'src/environments/environment';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { ServiceWorkerModule } from '@angular/service-worker';
import { ProductoViewComponent } from './components/producto-view/producto-view.component';

import { NgxImageZoomModule } from 'ngx-image-zoom';
import { LoginsComponent } from './layout/login/login.component';
import { RegistrosComponent } from './layout/registro/registro.component';
import { TerminosComponent } from './layout/terminos/terminos.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  entryComponents:[
    LoginComponent,
    RegistroComponent,
    ViewProductosComponent,
    TerminosComponent
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    PedidosComponent,
    LoginsComponent,
    RegistrosComponent,
    ContenidoComponent,
    LoginComponent,
    RegistroComponent,
    TerminosComponent,
    ViewProductosComponent,
    MenuLateralComponent,
    ProductoViewComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MyOwnCustomMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    FormsModule,
    NgImageSliderModule,
    ConfigModule,
    NgxImageZoomModule,
    StoreModule.forRoot({ name: appReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  exports: [
    LoginComponent,
    RegistroComponent,
    ViewProductosComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
