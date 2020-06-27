import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { MainConfigRoutingModule } from './main-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule,  FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProductosComponent } from './components/productos/productos.component';
import { FormcategoriasComponent } from './form/formcategorias/formcategorias.component';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ProvedoresComponent } from './components/provedores/provedores.component';
import { FormprovedoresComponent } from './form/formprovedores/formprovedores.component';
import { FormproductosComponent } from './form/formproductos/formproductos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FormusuariosComponent } from './form/formusuarios/formusuarios.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { FormventasComponent } from './form/formventas/formventas.component';
import { BancosComponent } from './components/bancos/bancos.component';
import { CobrosComponent } from './components/cobros/cobros.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FormbancosComponent } from './form/formbancos/formbancos.component';
import { FormcobrosComponent } from './form/formcobros/formcobros.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { ReferidosComponent } from './components/referidos/referidos.component';
import { FormpuntosComponent } from './form/formpuntos/formpuntos.component';

//settings
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormtestimoniosComponent } from './form/formtestimonios/formtestimonios.component';
import { TestimonioComponent } from './components/testimonios/testimonios.component';
import { VentastableComponent } from './table/ventastable/ventastable.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { VentasLiderComponent } from './components/ventas-lider/ventas-lider.component';
import { FormventasLiderComponent } from './form/formventas-lider/formventas-lider.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { FormcatalogoComponent } from './form/formcatalogo/formcatalogo.component';
import { ExtraModule } from '../extra/extra.module';
import { ProductosOrdenarComponent } from './table/productos-ordenar/productos-ordenar.component';
@NgModule({
  entryComponents: [
    FormcategoriasComponent,
    FormprovedoresComponent,
    FormproductosComponent,
    FormusuariosComponent,
    FormventasComponent,
    FormcobrosComponent,
    FormpuntosComponent,
    FormtestimoniosComponent,
    VentastableComponent,
    FormventasLiderComponent,
    FormcatalogoComponent,
    ProductosOrdenarComponent
  ],
  declarations: [
    MainComponent,
    CategoriasComponent,
    ProductosComponent,
    FormcategoriasComponent,
    ProvedoresComponent,
    FormprovedoresComponent,
    FormproductosComponent,
    UsuariosComponent,
    FormusuariosComponent,
    VentasComponent,
    FormventasComponent,
    BancosComponent,
    CobrosComponent,
    PerfilComponent,
    FormbancosComponent,
    FormcobrosComponent,
    ReferidosComponent,
    FormpuntosComponent,
    FormtestimoniosComponent,
    TestimonioComponent,
    VentastableComponent,
    VentasLiderComponent,
    FormventasLiderComponent,
    CatalogoComponent,
    FormcatalogoComponent,
    ProductosOrdenarComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    MainConfigRoutingModule,
    MyOwnCustomMaterialModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    FormsModule,
    NgxDropzoneModule,
    AngularEditorModule,
    Ng2SmartTableModule,
    ExtraModule
  ],
  exports: [
    FormcategoriasComponent,
    FormprovedoresComponent,
    FormproductosComponent,
    FormusuariosComponent,
    FormventasComponent,
    FormcobrosComponent,
    ProductosOrdenarComponent
  ],
  providers: [
  ],
  bootstrap: [MainComponent]
})
export class ConfigModule { }
