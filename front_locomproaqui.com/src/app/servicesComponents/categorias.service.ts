import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(
    private _model: ServiciosService
  ) { }

  getAll(query:any){
    return this._model.querys('tblcategorias/querys',query, 'post');
  }

  get(query:any){
    return this._model.querys('tblcategorias/categoryValidate',query, 'post');
  }
  create(query:any){
    return this._model.querys('tblcategorias',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblcategorias/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblcategorias/'+query.id, query, 'delete');
  }
  createUser(query:any){
    return this._model.querys('tblusuarioCategoria',query, 'post');
  }
  getUser(query:any){
    return this._model.querys('tblusuarioCategoria/querys',query, 'post');
  }
}
