import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ControlinventarioService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tblproveedorentradas/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tblproveedorentradas/create',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblproveedorentradas/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblproveedorentradas/'+query.id, query, 'delete');
  }
  getProductos(query:any){
    return this._model.querys('tblproveedorproductos/querys',query, 'post');
  }
  createProductos(query:any){
    return this._model.querys('tblproveedorproductos/create',query, 'post');
  }
  updateProductos(query:any){
    return this._model.querys('tblproveedorproductos/'+query.id, query, 'put');
  }
  deleteProductos(query:any){
    return this._model.querys('tblproveedorproductos/'+query.id, query, 'delete');
  }

}
