import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { FormVentasVeraComponent } from '../../form/form-ventas-vera/form-ventas-vera.component';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';


declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;


@Component({
  selector: 'app-list-ventas-vera',
  templateUrl: './list-ventas-vera.component.html',
  styleUrls: ['./list-ventas-vera.component.scss']
})
export class ListVentasVeraComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{ },
    limit: 100
  };
  Header:any = [ 'Acciones','Nombre','Numero','Ciudad','Barrio', 'Pais','Notificado Pedidos Web','Creado' ];
  $:any;
  public datoBusqueda = '';
  count:number = 0;
  dataUser:any = {};

  constructor(
    private _ventasSerices: VentasService,
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormVentasVeraComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._ventasSerices.delete(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }

  pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }


  cargarTodos() {
    this.query.where.nombre = { '!=' : ['.'] }
    this.query.where.user = this.dataUser.id;
    this._ventasSerices.getVentasL(this.query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.count = response.count || 0;
        this.dataTable = {
          headerRow: this.Header,
          footerRow: this.Header,
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows = response.data;
        this.paginas = Math.ceil(response.count/10);
        this.loader = false;
        setTimeout(() => {
          this.config();
          console.log("se cumplio el intervalo");
        }, 500);
      },
      error => {
        console.log('Error', error);
      });
  }
  config() {
    if(!this.$)return false;
    $('#datatables').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
      }

    });

    const table = $('#datatables').DataTable();

    /* // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }

      var data = table.row($tr).data();
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    }); */

    /* // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    }); */

    //Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
  buscar( opt:string = "none" ) {
    this.loader = true;
    this.dataTable.dataRows = [];
    this.query = {};
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{ },
      page: 0,
      limit: 100
    };
    if( opt === 'none' ){
      if (this.datoBusqueda != '') {
        this.query.where.or = [
          {
            nombre: {
              contains: this.datoBusqueda|| ''
            }
          },
          {
            ciudad: {
              contains: this.datoBusqueda|| ''
            }
          },
          {
            code: {
              contains: this.datoBusqueda|| ''
            }
          },
          {
            transportadora: {
              contains: this.datoBusqueda|| ''
            }
          }
        ];
        let validat:any = Number( this.datoBusqueda );
        if( validat >= 0 ) this.query.where.or.push( {
          numero: Number( this.datoBusqueda ) || Number(0)
        } );
      }
    }else{
      this.query.where.paisCreado = this.datoBusqueda;
      this.datoBusqueda = ""
    }
    this.cargarTodos();
  }

}
