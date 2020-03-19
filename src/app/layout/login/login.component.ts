import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/redux/app.actions';
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
    this._user.login(this.data).subscribe((res:any)=>{
      console.log("user", res);
      this.disableSubmit = true;
      if(res.success){
        localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction( res.data, 'post');
        this._store.dispatch(accion);
        this._router.navigate(['/pedidos']);
        location.reload();
      }else{
        this._tools.presentToast("Error de sesión")
      }
    },(error)=>{ console.error(error);this.disableSubmit = true; this._tools.presentToast("Error de servidor")});
  }

  registre(){
    
  }

}
