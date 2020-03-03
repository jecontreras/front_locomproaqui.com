import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

@Component({
  selector: 'app-formcobros',
  templateUrl: './formcobros.component.html',
  styleUrls: ['./formcobros.component.scss']
})
export class FormcobrosComponent implements OnInit {
  
  files: File[] = [];
  list_files: any = [];
  data:any = {};
  listCategorias:any = [];
  id:any;
  titulo:string = "Crear";
  dataUser:any = {};
  superSub:boolean = false;
  clone:any = {};
  disabledButton:boolean = false;

  constructor(
    public dialog: MatDialog,
    private _cobros: CobrosService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcobrosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<STORAGES>,
  ) { 

    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });

  }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.clone = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
    }else{ this.id = ""; this.data.usu_clave_int = this.dataUser.id; }
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  submit(){
    this.disabledButton = true;
    if(this.id) { 
      if(!this.superSub) if(this.clone.ven_estado == 1) { this._tools.presentToast("Error no puedes ya editar el Cobro ya esta aprobada"); return false; }
      this.updates();
    }
    else this.guardar();
  }
  guardar(){
    this.data.cat_activo = 0;
    this._cobros.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this.disabledButton = false;
      this._tools.presentToast("Exitoso");
    }, (error)=>{ this._tools.presentToast(error.error.mensaje); console.error(error); this.disabledButton = false; });
    this.dialog.closeAll();
  }
  updates(){
    this.data = _.omit( this.data, ['usu_clave_int'] );
    if(this.data.cob_estado == 1) this.data.cob_fecha_pago = moment().format('DD-MM-YYYY HH:MM:SS');
    this._cobros.update(this.data).subscribe((res:any)=>{
      this.disabledButton = false;
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor"); this.disabledButton = false});
  }

}
