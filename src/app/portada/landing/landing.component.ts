import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TRIDYCIUDAD } from 'src/app/JSON/dane-nogroup';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { Indicativo } from 'src/app/JSON/indicativo';
import { departamento } from 'src/app/JSON/departamentos';
import * as _ from 'lodash';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  listCiudades:any = TRIDYCIUDAD;
  listDepartamentoFullTD:any = departamento;
  listCiudadesRSelect:any = [];
  listCiudadesF:any = [];
  keyword = 'ciudad';
  data:any = {};
  btnDisabled: boolean = false;
  dataEnvioDetails:any = {};
  namePais:string = "Colombia";
  contraentregaAlert: boolean = false;
  price:number = 15999;
  code:string = "COP";
  price2:number = 15999;
  price3:number = 25000;
  dataCantidadCotizada:number;

  opcionCurrencys: any = {};

  constructor(
    public _ToolServices: ToolsService,
    private _ventas: VentasService,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.opcionCurrencys = this._ToolServices.currency;
    this.namePais = "Colombia";
    this.getCiudades();
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
  handleCheckContra(){
    this.contraentregaAlert = !this.contraentregaAlert;
    this.data.totalFlete = 0;
  }

  validarInput(){
    if( !this.data.nombre ) { this._ToolServices.presentToast("Falta Tu Nombre!"); return false; }
    if( !this.data.ciudad ) { this._ToolServices.presentToast("Falta Tu Ciudad!"); return false; }
    if( !this.data.direccion ) { this._ToolServices.presentToast("Falta Tu Dirección!"); return false; }
    if( !this.data.barrio ) {this._ToolServices.presentToast("Falta Tu Barrio!"); return false; }
    if( !this.data.numero ) {this._ToolServices.presentToast("Falta Tu Numero!"); return false; }
    if( !this.data.celL ) {this._ToolServices.presentToast("Falta Tu Numero de contacto!"); return false; }
    return true;
  }

  redondeaAlAlza(xx,r) {
    xx = Math.floor(xx/r)
    if (xx!=xx/r) {xx++}
    return (xx*r)
}

  async precioRutulo( ev:any, opt:boolean = true ){
    return new Promise( async ( resolve ) =>{
      //console.log("***EVE", ev);
      this.data.transportadora = ev.transportadora;
      this.data.totalFlete = 0;
      this.data.id_ciudad = ev.id_ciudad;
      this.dataEnvioDetails = ev;
      this.contraentregaAlert = false;
      if(ev.contraentrega != "SI" || !this.data.id_ciudad ){ this.contraentregaAlert = true; this.data.totalFlete = 0;  return resolve( true ) }
      let data = {
        peso: this.data.peso || 1,
        alto: this.data.alto || 9,
        ancho: this.data.ancho || 21,
        profundo: 28,
        idDestino: ev.id_ciudad,
        valor_declarado: ( this.data.priceTotal * 50 ) / 100 ,
        valor_recaudar: this.data.priceTotal,
        transport: ev.transportadora
      };
      let sumaFlete = 0;
      this.data.af = sumaFlete; //el AF
      this.btnDisabled = true;
      this._ToolServices.presentToast( "Estamos consultando tu flete esperé un momento, gracias..." );
      let res:any = await this.getTridy( data );
      if( res.data === "Cannot find table 0." ) res = await this.getTridy( data );
      if( res.data === "Cannot find table 0." )  { this.btnDisabled = false; this.data.totalFlete = 0; this.contraentregaAlert = true; resolve( false ); return this._ToolServices.presentToast( "Ok Tenemos Problemas Con Las Cotizaciones de Flete lo sentimos, un asesor se comunicar contigo gracias que pena la molestia" )  }
      /*data.valor_recaudar = ( Number( ( res.data || 0 ) ) + sumaFlete ) ;
      res = await this.getTridy( data );*/
      this.data.totalFlete = Number( ( res.data || 0 ) ) ;
      //console.log("res triidy", this.data.totalFlete)
      /*this.data.totalFlete = Number(this.data.totalFlete.toFixed(2));
      this.data.totalFlete = this.redondeaAlAlza(this.data.totalFlete,1000);*/
      //console.log("redondeado",this.data.totalFlete )
      //this.data.totalFlete += 3000;
      //console.log("aumento 5k", this.data.totalFlete)
      //console.log("af", sumaFlete )
      //this.data.totalFlete += sumaFlete
      //console.log("con AF" , this.data.totalFlete)
      // this.data.totalFlete += data.valor_recaudar
      //console.log("transportadora", this.data.transportadora)
      //console.log(this.data.totalFlete); // Muestra 1.78
      if( !res.data ){
        this.data.totalFlete = 0;
      }
      //this._ToolServices.basic("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  ev.transportadora );
      if( opt === true ) this._ToolServices.presentToast("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  ev.transportadora );
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
    //console.log( val, this.listCiudades )
    this.contraentregaAlert = false
    if (val) {
      this.listCiudadesF = this.listCiudades.filter((ciudad) =>
        ciudad.ciudad.toLowerCase().includes(val.toLowerCase())
      );
    } else {
      this.listCiudadesF = [];
    }
  }

  handleSelectDepartament(){
    let filterR = this.listCiudades.find( row => row.id_ciudad == this.data.departamento )
    //console.log("***566", this.data, filterR )
    if( filterR ){
      this.data.departament = filterR.departamento;
      this.listCiudadesRSelect = filterR.ciudadesList
    }
  }
  async handleProcesFlete( opt:boolean = true ){
    //console.log("*¨**574", this.data, this.listCiudadesRSelect );
    let dataFletePrice = [];
    let filterR = this.listCiudadesRSelect.find( row => row.id_ciudad == this.data.ciudades );
    console.log("***209", filterR)
    if( filterR ){
      if( this.namePais === 'Colombia'){
        if( opt === true ){
          this.data.ciudad = {
            ciudad_full: filterR.ciudad_full,
            id_ciudad: filterR.id_ciudad,
          };
        }
      }
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
          dataFletePrice.push( { ...dataF, price: r, recaudo: this.data.priceTotal, countPares: this.data.sumAmount } );
          //if( index >=3 ) break; // Consulta con 3 transportadoras
          index++;
        }
      }
    }
    let valAlto = _.orderBy(dataFletePrice, ['price'], ['asc']); // ORdenar Cual es el menos Caro
    valAlto = this.cleanData( valAlto ); // elimina los undefinde y los Nan
    valAlto = valAlto.filter( valAlto => valAlto.price ) // Busca los que si tienen precio
    if( valAlto[0] ){
      this.data.dataTridyCosto = valAlto || [];
      this.data.transportadora = valAlto[0].transportadora;
      //this.data.totalFlete = ( valAlto[0].price ) + ( ( valAlto[valAlto.length - 1 ].price ) * 10 / 100 );
      valAlto[0].price = this.data.totalFlete;
      //this.data.totalFlete = this.redondeaAlAlza(this.data.totalFlete,1000);
      this.dataCantidadCotizada = this.data.priceTotal;
      this._ToolServices.presentToast("Precio del Envio "+ this._ToolServices.monedaChange( 3, 2, ( this.data.totalFlete ) ) + " Transportadora "+  this.data.transportadora );
    }else{
      this.data.totalFlete = 0;
      this.data.transportadora = '';
      this.contraentregaAlert = true;
    }
    console.log("*****************650********", valAlto, this.data );
  }

  cleanData( dataArray ) {
    return dataArray.map(item => {
      let cleanedItem = {};
      for (let key in item) {
        if( key === 'transportadora') cleanedItem[key] = item[key];
        if (item.hasOwnProperty(key)) {
          let value = item[key];
          if (value !== undefined && !isNaN(value)) {
            cleanedItem[key] = value;
          }
        }
      }
      return cleanedItem;
    });
  }

}
