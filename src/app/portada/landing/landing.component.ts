import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  dataPro:any = [];
  listGaleria:any = [];
  viewPhoto:string;
  listDataAggregate:any = [];
  listCiudades:any = DANEGROUP;
  keyword = 'name';
  data:any = {
    sumAmount: 0,
    priceTotal: 0
  };
  @ViewChild('nextStep', { static: true }) nextStep: ElementRef;
  currentIndex: number = 0;
  btnDisabled: boolean = false;

  constructor(
    private _productServices: ProductoService,
    public _ToolServices: ToolsService,
    private _ventas: VentasService
  ) { }

  async ngOnInit() {
    this.dataPro = await this.getProduct();
    this.viewPhoto = this.dataPro.foto;
    try {
      for( let row of this.dataPro.listColor ){
        row.detailsP = {};
        row.tallaSelect = row.tallaSelect.filter( item => item.check === true );
        this.listGaleria.push( ...row.galeriaList );
      }
    } catch (error) { }
    //console.log("****", this.dataPro, this.listGaleria)
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
    let selectTalla = await this._ToolServices.modalInputSelect();
    //console.log("****70", selectTalla)
    if( !selectTalla ) return false;
    row.tal_descripcion = selectTalla;
    this.handleOpenDialogAmount( row, item )
  }

  async handleDeleteItem( item ){
    let alert = await this._ToolServices.confirm({title:"Eliminar", detalle:"Deseas Eliminar Item", confir:"Si Eliminar"});
    if( !alert.value ) return false;
    this.listDataAggregate = this.listDataAggregate.filter( row => row.codigo !== item.codigo );
    this.suma();
  }

  async handleOpenDialogAmount( row, item ){
    let result:any = await this._ToolServices.alertInput( { input: "number", title: "Cantidad adquirir", confirme: "Aceptar" } );
    if( !result.value ) return false;
    this.listDataAggregate.push( { ref: item.talla, foto: item.detailsP.foto, amountAd: Number( result.value ), talla: row.tal_descripcion, id: this._ToolServices.codigo() } );
    this.suma();
    this._ToolServices.presentToast("Producto Agregado al Carrito")
  }

  suma(){
    for( let row of this.listDataAggregate ){
      this.data.sumAmount = row.amountAd;
    }
    this.data.priceTotal = this.dataPro.pro_vendedor * this.data.sumAmount;
  } 

  handleEndOrder(){
    if( this.btnDisabled ) return false;
    let validate = this.validarInput();
    if( !validate ) return false;
    this.btnDisabled = true;
    let dataEnd:any = this.data;
    dataEnd.listProduct = this.listDataAggregate;
    if( dataEnd.ciudad.name ) dataEnd.ciudad = dataEnd.ciudad.name;
    this._ventas.createVentasL( dataEnd ).subscribe( res =>{
      //console.log("*****101", res)
      if( !res.id ) return false;
      this.openWhatsapp( res );
      this._ToolServices.presentToast("Pedido Tomado en Espera de un Asesor te comunicas con usted!");
      this.btnDisabled = false;
    },()=> this.btnDisabled = true);
    //console.log("***data", dataEnd)
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
    let urlWhatsapp = `https://wa.me/573108131582?text=
      *Hola Servicio al Cliente este es mi Pedido*
      *Nombre*: ${ data.nombre }
      *Ciudad*: ${ data.ciudad }
      *Numero*: ${ data.numero }
      *Direccion*: ${ data.direccion }
      *Barrio*: ${ data.barrio }
      *Numero de mi Pedido*: ${ data.id }
    `;
    window.open( urlWhatsapp );
    this.data = {};
    this.listDataAggregate = [];
    window.document.scrollingElement.scrollTop=0;
  }

  async precioRutulo( ev:any ){
    console.log("***EVE", ev);
  }
  onChangeSearch( ev:any ){
    //console.log( ev )
  }

}
