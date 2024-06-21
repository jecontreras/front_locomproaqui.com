import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DANEGROUP, TRIDYCIUDAD } from 'src/app/JSON/dane-nogroup';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { DialogPedidoArmaComponent } from '../dialog-pedido-arma/dialog-pedido-arma.component';
import { Indicativo } from 'src/app/JSON/indicativo';

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
  listCiudadesF:any = [];
  keyword = 'ciudad';
  data:any = {};
  @ViewChild('nextStep', { static: true }) nextStep: ElementRef;
  currentIndex: number = 0;
  btnDisabled: boolean = false;
  codeId:string;
  view:string = "one";
  dataEnvioDetails:any = {};
  numberId:string;
  indicativoId: string;
  listIndiPais = Indicativo;
  namePais:string = "Colombia";
  constructor(
    private _productServices: ProductoService,
    public _ToolServices: ToolsService,
    private _ventas: VentasService,
    private activate: ActivatedRoute,
    public dialog: MatDialog,
    private Router: Router
  ) { }

  async ngOnInit() {
    this.dataPro = await this.getProduct();
    this.viewPhoto = this.dataPro.foto;
    this.codeId = this.activate.snapshot.paramMap.get('code');
    let formatN = this.activate.snapshot.paramMap.get('number');
    console.log("**********48", this.activate.snapshot.paramMap, formatN)
    try {
      this.numberId = ( formatN.split("+") )[1];
      this.indicativoId = ( formatN.split("+") )[0]
      let filterNamePais = this.listIndiPais.find( row => row.phone_code === this.indicativoId );
      if( filterNamePais ) this.namePais = filterNamePais.name;
    } catch (error) {
      this.numberId = "3108131582";
      this.indicativoId = "57";
    }
    this.data = await this.getVentaCode();
    if( !this.data.id ){
      /*let alert = await this._ToolServices.confirm({title:"Crear Pedido", detalle:"Deseas Crear un nuevo Pedido", confir:"Si Crear"});
      if( !alert.value ) return false;      */
      this.HandleOpenNewBuy();
    }
    this.view = "three";
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
      this._ventas.getVentasL( { where: { code: this.codeId, stateWhatsapp: 0 } } ).subscribe( res => resolve( res.data[0] || {} ), error => resolve( error ) );
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
        console.log("list ciudades", this.listCiudades)
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
    //this._ToolServices.openFotoAlert( row.foto );
    console.log("***ENTRO", row, item)
    item.foto = row.foto;
    const dialogRef = this.dialog.open(DialogPedidoArmaComponent,{
      data: { foto: row.foto },
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(selectTalla => {
      console.log(`Dialog result:`, selectTalla);
      if( !selectTalla.talla || !selectTalla.cantidad ) return false;
      row.tal_descripcion = selectTalla.talla;
      row.amountAd = selectTalla.cantidad;
      
      this.handleOpenDialogAmount( row, item, false )
    });

  }

  async handleDeleteItem( item ){
    /*let alert = await this._ToolServices.confirm({title:"Eliminar", detalle:"Deseas Eliminar Item", confir:"Si Eliminar"});
    if( !alert.value ) return false;*/
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
    this._ToolServices.presentToast("Producto Agregado al Carrito")
  }

  suma(){
    this.data.sumAmount = 0;
    for( let row of this.listDataAggregate ){
      this.data.sumAmount+= Number( row.amountAd );
    }
    if( this.data.sumAmount >= 6 ) this.data.priceTotal = this.dataPro.pro_vendedor * this.data.sumAmount;
    else this.data.priceTotal = this.dataPro.pro_uni_venta * this.data.sumAmount;
    this.data.countItem = this.data.sumAmount;
    this.data.totalAPagar = this.data.priceTotal + ( this.data.totalFlete || 0 );
  } 

  async handleEndOrder(){ console.log("handle Order")
    if( this.btnDisabled ) return false;
    let validate = this.validarInput();
    if( !validate ) return false;
    this.btnDisabled = true;
    let dataEnd:any = this.data;
    dataEnd.listProduct = this.listDataAggregate;
    //edu
    console.log("this.data.transportadora",this.data.transportadora)
    dataEnd.transportadora = this.data.transportadora //EDU
    
    if( dataEnd.ciudad.ciudad_full ) {
      dataEnd.codeCiudad = dataEnd.ciudad.id_ciudad;
      dataEnd.ciudad = dataEnd.ciudad.ciudad_full;
      // dataEnd.transportadora = dataEnd.ciudad.transportadora; // EDU quedaba indefinido 20240613
    }
    dataEnd.stateWhatsapp = 1;
    this.suma();
    await this.precioRutulo( { id_ciudad:dataEnd.codeCiudad,  transportadora: dataEnd.transportadora} );
    dataEnd.totalFlete = this.data.totalFlete;
    this.suma();
    let result = await this._ToolServices.modaHtmlEnd( dataEnd );
    if( !result ) {this.btnDisabled = false; return this._ToolServices.presentToast("Editar Tu Pedido..."); }
    this._ventas.updateVentasL( dataEnd ).subscribe( res =>{
      //console.log("*****101", res)
      if( !res.id ) return false;
      if( this.numberId ) this.openWhatsapp( res );
      this._ToolServices.presentToast("Tu pedido ha sido enviado correctamente gracias por tu compra.!");
      this.btnDisabled = false;
      //this.data = [];
      this.listDataAggregate = [];
      this.view = 'foor';
      /*setTimeout(()=> {
      let url = "https://wa.me/573228174758?text=";
       window.open( url );
      }, 9000 );*/
      //EDU
      this.pedidoGuardar(dataEnd); //edu
    },()=> this.btnDisabled = true);
    //console.log("***data", dataEnd)
  }

  //edu
  pedidoGuardar(pedido){             
    console.log("pedido", pedido)
    const options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(pedido)
    }
    let url = "http://localhost/pedidosweb/api/lokompro/pedidolw.php";
    url = "https://ginga.com.co/pedidosweb/api/lokompro/pedidolw.php";
    fetch( url,options)
    .then(response => response.json())
    .then(data => { console.log(data)
      if(data.response == "ok"){
        console.log("Pedido Realizado")
      }
    })
  }

  handleOpenWhatsapp(){
    if( !this.numberId ) {
      let url = "https://wa.me/573228174758?text=";
      window.open( url );
    }
    setTimeout(()=> window.close(), 5000 );
  }

  HandleOpenNewBuy(){
    let dats = { 
      "sumAmount": 0,
      "priceTotal": 0,
      "nombre": ".",
      "ciudad": ".",
      "direccion": ".",
      "barrio": ".",
      "numero": this.data.numero || 0,
      "listProduct": [],
      "code": this._ToolServices.codigo(),
      "countItem": 0,
      "totalFlete": 0,
      "totalAPagar": 0
   };
   this._ventas.createVentasL( dats ).subscribe( res =>{
    if( res ){
      this.Router.navigate(['/front/landingWhatsapp', dats.code ] );
      setTimeout(()=> location.reload(), 3000 );
    }
   } );

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
    /*let urlWhatsapp = `https://wa.me/${ this.indicativoId }${ this.numberId }?text=${ encodeURIComponent(` Hola Servicio al Cliente de VICTOR LANDAZURY
      Acabo de realizar un Pedido \n
      Mi Nombre es: ${ data.nombre } \n      
      Ciudad: ${ data.ciudad } \n
      Numero: ${ data.numero} Direccion: ${ data.direccion } \n
      Barrio: ${ data.barrio } \n
      ID de Pedido: ${ data.id } \n
      
      Cantidad de pares: ${ this.data.sumAmount } \n
      
      * Transportadora: * ${ this.data.transportadora } \n
      * valor de los Zapatos: * ${ this.data.totalAPagar -  this.data.totalFlete }
      * valor del Flete: * ${ this.data.totalFlete } \n
      * Total a Pagar: * ${  this.data.totalAPagar } \n
      
      Quedo al pendiente de la guía de despacho tan pronto la tengas me la envías muchas gracias 🙂 `)}`;*/
    let urlWhatsapp = `https://wa.me/${ this.indicativoId }${ this.numberId }?text=${ encodeURIComponent(` Cod: 785
¡Gracias por tu compra, Victor!🤩

¡Es un honor para nosotros que hagas parte de nuestra familia! ✨

✈ Tus datos para la entrega son: 

Nombre: ${ data.nombre }
WhatsApp: ${ data.numero}
Dirección: ${ data.direccion }
Ciudad: ${ data.ciudad }
Cantidad de pares: ${ this.data.sumAmount } *
* Transportadora: * ${ this._ToolServices.monedaChange( 3,2, ( this.data.transportadora || 0 ) ) }
Valor de productos: ${ this._ToolServices.monedaChange(3,2,( ( this.data.totalAPagar -  this.data.totalFlete ) || 0 )) }
Valor de flete: ${ this._ToolServices.monedaChange( 3,2, ( this.data.totalFlete || 0 ) ) }
Monto a cancelar: ${ this._ToolServices.monedaChange( 3,2, ( this.data.totalAPagar || 0 ) ) } ¡Pagas al recibir!

⏳ Tiempo de entrega: 2 a 8 días hábiles (depende de tu ubicación y transportadora).

🤝 en el transcurso del día te enviaremos la guía de tu pedido`)}`;
    window.open( urlWhatsapp );
    this.data = {};
    this.listDataAggregate = [];
    window.document.scrollingElement.scrollTop=0;
  }

  async precioRutulo( ev:any ){
    return new Promise( async ( resolve ) =>{
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
      if ( this.data.sumAmount > 0 )  {
        data.peso = 1;
        data.alto= 9;
        sumaFlete = 1000;
      }
      if ( this.data.sumAmount > 6 )  {
        data.peso = 2;
        data.alto= 9;
        sumaFlete = 2000;
      }
      if ( this.data.sumAmount > 12 )  {
        data.peso = 3;
        data.alto= 9;
        sumaFlete = 3000;
      }
      if ( this.data.sumAmount > 18 )  {
        data.peso = 4;
        data.alto= 9;
        sumaFlete = 4000;
      }
      if ( this.data.sumAmount > 24 )  {
        data.peso = 5;
        data.alto= 9;
        sumaFlete = 5000;
      }
      if ( this.data.sumAmount > 31 )  {
        data.peso = 6;
        data.alto= 9;
        sumaFlete = 6000;
      }
      if ( this.data.sumAmount > 37 )  {
        data.peso = 7;
        data.alto= 9;
        sumaFlete = 7000;
      }
      if ( this.data.sumAmount > 43 )  {
        data.peso = 8;
        data.alto= 9;
        sumaFlete = 8000;
      }
      if ( this.data.sumAmount > 49 )  {
        data.peso = 9;
        data.alto= 9;
        sumaFlete = 9000;
      }
      if( ev.transportadora === "InterRapidisimo"){
        if ( this.data.sumAmount > 0 )  {
          data.peso = 1;
          data.alto= 9;
          sumaFlete = 1000;
        }
        if ( this.data.sumAmount > 12 )  {
          data.peso = 2;
          data.alto= 9 ;
          sumaFlete = 2000;
        }
        if ( this.data.sumAmount > 18 )  {
          data.peso = 3;
          data.alto= 9;
          sumaFlete = 3000;
        }
        if ( this.data.sumAmount > 25 )  {
          data.peso = 4;
          data.alto= 9;
          sumaFlete = 4000;
        }
        if ( this.data.sumAmount > 32 )  {
          data.peso = 5;
          data.alto= 9;
          sumaFlete = 5000;
        }
        if ( this.data.sumAmount > 38 )  {
          data.peso = 6;
          data.alto= 9;
          sumaFlete = 6000;
        }
        if ( this.data.sumAmount > 44 )  {
          data.peso = 7;
          data.alto= 9;
          sumaFlete = 7000;
        }
        if ( this.data.sumAmount > 50 )  {
          data.peso = 8;
          data.alto= 9;
          sumaFlete = 8000;
        }
        if ( this.data.sumAmount > 56 )  {
          data.peso = 9;
          data.alto= 9;
          sumaFlete = 9000;
        }
      }
      this.btnDisabled = true;
      let res:any = await this.getTridy( data );
      if( res.data === "Cannot find table 0." ) res = await this.getTridy( data );
      if( res.data === "Cannot find table 0." )  { this.btnDisabled = false; this.data.totalFlete = 0; resolve( true ); return this._ToolServices.presentToast( "Ok Tenemos Problemas Con Las Cotizaciones de Flete lo sentimos, un asesor se comunicar contigo gracias que pena la molestia" )  }
      data.valor_recaudar = ( Number( ( res.data || 0 ) ) + sumaFlete ) + data.valor_recaudar ;
      res = await this.getTridy( data );
      this.data.totalFlete = Number( ( res.data || 0 ) ) ;
      this.data.totalFlete = Number(this.data.totalFlete.toFixed(2));
      this.data.transportadora = ev.transportadora;
      console.log("transportadora", this.data.transportadora)
      this.data.id_ciudad = ev.id_ciudad;
      console.log(this.data.totalFlete); // Muestra 1.78
      if( !res.data ){
        this.data.totalFlete = 0;
      }
      //this._ToolServices.basic("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  ev.transportadora );
      this._ToolServices.presentToast("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  ev.transportadora );
      this.dataEnvioDetails = ev;
      this.suma();
      this.btnDisabled = false;
      resolve( true );
    })
  }

  getTridy( data ){
    return new Promise( resolve =>{
      this._ventas.getFleteValorTriidy( data ).subscribe( res =>{
        resolve( res );
      });
    });
  }
  onChangeSearch( val:any ){
    //console.log( ev )
    if (val) {
      this.listCiudadesF = this.listCiudades.filter((ciudad) =>
        ciudad.ciudad.toLowerCase().includes(val.toLowerCase())
      );
    } else {
      this.listCiudadesF = [];
    }
  }

  handleSelect( view:string, opt:number ){
    this.view = view;
  }

}
