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
  getUser(query:any){
    return this._model.querys('rechargeUser/querys',query, 'post');
  }
  createUser(query:any){
    return this._model.querys('rechargeUser',query, 'post');
  }
  updateUser(query:any){
    return this._model.querys('rechargeUser/'+query.id, query, 'put');
  }
  deleteUser(query:any){
    return this._model.querys('rechargeUser/'+query.id, query, 'delete');
  }
  getValidateRecharge( query ){
    return this._model.querys('rechargeUser/validateRecharge',query, 'post');
  }
}
