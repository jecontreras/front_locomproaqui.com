import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UserAction, TokenAction } from 'src/app/redux/app.actions';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  data:any = {};
  disableRestarure:boolean = true;
  disableSubmit: boolean = true;
  disabled:boolean = false;
  ocultar:boolean = false;
  vista:string = "inicial";

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
    private Router: Router
  ) { }

  ngOnInit() {
  }

  handleValidate(){
    this.data.usu_email = this.data.usu_email.replace(/ /g, '');
  }

  submit(){
    if(!this.disableSubmit) return false;
    this.disableSubmit = false;
    this.borrarCache();
    this.data.usu_email = this.data.usu_email.trim();
    this._user.login(this.data).subscribe((res:any)=>{
      console.log("user", res);
      this.disableSubmit = true;
      if(res.success){
        //localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction( res.data, 'post');
        this._store.dispatch(accion);
        accion = new TokenAction( { token: res.data.tokens }, 'post');
        this._store.dispatch( accion );
        this._router.navigate(['/pedidos']);
        this._tools.basicIcons({header: "Hola Bienvenido!", subheader: `Hola ${ res.data.usu_nombre } Que tengas un buen dia`});
        setTimeout(()=>{
          location.reload();
        }, 3000);
        this.dialog.closeAll();
      }else{
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

  openRecuperacion( ){
    if( this.disabled ) return false;
    this.disabled = true;
    this._user.olvidoPass( this.data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Actaulizada la Contraseña por Favor revisar correo electronico" } );
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
