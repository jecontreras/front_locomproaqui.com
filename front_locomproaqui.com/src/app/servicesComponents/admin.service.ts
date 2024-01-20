import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('admin/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('admin',query, 'post');
  }
  update(query:any){
    return this._model.querys('admin/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('admin/'+query.id, query, 'delete');
  }
}
