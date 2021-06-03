import { Component, OnInit, Inject } from '@angular/core';
import { MatChipInputEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { environment } from 'src/environments/environment';
import { Fruit } from 'src/app/interfaces/interfaces';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

const URL = environment.url;

@Component({
  selector: 'app-formcategorias',
  templateUrl: './formcategorias.component.html',
  styleUrls: ['./formcategorias.component.scss']
})
export class FormcategoriasComponent implements OnInit {
  
  files: File[] = [];
  list_files: any = [];
  data:any = {
    cat_activo: 0
  };
  listCategorias:any = [];
  id:any;
  titulo:string = "Crear";

  listCategoria:any = [];
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

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
    this._categoria.get( { where: { cat_activo: 0, cat_padre: this.data.id }, limit: 1000 } ).subscribe((res:any)=>{
      this.listCategoria =_.map( res.data , ( row )=>{ 
        return {
          id: row.id,
          categoria: row.categoria,
          ... row
        };
      });
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
    this.submitHijos();
  }

  guardar( item:any = this.data ){
    this._categoria.create( item ).subscribe((res:any)=>{
      //console.log(res);
      this.data.id = res.id;
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }

  updates( item:any = this.data ){
    this._categoria.update( item ).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

  submitHijos(){
    for ( let row of this.listCategoria ){
      let data:any = {
        id: row.id || null,
        cat_padre: this.data.id,
        cat_nombre: row.categoria,
        cat_activo: "0",
        cat_descripcion: row.categoria,
        ordenador: "30"
      };
      data = _.omitBy( data, _.isNull);
      if( row.id ) this.updates( data );
      else  this.guardar( data );
    }
  }

  add(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    let  listas:any = [];
    let filtro = this.listCategoria.filter(( item:any ) => item.categoria == value );
    if( filtro ) if( filtro.length > 0 ) return false;
    if (value) {
      let data:any = {
        categoria: value,
      };
      this.listCategoria.push( data );
    }
    event.value = "";
    // Clear the input value
    try {
      event['chipInput']!.clear();
    } catch (error) {
      
    }
  }

  remove(item: Fruit): void {
    const index = this.listCategoria.indexOf( item );

    if ( index >= 0 ) {
      this.listCategoria.splice(index, 1);
    }
  }

}
