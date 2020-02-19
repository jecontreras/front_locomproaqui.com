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

@NgModule({
  entryComponents: [
    FormcategoriasComponent
  ],
  declarations: [
    MainComponent,
    CategoriasComponent,
    ProductosComponent,
    FormcategoriasComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    MainConfigRoutingModule,
    MyOwnCustomMaterialModule,
    FormsModule,
    NgxDropzoneModule
  ],
  exports: [
    FormcategoriasComponent
  ],
  providers: [
  ],
  bootstrap: [MainComponent]
})
export class ConfigModule { }
