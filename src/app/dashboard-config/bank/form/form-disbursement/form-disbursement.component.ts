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
    this.opcionCurrencys = this._tools.currency;
    // this.getBank(); //envia el registro del cobro
    this.getSalesComplete();
    this.data.cob_num_cedula = this.dataUser.usu_cedula
    this.data.cob_num_celular = this.dataUser.usu_telefono
    //console.log("this.dataUser", this.dataUser)
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
    this._sale.getVentas( query ).subscribe(res=>{
      //console.log("getSalesComplete()", res)
      this.data.listVentas = []
      this.data.cob_listaVentas = []
      for( let row of res.data ){
        if(query.usu_perfil == 5){ //proveedor
          if(row.ven_estado == 1 && row.cob_id_proveedor == 0)
            this.data.cob_listaVentas.push({
              id : row.id
            })
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
      if(query.usu_perfil == 1 ){ //console.log("es vend" , total)
        this.data.amount = total
      }else
        this.data.amount = res.total;
    })
  }

  getBank(){
    this._bank.get( { where: { user: this.dataUser.id } } ).subscribe(res=>{
      this.listBank = res.data;
      if( this.listBank.length === 0 ) return this._tools.presentToast("¡Lo Sentimos primero debes agregar los datos bancarios!");
    });
  }

  async submit(){ //console.log("submit")

    // this._tools.ProcessTime({ title: "", tiempo: 4000 })
    // if( this.id ) {
    //   if( !this.superSub ) if( this.clone.ven_estado == 1 ) { this._tools.presentToast("Error no puedes ya editar el Cobro ya esta aprobada"); return false; }
    //   await this.handleUpdates();
    // }
    await this.handleAddCobro();

    // this.dialogRef.close('creo');
  }

  async handleUpdates(){
    return false;
  }

  openVentasList(){
    const dialogRef = this.dialog.open(FormListSaleComponent,{
      data: {
        datos: {
          list: this.lisTransactionsC,
          data: this.data,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  handleAdd(){ //console.log("handleAdd")
    return new Promise( resolve =>{
      this.data.listVentas = _.map( this.lisTransactions, 'id' );
      this.data.user = this.dataUser.id;
      this.data.
      console.log("data", this.data)
      this._supplier.create( this.data ).subscribe( res =>{
        if( res.status === 400 ){
          this._tools.tooast( { icon: "error",title: 'Lo sentimos tenemos Problemas! '+ res.data } );
        }
        else this._tools.tooast( { title: 'Proceso de retiro confirmado! Tu proceso estará en proceso demora 3 - 6 días hábiles' } );
        resolve( res );
      },()=> resolve( {}) );
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
    // this.data.listVentas = _.map( this.lisTransactions, 'id' ); // cargo las ventas
    this.data.usu_clave_int = this.dataUser.id;
    this.data.cob_monto = this.data.amount
    this.data.cob_fecha_cobro = new Date()
    this.data.cob_descripcion = "Pago Comision por Venta"
    this.data.usu_perfil = this.dataUser.usu_perfil.id;
    //this.data.cob_listaVentas = _.map( this.lisTransactions, 'id' );
    //console.log("handleAddCobro",this.data)
    this._cobros.create( this.data ).subscribe( res =>{
      if( res.status === 400 ){
        this._tools.tooast( { icon: "error",title: 'Lo sentimos tenemos Problemas! '+ res.data } );
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
