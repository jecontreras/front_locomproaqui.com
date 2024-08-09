import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { CartAction } from 'src/app/redux/app.actions';
import { CART } from 'src/app/interfaces/sotarage';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { NgImageSliderComponent } from 'ng-image-slider';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/servicesComponents/producto.service';

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
  seleccionoColor:any = {
    tallaSelect: [
      {
        tal_descripcion: "Unica",
        cantidad: 9999
      }
    ]
  };
  seleccionnTalla:any = {};
  contador:number = 0;
  disabledBtn:boolean = false;


  mySlideImages = [];
  imageObject: any = [];

  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  @ViewChild('colorSelect') colorSelect: ElementRef;
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
  disabledSelect:boolean = true;

  gananciaEstimada:any = 0;
  disabledPr:boolean = true;
  coinShop:boolean = false;
  titleButton:string = "Confirmar pedido";
  disabledView:string = "normal";
  breakpoint: number;
  trHeight:number = 430;
  listCart = [];
  constructor(
    public dialogRef: MatDialogRef<ViewProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<CART>,
    public _tools: ToolsService,
    private _catalago: CatalogoService,
    public dialog: MatDialog,
    private activate: ActivatedRoute,
    private _router: Router,
    private _products: ProductoService
  ) {

    this._store.subscribe((store: any) => {
      store = store.name;
      //console.log(store);
      if (!store) return false;
      this.userId = store.usercabeza;
      this.dataUser = store.user || {}; console.log("this.dataUser",this.dataUser)
      this.listCart = store.cart || [];
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
      console.log("****85", this.data)
      if( this.data.view ) this.disabledView = this.data.view;
      if( this.dataUser.id ) this.validPriceUser();
      this.galeria = _.clone( this.data.listaGaleria || [] );
      this.data.cantidadAdquirir = 1;
      this.urlFoto = this.data.foto;
      this.data.encuanto = this.data.coinShop == true ? ( this.data.pro_vendedorCompra || this.data.pro_uni_venta ) : this.data.pro_uni_venta;
      console.log(this.datas, this.porcentajeMostrar)
      this.gananciaEstimada = this._tools.monedaChange(3,2,( Number( this.data.pro_uni_venta * this.porcentajeMostrar ) ) / 100);
      if( this.data.coinShop == true ) {
        this.titleButton = "Hacer Compra";
        this.coinShop = true;
      }
    }
    this.procesoNext();
    //console.log( this.data.pro_categoria.cat_nombre )
    try {
      if( ( this.data.pro_categoria.cat_nombre == "CALZADO" ) || ( this.data.pro_categoria.cat_nombre == "ROPA" )  ) this.disabledSelect = true;
      else this.disabledSelect = false;
    } catch (error) {
      console.log("*CONTROLE EL ERROR", error)
      this.disabledSelect = false;
    }

    setTimeout(()=>{
      try {
        this.breakpoint = (window.innerWidth <= 500) ? 1 : 6;
        if( this.breakpoint === 6 ) this.trHeight = 700;
      } catch (error) { }
     },2000 );
  }

  handleImageError(event: any) {
    event.target.src = 'assets/avatar.png'; // Ruta a una imagen predeterminada para mostrar en caso de error
    event.target.alt = 'Imagen no disponible';
  }

  validPriceUser(){ //consulto el configurado por el vendedor
    this._products.getPrice( { where:{
      article: this.data.id,
      user: this.dataUser.id,
      state: 0
    }}).subscribe( res =>{
      res = res.data[0];
      if( res ) {
        this.data.idMyProduct = res.id;
        if( this.data.view === "store") this.disabledView = 'createPrice';
        //el precio configurado del vendedor
        this.data.idPrice = res.price; //console.log("res.price", res.price)
        this.data.encuanto = res.price;
      }
    });
  }

  shareUrl( ){
    const url = window.location.origin+"/front/catalogo/"+this.data.id+"/"+this.dataUser.usu_telefono;
    this._tools.handleCopyHolder( url );
    return url;
  }

  procesoNext(){
    if( !this.galeria ) this.galeria || [];
    this.galeria = [];
      this.galeria.push( {
        id: this._tools.codigo(),
        foto: this.data.foto
      });
      if( this.data.listColor ) if( this.data.listColor.length ) this.data.listColor = this.data.listColor.filter(( item:any )=> {
        if( !item.tallaSelect ) item.tallaSelect = [];
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
    this.data.nameColores = "";
    this.data.nemeTalla = "";
    try {
      for( let row of this.data.listColor ){
        this.galeria.push({ id: row.id, foto: row.foto });
        this.data.nameColores+=row.talla +", "
      }
      for( let key of this.data.listColor[0].tallaSelect ) {
        this.data.nemeTalla+= key.tal_descripcion+ ", ";
      }
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
    if( this.disabledPr == false ) return this._tools.tooast({ title: "lo sentimos pero no se puedes vender este producto en este precio", icon: "warning" });
    if(  !this.data.color ) { 
        const el = document.getElementById("sel_color")
        el.focus()
        return this._tools.tooast({ title: "Lo sentimos!  Tienes que seleccionar un color", icon: "warning" });
      }
    if(  this.seleccionnTalla.cantidad < this.data.cantidadAdquirir ) return this._tools.tooast({ title: "Lo sentimos en estos momento no tenemos en stock", icon: "warning" });
    if (!this.data.tallas) {
      try {
        if( this.data.pro_categoria.cat_nombre == "CALZADO" ) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
        else this.data.tallas = "default";
      } catch (error) { return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" }); }
    }
    let color = this.data.color;
    let cantidad = this.data.cantidadAdquirir || 1;
    const coinDefault = ( this.data.precio_vendedor || this.data.pro_uni_venta );
    let precio =  this.coinShop == true ? ( this.data.pro_vendedorCompra || coinDefault ) : ( coinDefault );
    let encuanto:any = this.data.encuanto || this.data.pro_uni_venta;
    //if( this.data.listColor ) { this.data.color = this.data.listColor.find(row=>row.foto == this.data.foto) || {}; color = this.data.color.talla }
    if(opt) { opt.selecciono = true; this.suma( opt.precios , opt.cantidad ); cantidad = opt.cantidad; precio = opt.precios; }
    else this.suma( precio , this.data.cantidadAdquirir );
    /*if( this.data.precio_vendedor && !this.data.encuanto ){
      encuanto = await this._tools.alertInput( { title: "Encuanto lo vendio", input: 'text', confirme: "Agregar"} );
      if( !encuanto.value ) return this._tools.tooast({ title: "Por Favor debes decirnos en cuanto lo vendiste", icon: "warning" });
      encuanto = encuanto.value;
    }else{
      encuanto = this.data.encuanto || precio;
    }*/
    let codigoImg:string
    try {
      codigoImg = this.data.listColor.find( ( row:any )=> row.talla == this.data.color );
      if( !codigoImg ) codigoImg = "NO CODIGO";
      else codigoImg = codigoImg['id']
    } catch (error) { codigoImg = "NO CODIGO"; }
    let data = {
      articulo: this.data.id,
      codigo: this.data.pro_codigo,
      codigoImg: codigoImg,
      titulo: this.data.pro_nombre,
      color: this.data.color,
      tallaSelect: this.data.tallas || 'default',
      foto: this.urlFoto,
      cantidad: cantidad,
      costo: precio,
      loVendio: encuanto * cantidad,
      costoTotal: precio,
      id: this.codigo(),
      precioReal: this.data.precioProveedor,
      coinShop: this.coinShop,
      bodegaName: this.data.pro_usu_creacion.usu_usuario,
      idBodega: this.data.pro_usu_creacion.id
    };
    if( this.listCart.length >= 1 ) {
      let validate = this.validateArticleStore( data );
      if( !validate ) return this._tools.confirm( { title: "Lo sentimos, no podemos agregar este artículo porque son bodegas diferentes", detalle:"Tienes que agregar artículos de la misma bodega para generar las guías", icon:"error", showCancel:false } );
    }
    let accion = new CartAction(data, 'post');
    this._store.dispatch(accion);
    this._tools.presentToast("Producto agregado al carro");
    this._tools.confirm( { title: "Producto Agregado Al Carrito", icon:"success", showCancel:false } );
    //this.dialog.closeAll();
  }

  validateArticleStore( item ){
    let filtro = this.listCart.find( row => row.idBodega === item.idBodega );
    if( filtro ) return true;
    return false;
  }

  async descargarFoto( item:any ){
    if( this.disabledBtn ) return false;
    this.disabledBtn = true;
    item.base64 = await this._catalago.FormatoBase64( item.foto );
    await this._tools.descargarFoto( item.base64 );
    try {
      let lista:any = item.listaGaleria || [];
      lista.push(..._.map( item.listColor, ( row:any )=> { return { foto: row.foto, id: row.id }; } ) );
      for( let row of item.listColor ) lista.push(..._.map( row.galeriaList, ( row:any )=> { return { foto: row.foto, id: row.id }; } ) );
      //console.log("**232", lista, this.data )
      if( lista ){
        for( let row of lista ){
          this._tools.ProcessTime( { title: "Descargando..." } );
          row.base64 = await this._catalago.FormatoBase64( row.foto );
          await this._tools.descargarFoto( row.base64 );
        }
      }
      this.disabledBtn = false;
    } catch (error) {
      console.log("****243", error)
      this.disabledBtn = false;
    }
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  masInfo(obj: any) {
    console.log( obj );
    let cerialNumero: any = '';
    let numeroSplit: any;
    let cabeza: any = this.dataUser.cabeza;
    const url = this.shareUrl( );
    //if (!obj.tallas) return this._tools.tooast({ title: "Por Favor debes seleccionar una talla", icon: "warning" });
    if (cabeza) {
      numeroSplit = _.split(cabeza.usu_telefono, "+57", 2);
      if (numeroSplit[1]) cabeza.usu_telefono = numeroSplit[1];
      if (cabeza.usu_perfil == 3) cerialNumero = (cabeza.usu_indicativo || '57') + (cabeza.usu_telefono || this._tools.dataConfig.clInformacion );
      else cerialNumero = "57" + this._tools.dataConfig.clInformacion;
    } else cerialNumero = "57" + this._tools.dataConfig.clInformacion;
    if (this.userId.id) this.urlwhat = `https://wa.me/${this.userId.usu_indicativo || 57}${((_.split(this.userId.usu_telefono, "+57", 2))[1]) || this._tools.dataConfig.clInformacion }?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo ${obj.pro_codigo} codigo: ${obj.pro_codigo} talla: ${obj.tallas || ''} url ==> ${ url }`;
    else {
      this.urlwhat = `https://wa.me/${cerialNumero}?text=Hola Servicio al cliente, como esta, saludo cordial, estoy interesad@ en mas informacion ${obj.pro_nombre} codigo: ${obj.pro_codigo} talla: ${obj.tallas || ''} url ==> ${ url }`;
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
      this.data.tallas = this.seleccionoColor[0];
      this.llenadoGaleria();
      this.seleccionTalla();
      this.cambioImgs();
      //console.log( this.data.pro_sw_tallas == 5, this.data )
      try {
        if( this.data.pro_sw_tallas == 5 ) this.seleccionnTalla.cantidad = this.seleccionoColor.tallaSelect[0].cantidad;
      } catch (error) {
        console.log("ERrOR", error);
        this.seleccionnTalla.cantidad = 100;
      }
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

  validando(){
    console.log( this.data )
    if( ( this.data.encuanto < this.data.pro_vendedor )  ) { this.disabledPr = false; return this._tools.tooast({ title: "Lo sentimos! Pero se puedes vender este producto en este precio", icon: "warning" });}
    this.disabledPr = true;
  }

  alertPromocion(){
    if( this.data.checkpromo ) this._tools.confirm( { title: "Importante", detalle: "Recuerda que solo aplica despues de 2 pares en adelante la promocion no sera valido con 1 solo par tenlo en cuenta", icon: "warning"})
  }

  async handleAddStore(){
    let coinAlert = await this._tools.alertInput({
      // title: "Valor a Vender <br>¡sin puntos solo numerico!",
      title: "Lo vas a vender en",
      input: "text",
      value: String( this.data.pro_uni_venta ),
      confirme: "Agregar"
    });
    console.log("***383", coinAlert);
    console.log("coin alert", coinAlert)
    coinAlert = Number( coinAlert['value']);

    const nuevoValor:number = Number( coinAlert )
    if( !coinAlert || coinAlert == "" ) return false
    else{
      console.log("nuevoValor", nuevoValor)
      if(nuevoValor <= (this.data.pro_vendedorCompra + 15000))
        return this._tools.error({ icon: "error",title: "Importante", mensaje: "Lo Sentimos. Tu nuevo valor es menor al precio de distribuidor.", footer: "Recuerda que también debes calcular el precio del envio" } )
      else{
        let data = {
          article: this.data.id,
          user: this.dataUser.id,
          price: coinAlert
        };
        this._products.createPrice( data ).subscribe( res =>{
          this._tools.tooast({ title: "Completo", detalle: "Este Producto ha sido Agregado a tu Cuenta."})
          this.dialogRef.close('creo');
        });
      }

    }
  }

  async handleDroppArticle(){
    let alert:any = await  this._tools.confirm({title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"});
    console.log("***", alert)
    if( alert.dismiss == "cancel" ) return false;
    this._products.updatePriceArticle( { id: this.data.idMyProduct, state: 1 }).subscribe( res=>{
      this._tools.tooast({ title: "Completado", detalle: "Este Producto Esta Eliminado de tu Tienda!!!"})
      this.dialogRef.close('drop');
    },()=> this._tools.tooast({ icon: "error",title: "Importante", detalle: "Problemas de Conexion !!!" } ) );

  }

  handleUpdatePrice(){
    this._products.updatePriceArticle( { id: this.data.idMyProduct, state: 0, price: this.data.idPrice }).subscribe( res=>{
      this._tools.tooast({ title: "Completado", detalle: "Este Producto Se le Edito el Precio de Venta Final!!!"})
      //this.dialogRef.close('update');
    },()=> this._tools.tooast({ icon: "error",title: "Importante", detalle: "Problemas de Conexion !!!" } ) );
  }

  openUrl( ){
    window.open(this.data.urlMedios)
  }

  handleRelation(){
    console.log( this.data )
    //this._router.navigate( [ "/listproduct/categoria", this.data['pro_categoria'] ] );
    this.dialogRef.close();
  }


}
