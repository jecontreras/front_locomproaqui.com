import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Component({
  selector: 'app-formcategorias',
  templateUrl: './formcategorias.component.html',
  styleUrls: ['./formcategorias.component.scss']
})
export class FormcategoriasComponent implements OnInit {
  
  files: File[] = [];
  list_files: any = [];
  data:any = {};
  listCategorias:any = [];
  id:any;
  titulo:string = "Crear";

  constructor(
    public dialog: MatDialog,
    private _categoria: CategoriasService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcategoriasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService
  ) { }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
    }else{this.id = ""}
    this.getCategorias();
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  getCategorias(){
    this._categoria.get({where:{cat_activo: 0}}).subscribe((res:any)=>{
      this.listCategorias = res.data;
    }, error=> this._tools.presentToast("error servidor"));
  }
  
  subirFile(){
    let form:any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe((res:any)=>{
      //console.log(res);
      this.data.cat_imagen = res.files;//URL+`/${res}`;
      this._tools.presentToast("Exitoso");
      if(this.id)this.submit();
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  submit(){
    console.log(this.data.cat_activo)
    // if(this.data.cat_activo) this.data.cat_activo = 0;
    // else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar(){
    this._categoria.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }

  updates(){
    this._categoria.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

}
