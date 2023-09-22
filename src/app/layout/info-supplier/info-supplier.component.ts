import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { RegistroComponent } from 'src/app/components/registro/registro.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-supplier',
  templateUrl: './info-supplier.component.html',
  styleUrls: ['./info-supplier.component.scss']
})
export class InfoSupplierComponent implements OnInit {
  listSupplier:any = [];
  querysStore:any = {
    where:{
      rol:"proveedor"
    },
    page:0,
    limit: 20
  };
  dataUser: any= {};
  dataStore:any = {};
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  counts:number = 0;

  constructor(
    private _user: UsuariosService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.getStore();
  }

  getStore(){
    this.spinner.show();
    return new Promise( resolve =>{
      this.querysStore.where.rol= "proveedor";
      if( this.dataStore.id ) this.querysStore.where.pro_usu_creacion = this.dataStore.id;
      this._user.getStore( this.querysStore ).subscribe( res =>{
        this.counts = res.count;
        console.log("***", this.counts)
        this.listSupplier = _.unionBy(this.listSupplier || [], res.data, 'id');
        this.spinner.hide();
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
        resolve( true );
      },()=> resolve( false ) )
    });
  }

  handleOpenCheckIn( opt:string ){
    this._router.navigate(['/registro']);
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


}
