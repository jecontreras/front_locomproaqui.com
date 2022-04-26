import { Component, Inject, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-formlistventas',
  templateUrl: './formlistventas.component.html',
  styleUrls: ['./formlistventas.component.scss']
})
export class FormlistventasComponent implements OnInit {
  
  dataTable: DataTable;
  loader = true;
  query:any = {
    where:{
      ven_retiro: null
    },
    page: 0,
    limit: 100
  };
  Header:any = [ 'Vendedor','Nombre Cliente','Teléfono Cliente','Pagado' , 'valor flete', 'Fecha Venta', 'Estado','Ganancia', 'Numero Guia', 'Evidencia' ];
  $:any;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  data:any = {};
  counts:number = 0;

  constructor(
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormlistventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService
  ) { }

  ngOnInit(): void {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.data = _.clone( this.datas.datos );
    this.cargarTodos();
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

  openEvidencia( url:string ){
    window.open( url )
  }

}
