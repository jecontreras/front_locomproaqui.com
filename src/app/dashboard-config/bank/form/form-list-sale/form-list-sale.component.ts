import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormlistventasComponent } from 'src/app/dashboard-config/form/formlistventas/formlistventas.component';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
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
  Header:any = [ 'Codigo','Foto','Precio de Venta','Ganancia de la plataforma','Mi Ganacia', 'Talla', 'Fecha Venta', 'Estado' ];
  $:any;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  data:any = {};
  counts:number = 0;
  dataUser:any = {};
  superSub:boolean = false;

  constructor(
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
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
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.data = _.clone( this.datas.datos );
    console.log("****50", this.data )
    if( this.data.data.id ) this.cargarTodos();
    else this.populateList();
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
    for( let row of this.data.list ){
      let gananciaLk = ( row.precio * ( row.producto.precioLokompro || 5 ) ) / 100;
      console.log("***83", gananciaLk)
      let data:any = {
        code: row.titulo,
        foto: row.fotoproducto,
        loVendio: row.precio,
        miGanancia: row.precioVendedor - gananciaLk, 
        precioVendedor: row.precioVendedor,
        talla: row.tallaSelect,
        pricePlatform: gananciaLk,
        fecha: row.ventas.ven_fecha_venta,
        estado: row.ventas.ven_estado ? 'Exitoso' : 'Reexpedición'
      }
      this.dataTable.dataRows.push( data );
    }
    this.loader = false;
    console.log("****82", this.dataTable)
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
