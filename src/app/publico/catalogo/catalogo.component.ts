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
    }
    this.getList();
  }

  getCatalago(){
    this._catalago.get( { where: { estado: 0, id: this.id }, limit: 1 }).subscribe((res:any)=> this.data = res.data[0] || {} );
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
      this.descargarFoto();
    });
  }
  
  async descargarFoto(){
    //console.log( this.listGaleria );
    for( let row of this.listGaleria ){
      await this.sleep(2);
      if( !row.base64 ) row.base64 = await this._catalago.FormatoBase64( row.producto.foto );
      await this._tools.descargarFoto(row.base64, ( row.producto.pro_nombre || row.producto.pro_codigo ));
    }
  }

  async sleep(segundos) {
    return new Promise(resolve => {
      setTimeout(async () => { resolve(true) }, segundos * 1000)
    })
  }

  async descargarFotoUna( row:any ){
    //console.log( this.listGaleria );
    if( !row.base64 ) row.base64 = await this._catalago.FormatoBase64( row.producto.foto );
    await this._tools.descargarFoto(row.base64, ( row.producto.pro_nombre || row.producto.pro_codigo ));
  }

}
