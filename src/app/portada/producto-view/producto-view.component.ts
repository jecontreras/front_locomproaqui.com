import { Component, OnInit, ViewChild } from '@angular/core';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { Store } from '@ngrx/store';
import { SeleccionCategoriaAction, CartAction, ProductoHistorialAction, UserCabezaAction } from 'src/app/redux/app.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { InfoProductoComponent } from '../info-producto/info-producto.component';
import { NgImageSliderComponent } from 'ng-image-slider';
import { FormatosService } from 'src/app/services/formatos.service';
import * as moment from 'moment';
import { ChecktDialogComponent } from '../checkt-dialog/checkt-dialog.component';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-producto-view',
  templateUrl: './producto-view.component.html',
  styleUrls: ['./producto-view.component.scss']
})
export class ProductosViewComponent implements OnInit {

  id:any;
  data:any = {
    listComentarios: []
  };
  pedido:any = { cantidad:1 };
  view:string = "descripcion";
  rango:number = 250;
  listProductos:any = [];
  query:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 30
  };
  queryId:any = {
    where:{
      pro_activo: 0
    },
    page: 0,
    limit: 1
  };
  loader:boolean = false;
  notEmptyPost:boolean = true;
  notscrolly:boolean=true;
  listProductosHistorial:any = [];
  tiendaInfo:any = {};
  comentario:any = {};
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
  imageObject3:any = [
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
  sliderWidth: Number = 1119;
  sliderImageWidth: Number = 250;
  sliderImageHeight: Number = 200;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;
  userId:any = {};
  dataUser:any = {};
  urlwhat:string
  listGaleria:any = [];
  viewsImagen:string;
  listTallas:any = [];
  number:any;

  constructor(
    private _store: Store<CART>,
    private _tools: ToolsService,
    private activate: ActivatedRoute,
    private _producto: ProductoService,
    private Router: Router,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public _formato: FormatosService,
    private _user: UsuariosService

  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      if(!store) return false;
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      this.listProductosHistorial = _.orderBy(store.productoHistorial, ['createdAt'], ['DESC']);
      this.tiendaInfo = store.configuracion || {};
      if( store.usercabeza ) {
        this.queryId.where.idPrice = store.usercabeza.id;
        this.query.where.idPrice = store.usercabeza.id;
       }
    });
  }

  async ngOnInit() {
    console.log("**127", this.activate.snapshot.params)
    if((this.activate.snapshot.paramMap.get('id'))){
      this.id = this.activate.snapshot.paramMap.get('id');
      this.getProducto();
      this.getProductos();
    }
    this.number = this.activate.snapshot.paramMap.get('cel');
    if( this.number ) this.dataUser = await this.getUser();
    window.document.scrollingElement.scrollTop=0

  }

  getUser(){
    return new Promise( resolve =>{
      this._user.get({ where:{ usu_telefono: this.number }, limit: 1 } ).subscribe( item =>{
        item = item.data[0];
        if( item ) {
          this.GuardarStoreUser( item );
          this.query.where.idPrice = item.id;
        }
        resolve( item );
      },()=> resolve( false ) );
    })
  }

  GuardarStoreUser( data:any ) {
    let accion = new UserCabezaAction( data , 'post');
    this._store.dispatch(accion);
  }

  getProducto(){
    this.queryId.where.id = this.id;
    this._producto.get( this.queryId ).subscribe((res:any)=>{
      this.data = res.data[0] || {};
      this.data.listComentarios = this.data.listComment || [];
      console.log("***165", this.data.listComentarios)
      try {
        this.data.listTallas = this.data.listColor[0].tallaSelect.filter( item => item.cantidad );
        //for( let row of this.data.listTallas ) row.tal_descripcion = ( Number( row.tal_descripcion ) || row.tal_descripcion );
        //this.data.listTallas = _.orderBy( this.data.listTallas , ['tal_descripcion'], ['DEC'] );
        console.log( "129", this.data )
      } catch (error) {}
      this.viewsImagen = this.data.foto;
      if( !this.data.listComentarios ) this.data.listComentarios = [];
      this.listGaleria = this.data.galeria || [];
      for( let row of this.data.listColor){
        this.listTallas.push( ... ( _.filter( row.tallaSelect, off=> off.check == true ) ) );
        this.listTallas = _.unionBy( this.listTallas || [], this.listTallas, 'id');
      }
      for( let row of this.data.listColor ) {
        let filtro = this.listGaleria.find( item => item.pri_imagen == row.foto );
        if( !filtro ) this.listGaleria.push( { id: this._tools.codigo(), pri_imagen: row.foto } );
      }
      this.listGaleria.push( { id: this._tools.codigo(), pri_imagen: this.data.foto})
    }, error=> { console.error(error); this._tools.presentToast('Error de servidor'); });
  }

  verImagen( img:any ){
    console.log("***",img)
    this.viewsImagen = img.pri_imagen || this.data.foto;
  }

  async getProductos(){
    this.query.where.codigo = this.data.codigo;
    delete this.query.where.id;
    let resultado:any = await this.getArticulos();
    this.imageObject = [];
    for( let row of resultado ){
      this.imageObject.push(
        {
          image: row.foto,
          thumbImage: row.foto,
          alt: '',
          check: true,
          id: row.id,
          ids: row.id,
          title: this._formato.monedaChange( 3, 2, row.pro_uni_venta || 0 )
        }
      );
    }
  }

  getArticulos(){
    return new Promise (resolve =>{
      this.query.where.idPrice = this.userId.id;
      console.log("***210", this.query)
      this._producto.getStore( this.query ).subscribe((res:any)=>{
        resolve( res.data )
      }, ( error )=> { console.error(error); resolve( [] ); } );
    })
  }

  suma(){
    this.data.costo = Number( this.pedido.cantidad ) * this.data.pro_uni_venta;
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  categoriasVer(){
    let accion = new SeleccionCategoriaAction( this.data.pro_categoria, 'post');
    this._store.dispatch(accion);
    this.Router.navigate(['/tienda/productos']);
  }

  AgregarCart(){
    this.suma();
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      color: "",
      talla: this.pedido.talla,
      foto: this.data.foto,
      cantidad: this.pedido.cantidad || 1,
      costo: this.data.pro_uni_venta,
      costoTotal: this.data.costo,
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Producto agregado al carro");
  }

  viewProducto( obj:any ){
    /*const dialogRef = this.dialog.open(InfoProductoComponent,{
      width: '855px',
      maxHeight: "665px",
      data: { datos: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
    let filtro = this.listProductosHistorial.filter( ( row:any ) => row.id == obj.id );
    if(!filtro) {
      let accion = new ProductoHistorialAction( obj , 'post');
      this._store.dispatch( accion );
    }
    this.Router.navigate(['/front/productosView', obj.id, this.dataUser.usu_telefono ]);
    setTimeout(()=>location.reload(), 200)
  }

  AgregarCart2( item:any ){
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

  async imageOnClick(obj:any) {
    //let data =  this.listProductosHistorial.find( (row:any )=> row.id == this.imageObject[obj].id);
    let data = await this.getProducId( { where: {
      idPrice: this.query.where.idPrice,
      pro_activo: 0
    } } );
    console.log("**++",obj, data, this.imageObject, this.listProductosHistorial)
    if( !data ) return false;
    this.viewProducto( data );
  }

  getProducId( query){
    return new Promise( resolve=>{
      this._producto.get( query ).subscribe((res:any)=>{
        resolve( res.data[0] || {});
      });
    })
  }

  arrowOnClick(event) {
      // console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
      // console.log('popup arrow click', event);
  }

  prevImageClick() {
      this.ds.prev();
  }

  nextImageClick() {
      this.ds.next();
  }

  masInfo(obj:any){
    obj.talla = this.pedido.talla;
    obj.cantidad = this.pedido.cantidad || 1;
    let cerialNumero:any = '';
    let numeroSplit:any;
    let cabeza:any = this.dataUser.cabeza;
    if( cabeza ){
      numeroSplit = _.split( cabeza.usu_telefono, "+57", 2);
      if( numeroSplit[1] ) cabeza.usu_telefono = numeroSplit[1];
      if( cabeza.usu_perfil == 3 ) cerialNumero = ( cabeza.usu_indicativo || '57' ) + ( cabeza.usu_telefono || '3208429429' );
      else cerialNumero = "57"+this.validarNumero();
    }else cerialNumero = "57"+this.validarNumero();
    if(this.userId.id) this.urlwhat = `https://wa.me/${ this.userId.usu_indicativo || 57 }${ ( (_.split( this.userId.usu_telefono , "+57", 2))[1] ) || '3208429429'}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} foto ==> ${ obj.foto } Talla: ${ obj.talla || 'default' }`;
    else {
      this.urlwhat = `https://wa.me/${ cerialNumero }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} foto ==> ${ obj.foto } Talla: ${ obj.talla || 'default'}`;
    }
    window.open(this.urlwhat);
  }

  guardarComentario(){
    this._producto.createTestimonio( {
      descripcion: this.comentario.descripcion,
      nombre: this.comentario.nombre,
      email: this.comentario.email,
      productos: this.data.id
    }).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Comentario creado" } );
      this.comentario = {};
      this.data.listComentarios.push( {
        nombre: res.nombre,
        fecha:  moment( res.createdAt ).format("DD/MM/YYYY"),
        descripcion: res.descripcion,
        posicion: _.random(0, 10),
        foto: "./assets/noimagen.jpg"
      } );
    },()=> this._tools.tooast( { title: "Error al crear el Comentario" } ) );
  }

  comprarArticulo( cantidad:number, opt ){
    this.suma();
    //this.AgregarCart();
    this.data.cantidadAd = opt == true ? cantidad : this.pedido.cantidad || cantidad;
    try {
      this.data.talla = this.pedido.talla || this.data.listTallas[0].tal_descripcion;
    } catch (error) { }
    this.data.opt = opt;
    this.data.foto = this.viewsImagen;
    const dialogRef = this.dialog.open(ChecktDialogComponent,{
      //width: '855px',
      //maxHeight: "665px",
      data: { datos: this.data }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  validarNumero(){
    return this.tiendaInfo.numeroCelular || "3156027551";
  }

  handleSelect( item ){
    //console.log("***364", item)
    this.viewsImagen = item.foto;
    this.data.colorSelect = item.talla;
    for( let row of this.data.listColor) row.check1 = false;
    item.check1 = true;
  }

  checkTalla( item ){
    this.pedido.talla = item.tal_descripcion;
    for( let row of this.data.listTallas ) row.check1 = false;
    item.check1 = !item.check1;

  }

  handleAdviser(){
    let number = this.userId.usu_telefono;
    if(number.length == 12 ) number;
    else number='57'+number;
    let url = `https://wa.me/${ number }?text=${encodeURIComponent(`👉Hola buenas! 🎉 Me gustaria mas informacion gracias 👈`)}`;
    window.open( url, "Mas Informacion", "width=640, height=480");
  }


}
