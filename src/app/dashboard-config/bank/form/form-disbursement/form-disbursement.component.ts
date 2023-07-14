import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { BancosService } from 'src/app/servicesComponents/bancos.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-disbursement',
  templateUrl: './form-disbursement.component.html',
  styleUrls: ['./form-disbursement.component.scss']
})
export class FormDisbursementComponent implements OnInit {

  disabledButton:boolean = false;
  id:any;
  data:any = {
    bank: 2
  };
  opcionCurrencys: any = {};
  superSub:boolean = false;
  clone:any = {};
  dataUser:any = {};
  listBank:any = [];
  querysSale:any = {
    where:{
    },
    limit: 10,
    skip: 0
  };
  dataConfig:any = {

  };
  lisTransactions:any = [];

  constructor(
    private _tools: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
    private _bank: BancosService,
    private _sale: ProductoService,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
      this.querysSale.where.creacion = this.dataUser.id;
    });
  }

  ngOnInit(): void {
    this.opcionCurrencys = this._tools.currency;
    this.getBank();
    this.getSalesComplete();
  }

  getSalesComplete(){
    this._sale.getVentaComplete( this.querysSale ).subscribe(res=>{
      console.log("****55", res)
      this.data.cob_monto = res.total;
      this.data.cob_monto = res.total;
      for( let row of res.data ) this.lisTransactions.push( {
        transactions: "Recaudo de pedido contraentrega",
        income: row.loVendio,
        discharge: row.precioVendedor,
        receive: row.ventas.create,
        id: row.id
      } );
    });
  }

  getBank(){
    this._bank.get( { where: { user: this.dataUser.id } } ).subscribe(res=>{
      this.listBank = res.data;
      if( this.listBank.length === 0 ) return this._tools.presentToast("¡Lo Sentimos primero debes agregar los datos bancarios!");
    });
  }

  async submit(){
    this.disabledButton = true;
    if( this.id ) {
      if( !this.superSub ) if( this.clone.ven_estado == 1 ) { this._tools.presentToast("Error no puedes ya editar el Cobro ya esta aprobada"); return false; }
      await this.handleUpdates();
    }
    else await this.handleAdd();
  }

  async handleUpdates(){
    return false;
  }

  handleAdd(){
    return new Promise( resolve =>{
      this.data.listVentas = _.map( this.lisTransactions, 'id' );
      this.data.user = this.dataUser.id;
      this._bank.create( this.data ).subscribe( res =>{
        this._tools.tooast( { title: 'Proceso de retiro confirmado! Tu proceso estará en proceso demora 3 - 6 días hábiles' } );
        resolve( res );
      },()=> resolve( {}) );
    });
  }

}
