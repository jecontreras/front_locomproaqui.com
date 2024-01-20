import { Component, OnInit, Inject } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { PerfilService } from 'src/app/servicesComponents/perfil.service';
import { ToolsService } from 'src/app/services/tools.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { FormempresaComponent } from '../formempresa/formempresa.component';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { OpenIframeComponent } from 'src/app/extra/open-iframe/open-iframe.component';

@Component({
  selector: 'app-formusuarios',
  templateUrl: './formusuarios.component.html',
  styleUrls: ['./formusuarios.component.scss']
})
export class FormusuariosComponent implements OnInit {

  data:any = {};
  id:any;
  titulo:string = "Crear";
  files: File[] = [];
  list_files: any = [];
  restaure:any = {};
  listPerfil:any = [];
  opcionCurrencys:any = {};
  listNivel:any = [];
  rolName:string = "";
  listCategoryUser:any = [];

  constructor(
    public dialog: MatDialog,
    private _usuarios: UsuariosService,
    private _perfil: PerfilService,
    private _tools: ToolsService,
    private _categorias: CategoriasService,
    public dialogRef: MatDialogRef<FormusuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any
  ) { }

  async ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    if(Object.keys(this.datas.datos).length > 0) {
      this.data = _.clone(this.datas.datos);
      console.log(this.data);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      try {
        this.rolName = this.data.usu_perfil.prf_descripcion;
      } catch (error) { }
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
      this.data.usu_perfil = this.data.usu_perfil.id;
      if( this.data.categoriaPerfil ) this.data.categoriaPerfil = this.data.categoriaPerfil.id;
    }else{this.id = ""}
    this.getPerfil();
    this.getNivel();
    this.listCategoryUser = await this.getUserCategory();
  }
  
  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  getNivel(){
    this._usuarios.getPerfiles( { where:{ } } ).subscribe(( res:any )=>{
      this.listNivel = res.data;
    });
  }

  openFile( urlText ){
    const dialogRef = this.dialog.open(OpenIframeComponent,{
      data: {
        url: urlText
      },
      // height:  '550px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getPerfil(){
    this._perfil.get({ where: {} }).subscribe((res:any)=> this.listPerfil = res.data );
  }

  submit(){
    this.data.estado = Number( this.data.estado );
    if(this.id) this.updates();
    else this.guardar();
  }
  guardar(){
    this._usuarios.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this._tools.presentToast("Exitoso");
    }, (error)=>this._tools.presentToast("Error"));
    this.dialog.closeAll();
  }
  updates(){
    this.data = _.omitBy(this.data, _.isNull);
    this.data = _.omit( this.data, ['cabeza', 'nivel', 'createdAt', 'updatedAt', ]);
    if( this.data.usu_perfil.id ) this.data.usu_perfil = this.data.usu_perfil.id;
    if( this.data.categoriaPerfil.id ) this.data.categoriaPerfil = this.data.categoriaPerfil.id;
    if( this.data.empresa.id ) this.data.empresa = this.data.empresa.id;
    this._usuarios.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }

  CambiarPassword(){
    this._usuarios.cambioPass({ id: this.data.id, password: this.restaure.passNew })
    .subscribe( (res:any)=>{console.log(res); this.restaure = {}; this._tools.presentToast("Actualizado Password"); },
    (error)=> { console.error(error); this._tools.presentToast("Error Servidor"); } );
  }

  openEmpresa(){
    const dialogRef = this.dialog.open(FormempresaComponent,{
      data: { datos: {} },
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log( result );
      if( result ) if( result.id ) { this.data.empresa = result.id; this.updates(); }
      
    });
  }

  async getUserCategory(){
    return new Promise( resolve =>{
      this._categorias.getUser( { where:{ cat_usu: this.data.id, cat_activo:0 }, limit: 10000 } ).subscribe( res => {
        resolve( res.data || [] );
      });
    })
  }

}
