import { Component, OnInit } from '@angular/core';
import { Indicativo } from 'src/app/JSON/indicativo';
import { ToolsService } from 'src/app/services/tools.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction, TokenAction, UserCabezaAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { TerminosComponent } from '../terminos/terminos.component';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { MatStepper } from '@angular/material/stepper';
import * as _ from 'lodash';

const indicativos = Indicativo;

@Component({
  selector: 'app-registros',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistrosComponent implements OnInit {

  data: any = {
    usu_indicativo: "57"
  };
  listIndicativos = indicativos;
  disableSubmit: boolean = true;
  isLinear: boolean = true;

  dataUser: any = {};
  cabeza: any;
  error: string;
  files: File[] = [];
  list_files: any = [];
  listRedes: any = [
    {
      titulo: "facebook",
      check: false
    },
    {
      titulo: "Instagram",
      check: false
    },
    {
      titulo: "Twitter",
      check: false
    },
    {
      titulo: "Youtube",
      check: false
    },
    {
      titulo: "Google ADS",
      check: false
    }
  ];
  disabledFile:boolean = false;
  disabledusername: boolean = true;
  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    private _store: Store<STORAGES>,
    private _authSrvice: AuthService,
    public dialog: MatDialog,
    private activate: ActivatedRoute,
    private _archivos: ArchivosService
  ) { }

  ngOnInit(): void {
    if (this.activate.snapshot.paramMap.get('id')) {
      this.cabeza = (this.activate.snapshot.paramMap.get('id'));
      this.getCabeza();
    } else this.data.cabeza = 1;
    if (this._authSrvice.isLoggedIn()) this._router.navigate(['/pedidos']);
  }

  onSelect(event: any) {
    //console.log(event, event.target.files);
    this.files = [event.target.files[0]];
    /*let image: any = event.target.files[0];
    let fr = new FileReader();
    fr.onload = () => { // when file has loaded
      var img = new Image();
      img.onload = () => {
        console.log( img.width,img.height )
      };
    };
    fr.readAsDataURL(image);*/
}

onRemove(event) {
  //console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
}

subirFile(){
  console.log( this.files )
  return new Promise( resolve =>{
    let form: any = new FormData();
    this.disabledFile = true;
    if (!this.files[0]) return false;
    form.append('file', this.files[0]);
    this._tools.ProcessTime({ title: "Cargando..." });
    this._archivos.create(form).subscribe((res: any) => {
      console.log(res);
      this.data.usu_imagen = res.files; //URL+`/${res}`;
      this.files = [];
      resolve( true );
    }, (error) => { console.error(error); this._tools.presentToast("Error de servidor subida de imagen"); resolve( false ); this.disabledFile = false; });
  });

}

validadUsername() {

  this.disabledusername = true;
  if (this.data.usu_usuario) {
    // console.log(this.data.usu_usuario.replace(/ /g, ""));
    this.data.usu_usuario = this.data.usu_usuario.replace(/ /g, '');
    this.data.usu_usuario = this.data.usu_usuario.replace(/[^a-zA-Z ]/g, "");
    this.data.usu_usuario = _.camelCase( this.data.usu_usuario );
    this._user.get({ where: { usu_usuario: this.data.usu_usuario } })
      .subscribe(
        (res: any) => {
          res = res.data[0];
          // console.log(res);
          if (res) this.disabledusername = false;
        }
      )
      ;
  }
}

validadorEmail(email: string){
  let validador: any = email.split("@");
  validador = validador[1];
  if (validador) {
    validador = validador.toLowerCase();
    console.log(validador);
    //if ((validador == "gmail.com") || (validador == "hotmail.com") || (validador == "hotmail.es") || (validador == "outlook.com") || (validador == "outlook.es")) { 
    if (validador == 'gmail.com' || validador == 'gmail.es' ) {
      this.error = ""; return true; 
    }
    else this.error = "Error el dominio tiene que ser gmail ";
  }
}

getCabeza(){
  this._user.get({ where: { 
    usu_usuario: this.cabeza } 
  }).subscribe((res: any) => { 
    this.dataUser = res.data[0]; 
    if( !this.dataUser ) this.dataUser = {
      usu_nombre: "ejemplo1",
      usu_usuario: "LOKOMPROAQUI",
      id: 75,
      codigo: "UVOQA"
    };
    this.GuardarStoreUser();
    this.data.cabeza = this.dataUser.id; 
  }, (error) => console.error(error));
}

GuardarStoreUser() {
  let accion = new UserCabezaAction( this.dataUser, 'post' );
  this._store.dispatch(accion);
}

async submit(){
  if (!this.disableSubmit) return false;
  this.disableSubmit = false;
  let valid: boolean = await this.validando();
  if (!valid || this.error) { this.disableSubmit = true; return false };
  if( !this.disabledusername ) return this._tools.tooast( { title: "Error tenemos problemas en el formulario por favor revisar gracias", icon: "error"})
  this._user.create(this.data).subscribe((res: any) => {
    console.log("user", res);
    this.disableSubmit = true;
    if (res.success) {
      //localStorage.setItem('user', JSON.stringify(res.data));
      let accion = new UserAction(res.data, 'post');
      this._store.dispatch(accion);
      accion = new TokenAction({ token: res.data.tokens }, 'post');
      this._store.dispatch(accion);
      this._router.navigate(['/pedidos']);
      this._tools.basicIcons({ header: "Hola Bienvenido!", subheader: `Hola ${res.data.usu_nombre} Que tengas un buen dia` });
      accion = new UserCabezaAction( this.dataUser, 'drop' );
      this._store.dispatch(accion);
      setTimeout(() => {
        location.reload();
      }, 3000);
    } else this._tools.tooast({ title: res.data, icon: "error" });
  }, (error) => { console.error(error); this.disableSubmit = true; this._tools.presentToast("Error de servidor") });
}

async validando(){
  if (!this.data.usu_nombre) { this._tools.tooast({ title: "Error falta el nombre", icon: "error" }); return false; }
  if (!this.data.usu_apellido) { this._tools.tooast({ title: "Error falta el Apellido", icon: "error" }); return false; }
  if (!this.data.usu_indicativo) { this._tools.tooast({ title: "Error falta el Indicativo", icon: "error" }); return false; }
  if (!this.data.usu_telefono) { this._tools.tooast({ title: "Error falta el Telefono", icon: "error" }); return false; }
  if (!this.data.usu_ciudad) { this._tools.tooast({ title: "Error falta la Ciudad", icon: "error" }); return false; }
  if (!this.data.usu_direccion) { this._tools.tooast({ title: "Error falta el Direccion", icon: "error" }); return false; }
  if (!this.data.usu_email) { this._tools.tooast({ title: "Error falta la Email", icon: "error" }); return false; }
  if (!this.data.usu_emailReper) { this._tools.tooast({ title: "Error falta el Email repetir", icon: "error" }); return false; }
  if (this.data.usu_emailReper != this.data.usu_email) { this._tools.tooast({ title: "Error los Emails no son iguales", icon: "error" }); return false; }
  if (!this.data.usu_clave) { this._tools.tooast({ title: "Error falta la clave", icon: "error" }); return false; }
  if (!this.data.usu_confir) { this._tools.tooast({ title: "Error falta la clave de confirmar", icon: "error" }); return false; }
  if (this.data.usu_confir != this.data.usu_clave) { this._tools.tooast({ title: "Error las claves no son correctas", icon: "error" }); return false; }
  if (!this.data.usu_usuario) { this._tools.tooast({ title: "Error falta Tu Nombre de tienda", icon: "error" }); return false; }
  if (!this.data.queEsDropp) { this._tools.tooast({ title: "Error falta que complete los campos de que es qué es droppshipping", icon: "error" }); return false; }
  if (!this.data.tiempoVendiendo) { this._tools.tooast({ title: "Error falta que complete los campos Cuanto tiempo llevas vendiendo de manera virtual", icon: "error" }); return false; }
  if (!this.data.ventasRealizarMensual) { this._tools.tooast({ title: "Error falta que complete los campos Cuantas ventas crees que puedes realizar mensualmente", icon: "error" }); return false; }
  if (!this.data.pagasPublicidad) { this._tools.tooast({ title: "Error falta que complete los campos Pagas publicidad en alguna red social para vender", icon: "error" }); return false; }
  //if( !this.data.usu_modo ) { this._tools.tooast( { title: "Error falta la descripcion de porque aceptarte como vendedor", icon: "error" }); return false; }
  return true;
}

terminos(){
  const dialogRef = this.dialog.open(TerminosComponent, {
    width: '461px',
    data: { datos: {} }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

selectTable(item){
  console.log(item);
}

async validador( opt:number, stepper: MatStepper ){
  console.log( stepper, this.disabledFile  )
  if( opt == 1 ){
    if( !this.disabledFile ) await this.subirFile();
    if (!this.data.usu_nombre) { this._tools.tooast({ title: "Error falta el nombre", icon: "error" }); return false; }
    if (!this.data.usu_apellido) { this._tools.tooast({ title: "Error falta el Apellido", icon: "error" }); return false; }
    if (!this.data.usu_indicativo) { this._tools.tooast({ title: "Error falta el Indicativo", icon: "error" }); return false; }
    if (!this.data.usu_telefono) { this._tools.tooast({ title: "Error falta el Telefono", icon: "error" }); return false; }
    if (!this.data.usu_usuario) { this._tools.tooast({ title: "Error falta Tu Nombre de tienda", icon: "error" }); return false; }
    if (!this.data.usu_imagen) { this._tools.tooast({ title: "Error falta Tu Logo de tienda", icon: "error" }); return false; }
    stepper.next();
  }
  if( opt == 2 ){
    if (!this.data.usu_ciudad) { this._tools.tooast({ title: "Error falta la Ciudad", icon: "error" }); return false; }
    if (!this.data.usu_direccion) { this._tools.tooast({ title: "Error falta el Direccion", icon: "error" }); return false; }
    if (!this.data.usu_email) { this._tools.tooast({ title: "Error falta la Email", icon: "error" }); return false; }
    if (!this.data.usu_emailReper) { this._tools.tooast({ title: "Error falta el Email repetir", icon: "error" }); return false; }
    if (this.data.usu_emailReper != this.data.usu_email) { this._tools.tooast({ title: "Error los Emails no son iguales", icon: "error" }); return false; }
    if (!this.data.usu_clave) { this._tools.tooast({ title: "Error falta la clave", icon: "error" }); return false; }
    if (!this.data.usu_confir) { this._tools.tooast({ title: "Error falta la clave de confirmar", icon: "error" }); return false; }
    if (this.data.usu_confir != this.data.usu_clave) { this._tools.tooast({ title: "Error las claves no son correctas", icon: "error" }); return false; }
    stepper.next();
  }
  if( opt == 3){
    if (!this.data.queEsDropp) { this._tools.tooast({ title: "Error falta que complete los campos de que es qué es droppshipping", icon: "error" }); return false; }
    if (!this.data.tiempoVendiendo) { this._tools.tooast({ title: "Error falta que complete los campos Cuanto tiempo llevas vendiendo de manera virtual", icon: "error" }); return false; }
    if (!this.data.ventasRealizarMensual) { this._tools.tooast({ title: "Error falta que complete los campos Cuantas ventas crees que puedes realizar mensualmente", icon: "error" }); return false; }
    if (!this.data.pagasPublicidad) { this._tools.tooast({ title: "Error falta que complete los campos Pagas publicidad en alguna red social para vender", icon: "error" }); return false; }
    this.submit()
  }
}

eventEstado(){
  if( this.data.fileDise ) { this.disabledFile = true; this.data.usu_imagen='./assets/logo.png' }
}

}
