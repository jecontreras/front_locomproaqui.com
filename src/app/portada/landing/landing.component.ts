import { Component, OnInit } from '@angular/core';
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
    console.log("****", this.dataPro, this.listGaleria)
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

  handleOpenDialogPhoto( row, item ){
    this._ToolServices.openFotoAlert( row.foto );
    item.foto = row.foto;
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
    this.listDataAggregate.push( {  foto: item.detailsP.foto, amountAd: Number( result.value ), talla: row.tal_descripcion, id: this._ToolServices.codigo() } );
    this.suma();
  }

  suma(){
    for( let row of this.listDataAggregate ){
      this.data.sumAmount = row.amountAd;
    }
    this.data.priceTotal = this.dataPro.pro_vendedor * this.data.sumAmount;
  } 

  handleEndOrder(){
    let dataEnd:any = this.data;
    dataEnd.listArticle = this.listDataAggregate;
    console.log("***data", dataEnd)
  }

  async precioRutulo( ev:any ){
    console.log("***EVE", ev);
  }
  onChangeSearch( ev:any ){
    //console.log( ev )
  }

}
