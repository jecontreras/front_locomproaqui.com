import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Indicativo } from 'src/app/JSON/indicativo';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/redux/app.actions';

const indicativos = Indicativo

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  data:any = {};
  listIndicativos = indicativos;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
  ) { }

  ngOnInit() {
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
        this.dialog.closeAll();
      }
    },(error)=>{ console.error(error); this._tools.presentToast("Error de servidor")});
  }

}

