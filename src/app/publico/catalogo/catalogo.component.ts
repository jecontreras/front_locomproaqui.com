import { Component, OnInit } from '@angular/core';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  
  listGaleria:any = [];
  id:any = {};
  query:any = { where: { /*catalago: ,*/ estado: 0 }, limit: -1 }
  data:any = {};

  estadosList:boolean = false;
  rango:boolean = true;
  disableDescarga:boolean = false;

  constructor(
    private _catalago: CatalogoService,
    private activate: ActivatedRoute,
    private _tools: ToolsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    // console.log( this.activate.snapshot.paramMap.get('id') )
    if(this.activate.snapshot.paramMap.get('id')){
      this.id = ( this.activate.snapshot.paramMap.get('id') );
      this.query.where.catalago = this.id;
      this.getCatalago();
    }else this.getList();
    this.detectarZona();
  }

  async detectarZona(){
    let zona:any = await this.myUbicacion();
    if( !zona ) return false;
    let data:any = {
      latitud1: zona.latitude,
      longitud1: zona.longitude,
      latitud2:  "7.888474",
      longitud2: "-72.497094"
    };
    let result:any = await this._tools.calcularDistancia( data );
    result = parseInt( result );
    if( 12111 >= result ) { this.rango = true; console.log("esta en el rango");}
    else { this.rango = false; console.log("no esta en el rango"); }
    console.log( result );
  }

  myUbicacion(){
    return new Promise( resolve =>{
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(coords);
      else { console.log("No soportado"); resolve(false);}
      function coords(position) { resolve(position.coords); }
    });
  }

  getCatalago(){
    this._catalago.get( { where: { estado: 0, id: this.id }, limit: 1 }).subscribe((res:any)=> {
      res = res.data[0];
      if( !res ) return this._tools.error( { mensaje: "Lo sentimos este catalogo no esta disponible", footer: "404" });
      this.data = res;
      this.data.precio = this._tools.monedaChange( 3, 2, this.data.precio );
      this.data.preciomayor = this._tools.monedaChange( 3, 2, ( this.data.preciomayor || this.data.precio ) );
      this.getList();
    } );
  }

  getList(){
    this.spinner.show();
    this._catalago.getDetallado( this.query ).subscribe(async( res:any )=>{
      this.listGaleria = res.data;
      // for( let row of this.listGaleria ){
      //   row.base64 = await this._catalago.FormatoBase64( row.producto.foto );
      // }
      this.spinner.hide();
      this.estadosList = true;
      if( this.data.descargar )this.descargarFoto();
    });
  }
  
  async descargarFoto(){
    //console.log( this.listGaleria );
    this.disableDescarga = true;
    this._tools.presentToast("Fotos descargando...");
    for( let row of this.listGaleria ){
      // await this.sleep(1);
      if( !row.base64 ) row.base64 = await this._catalago.FormatoBase64( row.producto.foto );
      await this._tools.descargarFoto(row.base64);
    }
    this._tools.presentToast("fotos descargadas totalmente ...")
    this.disableDescarga = false;
  }

  async sleep(segundos) {
    return new Promise(resolve => {
      setTimeout(async () => { resolve(true) }, segundos * 1000)
    })
  }

  async descargarFotoUna( row:any ){
    //console.log( this.listGaleria );
    if( !row.base64 ) row.base64 = await this._catalago.FormatoBase64( row.producto.foto );
    await this._tools.descargarFoto(row.base64);
  }

}
