import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-formcategorias',
  templateUrl: './formcategorias.component.html',
  styleUrls: ['./formcategorias.component.scss']
})
export class FormcategoriasComponent implements OnInit {
  
  files: File[] = [];
  list_files: any = [];
  data:any = {};

  constructor(
    public dialog: MatDialog,
    private _categoria: CategoriasService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  guardar(){
    console.log("eyyy", this.data);
    if(this.data.cat_activo) this.data.cat_activo = 1;
    else this.data.cat_activo = 0;
    this._categoria.create(this.data).subscribe((res:any)=>{
      console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();

  }

}
