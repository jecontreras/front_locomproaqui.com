import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Indicativo } from 'src/app/JSON/indicativo';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction, TokenAction } from 'src/app/redux/app.actions';
import { TerminosComponent } from 'src/app/layout/terminos/terminos.component';

const indicativos = Indicativo;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  data:any = {};
  listIndicativos = indicativos;
  disableSubmit:boolean = true;

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
    this.data.cabeza = 1;
    if(!this.disableSubmit)return false;
    this.disableSubmit = false;
    this._user.create(this.data).subscribe((res:any)=>{
      console.log("user", res);
      this.disableSubmit = true;
      if(res.success){
        localStorage.setItem('user', JSON.stringify(res.data));
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
      }
    },(error)=>{ console.error(error); this.disableSubmit = true; this._tools.presentToast("Error de servidor")});
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

