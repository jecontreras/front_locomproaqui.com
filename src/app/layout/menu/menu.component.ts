import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { RegistroComponent } from 'src/app/components/registro/registro.component';
import { OpenIframeComponent } from 'src/app/extra/open-iframe/open-iframe.component';
import { STORAGES } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
  ) { }

  ngOnInit(): void {
  }

  handleOpenView( url:string ){
    const dialogRef = this.dialog.open(OpenIframeComponent, {
      width: '950px',
      data: {
        url: url
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  handleOpenCheckIn( opt:string ){
    const dialogRef = this.dialog.open(RegistroComponent, {
      width: '100%',
      data: {
        view: opt,
        title: opt === "proveedor" ? "Registrate y muestra tus productos a cientos de vendedores": "Crea tu tienda virtual y compartela",
        cabeza: 1,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
