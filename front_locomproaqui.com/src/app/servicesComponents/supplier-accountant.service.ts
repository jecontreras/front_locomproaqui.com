import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierAccountantService {
  
  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('supplieraccountant/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('supplieraccountant',query, 'post');
  }
  update(query:any){
    return this._model.querys('supplieraccountant/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('supplieraccountant/'+query.id, query, 'delete');
  }
}
