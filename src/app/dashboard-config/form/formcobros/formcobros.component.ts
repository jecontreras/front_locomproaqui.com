import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';

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

  constructor(
    public dialog: MatDialog,
    private _cobros: CobrosService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcobrosComponent>,
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

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  submit(){
    if(this.id) this.updates();
    else this.guardar();
  }
  guardar(){
    this.data.cat_activo = 0;
    this._cobros.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }
  updates(){
    this._cobros.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
