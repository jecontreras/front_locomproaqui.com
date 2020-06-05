import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//config
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyOwnCustomMaterialModule } from './app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './redux/app';
import { environment } from 'src/environments/environment';
import { NgImageSliderModule } from 'ng-image-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgxImageZoomModule } from 'ngx-image-zoom';
import { TiendaModule } from './tienda/tienda.module';
import { PublicoModule } from './publico/publico.module';

@NgModule({
  entryComponents:[],
  declarations: [
    AppComponent
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
    NgxImageZoomModule,
    StoreModule.forRoot({ name: appReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TiendaModule,
    PublicoModule
  ],
  providers: [
    // {
    //   provide : HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi   : true,
    // },
    // {
    //   provide: ErrorHandler, 
    //   useClass: GlobalErrorHandler
    // }
  ],
  /*providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ServerStateInterceptor,
    //   multi: true
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: BrowserStateInterceptor,
    //   multi: true,
    // }
  ],*/
  bootstrap: [AppComponent]
})
export class AppModule { }
