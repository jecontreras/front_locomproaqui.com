import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { FormDisbursementComponent } from '../../form/form-disbursement/form-disbursement.component';
import { CreateBankComponent } from '../../form/create-bank/create-bank.component';
import { BancosService } from 'src/app/servicesComponents/bancos.service';
import { FormListSaleComponent } from '../../form/form-list-sale/form-list-sale.component';
import * as moment from 'moment';

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
    limit: 10,
    skip: 0
  }
  lisTransactions:any = []; // lista de cobros
  lisTransactionsProcess:any = []; //lista de ventas para cobrar
  dataUser:any = {};
  rolName:string;
  listBank:any = [];
  listPendiente:any = [];
  btnDesembolsarDisabled:boolean = true;

  constructor(
    private _sale: ProductoService,
    private _store: Store<STORAGES>,
    public _tools: ToolsService,
    private _usuarios: UsuariosService,
    public dialog: MatDialog,
    private _bank: BancosService
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
    // this.getSalesComplete();
    this.getSales();
    this.getDineros(); //recibiste
   // this.getTransportBuyEarning(); //Pendiente Pago de Transportadora
    //this.getSalesProcess();
    // this.getListBank();
    this.getCobros(); //cobros

  }

  getListBank(){
    this._bank.get( { where: { user: this.dataUser.id }, limit: 1000 } ).subscribe( res => {
      this.listBank = res.data;
    });
  }

  getDineros(){
     this._usuarios.getRecaudo( { where: { usuario: this.dataUser.id } }).subscribe( (res: any ) => {
      try {
        //this.dataConfig.receive = res.data[0].valor;
        this.dataConfig.date = moment().format()
      } catch (error) {
        this.dataConfig.income = 0;
        this.dataConfig.receive = 0;
        this.dataConfig.date = moment().format()
      }
    });
  }

  getSales(){ //console.log("get sales")
      //debo enviar el id del usuario y el usu_perfil
      let query = { usu_id : 0, usu_perfil : 0}
      let totalCompletas =0
      let totalDespachado = 0
      let totalPdtePagoTrans = 0
      query.usu_id =  this.querysSale.where.creacion
      query.usu_perfil = this.dataUser.usu_perfil.id
      // console.log(" getSales() query", query)
      this._sale.getVentas( query ).subscribe(res=>{
      //console.log("getSales res", res)
      for( let row of res.data ){
        if(query.usu_perfil == 5){ //proveedor
          if(row.ven_estado == 1 && row.cob_id_proveedor == 0){
            if(row.pagaPlataforma == 1){
              totalCompletas += row.ven_totaldistribuidor
              this.lisTransactionsProcess.push(row)
            }else{
              totalPdtePagoTrans += row.ven_totaldistribuidor
            }
          } 
          if(row.ven_estado == 3) totalDespachado += row.ven_totaldistribuidor
        }
        if(query.usu_perfil == 1 ){ //vendedor
          if(row.ven_estado == 1 && row.cob_id_vendedor == 0){
            if(row.pagaPlataforma == 1){
              totalCompletas += row.ven_ganancias
              this.lisTransactionsProcess.push(row)
            }else
              totalPdtePagoTrans += row.ven_ganancias
          } 
          if(row.ven_estado == 3) totalDespachado += row.ven_ganacias
        }

      };
      this.dataConfig.money = totalCompletas; //Dinero para solicitar desembolso
      this.dataConfig.pdtePagoTrans = totalPdtePagoTrans; //pendiente pago transportadora
      this.dataConfig.enTransito = totalDespachado; // pedidos en estado 3
      if(this.dataConfig.money > 0)
        this.btnDesembolsarDisabled = false
        //this.dataConfig.receive = res.total;

    });
  }

  getSalesComplete(){ //no usable
    this._sale.getVentaComplete( this.querysSale ).subscribe(res=>{
      // console.log("****55", res)
      this.dataConfig.money = res.total;
      this.dataConfig.income = res.totalSinLK;
      this.btnDesembolsarDisabled = false
        //this.dataConfig.receive = res.total;
      // for( let row of res.data ) this.lisTransactions.push( {
      //   transactions: "Recaudo de pedido contraentrega",
      //   income: row.loVendio,
      //   discharge: row.precioVendedor,
      //   receive: row.ventas.create
      // });
    });
  }

  getCobros(){ //console.log("getcobros")
    // obtener los cobros
    // this._usuarios.getRecaudo( { where: { usuario: this.dataUser.id } } )
    let total = 0
    let peticion = {
      "where": {},
      "page": 0,
      "limit": 10
    }
    peticion.where = { "usu_clave_int" : this.dataUser.id }
    this._usuarios.getCobros(peticion ).subscribe( (res: any ) => {
      try {
        //console.log("_usuarios.getCobros res", res)
        for( let row of res.dataEnd ){
          this.lisTransactions.push( {
            cob_descripcion: row.cob_descripcion,
            cob_monto: row.cob_monto,
            cob_fecha_cobro: row.cob_fecha_cobro,
            totalrecibir: row.totalrecibir,
            cob_fecha_pago: row.cob_fecha_pago
          });
          total +=  row.totalrecibir
        }
        this.dataConfig.receive = total
      } catch (error) {

      }
    });
  }

  getSalesProcess(){ //no usable
    this._sale.getVentaCompleteEarring( this.querysSale ).subscribe(res=>{
      // console.log("****55", res)
      this.dataConfig.pendingMoney = res.total;
      this.listPendiente = res.data;
      for( let row of res.data ) this.lisTransactionsProcess.push( {
        transactions: "Recaudo de pedido contraentrega",
        income: row.loVendio,
        discharge: row.precioVendedor,
        receive: row.ventas.create
      });
    });
  }

  handleDisbursement( obj ){ //solicitar desembolso
    obj.amount = this.dataConfig.money
    obj.lisTransactions = this.lisTransactionsProcess
    this.btnDesembolsarDisabled = true
    const dialogRef = this.dialog.open(FormDisbursementComponent,{
      data: { data: obj || {} }
    });

    dialogRef.afterClosed().subscribe( async ( result ) => {
      // console.log(`Dialog result: ${result}`);
      if( result === 'creo' ) location.reload();
    });
  }

  handleCreateBank(){
    const dialogRef = this.dialog.open(CreateBankComponent,{
      data: {datos: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  handleListReinitegro(){
    const dialogRef = this.dialog.open(FormListSaleComponent,{
      data: {
        datos: {
          list: this.listPendiente,
          data: {}
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
