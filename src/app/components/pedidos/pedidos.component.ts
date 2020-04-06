import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { MatDialog } from '@angular/material';
import { ViewProductosComponent } from '../view-productos/view-productos.component';
import { CART } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { CartAction, UserCabezaAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { NgImageSliderComponent } from 'ng-image-slider';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  @ViewChild('nav', {static: true}) ds: NgImageSliderComponent;
  sliderWidth: Number = 1204;
  sliderImageWidth: Number = 211;
  sliderImageHeight: Number = 44;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = false;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 15
  };
  seartxt:string = '';
  listProductos:any = [];
  loader:boolean = false;
  urlwhat:string
  userId:any;
  mySlideImages = [];
  imageObject:any = [];

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;


  constructor(
    private _productos: ProductoService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    private _tools: ToolsService,
    private activate: ActivatedRoute,
    private _user: UsuariosService,
    private _categorias: CategoriasService,
    private spinner: NgxSpinnerService
  ) { 

    this.cargarProductos();
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.userId = store.usercabeza;
    });

  }

  ngOnInit() {
    if((this.activate.snapshot.paramMap.get('id'))) { this.userId = (this.activate.snapshot.paramMap.get('id')); this.getUser(); }
    this.getCategorias();
  }
  
  getUser(){
    this._user.get( { where: { id: this.userId } } ).subscribe((res:any)=>{ this.userId = res.data[0]; this.GuardarStoreUser() }, (error)=>{ console.error(error); this.userId = '';});
  }
  GuardarStoreUser(){
    let accion = new UserCabezaAction(this.userId, 'post');
    this._store.dispatch(accion);
  }
  getCategorias(){
    this._categorias.get( { where:{ cat_activo: 0 }, limit: 100 } ).subscribe((res:any)=>{ 
    for(let row of res.data){
      this.imageObject.push({
        image: row.cat_imagen || './assets/categoria.jpeg',
        thumbImage: row.cat_imagen,
        alt: '',
        id: row.id,
        title: row.cat_nombre
      });
    }
    this.imageObject.unshift({
      image: './assets/categoria.jpeg',
      thumbImage: './assets/categoria.jpeg',
      alt: '',
      check: true,
      id: 0,
      title: "Todos"
    });
  });
  }
  cargarProductos(){
    this.spinner.show();
    this._productos.get(this.query).subscribe((res:any)=>{
        console.log("res", res);
        this.loader = false;
        this.spinner.hide();
        this.listProductos = _.unionBy(this.listProductos || [], res.data, 'id');
        
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
        
    });
  }
  buscar() {
    //console.log(this.seartxt);
    this.loader = true;
    this.seartxt = this.seartxt.trim();
    this.listProductos = [];
    this.notscrolly = true; 
    this.notEmptyPost = true;
    if (this.seartxt === '') {
      this.query = {where:{pro_activo: 0},limit: 15, page: 0};
      this.cargarProductos();
    } else {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.seartxt|| ''
          }
        },
        {
          pro_descripcion: {
            contains: this.seartxt|| ''
          }
        },
        {
          pro_descripcionbreve: {
            contains: this.seartxt|| ''
          }
        },
        {
          pro_codigo: {
            contains: this.seartxt|| ''
          }
        }
      ];
      this.cargarProductos();
    }
  }
  agregar(obj){
    const dialogRef = this.dialog.open(ViewProductosComponent,{
      width: '855px',
      maxHeight: "665px",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    }); 
  }
  masInfo(obj:any){
    if(this.userId) this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo || 57 }${ this.userId.usu_telefono || '3148487506'}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo}`;
    else this.urlwhat = `https://wa.me/573148487506?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo}`;
    window.open(this.urlwhat);
  }
  
  maxCantidad(obj:any){
    if(!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.cantidadAdquirir++;
    obj.pro_uni_ventaEdit = ( obj.cantidadAdquirir * obj.pro_uni_venta );
  }
  
  manualCantidad(obj:any){
    if(!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.pro_uni_ventaEdit = ( obj.cantidadAdquirir * obj.pro_uni_venta );
  }

  menosCantidad(obj){
    if(!obj.cantidadAdquirir) obj.cantidadAdquirir = 1;
    obj.cantidadAdquirir = obj.cantidadAdquirir-1;
    if(obj.cantidadAdquirir <= -1 ) obj.cantidadAdquirir = 0;
    obj.pro_uni_ventaEdit = ( obj.cantidadAdquirir * obj.pro_uni_venta );
  }

  AgregarCart(item:any){
    console.log(item);
    let data:any = {
      articulo: item.id,
      codigo: item.pro_codigo,
      titulo: item.pro_nombre,
      foto: item.foto,
      cantidad: item.cantidadAdquirir || 1,
      costo: item.pro_uni_venta,
      costoTotal: ( item.pro_uni_venta*( item.cantidadAdquirir || 1 ) ),
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Agregado al Carro");
  }
  
  imageOnClick(index:any, obj:any) {
      //console.log('index', index, this.imageObject[index]);
      for(let row of this.imageObject) row.check = false;
      obj.check = true;
      this.query = { where:{ pro_activo: 0 }, page: 0, limit: 10 };
      if( this.imageObject[index].id >0 ) this.query = { where:{ pro_activo: 0, pro_categoria: this.imageObject[index].id }, page: 0, limit: 10 };
      this.listProductos = [];
      this.notscrolly = true; 
      this.notEmptyPost = true;
      this.cargarProductos();
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

  onScroll(){
   if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      this.query.page++;
      this.cargarProductos();
    }
  }
  
  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

}
