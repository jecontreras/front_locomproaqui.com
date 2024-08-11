import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction, TokenAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { RegistroComponent } from 'src/app/components/registro/registro.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginsComponent implements OnInit {

  data:any = {
    indicative: "57"
  };
  disableRestarure:boolean = true;
  disableSubmit:boolean = true;
  disabled:boolean = false;
  vista:string = "inicial";
  ocultar:boolean = false;
  showPassword = false;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    private _store: Store<STORAGES>,
    private _authSrvice: AuthService,
    private activate: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    // if (this._authSrvice.isLoggedIn()) this._router.navigate(['/articulo']);
    console.log("***", this.activate.snapshot.params )
    if( this.activate.snapshot.paramMap.get('id') ) this.data.usu_email = this.activate.snapshot.paramMap.get('id');
    if( this.activate.snapshot.paramMap.get('cel') ) {this.data.IDL = true; this.data.usu_clave = this.activate.snapshot.paramMap.get('cel');}
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      passwordInput.type = 'text'; // Mostrar la contraseña
    } else {
      passwordInput.type = 'password'; // Ocultar la contraseña
    }
  }

  submit(){
    if(!this.disableSubmit) return false;
    this.disableSubmit = false;
    this.borrarCache();
    this.data.usu_email = this.data.usu_email.trim();
    this._user.login(this.data).subscribe((res:any)=>{
      //console.log("user", res);
      this.disableSubmit = true;
      if(res.success){
        //localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction( res.data, 'post');
        console.log("user action", res.data)
        this._store.dispatch(accion);
        accion = new TokenAction( { token: res.data.tokens }, 'post');
        this._store.dispatch( accion );
        try {
          if( res.data.usu_perfil.prf_descripcion === 'vendedor') this._router.navigate(['/articulo']);
          if( res.data.usu_perfil.prf_descripcion === 'proveedor') this._router.navigate(['/infoSupplier']);
          if( res.data.usu_perfil.id == 2) this._router.navigate(['/infoSupplier']);
        } catch (error) {
          this._router.navigate(['/pedido']);
        }
        this._tools.basicIcons({header: "Hola Bienvenido!", subheader: `Hola ${ res.data.usu_nombre } Que tengas un buen dia`});
        setTimeout(()=>{
          location.reload();
        }, 3000);
      }else{
        this._tools.error( { mensaje: res.message, footer: "Problemas de sesión" } );
        this._tools.presentToast( res.message )
      }
    },(error)=>{ console.error(error); this.disableSubmit = true; this._tools.presentToast("Error de servidor")});
  }

  registre(){
    const dialogRef = this.dialog.open(RegistroComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /*openRecuperacion( data:any ){
    //let ulr:string = 'https://wa.me/573148487506?text=Hola Servicio al cliente, como esta, saludo cordial, necesito recuperar las credenciales de mi cuenta ' + data.usu_email ;
    this._user.recuperacion( { usu_email: this.data.usu_email } ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Contraseña cambiada por favor revisar el correo electronico ", timer: 5000 } );
      this.disabled = false;
      this.ocultar = true;
      this.disableRestarure = true;
    },( error:any ) =>{
      console.log( error);
      let errors = error.error.data || "";
      this._tools.tooast( { title: "Tenemos problemas con el restablecimiento de la contraseña "+ errors, icon: "error", timer: 5000 } ); this.disabled = false; } );
  }*/

  async openRecuperacion( ){
    let alertInput:any  = await this._tools.alertInput( { title: "Escriba tu correo electronico"} );
    if( !alertInput.value )  return this._tools.tooast({ title:"Por Favor Escriba tu correo electronico?" ,icon: "error" });
    this.data.usu_email = alertInput.value;
    if( this.disabled ) return false;
    this.disabled = true;
    this._user.olvidoPass( this.data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Actualizado la Contraseña por Favor revisar correo electrónico" } );
      this.disabled = false;
      this.ocultar = true;
      this.disableRestarure = true;

    }, (error) => { console.log( error ); this._tools.tooast({ title:"Error "+ error.error.data ,icon: "error" }); this.disabled = false; } )
  }

  borrarCache(){
    localStorage.removeItem('APP');
    localStorage.removeItem('user');
  }

  

}
