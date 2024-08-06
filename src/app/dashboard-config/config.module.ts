import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { MainConfigRoutingModule } from './main-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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
import { VentasProveedorComponent } from './components/ventas-proveedor/ventas-proveedor.component';
import { FormventasLiderComponent } from './form/formventas-lider/formventas-lider.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { FormcatalogoComponent } from './form/formcatalogo/formcatalogo.component';
import { ExtraModule } from '../extra/extra.module';
import { ProductosOrdenarComponent } from './table/productos-ordenar/productos-ordenar.component';
import { AdminComponent } from './components/admin/admin.component';

import { NgxCurrencyModule } from "ngx-currency";
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { ControlInventarioComponent } from './components/control-inventario/control-inventario.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { VerCatalagoProveedorComponent } from './components/ver-catalago-proveedor/ver-catalago-proveedor.component';
import { VerProductoProveedorComponent } from './components/ver-producto-proveedor/ver-producto-proveedor.component';
import { VerProveedorComponent } from './components/ver-proveedor/ver-proveedor.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MisDespachoComponent } from './components/mis-despacho/mis-despacho.component';
import { FormempresaComponent } from './form/formempresa/formempresa.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormcrearguiaComponent } from './form/formcrearguia/formcrearguia.component';
import { FormlistventasComponent } from './form/formlistventas/formlistventas.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursosViewComponent } from './components/cursosView/cursosView.component';
import { MatVideoModule } from 'mat-video';
import { VentasClienteComponent } from './components/ventas-cliente/ventas-cliente.component';
import { FormPosiblesVentasComponent } from './form/form-posibles-ventas/form-posibles-ventas.component';
import { FormProductComponent } from './form/form-product/form-product.component';
import { FormListArticleComponent } from './form/form-list-article/form-list-article.component';
import { ListSizeComponent } from './components/list-size/list-size.component';
import { FormListSizeComponent } from './form/form-list-size/form-list-size.component';
import { ListPlatformComponent } from './components/list-platform/list-platform.component';
import { FormPlatformComponent } from './form/form-platform/form-platform.component';
import { RechargeComponent } from './components/recharge/recharge.component';
import { StoreProductActivatedComponent } from './components/store-product-activated/store-product-activated.component';
import { ListVentasVeraComponent } from './components/list-ventas-vera/list-ventas-vera.component';
import { FormVentasVeraComponent } from './form/form-ventas-vera/form-ventas-vera.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
    ProductosOrdenarComponent,
    FormempresaComponent,
    FormcrearguiaComponent,
    FormlistventasComponent,
    FormPosiblesVentasComponent,
    FormProductComponent
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
    VentasProveedorComponent,
    VentasLiderComponent,
    FormventasLiderComponent,
    CatalogoComponent,
    FormcatalogoComponent,
    ProductosOrdenarComponent,
    AdminComponent,
    ConfiguracionComponent,
    ControlInventarioComponent,
    VerCatalagoProveedorComponent,
    VerProductoProveedorComponent,
    VerProveedorComponent,
    MisDespachoComponent,
    FormempresaComponent,
    FormcrearguiaComponent,
    FormlistventasComponent,
    CursosComponent,
    CursosViewComponent,
    VentasClienteComponent,
    FormPosiblesVentasComponent,
    FormProductComponent,
    FormListArticleComponent,
    ListSizeComponent,
    FormListSizeComponent,
    ListPlatformComponent,
    FormPlatformComponent,
    RechargeComponent,
    StoreProductActivatedComponent,
    ListVentasVeraComponent,
    FormVentasVeraComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    MainConfigRoutingModule,
    ImageCropperModule,
    MyOwnCustomMaterialModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    FormsModule,
    NgxDropzoneModule,
    AngularEditorModule,
    Ng2SmartTableModule,
    ExtraModule,
    NgxCurrencyModule,
    NgImageSliderModule,
    NgxImageZoomModule,
    AutocompleteLibModule,
    MatVideoModule,
    LeafletModule
  ],
  exports: [
    FormcategoriasComponent,
    FormprovedoresComponent,
    FormproductosComponent,
    FormusuariosComponent,
    FormventasComponent,
    FormcobrosComponent,
    ProductosOrdenarComponent,
    FormPosiblesVentasComponent
  ],
  providers: [
  ],
  bootstrap: [MainComponent]
})
export class ConfigModule { }
