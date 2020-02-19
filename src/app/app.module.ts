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
import { LoginComponent } from './components/login/login.component';
import { ConfigModule } from './dashboard-config/config.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PedidosComponent,
    ContenidoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyOwnCustomMaterialModule,
    HttpClientModule,
    ConfigModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
