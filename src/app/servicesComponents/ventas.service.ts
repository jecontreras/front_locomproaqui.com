import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tblventas/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tblventas',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblventas/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tblventas/'+query.id, query, 'delete');
  }
  createFelte(query:any){
    return this._model.querys('tblventas/createFlete',query, 'post');
  }
  getMontos(query:any){
    return this._model.querys('tblventas/getDineroDetalle',query, 'post');
  }
  getFleteValor(query:any){
    return this._model.querys('tblventas/getFleteValor',query, 'post');
  }
  cancelarFlete(query:any){
    return this._model.querys('tblventas/cancelarGuia',query, 'post');
  }
  imprimirFlete(query:any){
    return this._model.querys('tblventas/imprimirRotulo',query, 'post');
  }
  imprimirEvidencia(query:any){
    return this._model.querysFlete('fletes/cordinadoraSeguimiento',query, 'post');
  }
}
