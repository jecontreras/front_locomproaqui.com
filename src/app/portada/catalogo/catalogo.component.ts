import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { NgImageSliderComponent } from 'ng-image-slider';
import { CART } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';
import { MatDialog, MatSnackBar } from '@angular/material';
import { setTimeout } from 'timers';
import { ChecktDialogComponent } from '../checkt-dialog/checkt-dialog.component';
import { FormatosService } from 'src/app/services/formatos.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { UserCabezaAction } from 'src/app/redux/app.actions';
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  id:string;
  data:any = {};
  listGaleria = [];
  urlFoto:string = "";
  form:any = {
    checkEnvio: true
  };
  urlWhatsapp: string = "";
  timeot= {
    hora: 0,
    minuto: 15,
    milesegundo: 15
  };
  tiendaInfo:any = {};
  imageObject:any = [
    {
      image: "./assets/imagenes/1920x700.png",
      thumbImage: "./assets/imagenes/1920x700.png",
      alt: '',
      check: true,
      id: 1,
      title: ""
    }
  ]
  @ViewChild('nav', {static: true}) ds: NgImageSliderComponent;
  sliderWidth: Number = 500;
  sliderImageWidth: Number = 60;
  sliderImageHeight: Number = 60;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 0;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;
  comentario:any = {};
  view:boolean = false;
  listComentario:any = [{
    foto: './assets/noimagen.jpg',
    nombre: "Ainhoa Pabón",
    fecha: "2023-05-05",
    descripcion: " Ordenado para mi esposo, esta muy felices, suave, el tamaño es correcto, hecho con cuidado, embalado de forma segura, la entrega es rápida"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Rayan Ybarra",
    fecha: "2023-05-04",
    descripcion: " Lo que necesito gracias,"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Alejandro Almaráz",
    fecha: "2023-04-06",
    descripcion: " Excelente"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Rosa Pérez",
    fecha: "2022-11-26",
    descripcion: "Me gustó el material bueno y llegué a tiempo"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Dario Soria",
    fecha: "2023-04-27",
    descripcion: "Super rápido, buen producto,"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Arnau Pardo",
    fecha: "2023-03-29",
    descripcion: "excelentes Calzado, tenia duda en pedirlas pero están super tal y cual en la imagen, las recomiendo....."
  },{
    foto: './assets/noimagen.jpg',
    nombre: "María Pilar Viera",
    fecha: "2022-11-21",
    descripcion: "Es realmente hermoso me gusta"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Eduardo Alaniz",
    fecha: "2023-04-17",
    descripcion: "lindas"
  },{
    foto: './assets/noimagen.jpg',
    nombre: "Julia Melgar",
    fecha: "2023-03-16",
    descripcion: "Son bellos"
  }];

  durationInSeconds = 5;
  pedido:any = { cantidad:1 };
  number:any;
  dataUser:any = {};
  query:any = {
    where:{

    },
    limit: 1,
    page: 0
  }

  constructor(
    private activate: ActivatedRoute,
    private _producto: ProductoService,
    public _tools: ToolsService,
    private _ventas: VentasService,
    private _store: Store<CART>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public _formato: FormatosService,
    private _user: UsuariosService
  ) {
    this.configTime();
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.tiendaInfo = store.usercabeza || {};
    });
    setInterval(()=>{
      this.openSnackBar();
    }, 50000 );
  }

  async ngOnInit() {
    this.id = ( this.activate.snapshot.paramMap.get('id') );
    if( this.id ) this.query.where.id = this.id;
    this.number = this.activate.snapshot.paramMap.get('cel');
    if( this.number ) this.dataUser = await this.getUser();
    window.document.scrollingElement.scrollTop=0
    this.getArticulos();
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

  getArticulos(){
    this.imageObject = [];
    this._producto.get( this.query ).subscribe(( res:any )=>{
      this.data = res.data[0] || {}
      try {
        if( this.data.listComment ) this.listComentario.push( ...this.data.listComment )
      } catch (error) { }
      this.urlFoto = this.data.foto;
      for( let row of this.data.listColor ){
        if( row.galeriaList)for( let key of row.galeriaList ) this.listGaleria.push( { ... key, name: row.talla } );
      }
      if( this.data.galeria ) for( let key of this.data.galeria ) this.listGaleria.push( { ...key, foto:key.pri_imagen  } );
      if( this.data.listaGaleria ) for( let key of this.data.listaGaleria ) this.listGaleria.push( { ...key, foto:key.foto  } );
      for( let row of this.listGaleria ) this.imageObject.push( {
        image: row.foto,
        thumbImage: row.foto,
        alt: '',
        check: true,
        id: row.id,
        title: ""
      });
      try {
        this.data.listTallas = this.data.listColor[0].tallaSelect.filter( item => item.cantidad );
      } catch (error) {}
      console.log("***27", this.data, "*******", this.listGaleria, this.imageObject )
    });
  }

  handleSubmit(){
    let validate:any = this.validador();
    if( !validate ) return false;
    /*this.urlWhatsapp = `https://api.whatsapp.com/send?phone=573156027551&amp;text=${ encodeURIComponent(`Hola estoy interesado en los tenis
      nombre: ${ this.form.nombre }
      celular: ${ this.form.celular }
      direccion: ${ this.form.direccion }
      ciudad: ${ this.form.ciudad }
      foto: ${ this.urlFoto }
      cantidad: 1,
      Talla: ${ this.form.talla }
      Total a pagar ${ this.data.pro_uni_venta }
      envio: Gratis
      ENVÍO DE 4 -8 DÍAS HÁBILES GRATIS
    `) } `;
    window.open( this.urlWhatsapp );*/
    this.urlWhatsapp = `https://wa.me/57${ this.tiendaInfo.usu_telefono }?text=${encodeURIComponent(`
          DATOS DE CONFIRMACIÓN DE COMPRA:
          Nombre: ${ this.form.nombre }
          Celular: ${ this.form.celular }
          Direccion: ${ this.form.direccion }
          Ciudad: ${ this.form.ciudad }
          Foto: ${ this.urlFoto }
          Cantidad: 1
          Talla: ${ this.form.talla }
          Color: ${ this.form.color }
          Total a pagar: ${ this.data.pro_uni_venta } (PAGO CONTRA ENTREGA)
          Envío de 4 -8 días hábiles
      EN ESPERA DE LA GUÍA DE DESPACHO.
    `)}`;
    console.log(this.urlWhatsapp);
    window.open(this.urlWhatsapp);
    let formsData:any = {
      "ven_tipo": "whatsapp",
      "usu_clave_int": this.tiendaInfo.id,
      "ven_usu_creacion": this.tiendaInfo.usu_email,
      "ven_fecha_venta": moment().format("DD/MM/YYYY"),
      "cob_num_cedula_cliente": this.form.celular,
      "ven_nombre_cliente": this.form.nombre,
      "ven_telefono_cliente": this.form.celular,
      "ven_ciudad": this.form.ciudad,
      "ven_barrio": this.form.direccion,
      "ven_direccion_cliente": this.form.direccion,
      "ven_cantidad": 1,
      "ven_tallas": this.form.talla,
      "ven_precio": this.data.pro_uni_venta,
      "ven_total": this.data.pro_uni_venta || 0,
      "ven_ganancias": 0,
      "ven_observacion": "ok la talla es " + this.form.talla + " y el color " + this.form.color,
      "nombreProducto": "ok la talla es " + this.form.talla + " y el color " + this.form.color,
      "ven_estado": 0,
      "create": moment().format("DD/MM/YYYY"),
      "apartamento": '',
      "departamento":'',
      "ven_imagen_producto": this.data.foto
    };

    this._ventas.create( formsData ).subscribe(( res:any )=>{
      this._tools.presentToast("Exitoso Tu pedido esta en proceso. un accesor se pondra en contacto contigo!");
    },( error:any )=> { } );

  }
  handleColor(){
    console.log("***", this.data, this.form)
    this.urlFoto = ( this.data.listColor.find( item => item.talla == this.form.color ) ).foto;
    this._tools.openFotoAlert( this.urlFoto );
  }
  validador(){
    if( !this.form.nombre ) { this._tools.tooast( { title: "Error falta el nombre ", icon: "error"}); return false; }
    if( !this.form.celular ) { this._tools.tooast( { title: "Error falta el celular ( whatsapp)", icon: "error"}); return false; }
    if( !this.form.direccion ) { this._tools.tooast( { title: "Error falta la direccion ", icon: "error"}); return false; }
    if( !this.form.ciudad  ) { this._tools.tooast( { title: "Error falta la ciudad ", icon: "error"}); return false; }
    if( !this.form.talla ) { this._tools.tooast( { title: "Error falta la talla ", icon: "error"}); return false; }
    if( !this.form.color ) { this._tools.tooast( { title: "Error falta el color ", icon: "error"}); return false; }
    return true;
  }

  handleNewPhoto( row ){
    this.urlFoto = row.foto;
  }

  configTime(){
    let minuto = 15;
    let milegundo = 15;
    setInterval(()=>{
      if( minuto === 0 ) return false;
      milegundo--;
      if(milegundo == 0 ) {
        minuto--;
        milegundo = 60;
      }
      this.timeot.hora = 0;
      this.timeot.minuto = minuto;
      this.timeot.milesegundo = milegundo;
    }, 1000 );
  }

  imageOnClick(obj:any) {
    console.log("***173", obj)
    console.log("***", this.imageObject[obj])
    this.urlFoto = this.imageObject[obj].image;
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

  guardarComentario(){
    this._producto.createTestimonio( {
      descripcion: this.comentario.descripcion,
      nombre: this.comentario.nombre,
      email: this.comentario.email,
      productos: this.data.id
    }).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Comentario creado" } );
      this.comentario = {};
    },()=> this._tools.tooast( { title: "Error al crear el Comentario" } ) );
  }

  activates(){
    console.log("******HELLO")
    this.view = !this.view;
  }

  comprarArticulo(){
    let url = `https://wa.me/57${ this.tiendaInfo.usu_telefono }?text=${encodeURIComponent(` Hola servicio al cliente necesito mas informacion gracias`)}`;
    window.open( url, "Mas Informacion", "width=640, height=480");
  }

  openSnackBar() {
    this._snackBar.openFromComponent(PizzaPartyComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  suma(){
    this.data.costo = Number( this.pedido.cantidad ) * this.data.pro_uni_venta;
  }

  buyArticulo( cantidad:number, opt ){
    window.document.scrollingElement.scrollTop=3000;
    /*this.suma();
    //this.AgregarCart();
    this.data.cantidadAd = opt == true ? cantidad : this.pedido.cantidad || cantidad;
    this.data.talla = this.pedido.talla;
    this.data.opt = opt;
    this.data.foto = this.urlFoto;
    const dialogRef = this.dialog.open(ChecktDialogComponent,{
      //width: '855px',
      //maxHeight: "665px",
      data: { datos: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }



}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`
    .example-pizza-party {
      color: white;
      font-size: 15px;
    }
  `],
})
export class PizzaPartyComponent {
  data:any = [
    {
      txt: " Andres Ciudad Armenia"
    },{
      txt: " Albaro Ciudad Caqueta"
    },{
      txt: " Diego Ciudad Bogota"
    },{
      txt: " Juan Ciudad Medellin"
    },{
      txt: " Huberth Ciudad Bogota"
    },{
      txt: " Cesar Ciudad Bucaramanga"
    },{
      txt: " Alberto Ciudad Cartagena"
    },{
      txt: " Andrea Ciudad Medellin"
    },{
      txt: " Roberto Ciudad Santa martha"
    },{
      txt: " Eduardo Ciudad Huila"
    },{
      txt: " Alvaro Ciudad Bogota"
    },
  ];
  txtData:string;
  constructor(){

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    this.txtData = this.data[getRandomInt(10)].txt;
    this.audioNotificando('./assets/sonidos/notificando.mp3');
    setInterval(()=>{
      this.txtData = this.data[getRandomInt(10)].txt;
    }, 50000 )
  }
  audioNotificando(obj:string){
    console.log("**SONAR")
    let sonido = new Audio();
    sonido.src = obj;
    sonido.load();
    sonido.play();
  }
  // Expected output: 0, 1 or 2
}
