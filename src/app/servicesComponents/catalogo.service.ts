import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

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
}