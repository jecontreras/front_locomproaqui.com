import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { CartAction } from 'src/app/redux/app.actions';
import { CART } from 'src/app/interfaces/sotarage';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { NgImageSliderComponent } from 'ng-image-slider';

@Component({
  selector: 'app-view-productos',
  templateUrl: './view-productos.component.html',
  styleUrls: ['./view-productos.component.scss']
})
export class ViewProductosComponent implements OnInit {

  data:any = {};
  rango:number = 250;
  urlwhat: string
  userId: any;
  dataUser:any = {};
  urlFoto:string;
  galeria:any = [];
  seleccionoColor:any = {};
  seleccionnTalla:any = {};
  contador:number = 0;
  disabledBtn:boolean = false;


  mySlideImages = [];
  imageObject: any = [];

  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  sliderWidth: Number = 300;
  sliderImageWidth: Number = 90;
  sliderImageHeight: Number = 100;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = false;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;

  opcionCurrencys:any = {};
  porcentajeMostrar:number = 10;
  porcentajeUser: number = 0;
  
  constructor(
    public dialogRef: MatDialogRef<ViewProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<CART>,
    public _tools: ToolsService,
    private _catalago: CatalogoService,
    public dialog: MatDialog,
  ) { 

    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.userId = store.usercabeza;
      this.dataUser = store.user || {};
      try {
        if (this.dataUser.categoriaPerfil) this.porcentajeUser = this.dataUser.categoriaPerfil.precioPorcentaje;
      } catch (error) {
        this.porcentajeUser = 0;
      }
      if( this.porcentajeUser > this.dataUser.porcentaje ) this.porcentajeMostrar = this.porcentajeUser;
      else this.porcentajeMostrar = this.dataUser.porcentaje;
    });
  }

  ngOnInit() {

    this.opcionCurrencys = this._tools.currency;
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.galeria = _.clone( this.data.listaGaleria || [] );
      this.data.cantidadAdquirir = 1;
      this.urlFoto = this.data.foto;
      this.data.encuanto = this.data.pro_uni_venta;
      console.log(this.datas)
    }
    this.procesoNext();

    /*setTimeout(()=>{ 
      try {
        this.data.color = this.data.listColor[0].talla;
        this.cambioImgs(); 
        this.colorSeleccionado( ); 
      } catch (error) { }
     },2000 );*/
  }

  procesoNext(){
    if( !this.galeria ) this.galeria || [];
    this.galeria = [];
      this.galeria.push( {
        id: this._tools.codigo(),
        foto: this.data.foto
      });
      console.log(this.data);
      if( this.data.listColor ) if( this.data.listColor.length ) this.data.listColor = this.data.listColor.filter(( item:any )=> {
        item.tallaSelect = item.tallaSelect.filter(( row:any ) => Number( row.cantidad ) > 0 );
        if( item.galeriaList ) this.galeria.push( ... item.galeriaList );
        return true;
      } );
      //this.data.cantidadAdquirir = 1;
      this.llenandoGaleria();
      for( let row of this.galeria ) this.imageObject.unshift({
        //image: row.foto,
        thumbImage: row.foto,
        alt: '',
        check: true,
        id: 0,
      });
  }

  llenandoGaleria(){
    try {
      for( let row of this.data.listColor )
      this.galeria.push({ id: row.id, foto: row.foto });
    } catch (error) {}
  }

  ngOnDestroy(){
   // console.log("saliendo", this.data, this.datas.datos );
  }

  seleccionFoto( foto:string ){
    this.urlFoto = foto;
  }

  getProducto(){

  }

  descargar(){

  }

  suma( numero:any, cantidad:any ){
    this.data.costo = Number( cantidad ) * Number( numero );
  }
  
  cambioImgs(){
    //console.log( this.seleccionoColor );
    this.urlFoto = this.seleccionoColor.foto;
    //console.log( this.urlFoto );
  }

  async AgregarCart( opt:any ){
    if(  this.seleccionnTalla.cantidad < this.data.cantidadAdquirir ) return this._tools.tooast({ title: "Lo sentimos en estos momento no tenemos en stock", icon: "warning" });
    if (!this.data.tallas) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    let color = '';
    let cantidad = this.data.cantidadAdquirir || 1;
    let precio = this.data.precio_vendedor || this.data.pro_uni_venta;
    if( this.data.listColor ) { this.data.color = this.data.listColor.find(row=>row.foto = this.data.foto) || {}; color = this.data.color.talla }
    if(opt) { opt.selecciono = true; this.suma( opt.precios , opt.cantidad ); cantidad = opt.cantidad; precio = opt.precios; }
    else this.suma( ( this.data.precio_vendedor || this.data.pro_uni_venta ) , this.data.cantidadAdquirir );
    let encuanto:any = this.data.pro_uni_venta;
    /*if( this.data.precio_vendedor && !this.data.encuanto ){
      encuanto = await this._tools.alertInput( { title: "Encuanto lo vendio", input: 'text', confirme: "Agregar"} );
      if( !encuanto.value ) return this._tools.tooast({ title: "Por Favor debes decirnos en cuanto lo vendiste", icon: "warning" });
      encuanto = encuanto.value;
    }else{
      encuanto = this.data.encuanto || precio;
    }*/
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      titulo: this.data.pro_nombre,
      color: color,
      tallaSelect: this.data.tallas || 'default',
      foto: this.urlFoto,
      cantidad: cantidad,
      costo: precio,
      loVendio: encuanto,
      costoTotal: this.data.costo,
      id: this.codigo()
    };
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Producto agregado al carro");
    this.dialog.closeAll();
  }

  async descargarFoto( item:any ){
    if( this.disabledBtn ) return false;
    this.disabledBtn = true;
    item.base64 = await this._catalago.FormatoBase64( item.foto );
    await this._tools.descargarFoto( item.base64 );
    try {
      let lista:any = item.listaGaleria;
      lista.push(..._.map( item.listColor, ( row:any )=> { return { foto: row.foto, id: row.id }; } ) );
      if( lista ){
        for( let row of lista ){
          this._tools.ProcessTime( { title: "Descargando..." } );
          row.base64 = await this._catalago.FormatoBase64( row.foto );
          await this._tools.descargarFoto( row.base64 );
        }
      }
      this.disabledBtn = false;
    } catch (error) {
      this.disabledBtn = false;
    }
  }
  
  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  masInfo(obj: any) {
    //console.log( obj );
    let cerialNumero: any = '';
    let numeroSplit: any;
    let cabeza: any = this.dataUser.cabeza;
    if (!obj.tallas) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    if (cabeza) {
      numeroSplit = _.split(cabeza.usu_telefono, "+57", 2);
      if (numeroSplit[1]) cabeza.usu_telefono = numeroSplit[1];
      if (cabeza.usu_perfil == 3) cerialNumero = (cabeza.usu_indicativo || '57') + (cabeza.usu_telefono || this._tools.dataConfig.clInformacion );
      else cerialNumero = "57" + this._tools.dataConfig.clInformacion;
    } else cerialNumero = "57" + this._tools.dataConfig.clInformacion;
    if (this.userId.id) this.urlwhat = `https://wa.me/${this.userId.usu_indicativo || 57}${((_.split(this.userId.usu_telefono, "+57", 2))[1]) || this._tools.dataConfig.clInformacion }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} codigo: ${obj.pro_codigo} talla: ${obj.tallas} foto ==> ${obj.this.urlFoto}`;
    else {
      this.urlwhat = `https://wa.me/${cerialNumero}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo: ${obj.pro_codigo} talla: ${obj.tallas} foto ==> ${obj.this.urlFoto}`;
    }
    window.open(this.urlwhat);
  }

  colorSeleccionado(){
    try {
      if( !this.data.color ) return this.procesoNext();
      if( this.data.color == 'null' ) return this.procesoNext();
      this.data.tallas = "";
      this.seleccionnTalla = {};
      this.seleccionoColor = this.data.listColor.find( row => row.talla == this.data.color );
      this.llenadoGaleria();  
      this.seleccionTalla();
      this.cambioImgs();
    } catch (error) {}
  }

  llenadoGaleria(){
    this.imageObject = [];
    this.imageObject.push( 
      {
        //image: this.seleccionoColor.foto,
        thumbImage: this.seleccionoColor.foto,
        alt: '',
        check: true,
        id: 0,
      }
    );
    for( let row of this.seleccionoColor.galeriaList ) this.imageObject.unshift({
      //image: row.foto,
      thumbImage: row.foto,
      alt: '',
      check: true,
      id: 0,
    });
  }

  seleccionTalla(){
    try {
      //console.log( this.data );
      if( !this.data.tallas ) return false;
      this.seleccionnTalla = this.seleccionoColor.tallaSelect.find( row => row.tal_descripcion == this.data.tallas );
      //console.log( this.seleccionnTalla );
    } catch (error) { console.log( error ); }
  }

  previusFoto(){
    try {
      this.contador--;
      if( Object.keys( this.galeria[ this.contador ] ).length < 1) return;
      this.urlFoto = this.galeria[ this.contador ].foto;
    } catch (error) { this.contador++; }
  }

  nextFoto(){
    try {
      this.contador++; 
      if( Object.keys( this.galeria[ this.contador ] ).length < 1) return;
      this.urlFoto = this.galeria[ this.contador ].foto;
    } catch (error) {
      this.contador--;
    }
  }

  imageOnClick(index: any) {
    //con
    this.urlFoto = this.imageObject[index].thumbImage;
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

  eventoFoto( event ){
    //console.log( event )
  }

}
