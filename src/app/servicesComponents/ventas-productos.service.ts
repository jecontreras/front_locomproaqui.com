import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class VentasProductosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tblventasproducto/querys',query, 'post');
  }
  
  create(query:any){
    return this._model.querys('tblventasproducto',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblventasproducto/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblventasproducto/'+query.id, query, 'delete');
  }
}
