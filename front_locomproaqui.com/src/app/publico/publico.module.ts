import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { PublicoRoutingModule } from './publico-routing.module';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ConfigModule } from '../dashboard-config/config.module';
import { ExtraModule } from '../extra/extra.module';
import { PublicoComponent } from './publico.component';



@NgModule({
  declarations: [
    CatalogoComponent,
    PublicoComponent,

  ],
  imports: [
    CommonModule,
    PublicoRoutingModule,
    MyOwnCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    NgImageSliderModule,
    NgxImageZoomModule,
    ConfigModule,
    ExtraModule
  ],
  bootstrap: [ PublicoComponent ]
})
export class PublicoModule { }
