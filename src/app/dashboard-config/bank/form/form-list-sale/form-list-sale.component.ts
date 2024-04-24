import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormlistventasComponent } from 'src/app/dashboard-config/form/formlistventas/formlistventas.component';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { VentasProductosService } from 'src/app/servicesComponents/ventas-productos.service';
import * as _ from 'lodash';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-form-list-sale',
  templateUrl: './form-list-sale.component.html',
  styleUrls: ['./form-list-sale.component.scss']
})
export class FormListSaleComponent implements OnInit {
  dataTable: DataTable;
  loader = true;
  query:any = {
    where:{
      ven_retiro: null
    },
    page: 0,
    limit: 100
  };
  // Header:any = [ 'Codigo','Numero de Guia','Foto','Precio de Venta','Ganancia de la plataforma','Mi Ganacia', 'Talla', 'Fecha Venta', 'Estado' ];
  Header:any = [ 'Codigo','Numero de Guia','Foto', 'Talla', 'Fecha Venta', 'Estado' ];
  $:any;

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  data:any = {};
  counts:number = 0;
  dataUser:any = {};
  superSub:boolean = false;
  suma:number = 0;
  formatoMoneda:any = {};
  amount:number = 0;

  constructor(
    private _ventas: VentasService,
    private _ventasproductos: VentasProductosService,
    public dialogRef: MatDialogRef<FormlistventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService,
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });
  }

  ngOnInit(): void {
    this.formatoMoneda = this._tools.currency;
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    console.log("datas", this.datas)
    this.data = _.clone( this.datas.datos );
    console.log("ngOnInit()", this.data )
    this.amount = this.datas.datos.amount
    console.log("this.amount", this.amount)
    // if( this.data.data.id )
    //   this.cargarTodos();
    // else
      this.populateList();
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
  }

  pageEvent( ev: any ) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  populateList(){
    let suma = 0;
    //tomos los id de las ventas
    let ventas_id:any = [];
    this.data.list.map(item => ventas_id.push(item.id));

    let query = {
     where : { ventas : ventas_id }
    }
    this._ventasproductos.get(query)
    .subscribe(
      (response: any) => {
        //console.log("ventasproductos.get res",response)
        for( let row of response.data ){
          let gananciaLk = 0;
          try { gananciaLk = ( row.precio * ( row.producto.precioLokompro || 5 ) ) / 100; } catch (error) { }

          if( !row.ventas ) continue;
          console.log("***83", row, row.id)
          let data:any = {
            code: row.titulo,
            foto: row.fotoproducto,
            loVendio: row.loVendio,
            miGanancia: row.precioVendedor - gananciaLk,
            precioVendedor: row.precioVendedor,
            talla: row.colorSelect,
            pricePlatform: gananciaLk,
            ven_numero_guia: row.ventas.ven_numero_guia,
            fecha: row.ventas.ven_fecha_venta || row.ventas.createdAt,
            estado: row.ventas.ven_estado ? 'Exitoso' : 'Reexpedición'
          }
          if( data.ven_numero_guia ) {
            this.dataTable.dataRows.push( data );
            suma+=data.miGanancia;
          }
        }
        this.loader = false;
        this.suma = suma;
        //console.log("****82", this.dataTable)
      });
  }

  cargarTodos() {
    this.query.where.ven_retiro = this.data.id;
    this._ventas.get(this.query)
    .subscribe(
      (response: any) => {
        this.counts = response.count;
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data)
        this.dataTable.dataRows = _.unionBy(this.dataTable.dataRows || [], this.dataTable.dataRows, 'id');
        this.loader = false;

          if (response.data.length === 0 ) {
            this.notEmptyPost =  false;
          }
          this.notscrolly = true;
      },
      error => {
        console.log('Error', error);
      });
  }

  openEvidencia( url:string, item:any  ){
    if( item.transportadoraSelect == "CORDINADORA" ){
      this._ventas.imprimirEvidencia( { nRemesa: item.ven_numero_guia } ).subscribe( ( res:any )=>{
        res = res.data[0];
        //console.log("**", res.imagen )
        if( !res ) return this._tools.tooast("");
        this._tools.downloadIMG( res.imagen );
      });
    }else{
      window.open( url );
    }
  }

}
