import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('cursos/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('cursos/create',query, 'post');
  }
  update(query:any){
    return this._model.querys('cursos/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('cursos/'+query.id, query, 'delete');
  }

}