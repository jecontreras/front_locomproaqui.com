import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { MatDialog } from '@angular/material';
import { CartAction, ProductoHistorialAction } from 'src/app/redux/app.actions';
import { InfoProductoComponent } from '../info-producto/info-producto.component';
import * as _ from 'lodash';
import { NgImageSliderComponent } from 'ng-image-slider';
import { FormatosService } from 'src/app/services/formatos.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {

  listProductos:any = [];
  listProductos2:any = [];
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 15
  };
  query2:any = {
    where:{
      pro_activo: 0
    },
    sort: "pro_uni_venta DESC",
    page: 0,
    limit: 15
  };
  listCategorias:any = [];
  listProductosHistorial:any = [];

  imageObject:any = [
    {
      image: "./assets/imagenes/1920x700.png",
      thumbImage: "./assets/imagenes/1920x700.png",
      alt: '',
      check: true,
      id: 1,
      title: ""
    }
  ];
  imageObject2:any = [
    {
      image: "./assets/imagenes/1920x700.png",
      thumbImage: "./assets/imagenes/1920x700.png",
      alt: '',
      check: true,
      id: 1,
      title: ""
    }
  ];
  @ViewChild('nav', {static: true}) ds: NgImageSliderComponent;
  sliderWidth: Number = 1505;
  sliderImageWidth: Number = 1510;
  sliderImageHeight: Number = 627;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 5;

  sliderWidth2: Number = 1505;
  sliderImageWidth2: Number = 247;
  sliderImageHeight2: Number = 200;

  boletin:any = {};

  tiendaInfo:any = {};

  constructor(
    private _productos: ProductoService,
    private _categorias: CategoriasService,
    private spinner: NgxSpinnerService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    private _tools: ToolsService,
    public _formato: FormatosService
  ) { 
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      if(!store) return false;
      this.listProductosHistorial = _.orderBy(store.productoHistorial, ['createdAt'], ['DESC']);
      this.tiendaInfo = store.configuracion || {};
      if(store.configuracion) if(store.configuracion.id) this.armandoSlider();
    });
  }

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
    this.getProductosMax();
  }

  armandoSlider(){
    try {
      if(this.tiendaInfo.foto1.length > 0 ) this.imageObject = [];
      for( let row of this.tiendaInfo.foto1 ){
        this.imageObject.unshift(
          {
            image: row.foto,
            thumbImage: row.foto,
            alt: '',
            check: true,
            id: this.codigo(),
            title: row.titulo
          }
        );
      }
      if(this.tiendaInfo.foto2.length > 0 ) this.imageObject2 = [];
      for( let row of this.tiendaInfo.foto2 ){
        this.imageObject2.unshift(
          {
            image: row.foto,
            thumbImage: row.foto,
            alt: '',
            check: true,
            id: this.codigo(),
            title: row.titulo
          }
        );
      } 
    } catch (error) {
      
    }
  }


  getCategorias(){
    this._categorias.get( { where:{ cat_activo: 0 }, limit: 6 } ).subscribe((res:any)=>{  this.listCategorias = res.data; });
  }

  SeleccionCategoria( obj:any ){
    this.query = { where:{ pro_activo: 0 }, page: 0, limit: 10 };
    if( obj.id ) this.query.where.pro_categoria = obj.id;
    this.listProductos = [];
    this.getProductos();
  }

  getProductos(){
    this.spinner.show();
    this._productos.get(this.query).subscribe((res:any)=>{ console.log(res); this.listProductos = res.data; this.spinner.hide(); }, ( error )=> { console.error(error); this.spinner.hide(); });
  }

  eventoSeleccion( texto:string ){
    if( texto == 'popular') this.query = { where:{ pro_activo: 0 }, sort: "pro_uni_venta DESC", page: 0, limit: 15 };
    if( texto == 'destacado') this.query = { where:{ pro_activo: 0 }, sort: "pro_categoria DESC", page: 0, limit: 15 };
    if( texto == 'createdAt') this.query = { where:{ pro_activo: 0 }, sort: "pro_categoria DESC", page: 0, limit: 15 };
    this.listProductos2 = [];
    this.getProductosMax();
  }

  getProductosMax(){
    this.spinner.show();
    this._productos.get(this.query2).subscribe((res:any)=>{ console.log(res); this.listProductos2 = res.data; this.spinner.hide(); }, ( error )=> { console.error(error); this.spinner.hide(); });
  }

  AgregarCart(item:any){
    let data:any = {
      articulo: item.id,
      codigo: item.pro_codigo,
      titulo: item.pro_nombre,
      foto: item.foto,
      talla: item.talla,
      cantidad: item.cantidadAdquirir || 1,
      costo: item.pro_uni_venta,
      costoTotal: ( item.pro_uni_venta*( item.cantidadAdquirir || 1 ) ),
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Agregado al Carro");
  }

  viewProducto( obj:any ){
    const dialogRef = this.dialog.open(InfoProductoComponent,{
      width: '855px',
      maxHeight: "665px",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    let filtro = this.listProductosHistorial.filter( ( row:any ) => row.id == obj.id );
    if(filtro) return false;
    let accion = new ProductoHistorialAction( obj , 'post');
    this._store.dispatch( accion );
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  imageOnClick(obj:any) {
    console.log( obj )
  }

  arrowOnClick(event) {
      //console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
      //console.log('popup arrow click', event);
  }

  prevImageClick() {
      this.ds.prev();
  }

  nextImageClick() {
      this.ds.next();
  }

  enviarBoletin(){
    let url:string = `https://wa.me/573148487506?text=Hola Servicio al cliente, como esta, saludo cordial, Email ${ this.boletin.email } Me Gustaria Tener Mas Informacion Detallada`;
    window.open( url );
  }

}
