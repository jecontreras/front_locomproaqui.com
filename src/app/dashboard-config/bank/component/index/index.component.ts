import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { FormDisbursementComponent } from '../../form/form-disbursement/form-disbursement.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  dataConfig:any = {

  };
  querysSale:any = {
    where:{
    },
    limit: 100000,
    skip: 0
  }
  lisTransactions:any = [];
  lisTransactionsProcess:any = [];
  dataUser:any = {};
  rolName:string;

  constructor(
    private _sale: ProductoService,
    private _store: Store<STORAGES>,
    public _tools: ToolsService,
    private _usuarios: UsuariosService,
    public dialog: MatDialog,
  ) {
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
        this.querysSale.where.creacion = this.dataUser.id;
      } catch (error) {}
    });
  }

  ngOnInit(): void {
    this.getDineros();
    this.getSalesComplete();
    this.getSalesProcess();
  }

  getDineros(){
    this._usuarios.getRecaudo( { where: { usuario: this.dataUser.id } } )
    .subscribe( (res: any ) => {
      try {
        this.dataConfig.receive = res.data[0].valor;
        this.dataConfig.date = new Date()
      } catch (error) {
        this.dataConfig.income = 0;
        this.dataConfig.receive = 0;
        this.dataConfig.date = new Date()
      }
    });
  }

  getSalesComplete(){
    this._sale.getVentaComplete( this.querysSale ).subscribe(res=>{
      console.log("****55", res)
      this.dataConfig.money = res.total;
        this.dataConfig.income = res.total;
      for( let row of res.data ) this.lisTransactions.push( {
        transactions: "Recaudo de pedido contraentrega",
        income: row.loVendio,
        discharge: row.precioVendedor,
        receive: row.ventas.create
      });
    });
  }

  getSalesProcess(){
    this._sale.getVentaCompleteEarring( this.querysSale ).subscribe(res=>{
      console.log("****55", res)
      this.dataConfig.pendingMoney = res.total;
      for( let row of res.data ) this.lisTransactionsProcess.push( {
        transactions: "Recaudo de pedido contraentrega",
        income: row.loVendio,
        discharge: row.precioVendedor,
        receive: row.ventas.create
      });
    });
  }

  handleDisbursement( obj ){
    const dialogRef = this.dialog.open(FormDisbursementComponent,{
      data: { data: obj || {} }
    });

    dialogRef.afterClosed().subscribe( async ( result ) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
