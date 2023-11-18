import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('platform/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('platform',query, 'post');
  }
  update(query:any){
    return this._model.querys('platform/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('platform/'+query.id, query, 'delete');
  }
}
