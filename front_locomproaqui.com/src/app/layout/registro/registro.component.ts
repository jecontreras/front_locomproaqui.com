import { Component, OnInit } from '@angular/core';
import { Indicativo } from 'src/app/JSON/indicativo';
import { ToolsService } from 'src/app/services/tools.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserCabezaAction } from 'src/app/redux/app.actions';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { RegistroComponent } from 'src/app/components/registro/registro.component';

const indicativos = Indicativo;

@Component({
  selector: 'app-registros',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistrosComponent implements OnInit {

  data: any = {
    usu_indicativo: "57",
    ids: "XXXXXXXXXXXXXXXXXXXX",
    usu_imagen: './assets/logo.png'
  };
  dataUser: any = {};
  cabeza: any;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router,
    private _authSrvice: AuthService,
    public dialog: MatDialog,
    private activate: ActivatedRoute,
    private _store: Store<STORAGES>,
  ) { }

  ngOnInit(): void {
    if (this.activate.snapshot.paramMap.get('id')) {
      this.cabeza = (this.activate.snapshot.paramMap.get('id'));
      this.getCabeza();
    } else this.data.cabeza = 1;
    if (this._authSrvice.isLoggedIn()) this._router.navigate(['/pedidos']);
  }

  handleOpenDialog( opt:string ){
    this._router.navigate(['/singUp', opt, ( this.data.usu_telefono || '3213692393' ) ])
    return false;
    const dialogRef = this.dialog.open(RegistroComponent, {
      width: '100%',
      data: {
        view: opt,
        title: opt === "proveedor" ? "Registrate y muestra tus productos a cientos de vendedores": "Crea tu tienda virtual y compartela",
        cabeza: this.cabeza,
        usu_email: this.data.usu_email
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


openEmail(){
  console.log("**ENTRE")
  let scrollRoot = this._tools.getScrollRoot();
  scrollRoot.scrollTop = 500;
  this.handleOpenDialog('vendedor');
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

}
