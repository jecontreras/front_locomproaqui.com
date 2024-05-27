import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DANEGROUP, TRIDYCIUDAD } from 'src/app/JSON/dane-nogroup';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-landing-whatsapp',
  templateUrl: './landing-whatsapp.component.html',
  styleUrls: ['./landing-whatsapp.component.scss']
})
export class LandingWhatsappComponent implements OnInit {

  dataPro:any = [];
  listGaleria:any = [];
  viewPhoto:string;
  listDataAggregate:any = [];
  listCiudades:any = TRIDYCIUDAD;
  keyword = 'ciudad';
  data:any = {};
  @ViewChild('nextStep', { static: true }) nextStep: ElementRef;
  currentIndex: number = 0;
  btnDisabled: boolean = false;
  codeId:string;

  constructor(
    private _productServices: ProductoService,
    public _ToolServices: ToolsService,
    private _ventas: VentasService,
    private activate: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.dataPro = await this.getProduct();
    this.viewPhoto = this.dataPro.foto;
    this.codeId = this.activate.snapshot.paramMap.get('code');
    this.data = await this.getVentaCode( );
    if( this.data.id ) { this.listDataAggregate = this.data.listProduct || []; this.suma(); }
    this.data.sumAmount = 0;
    this.data.priceTotal = 0;
    
    try {
      for( let row of this.dataPro.listColor ){
        row.detailsP = {};
        row.tallaSelect = row.tallaSelect.filter( item => item.check === true );
        this.listGaleria.push( ...row.galeriaList );
      }
      this.listGaleria.sort(() => this.getRandomNumber());
    } catch (error) { }
    //console.log("****", this.dataPro, this.listGaleria)
  }

  getVentaCode(){
    return new Promise( resolve =>{
      this._ventas.getVentasL( { where: { code: this.codeId } } ).subscribe( res => resolve( res.data[0] || {} ), error => resolve( error ) );
    });
  }

  getRandomNumber() {
    return Math.random() - 0.5;
  }

  scrollToNextStep() {
    if (this.nextStep) {
      this.nextStep.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Función para mostrar la foto siguiente
  showNextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.listGaleria.length;
  }

  // Función para mostrar la foto anterior
  showPreviousPhoto() {
    this.currentIndex = (this.currentIndex - 1 + this.listGaleria.length) % this.listGaleria.length;
  }
  getProduct(){
    return new Promise( resolve =>{
      this._productServices.get( { where: { id: 1456 } } ).subscribe( res => resolve( res.data[0] ), error => resolve( error ) );
    })
  }

  async getCiudades(){
    return new Promise( resolve => {
      this._ventas.getCiudades( { where: { }, limit: 100000 } ).subscribe( ( res:any )=>{
        this.listCiudades = res.data;
        resolve( this.listCiudades );
      });
    });
  }

  handleOpenViewPhoto( photo:string ){
    this.viewPhoto = photo;
  }

  handleOpenViewPhotoG( photo:string, list:any ){
    list.foto = photo;
  }

  async handleOpenDialogPhoto( row, item ){
    this._ToolServices.openFotoAlert( row.foto );
    item.foto = row.foto;
    let selectTalla:any = await this._ToolServices.modalInputSelect();
    console.log("****70", selectTalla)
    if( !selectTalla ) return false;
    row.tal_descripcion = selectTalla.talla;
    row.amountAd = selectTalla.cantidad;
    this.handleOpenDialogAmount( row, item, false )
  }

  async handleDeleteItem( item ){
    let alert = await this._ToolServices.confirm({title:"Eliminar", detalle:"Deseas Eliminar Item", confir:"Si Eliminar"});
    if( !alert.value ) return false;
    this.listDataAggregate = this.listDataAggregate.filter( row => row.id !== item.id );
    this.suma();
  }

  async handleOpenDialogAmount( row, item, opt ){
    if( opt === true ) {
      let result:any = await this._ToolServices.alertInput( { input: "number", title: "Cantidad adquirir", confirme: "Aceptar" } );
      if( !result.value ) return false;
      row.cantidadAd = result.value;
    }
    this.listDataAggregate.push( { ref: item.talla, foto: item.detailsP.foto, amountAd: Number( row.amountAd ), talla: row.tal_descripcion, id: this._ToolServices.codigo() } );
    console.log("***114", this.listDataAggregate)
    this.suma();
    this._ToolServices.basic("Producto Agregado al Carrito")
  }

  suma(){
    this.data.sumAmount = 0;
    for( let row of this.listDataAggregate ){
      this.data.sumAmount+= row.amountAd;
    }
    if( this.data.sumAmount >= 6 ) this.data.priceTotal = this.dataPro.pro_vendedor * this.data.sumAmount;
    else this.data.priceTotal = this.dataPro.pro_uni_venta * this.data.sumAmount;
    this.data.countItem = this.data.sumAmount;
    this.data.totalAPagar = this.data.priceTotal;
  } 

  async handleEndOrder(){
    if( this.btnDisabled ) return false;
    let validate = this.validarInput();
    if( !validate ) return false;
    this.btnDisabled = true;
    let dataEnd:any = this.data;
    dataEnd.listProduct = this.listDataAggregate;
    if( dataEnd.ciudad.ciudad_full ) {
      dataEnd.codeCiudad = dataEnd.ciudad.id_ciudad;
      dataEnd.ciudad = dataEnd.ciudad.ciudad_full;
    }
    dataEnd.stateWhatsapp = 1;
    let result = await this._ToolServices.modaHtmlEnd( dataEnd );
    console.log("1111", result );
    if( !result ) {this.btnDisabled = false; return this._ToolServices.presentToast("Editar Tu Pedido..."); }

    this._ventas.updateVentasL( dataEnd ).subscribe( res =>{
      //console.log("*****101", res)
      if( !res.id ) return false;
      //this.openWhatsapp( res );
      this._ToolServices.presentToast("Tu pedido ha sido enviado correctamente gracias por tu compra.!");
      this.btnDisabled = false;
      this.data = [];
      this.listDataAggregate = [];
      setTimeout(()=> window.close(), 5000 );
    },()=> this.btnDisabled = true);
    //console.log("***data", dataEnd)
  }

  validarCantidad(){
    let sum = 0;
    for( let row of this.listDataAggregate ) sum+=row.amountAd
    if( sum < 6 ) this._ToolServices.basicIcons( { header: "Alerta", subheader: "Recuerda que para aplicar al precio de $15.500 son despues de 6 pares en adelante de lo contrario saldran a $25.000"})
  }

  validarInput(){
    if( !this.data.nombre ) { this._ToolServices.presentToast("Falta Tu Nombre!"); return false; }
    if( !this.data.ciudad ) { this._ToolServices.presentToast("Falta Tu Ciudad!"); return false; }
    if( !this.data.direccion ) { this._ToolServices.presentToast("Falta Tu Dirección!"); return false; }
    if( !this.data.barrio ) {this._ToolServices.presentToast("Falta Tu Barrio!"); return false; }
    if( !this.data.numero ) {this._ToolServices.presentToast("Falta Tu Numero!"); return false; }
    if( this.listDataAggregate.length === 0 ) {this._ToolServices.presentToast("Falta Tu Agregar Articulos Al Carrito!"); return false; }
    return true;
  }

  openWhatsapp( data:any ){
    /*let urlWhatsapp = `https://wa.me/573108131582?text=
      *Hola Servicio al Cliente este es mi Pedido*
      *Nombre*: ${ data.nombre }
      *Ciudad*: ${ data.ciudad }
      *Numero*: ${ data.numero }
      *Direccion*: ${ data.direccion }
      *Barrio*: ${ data.barrio }
      *Numero de mi Pedido*: ${ data.id }
    `;*/
    let urlWhatsapp = `https://wa.me/573112128943?text=${ encodeURIComponent(` Hola Servicio al Cliente de VICTOR LANDAZURY
      Acabo de realizar un Pedido \n
      Mi Nombre es: ${ data.nombre } \n      
      Ciudad: ${ data.ciudad } \n
      Numero: ${ data.numero} Direccion: ${ data.direccion } \n
      Barrio: ${ data.barrio } \n
      ID de Pedido: ${ data.id } \n
      
      Cantidad de pares: ${ this.data.sumAmount } \n
      
      Valor a pagar ${  this.data.priceTotal } \n
      ((A espera que le agregues el valor de envío*para saber cuánto debo pagar en total al momento de recibir el pedido)) \n
      
      Quedo al pendiente de la guía de despacho tan pronto la tengas me la envías muchas gracias 🙂 `)}`;
    window.open( urlWhatsapp );
    this.data = {};
    this.listDataAggregate = [];
    window.document.scrollingElement.scrollTop=0;
  }

  async precioRutulo( ev:any ){
    console.log("***EVE", ev);
    let data = {
      peso: 1 ,
      alto: 9,
      ancho: 21,
      profundo: 28,
      idDestino: ev.id_ciudad,
      valor_declarado: ( this.data.priceTotal * 50 ) / 100 ,
      valor_recaudar: this.data.priceTotal
    };
    let sumaFlete = 0;
    if ( this.data.sumAmount > 6 )  {
      data.peso = 2;
      data.alto= 9 * 2;
      sumaFlete = 2000;
    }
    else if ( this.data.sumAmount > 12 )  {
      data.peso = 3;
      data.alto= 9 * 3;
      sumaFlete = 3000;
    }
    else if ( this.data.sumAmount > 18 )  {
      data.peso = 4;
      data.alto= 9 * 4;
      sumaFlete = 4000;
    }
    else if ( this.data.sumAmount > 24 )  {
      data.peso = 5;
      data.alto= 9 * 5;
      sumaFlete = 5000;
    }
    else if ( this.data.sumAmount > 31 )  {
      data.peso = 6;
      data.alto= 9 * 6;
      sumaFlete = 6000;
    }
    else if ( this.data.sumAmount > 37 )  {
      data.peso = 7;
      data.alto= 9 * 7;
      sumaFlete = 7000;
    }
    else if ( this.data.sumAmount > 43 )  {
      data.peso = 8;
      data.alto= 9 * 8;
      sumaFlete = 8000;
    }
    else if ( this.data.sumAmount > 49 )  {
      data.peso = 9;
      data.alto= 9 * 9;
      sumaFlete = 9000;
    }
    else {
      data.peso = 1;
      sumaFlete = 1000;
    }
    this._ventas.getFleteValorTriidy( data ).subscribe( res =>{
      this.data.totalFlete = Number( ( res.data || 0 ) ) + sumaFlete ;
      this.suma();
    });
  }
  onChangeSearch( ev:any ){
    //console.log( ev )
  }

}
