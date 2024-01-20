import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Indicativo } from 'src/app/JSON/indicativo';
import { AuthService } from 'src/app/services/auth.service';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { TokenAction, UserAction, UserCabezaAction } from 'src/app/redux/app.actions';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { MatDialog, MatStepper } from '@angular/material';
import { TerminosComponent } from '../terminos/terminos.component';

const indicativos = Indicativo;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  data:any = {
    usu_indicativo: "57",
    ids: "XXXXXXXXXXXXXXXXXXXX",
    usu_imagen: './assets/avatar.png',
    optVendedor: true,
    optProveedor: false,
    rol: "vendedor"
  };
  listIndicativos = indicativos;
  disabledusername: boolean = true;
  error: string;
  dataUser: any = {};
  disableSubmit: boolean = true;
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
  listPltaform: any = [
    {
      titulo: "Triidy",
      check: false
    },
    {
      titulo: "Hoko",
      check: false
    },
    {
      titulo: "Droppy",
      check: false
    },
    {
      titulo: "Rocketfy",
      check: false
    },
    {
      titulo: "Otro",
      check: false
    }
  ];
  typeRol:string;
  number:string;
  showPassword = false;
  dataCabeza:any = {};

  constructor(
    private _tools: ToolsService,
    private _authSrvice: AuthService,
    private _router: Router,
    private _user: UsuariosService,
    private _store: Store<STORAGES>,
    public dialog: MatDialog,
    private activate: ActivatedRoute,
  ) {
    window.document.scrollingElement.scrollTop=0
    this.typeRol = ( this.activate.snapshot.paramMap.get('type'));
    this.number = ( this.activate.snapshot.paramMap.get('cel') )
    if( this.number ) this.getCabeza();
    if( this.typeRol ){
      this.data.optVendedor = this.typeRol === 'vendedor' ? true : false;
      this.data.optProveedor = this.typeRol === 'proveedor' ? true : false;
    }
    this.data.rol = this.typeRol;
  }

  ngOnInit(): void {
      if (this._authSrvice.isLoggedIn()) {
        this._router.navigate(['/pedidos']);
      }
    }

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      passwordInput.type = 'text'; // Mostrar la contraseña
    } else {
      passwordInput.type = 'password'; // Ocultar la contraseña
    }
  }
  getCabeza(){
    this._user.get({ where: {
      usu_telefono: this.number }
    }).subscribe((res: any) => {
      if( !res.data[0]) this.data.cabeza = 1;
      else {
        this.data.cabeza = res.data[0].id;
        this.dataCabeza = res.data[0];
      }
    }, (error) => console.error(error));
  }

  openEmail(){
    console.log("**ENTRE")
    let scrollRoot = this._tools.getScrollRoot();
    scrollRoot.scrollTop = 500; // set the scroll position to 10 pixels from the top
    //scrollRoot.scrollTop = 0; // set the scroll position to the top of the window
  }

  blurApellido(){
    this.data.usu_nombre1 = ( this.data.usu_nombre || "" ) + " " + ( this.data.usu_apellido || "" );
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

  validateClick(){
    this.data.optVendedor =  false;
    this.data.optProveedor =  false;
  }

  validadorEmail(email: string){
    try {
      let validador: any = email.split("@");
      validador = validador[1];
      if (validador) {
        validador = validador.toLowerCase();
        console.log(validador);
        //if ((validador == "gmail.com") || (validador == "hotmail.com") || (validador == "hotmail.es") || (validador == "outlook.com") || (validador == "outlook.es")) {
        if (validador == 'gmail.com' || validador == 'gmail.es' ) {
          this.error = ""; return true;
        }
        else this.error = "Problemas el dominio tiene que ser gmail ";
      }
    } catch (error) { }
  }

  GuardarStoreUser() {
    let accion = new UserCabezaAction( this.dataUser, 'post' );
    this._store.dispatch(accion);
  }

  validateRol(  ){
    if( this.data.optVendedor === true ) this.data.rol= 'vendedor';
    if( this.data.optProveedor === true ) this.data.rol= 'proveedor';
  }

  async submit(){
    this.validateRol();
    console.log("***158", this.data )
    if (!this.disableSubmit) return false;
    this._tools.ProcessTime({ title: "¡Registrandote a tu nueva oficina virtual!"});
    let valid: boolean = await this.validando( );
    if (!valid || this.error) { this.disableSubmit = true; return false };
    if( !this.disabledusername ) return this._tools.tooast( { title: "Problemas tenemos problemas en el formulario por favor revisar gracias", icon: "error"})
    this.data = _.omit(this.data, [ 'id', 'usu_nombre1', 'title', 'optVendedor', 'optProveedor' ])
  this.data = _.omitBy(this.data, _.isNull);
  if( this.data.rol == 'proveedor' ) {
    //this.data.listRedes = this.listPltaform.filter( item=> item.check == true );
    this.data.listRedes = [ { titulo: this.data.txtListRedes } ]
  }
  else this.data.listRedes = this.listRedes.filter( item=> item.check == true );
  this.disableSubmit = false;
    this._user.create(this.data).subscribe((res: any) => {
      console.log("user", res);
      this.disableSubmit = true;
      if (res.success) {
        //localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction(res.data, 'post');
        this._store.dispatch(accion);
        accion = new TokenAction({ token: res.data.tokens }, 'post');
        this._store.dispatch(accion);
        try {
          if( res.data.usu_perfil.prf_descripcion === 'vendedor') this._router.navigate(['/articulo']);
          if( res.data.usu_perfil.prf_descripcion === 'proveedor') this._router.navigate(['/infoSupplier']);
        } catch (error) {
          this._router.navigate(['/pedido']);
        }
        /*if( this.data.rol == 'proveedor' ) this._router.navigate(['/config/perfil']);
        else this._router.navigate(['/pedidos']);*/
        this._tools.basicIcons({ header: "Hola Bienvenido!", subheader: `Hola ${res.data.usu_nombre} Que tengas un buen dia` });
        accion = new UserCabezaAction( this.dataUser, 'drop' );
        this._store.dispatch(accion);
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else this._tools.tooast({ title: res.data, icon: "error" });
    }, (error) => { console.error(error); this.disableSubmit = true; this._tools.presentToast("Error de servidor") });
  }

  async validando( ){
    if (!this.data.usu_nombre) { this._tools.tooast({ title: "Error falta el nombre", icon: "error" }); return false; }
    if (!this.data.usu_apellido) { this._tools.tooast({ title: "Error falta el Apellido", icon: "error" }); return false; }
    if (!this.data.usu_indicativo) { this._tools.tooast({ title: "Error falta el Indicativo", icon: "error" }); return false; }
    if (!this.data.usu_telefono) { this._tools.tooast({ title: "Error falta el Telefono", icon: "error" }); return false; }
    if (!this.data.usu_email) { this._tools.tooast({ title: "Error falta la Email", icon: "error" }); return false; }
    this.data.usu_emailReper = this.data.usu_email;
    if (!this.data.usu_clave) { this._tools.tooast({ title: "Error falta la clave", icon: "error" }); return false; }
    if (!this.data.usu_confir) { this._tools.tooast({ title: "Error falta la clave de confirmar", icon: "error" }); return false; }
    if (this.data.usu_confir != this.data.usu_clave) { this._tools.tooast({ title: "Error las claves no son correctas", icon: "error" }); return false; }
    if (!this.data.usu_usuario) { this._tools.tooast({ title: "Error falta Tu Nombre de tienda", icon: "error" }); return false; }
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
}
