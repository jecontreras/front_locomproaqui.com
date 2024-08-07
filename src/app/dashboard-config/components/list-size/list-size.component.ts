import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { TipoTallasService } from 'src/app/servicesComponents/tipo-tallas.service';
import { FormListSizeComponent } from '../../form/form-list-size/form-list-size.component';
import * as _ from 'lodash';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-list-size',
  templateUrl: './list-size.component.html',
  styleUrls: ['./list-size.component.scss']
})
export class ListSizeComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      tit_sw_activo: 1
    },
    limit: 10
  };
  Header:any = [ 'Acciones','Tipo de Talla','Estado','Creado' ];
  $:any;
  public datoBusqueda = '';
  counts:number = 0;
  constructor(
    private _tipoTalla: TipoTallasService,
    public dialog: MatDialog,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormListSizeComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  async delete(obj:any, idx:any){
    let alert:any = await  this._tools.confirm({title:"Importante", detalle:"Deseas! Eliminar esta talla", confir:"Si Acepto"});
    console.log("***", alert)
    if( alert.dismiss == "cancel" ) return false;
    obj.tit_sw_activo = 0;
    this._tipoTalla.update(obj).subscribe((res:any)=>{
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
    this._tipoTalla.get(this.query)
    .subscribe(
      (response: any) => {
        this.counts = response.count;
        console.log(response);
        this.dataTable = {
          headerRow: this.Header,
          footerRow: this.Header,
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data)
        this.dataTable.dataRows = _.unionBy(this.dataTable.dataRows || [], this.dataTable.dataRows, 'id');
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
  buscar() {
    this.loader = true;
    this.dataTable.dataRows = [];
    this.query = {};
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        tit_sw_activo: 1
      },
      limit: 10
    };
    if (this.datoBusqueda != '') {
      this.query.where.or = [
        {
          tit_descripcion: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    this.cargarTodos();
  }

}
