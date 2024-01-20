import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RegistroComponent } from 'src/app/components/registro/registro.component';
import { OpenIframeComponent } from 'src/app/extra/open-iframe/open-iframe.component';
import { STORAGES } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  numberInf:number = 0;
  constructor(
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
    private _router: Router,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      try {
        this.numberInf = store.configuracion.clInformacion
      } catch (error) {
        this.numberInf = 3213692393;
      }
    });
  }

  ngOnInit(): void {
  }

  handleOpenView( url:string ){
    const dialogRef = this.dialog.open(OpenIframeComponent, {
      width: '50%',
      data: {
        url: url
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  handleOpenCheckIn( opt:string ){
    //this._router.navigate(['/registro']);
    this._router.navigate(['/singUp', opt, ( this.numberInf || '3213692393' ) ])
    /*const dialogRef = this.dialog.open(RegistroComponent, {
      width: '100%',
      data: {
        view: opt,
        title: opt === "proveedor" ? "Registrate y muestra tus productos a cientos de vendedores": "Crea tu tienda virtual y compartela",
        cabeza: 1,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }

  handleInfo(){
    let url = `https://wa.me/57${ this.numberInf }?text=Hola Servicio al cliente`
    window.open( url )
  }

}
