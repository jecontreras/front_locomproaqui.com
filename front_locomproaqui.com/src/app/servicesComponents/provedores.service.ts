import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ProvedoresService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tblproveedor/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tblproveedor',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblproveedor/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblproveedor/'+query.id, query, 'delete');
  }
}
