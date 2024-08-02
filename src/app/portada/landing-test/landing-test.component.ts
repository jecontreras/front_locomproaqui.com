import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TRIDYCIUDAD } from 'src/app/JSON/dane-nogroup';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { DialogPedidoArmaComponent } from '../dialog-pedido-arma/dialog-pedido-arma.component';
import { Indicativo } from 'src/app/JSON/indicativo';
import { departamento } from 'src/app/JSON/departamentos';
import * as _ from 'lodash';

@Component({
  selector: 'app-landing-test',
  templateUrl: './landing-test.component.html',
  styleUrls: ['./landing-test.component.scss']
})
export class LandingTestComponent implements OnInit {
  dataPro:any = {};
  listGaleria:any = [];
  viewPhoto:string;
  listDataAggregate:any = [];
  listCiudades:any = TRIDYCIUDAD;
  listDepartamentoFullTD:any = departamento;
  listCiudadesRSelect:any = [];
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
  finalizarBoton: boolean = false;
  contraentregaAlert: boolean = false;
  price:number = 15500;
  code:string = "COP"
  constructor(
    private _productServices: ProductoService,
    public _ToolServices: ToolsService,
    private _ventas: VentasService,
    private activate: ActivatedRoute,
    public dialog: MatDialog,
    private Router: Router
  ) { }

  async ngOnInit() {
    this.dataInit( true );
  }
  getLocation() {
    this._ToolServices.getPosition().then((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Latitude: " + latitude + " Longitude: " + longitude);
      this.data.latitude  = latitude;
      this.data.longitude = longitude;
      // Aquí puedes enviar la ubicación al servidor o usarla como desees
    }).catch((error) => {
      console.error("Error getting location: ", error);
    });
  }

  async dataInit( off = true ){
    if( off ) this.dataPro = await this.getProduct();
    //console.log("articulos", this.dataPro)
    this.viewPhoto = this.dataPro.foto;
    this.codeId = this.activate.snapshot.paramMap.get('code');
    let formatN = this.activate.snapshot.paramMap.get('number');
    //console.log("**********48", this.activate.snapshot.paramMap, formatN)
    try {
      this.numberId = ( formatN.split("&") )[1];
      this.indicativoId = ( formatN.split("&") )[0]
      let filterNamePais = this.listIndiPais.find( row => row.iso3 === this.indicativoId );
      if( filterNamePais ) {
        this.namePais = filterNamePais.name;
        if( this.namePais === 'Panama' ) {
          this.price = 5;
          this.code = "USD";
        }else{
          this.price = this.dataPro.pro_vendedor;
          this.code = "COP";
        }
      }
    } catch (error) {
      this.numberId = "3108131582";
      this.indicativoId = "COL";
      this.price = this.dataPro.pro_vendedor;
    }
    this.getCiudades();
    let res:any = await this.getVentaCode();
    this.data.id = res.id;
    this.data.code = res.code;

    if( !this.data.id ){
      /*let alert = await this._ToolServices.confirm({title:"Crear Pedido", detalle:"Deseas Crear un nuevo Pedido", confir:"Si Crear"});
      if( !alert.value ) return false;      */
      this.HandleOpenNewBuy();
    }
    this.view = "three";
    this.data.sumAmount = 0;
    this.data.priceTotal = 0;
    if( this.data.id ) { this.listDataAggregate = this.data.listProduct || []; this.suma(); }

    try {
      for( let row of this.dataPro.listColor ){
        row.detailsP = {};
        row.tallaSelect = row.tallaSelect.filter( item => item.check === true );
        this.listGaleria.push( ...row.galeriaList );
      }
      this.listGaleria.sort(() => this.getRandomNumber());
    } catch (error) { }
    setTimeout(()=> this.getLocation(), 5000 );
    //console.log("****", this.dataPro, this.listGaleria)
    //console.log("list ciudades", this.listCiudades)
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

    if( this.namePais === 'Colombia'){
      return new Promise( resolve => {
        this._ventas.getCiudadesTridy( { where: { pais:'COLOMBIA' }, limit: 100000 } ).subscribe( ( res:any )=>{
          //this.listCiudades = res.data;
          this.listCiudades = res.data;
          resolve( this.listCiudades );
        });
      });
    }else{
      return new Promise( resolve =>{
        this._ventas.getCiudadesTridy( { where: { pais:'PANAMA' }, limit: 100000 } ).subscribe( ( res:any )=>{
          //this.listCiudades = res.data;
          this.listCiudades = res.data;
          resolve( this.listCiudades );
        });
      })
    }

  }

  handleOpenViewPhoto( photo:string ){
    this.viewPhoto = photo;
  }

  handleOpenViewPhotoG( photo:string, list:any ){
    list.foto = photo;
  }

  async handleOpenDialogPhoto( row, item ){
    //this._ToolServices.openFotoAlert( row.foto );
    //console.log("***ENTRO", row, item)
    item.foto = row.foto;
    const dialogRef = this.dialog.open(DialogPedidoArmaComponent,{
      data: { foto: row.foto },
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(selectTalla => {
      //console.log(`Dialog result:`, selectTalla);
      if( !selectTalla.talla || !selectTalla.cantidad || !item.foto ) return false;
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
    if( !item.detailsP.foto ) return this._ToolServices.presentToast("Tenemos problemas, seleccionar una foto")
    this.listDataAggregate.push( { ref: item.talla, foto: item.detailsP.foto, amountAd: Number( row.amountAd ), talla: row.tal_descripcion, id: this._ToolServices.codigo(), price: this.price } );
    console.log("***114", this.listDataAggregate)
    this.suma();
    this._ToolServices.presentToast("Producto Agregado al Carrito")
  }

  suma(){
    this.data.sumAmount = 0;
    let sumPrice = this.price;
    console.log("****186", sumPrice, this.namePais)
    for( let row of this.listDataAggregate ) {
      row.price = this.price;
      this.data.sumAmount+= Number( row.amountAd )
    }
    if( this.data.sumAmount >= 6 ) {
      if( this.namePais === 'Panama') this.finalizarBoton = false;
      if( this.namePais === 'Colombia')  this.price = this.dataPro.pro_vendedor;
      this.data.priceTotal = this.price * this.data.sumAmount;
    }
    else {
      if( this.namePais === 'Panama'){ //PANAMA
        this.data.priceTotal =  sumPrice * this.data.sumAmount;
        this.finalizarBoton = true;
        this._ToolServices.presentToast("La Compra Minima es de 6 pares de calzado");
      }else{ // COLOMBIA
        this.price = this.dataPro.pro_uni_venta;
        this.data.priceTotal = this.price * this.data.sumAmount;
      }

    }
    this.data.countItem = this.data.sumAmount;
    this.data.totalAPagar = this.data.priceTotal + ( this.data.totalFlete || 0 );
  }

  //edu
  async pedidoConfirmar(){ console.log("pedidoconfirmar")
    let dataEnd:any = this.data;
    dataEnd.listProduct = this.listDataAggregate;
    console.log("this.data.transportadora",this.data.transportadora)
    dataEnd.transportadora = this.data.transportadora //EDU
    dataEnd.numerowsap = this.numberId
    this.celularConfirmar(dataEnd);
  }

  handleCheckContra(){
    this.contraentregaAlert = !this.contraentregaAlert;
    this.data.totalFlete = 0;
    this.suma();
  }

  async handleEndOrder(){ console.log("handle Order", this.btnDisabled)
    if( this.btnDisabled ) return false;
    let validate = this.validarInput();
    if( !validate ) return false;
    this.btnDisabled = true;
    let dataEnd:any = this.data;
    this.view = 'one';
    if( dataEnd.ciudad.ciudad_full ) {
      dataEnd.codeCiudad = dataEnd.ciudad.id_ciudad;
      dataEnd.ciudad = dataEnd.ciudad.ciudad_full;
      console.log("*****262", dataEnd )
    }
    dataEnd.stateWhatsapp = 1;
    dataEnd.paisCreado = this.namePais;
    dataEnd.numberCreado = this.numberId;
    this.suma();
    if( !this.contraentregaAlert ) await this.handleProcesFlete( false );
    dataEnd.totalFlete = this.data.totalFlete;
    this.suma();
    if( this.contraentregaAlert === true ) dataEnd.contraEntrega = 1;
    else dataEnd.contraEntrega = 0;
    this.ProcessNextUpdateVentaL( dataEnd )
    let result = await this._ToolServices.modaHtmlEnd( dataEnd );
    if( !result ) {this.btnDisabled = false; this.view = 'three'; return this._ToolServices.presentToast("Editar Tu Pedido..."); }
    let res:any = await this.ProcessNextUpdateVentaL( dataEnd );
    //console.log("*****101", res)
    this.view = 'three';
    if( !res.id ) { this._ToolServices.presentToast("Ok, tenemos problemas con tu envío, por favor recargar tu página!"); this.btnDisabled = false; return false; };
    this.data = res;
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
    this.pedidoGuardar(dataEnd)
  }

  ProcessNextUpdateVentaL( dataEnd ){
    return new Promise( resolve =>{
      this._ventas.updateVentasL( dataEnd ).subscribe( res => resolve( res) );
    })
  }

  celularConfirmar(pedido){
    console.log("pedido", pedido)
    const options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(pedido)
    }
    let url = "http://localhost/pedidosweb/api/lokompro/celularConfirmar.php";
    url = "https://ginga.com.co/pedidosweb/api/lokompro/celularConfirmar.php";
    fetch( url,options)
    .then(response => response.json())
    .then(data => { console.log("api pedidosweb",data)
      if(data.response == "ok"){
        console.log("numero confirmado")
        this.handleEndOrder()
      }
      else{
        console.log("problema")
        this._ToolServices.presentToast(data.msj);
      }
    })
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
    .then(data => { console.log("api pedidoslw",data)
      if(data.response == "ok"){
        console.log("Pedido Realizado")
        this.handleEndOrder()
      }
      // else{
      //   console.log("problema")
      //   this._ToolServices.presentToast(data.msj);
      // }
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
      "totalAPagar": 0,
      paisCreado: this.namePais,
      numberCreado: this.numberId
   };
   this._ventas.createVentasL( dats ).subscribe( res =>{
    if( res ){
      //console.log("*****335", '/front/landingWhatsapp'+dats.code+this.indicativoId+this.numberId);
      this.Router.navigate(['/front/landingWhatsapp', dats.code, `${ this.indicativoId }&${ this.numberId }` ] );
      setTimeout(()=> this.dataInit( false ), 3000 );
      //setTimeout(()=> location.reload(), 3000 );
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
    if( !this.data.celL ) {this._ToolServices.presentToast("Falta Tu Numero de contacto!"); return false; }
    if( this.listDataAggregate.length === 0 ) {this._ToolServices.presentToast("Falta Tu Agregar Articulos Al Carrito!"); return false; }
    return true;
  }

  openWhatsapp( data:any ){
    let urlWhatsapp = `https://wa.me/57${ this.numberId }?text=${ encodeURIComponent(` Cod: 785
¡Gracias por tu compra, ${ data.nombre }!🤩

¡Es un honor para nosotros que hagas parte de nuestra familia! ✨

✈ Tus datos para la entrega son:

Nombre: ${ data.nombre }
WhatsApp: ${ data.numero}
Dirección: ${ data.direccion }
Ciudad: ${ data.ciudad }
Cantidad de pares: * ${ this.data.countItem } *
* Transportadora: * ${ this.data.transportadora }
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

  redondeaAlAlza(xx,r) {
    xx = Math.floor(xx/r)
    if (xx!=xx/r) {xx++}
    return (xx*r)
}
btnFleteDisable:boolean = false;
  async precioRutulo( ev:any, opt:boolean = true ){
    return new Promise( async ( resolve ) =>{
      console.log("***EVE", ev);
      this.data.transportadora = ev.transportadora;
      this.data.totalFlete = 0;
      this.data.id_ciudad = ev.id_ciudad;
      this.dataEnvioDetails = ev;
      this.contraentregaAlert = false;
      if(ev.contraentrega != "SI" || !this.data.id_ciudad ){ this.contraentregaAlert = true; this.data.totalFlete = 0;  return resolve( true ) }
      let data = {
        peso: 1 ,
        alto: 9,
        ancho: 21,
        profundo: 28,
        idDestino: ev.id_ciudad,
        valor_declarado: ( this.data.priceTotal * 50 ) / 100 ,
        valor_recaudar: this.data.priceTotal,
        transport: ev.transportadora
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
        if ( this.data.sumAmount >= 6 && this.data.sumAmount <= 17 )  {
          data.peso = 2;
        }
        if ( this.data.sumAmount >= 18 && this.data.sumAmount <= 25 )  {
          data.peso = 4;
        }
        if ( this.data.sumAmount >= 26 && this.data.sumAmount <= 32 )  {
          data.peso = 5;
        }
        if ( this.data.sumAmount >= 33 && this.data.sumAmount <= 38 )  {
          data.peso = 6;
        }
        if ( this.data.sumAmount >= 39 && this.data.sumAmount <= 44 )  {
          data.peso = 7;
        }
      }
      this.data.af = sumaFlete; //el AF
      this.btnDisabled = true;
      this._ToolServices.presentToast( "Estamos consultando tu flete esperé un momento, gracias..." );
      let res:any = await this.getTridy( data );
      if( res.data === "Cannot find table 0." ) res = await this.getTridy( data );
      if( res.data === "Cannot find table 0." )  { this.btnDisabled = false; this.data.totalFlete = 0; this.contraentregaAlert = true; resolve( false ); return this._ToolServices.presentToast( "Ok Tenemos Problemas Con Las Cotizaciones de Flete lo sentimos, un asesor se comunicar contigo gracias que pena la molestia" )  }
      /*data.valor_recaudar = ( Number( ( res.data || 0 ) ) + sumaFlete ) ;
      res = await this.getTridy( data );*/
      this.data.totalFlete = Number( ( res.data || 0 ) ) ;
      console.log("res triidy", this.data.totalFlete)
      this.data.totalFlete = Number(this.data.totalFlete.toFixed(2));
      this.data.totalFlete = this.redondeaAlAlza(this.data.totalFlete,1000);
      console.log("redondeado",this.data.totalFlete )
      this.data.totalFlete += 5000
      console.log("aumento 5k", this.data.totalFlete)
      console.log("af", sumaFlete )
      this.data.totalFlete += sumaFlete
      console.log("con AF" , this.data.totalFlete)
      // this.data.totalFlete += data.valor_recaudar
      //console.log("transportadora", this.data.transportadora)
      //console.log(this.data.totalFlete); // Muestra 1.78
      if( !res.data ){
        this.data.totalFlete = 0;
      }
      //this._ToolServices.basic("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  ev.transportadora );
      if( opt === true ) this._ToolServices.presentToast("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  ev.transportadora );
      this.suma();
      this.btnDisabled = false;
      resolve( this.data.totalFlete );
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
    console.log( val, this.listCiudades )
    this.contraentregaAlert = false
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

  handleSelectDepartament(){
    let filterR = this.listCiudades.find( row => row.id_ciudad == this.data.departamento )
    console.log("***566", this.data, filterR )
    if( filterR ){
      this.listCiudadesRSelect = filterR.ciudadesList
    }
  }
  async handleProcesFlete( opt:boolean = true ){
    console.log("*¨**574", this.data, this.listCiudadesRSelect );
    let dataFletePrice = [];
    let filterR = this.listCiudadesRSelect.find( row => row.id_ciudad == this.data.ciudades );
    console.log("****", filterR)
    if( this.listDataAggregate.length === 0 ) return true;
    if( filterR ){
      let dataF:any = {};
      let index = 0;
      for( let row of filterR.transport ){
        if( row.contraentrega === 'SI' && row.transportadora !== "Domicilio" ){
          dataF = {
            transportadora: row.transportadora,
            id_ciudad: row.id_ciudad,
            contraentrega: String( row.contraentrega ),
          };
          let r = await this.precioRutulo( dataF, false )
          if( r === false ) continue;
          dataFletePrice.push( { ...dataF, price: r } );
          if( index >=2 ) break; // Consulta con 3 transportadoras
          index++;
        }
      }
    }
    let valAlto = _.orderBy(dataFletePrice, ['price'], ['asc']); // ORdenar Cual es el menos Caro
    if( this.namePais === 'Colombia'){
      if( opt === true ){
        this.data.ciudad = {
          ciudad_full: filterR.ciudad_full,
          id_ciudad: filterR.id_ciudad,
        };
      }
    }
    if( this.namePais === 'Panama'){
      this.data.ciudad = filterR.ciudad_full
      this.data.codeCiudad = Number( filterR.id_ciudad )
    }
    if( valAlto[0] ){
      this.data.transportadora = valAlto[0].transportadora;
      this.data.totalFlete = ( valAlto[0].price ) + ( ( valAlto[valAlto.length - 1 ].price ) * 10 / 100 );
      this.suma();
      this._ToolServices.presentToast("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  this.data.transportadora );
    }else{
      this.contraentregaAlert = true;
    }
    console.log("*****600", this.data)
  }

}
