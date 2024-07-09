import { Component, Inject, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { FormventasComponent } from '../formventas/formventas.component';
import { VentasProductosService } from 'src/app/servicesComponents/ventas-productos.service';
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
  Header:any = [ 'Opciones', 'Vendedor','Nombre Cliente','Teléfono Cliente','Ganancia Vendedor' , 'valor flete', 'Fecha Venta', 'Estado','Ganancia Proveedor', 'Numero Guia', 'Evidencia' ];
  $:any;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  data:any = {};
  counts:number = 0;

  constructor(
    private _ventas: VentasService,
    private spinner: NgxSpinnerService,
    private _ventasproductos: VentasProductosService,
    public dialogRef: MatDialogRef<FormlistventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService,
    public dialog: MatDialog
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

  cargarTodosx(){
    // let ventas_id:any = [];
    // this.datas.datos.cob_listaVentas.map(item => ventas_id.push(item.id));
    let query = {
      where : { ventas : JSON.parse(this.datas.datos.cob_listaVentas) }
     }
     this._ventasproductos.get(query)
     .subscribe(
       (response: any) => {
         console.log("ventasproductos.get res",response)
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
           }
         }
         this.loader = false;
       });
  }


  cargarTodos() {
    this.query.where.ven_retiro = this.data.id;
    console.log("this query", this.query)
    console.log("this datas", this.datas)
    let query = {
      where : { id : JSON.parse(this.datas.datos.cob_listaVentas) }
     }
    this._ventas.get(query)
    .subscribe(
      (response: any) => { console.log("ventas._get response", response)
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

  crear(obj:any){
    const dialogRef = this.dialog.open(FormventasComponent,{
      data: {datos: obj || {}}
    });
    dialogRef.afterClosed().subscribe( async ( result ) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}