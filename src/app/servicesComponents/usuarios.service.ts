import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { UserAction } from '../redux/app.actions';
import { STORAGES } from '../interfaces/sotarage';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private _model: ServiciosService,
    private _store: Store<STORAGES>,
  ) { }

  get(query:any){
    return this._model.querys('tblusuario/querys',query, 'post');
  }

  getOn(query:any){
    return this._model.querys('tblusuario/querysOn',query, 'post');
  }

  getStore(query:any){
    return this._model.querys('tblusuario/querysStore',query, 'post');
  }

  getStores(query:any){
    return this._model.querys('tblusuario/queryStores',query, 'post');
  }

  recuperacion(query:any){
    return this._model.querys('tblusuario/resetiar',query, 'post');
  }

  getInfo(query:any){
    return this._model.querys('tblusuario/infoUser',query, 'post');
  }

  darPuntos(query:any){
    return this._model.querys('tblusuario/guardarPunto',query, 'post');
  }

  getNivel(query:any){
    return this._model.querys('tblusuario/nivelUser',query, 'post');
  }

  cambioPass(query:any){
    return this._model.querys('tblusuario/cambioPass',query, 'post');
  }

  login(query:any){
    return this._model.querys('tblusuario/login',query, 'post');
  }

  create(query:any){
    return this._model.querys('tblusuario/register',query, 'post');
  }

  update(query:any){
    return this._model.querys('tblusuario/'+query.id, query, 'put');
  }

  updatePlatform(query:any){
    return this._model.querys('tblusuario/updatePlatform', query, 'post');
  }

  delete(query:any){
    return this._model.querys('tblusuario/'+query.id, query, 'delete');
  }

  createSolicitud(query:any){
    return this._model.querys('solicitudes',query, 'post');
  }

  updateSolicitud(query:any){
    return this._model.querys('solicitudes/'+query.id, query, 'put');
  }

  deleteSolicitud(query:any){
    return this._model.querys('solicitudes/'+query.id, query, 'delete');
  }
  getRecaudo(query:any){
    return this._model.querys('platadistribuidor/querys',query, 'post');
  }
  getCobros(query:any){ console.log("_usuSVC getCobros")
    return this._model.querys('tblcobrar/cobros',query, 'post');
  }
  getPerfiles(query:any){
    return this._model.querys('tblcategoriaperfil/querys',query, 'post');
  }
  olvidoPass(query:any){
    return this._model.querys('tblusuario/olvidopass',query, 'post');
  }
    async initProcess( data:any ){
    return new Promise( async ( resolve ) =>{
      let filtro:any = await this.getValidador( data.email );
      if( filtro == false ) { await this.createUser( data ); return resolve( true ) }
      this.dataStore( filtro );
      resolve( true );
    })
  }
  async getValidador( email:string ){
    return new Promise( resolve => {
      this.get( { where: { usu_email:  email } } ).subscribe(( res:any )=>{
        res = res.data[0];
        if( !res ) return resolve( false );
        resolve( res );
      },( )=> resolve("error") );
    });
  }
  async createUser( data:any ){
    return new Promise ( resolve => {
      let querys:any = {
        usu_clave: data.email,
        usu_confir: data.email,
        usu_usuario: data.firstName + data.lastName,
        usu_email: data.email,
        usu_nombre: data.name,
        usu_documento: data.id,
        usu_imagen: data.photoUrl
      };
      this.create( querys ).subscribe( ( res:any )=>{
        if(res.success){
          this.dataStore( res.data );
          resolve( res );
        }else resolve( false );
      },( )=> resolve('error') )
    })
  }

  dataStore( data:any ){
    localStorage.setItem('user', JSON.stringify( data ));
    let accion = new UserAction( data, 'post');
    this._store.dispatch(accion);
  }

}
