import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction, TokenAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginsComponent implements OnInit {

  data:any = {};
  disableRestarure:boolean = true;
  disableSubmit:boolean = true;
  disabled:boolean = false;
  vista:string = "inicial";
  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    private _store: Store<STORAGES>,
    private _authSrvice: AuthService
  ) { }
  
  ngOnInit() {
    if (this._authSrvice.isLoggedIn()) this._router.navigate(['/pedidos']);
  }

  submit(){
    if(!this.disableSubmit) return false;
    this.disableSubmit = false;
    this.borrarCache();
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
      }else{
        this._tools.presentToast("Error de sesión")
      }
    },(error)=>{ console.error(error);this.disableSubmit = true; this._tools.presentToast("Error de servidor")});
  }

  registre(){
    
  }

  cambiosPass(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._user.olvidoPass( this.data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Actaulizada la Contraseña por Favor revisar correo electronico" } );
      this.disabled = false;
      this.data = {};
      
    }, (error) => { console.log( error ); this._tools.tooast({ title:"Error "+ error.error.data ,icon: "error" }); this.disabled = false; } )
  }

  borrarCache(){
    localStorage.removeItem('APP');
    localStorage.removeItem('user');
  }

}
