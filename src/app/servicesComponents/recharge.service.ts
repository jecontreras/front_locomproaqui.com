import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('recharge/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('recharge',query, 'post');
  }
  update(query:any){
    return this._model.querys('recharge/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('recharge/'+query.id, query, 'delete');
  }
}
