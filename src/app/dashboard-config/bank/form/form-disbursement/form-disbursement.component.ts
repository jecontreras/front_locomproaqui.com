import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { BancosService } from 'src/app/servicesComponents/bancos.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';
import { SupplierAccountantService } from 'src/app/servicesComponents/supplier-accountant.service';
import { FormlistventasComponent } from 'src/app/dashboard-config/form/formlistventas/formlistventas.component';
import { FormListSaleComponent } from '../form-list-sale/form-list-sale.component';
import { CobrosService } from 'src/app/servicesComponents/cobros.service';

@Component({
  selector: 'app-form-disbursement',
  templateUrl: './form-disbursement.component.html',
  styleUrls: ['./form-disbursement.component.scss']
})
export class FormDisbursementComponent implements OnInit {

  disabledButton:boolean = true;
  btnVentasSolDisabled:boolean = true;
  id:any;
  data:any = {
    // bank: 2
  };
  params:any = {}
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
  lisTransactionsC:any = [];

  constructor(
    private _tools: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
    private _bank: BancosService,
    private _sale: ProductoService,
    private _cobros: CobrosService,
    private _supplier: SupplierAccountantService,
    public dialogRef: MatDialogRef<FormDisbursementComponent>,
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
    //console.log("datas", this.datas)
    this.data.amount = this.datas.data.amount
    this.opcionCurrencys = this._tools.currency;
    //console.log("this.dataUser", this.dataUser)
    this.data.cob_num_cedula = this.dataUser.usu_cedula
    this.data.cob_num_celular = this.dataUser.usu_telefono
    this.btnVentasSolDisabled = false
    this.disabledButton = false
    //this.getSalesComplete()
  }

  getSalesComplete(){ 
    let total = 0
    this._sale.getVentaComplete( this.querysSale ).subscribe(res=>{
      this.lisTransactionsC = res.data;
      this.btnVentasSolDisabled = false
      this.disabledButton = false
      for( let row of res.data ) this.lisTransactions.push( {
        transactions: "Recaudo de pedido contraentrega",
        income: row.loVendio,
        discharge: row.precioVendedor,
        receive: row.ventas.create,
        id: row.id
      } );
    });
    let query = { usu_id : 0, usu_perfil : 0}
    query.usu_id =  this.querysSale.where.creacion
    query.usu_perfil = this.dataUser.usu_perfil.id
    console.log(query)
    this._sale.getVentas( query ).subscribe(res=>{
      console.log("getSalesComplete() getVenta", res)
      this.data.listVentas = []
      this.data.cob_listaVentas = []
      for( let row of res.data ){
        if(query.usu_perfil == 5){ //proveedor
          if(row.ven_estado == 1 && row.cob_id_proveedor == 0)
            this.data.cob_listaVentas.push({
              id : row.id
            })
            total+= row.ven_totaldistribuidor
            this.data.cob_listaVentas.push(row)
        }
        if(query.usu_perfil == 1 ){ //vendedor
          //console.log("row", row)
          if(row.ven_estado == 1 && row.cob_id_vendedor == 0){
            this.data.cob_listaVentas.push({
              id : row.id
            })
            total+= row.ven_ganancias
          }
        }
      }
      // if(query.usu_perfil == 1 ){ //console.log("es vend" , total)
      //   this.data.amount = total
      // }else
        this.data.amount = total;
        console.log("this.data.cob_listaVentas", this.data.cob_listaVentas)
    })
  }

  getBank(){
    this._bank.get( { where: { user: this.dataUser.id } } ).subscribe(res=>{
      this.listBank = res.data;
      if( this.listBank.length === 0 ) return this._tools.presentToast("¡Lo Sentimos primero debes agregar los datos bancarios!");
    });
  }

  async submit(){ //console.log("submit")
    await this.handleAddCobro();
  }

  async handleUpdates(){
    return false;
  }

  openVentasList(){
    const dialogRef = this.dialog.open(FormListSaleComponent,{
      data: {
        datos: {
          list: this.datas.data.lisTransactions,
          amount : this.data.amount
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  handleAddCobro(){ //console.log("handleAddCobro",this.data)
  // return new Promise( resolve =>{
  this.disabledButton = true;
  let errores = 0
  if(!this.data.cob_num_cedula){  this._tools.tooast( { icon: "warning",title: 'Debes diligenciar un numero de Cedula Válido' } ); errores++; }
  if(!this.data.cob_metodo){  this._tools.tooast( { icon: "warning",title: 'Debes diligenciar un Metodo de pago' } ); errores++; }
  if(!this.data.cob_num_cuenta ){  this._tools.tooast( { icon: "warning",title: 'Debes diligenciar un numero de Cuenta Válido' } ); errores++; }else{
    if(this.data.cob_num_cuenta.length  < 6 ){  this._tools.tooast( { icon: "warning",title: 'Debes diligenciar un numero de Cuenta Válido' } ); errores++; }
  }
  if(errores == 0){
    this.data.usu_clave_int = this.dataUser.id;
    this.data.cob_monto = this.data.amount
    this.data.cob_fecha_cobro = new Date()
    this.data.cob_descripcion = "Pago Comision por Venta"
    this.data.usu_perfil = this.dataUser.usu_perfil.id;
    this.data.cob_listaVentas = _.map( this.datas.data.lisTransactions, 'id' );
    console.log("handleAddCobro",this.data)
    this._cobros.create( this.data ).subscribe( res =>{
      if( res.status === 400 ){
        this._tools.tooast( { icon: "error",title: 'Lo sentimos, tenemos Problemas! '+ res.data } );
        this.disabledButton = false;
      }
      else{
        this._tools.tooast( { icon: "success",title: res.data} );
      }
    });
  }else{
    this.disabledButton = false;
  }
}

}
