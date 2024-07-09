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
  updateState(query:any){
    return this._model.querys('tblproductos/updateState', query, 'post');
  }
  updateCache(query:any){
    return this._model.querys('tblproductos/updateCache', query, 'post');
  }
  delete(query:any){
    return this._model.querys('tblproductos/'+query.id, query, 'delete');
  }
  getListInit(query:any){
    return this._model.querys('tblproductos/getInit',query, 'post');
  }
  getListgetNews(query:any){
    return this._model.querys('tblproductos/getNews',query, 'post');
  }
  getListgeMore(query:any){
    return this._model.querys('tblproductos/getMore',query, 'post');
  }
  getListgetBanner(query:any){
    return this._model.querys('tblproductos/getBanners',query, 'post');
  }
  ordenar(query:any){
    return this._model.querys('tblproductos/ordenar', query, 'post');
  }
  getVenta(query:any){
    return this._model.querys('tblventasproducto/querys',query, 'post');
  }
  getVentas(query:any){ //console.log("ventasProveedoresView query", query)
    return this._model.querys('tblventas/ventasProveedoresView',query, 'post');
  }
  getVentaComplete(query:any){
    return this._model.querys('tblventas/getTransactions',query, 'post');
  }
  getVentaCompleteEarningBuy(query:any){
    return this._model.querys('tblventas/getTransactionsEarringBuyTrasnport',query, 'post');
  }
  getVentaCompleteEarring(query:any){
    return this._model.querys('tblventas/getTransactionsEarring',query, 'post');
  }
  getVentaCompletePendients(query:any){
    return this._model.querys('tblventas/getTransactionsPendients',query, 'post');
  }
  getVentaCompleteComplete(query:any){
    return this._model.querys('tblventas/getTransactionsComplete',query, 'post');
  }
  getVentaCompletePago(query:any){
    return this._model.querys('tblventas/getTransactionsPagados',query, 'post');
  }
  getVentaDevolution(query:any){
    return this._model.querys('tblventas/getTransactionsDevolution',query, 'post');
  }
  getTransactionsPreparacion(query:any){
    return this._model.querys('tblventas/getTransactionsPreparacion',query, 'post');
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
  createPriceArticleFull( query:any ){
    return this._model.querys('priceArticle/createTotalProduct',query, 'post');
  }

}
