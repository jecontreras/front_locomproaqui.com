import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfiguracionAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { AdminService } from 'src/app/servicesComponents/admin.service';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  data: any = {};
  listNotificaciones: any[] = [];

  constructor(
    private _admin: AdminService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _notificacion: NotificacionesService
  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.data = store.configuracion || {};
    }
    );
  }

  ngOnInit(): void {
    this.getComentario();
    this.getConfig();
  }

  guardar() {
    let data:any = {
      id: this.data.id,
      clInformacion: this.data.clInformacion,
      cdPedidos: this.data.cdPedidos,
      cdVentas: this.data.cdVentas,
      cdRetiros: this.data.cdRetiros,
      txtRegistroPWhatsapp: this.data.txtRegistroPWhatsapp,
      txtRegistroVWhatsapp:  this.data.txtRegistroVWhatsapp,
      txtVentasVWhatsapp:  this.data.txtVentasVWhatsapp,
      txtVentasPWhatsapp: this.data.txtVentasPWhatsapp,
      txtRetirosPWhatsapp:  this.data.txtRetirosPWhatsapp,
      txtRetirosVWhatsapp:  this.data.txtRetirosVWhatsapp
    };
    this._admin.update( data ).subscribe(( res:any )=>{
      let accion = new ConfiguracionAction( res, 'post' );
      this._store.dispatch( accion );
      this._tools.tooast( { title: "Actualizado..."} );
    },( )=> this._tools.tooast( { title: "Erro al actualizar", icon: "error" } ) );
  }

  getConfig(){
    this._admin.get( { where: { }} ).subscribe(res =>{
      res = res.data;
      this.data = res[0] || this.data;
    })
  }

  getComentario(){
    this._notificacion.get( { where: { tipoDe:3 }} ).subscribe(res =>{
      res = res.data;
      this.listNotificaciones = res;
      console.log("***", this.listNotificaciones)
    })
  }

  newComentario(){
    this.listNotificaciones.unshift({})
  }

  createComentario(){
    for( let row of this.listNotificaciones ){
      if( row.id ) continue;
      let data = {
        titulo: row.titulo,
        tipoDe: 3,
        descripcion: row.descripcion,
      };
      this._notificacion.create( data ).subscribe( res =>{
        this._tools.tooast( { title: "Creando..."} );
        row.id = res.id;
      });
    }
  }

  dropComentario(){
    for( let row of this.listNotificaciones ){
      if( row.check == true ){
        let data = {
          id: row.id
        };
        this._notificacion.delete( data ).subscribe( res =>{
          console.log("****65", res );
          this._tools.tooast( { title: "Eliminado..."} );
          this.listNotificaciones = this.listNotificaciones.filter(( res )=> res.id !== row.id );
        });
      }
    }
  }

}
