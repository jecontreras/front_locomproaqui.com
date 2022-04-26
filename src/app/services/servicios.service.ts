import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER } from '../interfaces/sotarage';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ConfiguracionAction, UserAction } from '../redux/app.actions';
import { ToolsService } from './tools.service';

declare var io: any;
const headers = new HttpHeaders({
  'X-Api-Key': ""
});

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  public sock: any;
  public disable_reconect: boolean = false;
  public interval:any;
  public dataUser:any = {};
  activador: boolean = false;
  dataConfig:any = {};

  constructor(
    private http: HttpClient,
    private _store: Store<USER>,
    private Router: Router,
    private _tools: ToolsService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataConfig = store.configuracion || {};
      try {
        this.activador = store.userpr.id ? true : false;
      } catch (error) {
        this.activador = false;
      }
    });
    //this.conectionSocket();
    //this.createsocket("emitir", {mensaje:"inicial"}); 
    if( !this.activador ) this.privateDataUser();
    this.getConfig();
  }
  getConfig(){
    this.querys('admin/querys',{
      where:{}
    }, 'post').subscribe((res:any)=>{
      res = res.data[0];
      let opcion:string = "post";
      if( this.dataConfig.id ) opcion = "put";
      let accion = new ConfiguracionAction( res, opcion )
      this._store.dispatch(accion);
    });
  }
  privateDataUser(){
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    if(Object.keys(this.dataUser).length >0 ){
      this.querys('tblusuario/querys',{
        where:{
           id: this.dataUser.id
          //id: 1016
        }
      }, 'post').subscribe((res:any)=>{
        res = res.data[0];
        localStorage.removeItem('user');
        if(!res) {
          let accion = new UserAction(this.dataUser,'delete')
          this._store.dispatch(accion);
          this._tools.presentToast("Tu sesión ha expirado")
          this.Router.navigate(['/login']);
          setTimeout(function(){ location.reload(); }, 3000);
        }else{
          let accion = new UserAction( res, 'post');
          this._store.dispatch( accion );
          //localStorage.setItem('user', JSON.stringify(res));
        }
      });
    }
  }
  private ejecutarQuery(url: string, data, METODO){
    return this.http[METODO]( url, data );
  }

  querys(query:string, datas:any, METODO:string){
    let data = datas;
    if(!datas.where) datas.where = {};
    data.skip = datas.page ? datas.page : 0;
    data.limit = datas.limit ? datas.limit : 10;
    query = URL+`/${query}`;
    return this.ejecutarQuery(query, data, METODO);
  }

  async createsocket(modelo: string, query: any) {
      return new Promise(async (promesa) => {
        query.modelo = modelo;
        await this.sock.post(URL + '/socket/emitir', query, (rta) => {
          // console.log(rta, modelo);
          promesa(rta)
        });
        promesa("exitoso");
      })

  }
  init_process_socket() {
    let
      init: any = 0
    ;
    this.interval = setInterval(() => {
      init += 1;
      if (init === 3) {
        init = 0;
        if(this.disable_reconect) {
          this.conectionSocket();
        }
      }
    }, 1000);
  }
  stopConter(interval: any) {
    clearInterval(interval);
  }
  /* Primera la conexion de configuracion del socket */
  conectionSocket() {
    try {
      if (io) {
        io.sails.autoConnect = false;
        this.sock = io.sails.connect(URL);
        this.scoket_global();
      }
    } catch (error) {
    }
  }
  scoket_global() {
    /* determinar  la conexion del socket con el back  */
    this.sock.on('connect',() => {
      console.log('conectado');
      this.disable_reconect = false;
      this.stopConter(this.interval);
    });
    /* Reconectar si se cae la conexion del socket */
    this.sock.on('disconnect', () =>{
      console.log('desconectado');
      this.disable_reconect = true;
      this.init_process_socket()
    });
  }
}
