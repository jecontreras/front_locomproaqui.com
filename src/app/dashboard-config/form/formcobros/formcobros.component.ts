import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

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
    private _user: UsuariosService
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
    }else{ 
      this.id = ""; 
      this.data.usu_clave_int = this.dataUser.id; 
      this.data.cob_num_cedula = this.dataUser.usu_documento;
      this.data.cob_num_celular = this.dataUser.usu_telefono;
      this.data.cob_pais = 'colombia';
      this.getInfoUser();
    }
  }

  getInfoUser(){
    this._user.getInfo({where:{id:this.dataUser.id}}).subscribe((res:any)=>this.data.cob_monto = res.data.porcobrado);
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
      res = res.data[0];
      this.disabledButton = false;
      this._tools.basicIcons({header: `hola ${ this.dataUser.usu_nombre } cordial saludo`, subheader: `Te informamos que tu solicitud de retiro ha Sido recibida de manera satisfactoria y está en proceso de validación la empresa te pagara dentro de los 3 días hábiles siguientes después de la quincena!`});
      this.procesoWhat( res );
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

  procesoWhat( res:any ){
    let mensaje:string;

    if(res.cob_pais === 'colombia'){
      mensaje = `https://wa.me/573148487506?text=info del cliente ${ this.dataUser.usu_nombre } Pais ${ res.cob_pais } cedula ${ res.cob_num_cedula } telefono ${ this.dataUser.usu_telefono || '' }  fecha de retiro ${ moment(res.createdAt).format('DD-MM-YYYY HH:MM:SS') } Tipo de Banco ${ res.cob_metodo } Numero cuenta ${ res.cob_num_cuenta } Hola Servicio al cliente, como esta, cordial saludo. Sería tan amable de solicitarme este retiro monto $ ${ ( res.cob_monto || 0 ).toLocaleString(1) } COP gracias por su tiempo ...`;
    }else{
      mensaje = `https://wa.me/573148487506?text=info del cliente ${ this.dataUser.usu_nombre } 
      Pais ${ res.cob_pais }
      Numero Cedula Bancario ${ res.cob_numero_cedula || 'nulo' }
      Ciudad o corregimiento donde deseas retirar ${ res.cob_ciudad_corregimiento || 'nulo' }
      Nombre del banco Correctamente ${ res.cob_nombre_banco || 'nulo' }
      Numero de cuenta ${ res.cob_num_cuenta || 'nulo' }
      cedula ${ res.cob_num_cedula } telefono ${ this.dataUser.usu_telefono || '' }  
      fecha de retiro ${ moment(res.createdAt).format('DD-MM-YYYY HH:MM:SS') } 
      Tipo de Banco ${ res.cob_metodo || 'nulo' } 
      Numero cuenta ${ res.cob_num_cuenta } Hola Servicio al cliente, como esta, cordial saludo. Sería tan amable de solicitarme este retiro monto $ ${ ( res.cob_monto || 0 ).toLocaleString(1) } COP gracias por su tiempo ...`;
    }
    
    window.open(mensaje);
  }

}
