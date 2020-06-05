import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { map } from 'rxjs/operators';
// import * as base64Img from 'base64-img';
// var base64Img = require('base64-img');
declare var base64Img:any;

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('catalago/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('catalago',query, 'post');
  }
  update(query:any){
    return this._model.querys('catalago/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('catalago/'+query.id, query, 'delete');
  }
  getDetallado(query:any){
    return this._model.querys('catalagodetallado/querys',query, 'post');
    /*.pipe(
      map(async (res: any) => {
        console.log(res);
        for( let row of res.data ){
          let base = await this.FormatoBase64( row.producto.foto );
				  row.base64 = base;
        }
        return res;
      }));*/
  }
  createDetallado(query:any){
    return this._model.querys('catalagodetallado',query, 'post');
  }
  updateDetallado(query:any){
    return this._model.querys('catalagodetallado/'+query.id, query, 'put');
  }
  deleteDetallado(query:any){
    return this._model.querys('catalagodetallado/'+query.id, query, 'delete');
  }
  FormatoBase64( foto ){
    return new Promise( resolve=>{
      return this._model.querys('catalagodetallado/FormatoBase64',{ foto: foto }, 'post').subscribe((res:any)=>resolve( res.data ), (error:any)=> resolve(false));
    });
  }
}