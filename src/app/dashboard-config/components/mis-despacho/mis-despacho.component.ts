import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-mis-despacho',
  templateUrl: './mis-despacho.component.html',
  styleUrls: ['./mis-despacho.component.scss']
})
export class MisDespachoComponent implements OnInit {

  dataTable: DataTable;
  dataTable2: DataTable;
  dataTable3: DataTable;
  dataTable4: DataTable;
  dataTable5: DataTable;
  dataTable6: DataTable;

  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{

    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Seleccionar','Transportadora','Productos', 'Fecha de orden', 'Estado de la orden', 'Numero del vendedor','Nombre cliente final',"Valor bodega", 'Venta final'];
  $:any;

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;

  reacudo:number;
  total:number;
  Pdreacudo:number;
  Pcreacudo:number;
  counts:number = 0;
  counts2:number = 0;
  querysSale:any = {
    where:{
    },
    limit: 10,
    skip: 0
  }

  querysComplete:any = {
    where:{
    },
    limit: 10,
    skip: 0
  };

  constructor(
    public dialog: MatDialog,
    public _tools: ToolsService,
    private _productos: ProductoService,
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,

  ) {
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
        this.querysSale.where.creacion = this.dataUser.id;
        this.querysComplete.where.creacion = this.dataUser.id;
      } catch (error) {}
    });
  }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable2 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable3 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable4 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable5 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.dataTable6 = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos4(); //pendietes por imprimir
    this.cargarCompletas();
    this.cargarTodos2();
    this.cargarTodos3();
    this.cargarTodos5();
    this.cargarTodos6();
    //this.getDineros();
  }

  cargarTodos6() {
    this.spinner.show();
    this._productos.getTransactionsPreparacion( this.querysSale ).subscribe(res=>{
     //console.log("****55", res)
      this.dataTable6.headerRow = this.dataTable6.headerRow;
      this.dataTable6.footerRow = this.dataTable6.footerRow;
      this.dataTable6.dataRows.push(... res.data);
      this.dataTable6.dataRows =_.unionBy(this.dataTable6.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  cargarTodos5() {
    this.spinner.show();
    this._productos.getVentaDevolution( this.querysSale ).subscribe(res=>{
     // console.log("****55", res)
      this.counts2 = res.count;
      this.Pdreacudo = res.total;
      this.dataTable5.headerRow = this.dataTable5.headerRow;
      this.dataTable5.footerRow = this.dataTable5.footerRow;
      this.dataTable5.dataRows.push(... res.data);
      this.dataTable5.dataRows =_.unionBy(this.dataTable5.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  cargarTodos4() { // por imprimir  por generar guia
    this.spinner.show();
    this._productos.getVentaCompletePendients( this.querysSale ).subscribe(res=>{
     // console.log("****55", res)
     console.log("ctodos4", res.data)
      this.counts2 = res.count;
      this.Pdreacudo = res.total;
      this.dataTable4.headerRow = this.dataTable4.headerRow;
      this.dataTable4.footerRow = this.dataTable4.footerRow;
      this.dataTable4.dataRows.push(... res.data);
      this.dataTable4.dataRows =_.unionBy(this.dataTable4.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  cargarTodos3() { //guias pagas al proveedor
    this.spinner.show();
    this._productos.getVentaCompleteComplete( this.querysComplete ).subscribe(res=>{
      //console.log("****55", res)
      this.counts2 = res.count;
      this.Pcreacudo = res.total;
      this.dataTable3.headerRow = this.dataTable3.headerRow;
      this.dataTable3.footerRow = this.dataTable3.footerRow;
      this.dataTable3.dataRows.push(... res.data);
      this.dataTable3.dataRows =_.unionBy(this.dataTable3.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }
  cargarTodos2() { //despachadas
    this.spinner.show();
    this._productos.getVentaCompleteEarring( this.querysSale ).subscribe(res=>{
      //console.log("****55", res)
      this.counts2 = res.count;
      this.Pdreacudo = res.total;
      this.dataTable2.headerRow = this.dataTable2.headerRow;
      this.dataTable2.footerRow = this.dataTable2.footerRow;
      this.dataTable2.dataRows.push(... res.data);
      this.dataTable2.dataRows =_.unionBy(this.dataTable2.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  guiasCompletadas(){ console.log("guias completadas")  }

  cargarCompletas() { // completadas
    this.spinner.show();
    this._productos.getVentaComplete( this.querysSale ).subscribe(res=>{
      console.log("cargarCompletas completas", res)
      this.counts = res.count;
      this.reacudo = res.total;
      this.dataTable.headerRow = this.dataTable.headerRow;
      this.dataTable.footerRow = this.dataTable.footerRow;
      this.dataTable.dataRows.push(... res.data);
      this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();
        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }

  cargarCompletascccc() { // completadas
    this.spinner.show();
    // this._productos.getVentaComplete( this.querysSale ).subscribe(res=>{
    this._ventas.getVentasExitosasProveedor({ proveedor_id: this.dataUser.id }).subscribe(res=>{
      // console.log("****55 completas", res)
      // this.counts = res.count;
      // this.reacudo = res.total;
      console.log("cargarCompletas res",res)

      this.counts = res.length
      this.total = res.data.reduce((accumulator, item) => {
        return accumulator + item.ven_ganancias
      },0);

      console.log(this.total) // 15
      this.dataTable.headerRow = this.dataTable.headerRow;
      this.dataTable.footerRow = this.dataTable.footerRow;
      this.dataTable.dataRows.push(... res.data);
      this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], res.data, 'id');
      this.loader = false;
        this.spinner.hide();

        if (res.data.length === 0 ) {
          this.notEmptyPost =  false;
        }
        this.notscrolly = true;
    });
  }
}
