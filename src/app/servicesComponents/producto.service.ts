import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tblproductos/querys',query, 'post');
  }
  getStore(query:any){
    return this._model.querys('tblproductos/filtroStore',query, 'post');
  }
  create(query:any){
    return this._model.querys('tblproductos',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblproductos/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblproductos/'+query.id, query, 'delete');
  }
  ordenar(query:any){
    return this._model.querys('tblproductos/ordenar', query, 'post');
  }
  getVenta(query:any){
    return this._model.querys('tblventasproducto/querys',query, 'post');
  }
  createTestimonio(query:any){
    return this._model.querys('tbltestimonio',query, 'post');
  }
  createPrice( query:any ){
    return this._model.querys('priceArticle',query, 'post');
  }
  getPrice( query:any ){
    return this._model.querys('priceArticle/querys',query, 'post');
  }
  getPriceArticle( query:any ){
    return this._model.querys('priceArticle/querysProducts',query, 'post');
  }
  updatePriceArticle( query:any ){
    return this._model.querys('priceArticle/'+query.id,query, 'put');
  }

}
