import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProvedoresService } from 'src/app/servicesComponents/provedores.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-formprovedores',
  templateUrl: './formprovedores.component.html',
  styleUrls: ['./formprovedores.component.scss']
})
export class FormprovedoresComponent implements OnInit {

  data:any = {};
  id:any;
  titulo:string = "Crear";

  constructor(
    public dialog: MatDialog,
    private _provedores: ProvedoresService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormprovedoresComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
    }else{this.id = ""}
  }

  submit(){
    if(this.data.cat_activo) this.data.cat_activo = 0;
    else this.data.cat_activo = 1;
    if(this.id) this.updates();
    else this.guardar();
  }
  guardar(){
    this._provedores.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }
  updates(){
    this._provedores.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
