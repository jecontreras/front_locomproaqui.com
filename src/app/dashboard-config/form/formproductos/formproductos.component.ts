import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { TipoTallasService } from 'src/app/servicesComponents/tipo-tallas.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { environment } from 'src/environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

const URL = environment.url;

@Component({
  selector: 'app-formproductos',
  templateUrl: './formproductos.component.html',
  styleUrls: ['./formproductos.component.scss']
})
export class FormproductosComponent implements OnInit {

  data:any = {};
  id:any;
  titulo:string = "Crear";
  files: File[] = [];
  list_files: any = [];
  listCategorias:any = [];
  listTipoTallas:any = [];
  listColor:any = [];
  editorConfig: any;


  constructor(
    public dialog: MatDialog,
    private _productos: ProductoService,
    private _categoria: CategoriasService,
    private _tipoTallas: TipoTallasService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormproductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService
  ) { 
    this.editor();
  }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if( this.data.pro_categoria ) if(this.data.pro_categoria.id) this.data.pro_categoria = this.data.pro_categoria.id;
      this.listColor = this.data.listColor || [];
    }else{this.id = ""; this.data.pro_codigo = this.codigo();}
    this.getCategorias();
    this.getTipoTallas();
  }
  getCategorias(){
    this._categoria.get({where:{cat_activo: 0}}).subscribe((res:any)=>{
      this.listCategorias = res.data;
    }, error=> this._tools.presentToast("error servidor"));
  }
  getTipoTallas(){
    this._tipoTallas.get({}).subscribe((res:any)=>{
      this.listTipoTallas = res.data;
    }, error=> this._tools.presentToast("error servidor"));
  }
  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }

  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  subirFile(item:any){
    let form:any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    //this._archivos.create( this.files[0] );
    this._archivos.create( form ).subscribe((res:any)=>{
      // console.log(res);
      if( item == false ){
        this.data.foto = res.files;//URL+`/${res}`;
        if(this.id)this.submit();
      }
      else item.foto = res.files;
      this._tools.presentToast("Exitoso");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  guardarColor(item:any){
    item.check = true;
    this.data.listColor = this.listColor;
    if(this.id) this.submit();
  }
  EliminarColor(idx:any){
    this.listColor.splice(idx, 1);
    this.data.listColor = this.listColor;
    if(this.id) this.submit();
  }

  submit(){
    if(this.data.cat_activo) this.data.cat_activo = 0;
    else this.data.cat_activo = 1;
    if(this.id) {
      this.updates();
    }
    else { this.guardar(); }
  }
  
  TallaPush(){
    this.listColor.push({
      codigo: this.codigo()
    });
  }

  guardar(){
    this._productos.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }
  updates(){
    // this.data = _.omit(this.data, [ ''])
    this._productos.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }
  editor(){
    let config:AngularEditorConfig = {
          editable: true,
          spellcheck: true,
          height: '300px',
          minHeight: '0',
          maxHeight: 'auto',
          width: 'auto',
          minWidth: '0',
          translate: 'yes',
          enableToolbar: true,
          showToolbar: true,
          placeholder: 'Enter text here...',
          defaultParagraphSeparator: '',
          defaultFontName: '',
          defaultFontSize: '',
          fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
          ],
          customClasses: [
          {
            name: 'quote',
            class: 'quote',
          },
          {
            name: 'redText',
            class: 'redText'
          },
          {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1',
          },
        ],
        uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
          ['bold', 'italic'],
          ['fontSize']
        ]
    };
    this.editorConfig = config;
  }
  eventoDescripcion(){
    // console.log("HP")
  }

}
