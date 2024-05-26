import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
//config
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { IntroduccionComponent } from './components/introduccion/introduccion.component';
import { MatVideoModule } from 'mat-video';
import { RegistroComponent } from './components/registro/registro.component';
import { NgxCurrencyModule } from 'ngx-currency';

import { registerLocaleData } from '@angular/common';
    // importar locales
    import localePy from '@angular/common/locales/es-PY';
    import localePt from '@angular/common/locales/pt';
    import localeEn from '@angular/common/locales/en';
    import localeEsAr from '@angular/common/locales/es-AR';
import { AuthInterceptor } from './services/authInterceptor';
import { GlobalErrorHandler } from './services/globalErrorHandler';
import { ExtraModule } from './extra/extra.module';

    // registrar los locales con el nombre que quieras utilizar a la hora de proveer
    registerLocaleData(localePy, 'es');
    registerLocaleData(localePt, 'pt');
    registerLocaleData(localeEn, 'en')
    import  { FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { PortadaModule } from './portada/portada.module';
import { SwiperModule } from 'swiper/angular';
import { PoliticasComponent } from './components/politicas/politicas.component';
@NgModule({
  entryComponents:[],
  declarations: [
    AppComponent,
    RegistroComponent,
    IntroduccionComponent,
    PoliticasComponent
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
    SocialLoginModule,
    StoreModule.forRoot({ name: appReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TiendaModule,
    PortadaModule,
    PublicoModule,
    MatVideoModule,
    NgxCurrencyModule,
    ExtraModule,
    SocialLoginModule,
    SwiperModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Co', },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '257894275306451'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
    /*{
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }*/
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
