import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(
    private _model: ServiciosService
  ) { }
  create(query:any){
    return this._model.querys('archivos/file',query, 'post');
  }
}
