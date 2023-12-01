import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class HistorySettlementFletesService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('historysettlementfletes/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('historysettlementfletes',query, 'post');
  }
  update(query:any){
    return this._model.querys('historysettlementfletes/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('historysettlementfletes/'+query.id, query, 'delete');
  }
}