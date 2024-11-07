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
  create2(query:any){
    return this._model.querys('ventasDBI',query, 'post');
  }
  update(query:any){
    return this._model.querys('tblventas/'+query.id, query, 'put');
  }
  updateDBI(query:any){
    return this._model.querys('ventasDBI/'+query.id, query, 'put');
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
  getFleteValorTriidy(query:any){
    return this._model.querysFlete('fletes/getFleteTriidy',query, 'post');
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
  getFletes(query:any){
    return this._model.querysFlete('fletes/querys',query, 'post');
  }
  getFletesInter(query:any){
    return this._model.querysFlete('fletes/interrpRotulo',query, 'post');
  }
  getCiudades(query:any){
    return this._model.querysFlete('ciudades/querys',query, 'post');
  }
  getPossibleSales( query:any ){
    return this._model.querys('ventasDBI/querys',query, 'post');
  }
  getVentasProveedores( query:any ){ //console.log("getVentasProveedores query", query)
    return this._model.querys('tblventas/ventasProveedoresView',query, 'post');
  }
  getVentasExitosasProveedor( query:any ){
    return this._model.querys('tblventas/getVentasExitosasProveedor',query, 'post');
  }
  getVentasL(query:any){
    return this._model.querys('ventaLandazury/querys',query, 'post');
  }
  createVentasL(query:any){
    return this._model.querys('ventaLandazury',query, 'post');
  }
  updateVentasL(query:any){
    return this._model.querys('ventaLandazury/'+query.id,query, 'put');
  }
  deleteVentasL(query:any){
    return this._model.querys('ventaLandazury/'+query.id,query, 'delete');
  }
  getCiudadesTridy(query:any){
    return this._model.querysFlete('CiudadesTridy/querys',query, 'post');
  }


}
