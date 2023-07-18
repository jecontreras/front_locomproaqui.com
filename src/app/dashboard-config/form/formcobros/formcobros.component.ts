import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { FormtestimoniosComponent } from '../formtestimonios/formtestimonios.component';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { NotificacionesService } from 'src/app/servicesComponents/notificaciones.service';
import { FormlistventasComponent } from '../formlistventas/formlistventas.component';

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
  opcionCurrencys: any = {};

  constructor(
    public dialog: MatDialog,
    private _cobros: CobrosService,
    private _tools: ToolsService,
    public dialogRef: MatDialogRef<FormcobrosComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _store: Store<STORAGES>,
    private _user: UsuariosService,
    private _archivos: ArchivosService,
    private _notifacion: NotificacionesService
  ) {

    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });

  }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
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
    this._user.getInfo( { where:{ id:this.dataUser.id } } ).subscribe((res:any)=>{
      this.data.cob_monto = res.data.porcobrado;
      this.data.devoluciones = 0 /*res.data.devoluciones*/;
      //this.data.totalrecibir = ( res.data.porcobrado - res.data.devoluciones || 0 );
      this.data.totalrecibir = res.data.porcobrado;
    });
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  subirFile(item:any){
    let form:any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    //this._archivos.create( this.files[0] );
    this._archivos.create( form ).subscribe((res:any)=>{
      // console.log(res);
      this.data.fotoPago = res.files;//URL+`/${res}`;
      if( this.id ) { this.submit(); this.crearNotificacion(); }
      this._tools.presentToast("Exitoso");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  submit(){
    this.disabledButton = true;
    if(this.id) {
      if(!this.superSub) if(this.clone.ven_estado == 1) { this._tools.presentToast("Error no puedes ya editar el Cobro ya esta aprobada"); return false; }
      this.updates();
    }
    else this.guardar();
  }

  async guardar(){
    let validador:any = await this.validador();
    if( !validador ) return this.disabledButton = false;
    this.data.cat_activo = 0;
    this._cobros.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      res = res.data[0];
      this.disabledButton = false;
      this._tools.basicIcons({header: `hola ${ this.dataUser.usu_nombre } cordial saludo`, subheader: `Te informamos que tu solicitud de retiro ha Sido recibida de manera satisfactoria y está en proceso de validación la empresa te pagara dentro de los 3 días hábiles siguientes después de la quincena!`});
      this.procesoWhat( res );
      setTimeout(()=> this.openTestimonios(), 3000);
      this.dialog.closeAll();
    }, (error)=>{ this._tools.presentToast(error.error.mensaje); console.error(error); this.disabledButton = false; });
  }

  async validador(){
    if( !this.data.cob_pais ) { this._tools.presentToast( "Error no has seleccionado pais"); return false; }
    if( !this.data.cob_num_cedula ) { this._tools.presentToast( "Error no has introducido tu Cedula"); return false; }
    if( !this.data.cob_num_celular ) { this._tools.presentToast( "Error no has introducido tu Celular por si necesitamos mas informacion"); return false; }
    if( !this.data.cob_num_cuenta ) { this._tools.presentToast( "Error no has introducido tu Numero de la cuenta "); return false; }
    if( this.data.cob_pais == "venezuela" ) if( !this.data.usu_email ) { this._tools.presentToast( "Error no has introducido tu Email de la cuenta "); return false; }
    if( !this.data.cob_monto || ( Number( this.data.cob_monto ) < 5000 ) ) { this._tools.presentToast( "Error no tienes suficiente monto a retirar "); return false; }
    return true;
  }

  updates(){
    let data:any = _.omit( this.data, ['usu_clave_int'] );
    data = _.omitBy( data, _.isNull );
    if( !data.sumaFlete ) data.sumaFlete = 0;
    if( data.cob_estado == 1 )  data.cob_fecha_pago = moment().format('DD-MM-YYYY HH:MM:SS');
    this._cobros.update( data ).subscribe((res:any)=>{
      this.disabledButton = false;
      this._tools.presentToast("Actualizado");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor"); this.disabledButton = false});
  }

  crearNotificacion(){
    let data:any = {
      titulo: "Retiro Completado",
      descripcion: "Estimado Usuario tu retiro ya fue enviado a tu cuenta",
      user: this.data.usu_clave_int.id,
      tipoDe: 1,
      foto: this.data.fotoPago
    };
    this._notifacion.update(data).subscribe((res:any)=>console.log(res));
  }

  procesoWhat( res:any ){
    let mensaje:string;
    let numero:string = "573134453649";

    if(res.cob_pais === 'colombia'){
      mensaje = `https://wa.me/${ numero }?text=info del cliente ${ this.dataUser.usu_nombre } Pais ${ res.cob_pais } cedula ${ res.cob_num_cedula } telefono ${ this.dataUser.usu_telefono || '' }  fecha de retiro ${ moment(res.createdAt).format('DD-MM-YYYY HH:MM:SS') } Tipo de Banco ${ res.cob_metodo } Numero cuenta ${ res.cob_num_cuenta } Hola Servicio al cliente, como esta, cordial saludo. Sería tan amable de solicitarme este retiro monto $ ${ ( res.cob_monto || 0 ).toLocaleString(1) } COP gracias por su tiempo ...`;
    }else{
      mensaje = `https://wa.me/${ numero }?text=info del cliente ${ this.dataUser.usu_nombre }
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

  openTestimonios(){
    const dialogRef = this.dialog.open(FormtestimoniosComponent,{
      width: '731px',
      data: {datos: {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openVentasList(){
    const dialogRef = this.dialog.open(FormlistventasComponent,{
      data: {datos: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
