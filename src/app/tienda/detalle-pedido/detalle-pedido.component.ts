import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormventasComponent } from 'src/app/dashboard-config/form/formventas/formventas.component';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
  
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss']
})
export class DetallePedidoComponent implements OnInit {
  
  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      ven_sw_eliminado: 0,
      ven_estado: { '!=': 4 }
    },
    page: 0
  };
  Header:any = [ 'Acciones','Tipo Venta','Vendedor','Nombre Cliente','Teléfono Cliente','Fecha Venta','Productos','Cantidad','Precio','Imagen Producto','Estado', 'Motivo Rechazo', 'Tallas' ];
  $:any;

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};

  constructor(
    private _ventas: VentasService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    if( this.dataUser.id ) this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormventasComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
  }

  cargarTodos() {
    this.spinner.show();
    this.query.where.usu_clave_int = this.dataUser.id
    this._ventas.get( this.query )
    .subscribe(
      (response: any) => {
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data)
        this.dataTable.dataRows = _.unionBy(this.dataTable.dataRows || [], this.dataTable.dataRows, 'id');
        this.loader = false;
          this.spinner.hide();
          
          if (response.data.length === 0 ) {
            this.notEmptyPost =  false;
          }
          this.notscrolly = true;
      },
      error => {
        console.log('Error', error);
      });
  }

}
