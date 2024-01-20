import { Component, OnInit, Inject } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormproductosComponent } from '../formproductos/formproductos.component';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';

@Component({
  selector: 'app-formtestimonios',
  templateUrl: './formtestimonios.component.html',
  styleUrls: ['./formtestimonios.component.scss']
})
export class FormtestimoniosComponent implements OnInit {

  dataUser:any = {};
  superSub:boolean = false;
  disabledButton:boolean = false;
  id:any;
  editorConfig: any;
  data:any = {
    usuario: {}
  };
  nameEmail:string;
  disabledBuscador:boolean = false;

  constructor(
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _testimonio: TestimoniosService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FormproductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _user: UsuariosService,
    private _notificaciones: NotificacionesService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });
    this.editor();
  }

  ngOnInit(): void {
    if(Object.keys(this.datas.datos).length > 0) {
      this.nameEmail = this.datas.datos.email || '';
      if(this.datas.datos.vista == "ver"){
        this._tools.basicIcons({header: `hola ${ this.dataUser.usu_nombre } cordial saludo`, subheader: `Que testimonio brindarias o que mensaje para que otras personas se den la oportunidad de emprender al igual que tú`});
        this.data.usuario = this.dataUser.id;
      }else{
        this.data = _.clone(this.datas.datos);
        this.id = this.data.id;
      }
    }else{
      this._tools.basicIcons({header: `hola ${ this.dataUser.usu_nombre } cordial saludo`, subheader: `Que testimonio brindarias o que mensaje para que otras personas se den la oportunidad de emprender al igual que tú`});
      this.data.usuario = this.dataUser.id;
    }
  }

  getUsuario(){
    if( !this.nameEmail ) return this._tools.presentToast("Por favor introducir un correo");
    this.disabledBuscador = true;
    this._user.get({ where: { usu_email: this.nameEmail }}).subscribe((res:any)=>{
      res = res.data[0];
      if( res ) { this.data.usuario = res.id; this._tools.presentToast("Usuario encontrado");}
      else this._tools.presentToast("Usuario no encontrado");
      this.disabledBuscador = false;
    }, (error)=> this.disabledBuscador = false );
  }

  submit(){
    if( !this.id ) this.guardar();
    else this.update();
  }

  guardar(){
    this.data.estado = 0;
    this._testimonio.create( this.data ).subscribe(( res:any )=>{
      this._tools.presentToast("testimonio actualizado");
      this.actualizarNotificacion();
      this.dialog.closeAll();
    },( error:any )=> this._tools.presentToast("Error de servidor"));
  }

  update(){
    this.data = _.omit( this.data, ['usuario', 'createdAt', 'updatedAt']);
    this._testimonio.update( this.data ).subscribe(( res:any )=>{
      this._tools.presentToast("Gracias Por tu testimonio");
      this.dialog.closeAll();
    },( error:any )=> this._tools.presentToast("Error de servidor"));
  }

  actualizarNotificacion(){
    let data:any = {
      id: this.datas.datos.id,
      view: true
    };
    this._notificaciones.update( data ).subscribe(( res:any )=>console.log(res));
  }

  eventoDescripcion(){

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

}
