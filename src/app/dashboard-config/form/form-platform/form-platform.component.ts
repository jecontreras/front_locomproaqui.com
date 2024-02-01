import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { PlatformService } from 'src/app/servicesComponents/platform.service';
import * as _ from 'lodash';
import { DANEGROUP } from 'src/app/JSON/dane-nogroup';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-form-platform',
  templateUrl: './form-platform.component.html',
  styleUrls: ['./form-platform.component.scss']
})
export class FormPlatformComponent implements OnInit {

  dataUser:any = {};
  superSub:boolean = false;
  disabledButton:boolean = false;
  id:any;
  data:any = {

  };
  listCiudades:any = DANEGROUP;
  keyword = 'name';

  constructor(
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FormPlatformComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _platform: PlatformService,
    private _ventas: VentasService,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });
  }

  ngOnInit(): void {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.data.direccion = this.data.user.usu_direccion
    }else{
      this.data.email = this.dataUser.usu_email;
      this.data.nombreEmpresa = this.dataUser.usu_usuario;
      this.data.nombrePersona = this.dataUser.usu_nombre;
      this.data.telefono = this.dataUser.usu_telefono;
      this.data.direccion = this.dataUser.usu_direccion;
    }
    this.getCiudades();
  }

  async getCiudades(){
    return new Promise( resolve => {
      this._ventas.getCiudades( { where: { }, limit: 100000 } ).subscribe( ( res:any )=>{
        this.listCiudades = res.data;
        resolve( true )
      });
    });
  }

  onChangeSearch( ev:any ){
    //console.log( ev )
  }

  submit(){
    try { this.data.ciudad = this.data.ciudad.name; } catch (error) { error }
    this.data.horarioRecogida = "Todos los dias";
    if( !this.id ) this.guardar();
    else this.update();
  }

  guardar(){
    this.data.estado = 0;
    this.data.user = this.dataUser.id;
    this._platform.create( this.data ).subscribe(( res:any )=>{
      this._tools.presentToast("Plataforma Creado");
      this.dialog.closeAll();
    },( error:any )=> this._tools.presentToast("Error de servidor"));
  }

  update(){
    let data = _.omit( this.data, ['user','nameState', 'createdAt', 'updatedAt', 'namePlatform']);
    this._platform.update( data ).subscribe(( res:any )=>{
      this._tools.presentToast("Plataforma Actualizado");
      this.dialog.closeAll();
    },( error:any )=> this._tools.presentToast("Error de servidor"));
  }

}
