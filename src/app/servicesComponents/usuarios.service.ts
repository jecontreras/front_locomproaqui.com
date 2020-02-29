import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tblusuario/querys',query, 'post');
  }
  login(query:any){
    return this._model.querys('tblusuario/login',query, 'post');
  }
  create(query:any){
    return this._model.querys('tblusuario/register',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblusuario/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblusuario/'+query.id, query, 'delete');
  }
}
