import { Component, OnInit } from '@angular/core';
import { Indicativo } from 'src/app/JSON/indicativo';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { TerminosComponent } from '../terminos/terminos.component';

const indicativos = Indicativo;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistrosComponent implements OnInit {
  
  data:any = {};
  listIndicativos = indicativos;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    private _store: Store<STORAGES>,
    private _authSrvice: AuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this._authSrvice.isLoggedIn()) this._router.navigate(['/config']);
  }

  submit(){
    this._user.create(this.data).subscribe((res:any)=>{
      console.log("user", res);
      if(res.success){
        localStorage.setItem('user', JSON.stringify(res.data));
        let accion = new UserAction( res.data, 'post');
        this._store.dispatch(accion);
        this._router.navigate(['/config']);
        location.reload();
      }
    },(error)=>{ console.error(error); this._tools.presentToast("Error de servidor")});
  }
  
  terminos(){
    const dialogRef = this.dialog.open(TerminosComponent,{
      width: '461px',
      data: { datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
