import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/servicesComponents/categorias.service';
import { MatDialog } from '@angular/material';
import { FormcategoriasComponent } from '../../form/formcategorias/formcategorias.component';
import { error } from 'protractor';
import { ToolsService } from 'src/app/services/tools.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      cat_padre: null
    },
    limit: 100
  };
  Header:any = [ 'Acciones','Imagen','Categorias','Descripcion','Categoria Padre','Estado' ];
  $:any;
  public datoBusqueda = '';
  count:number = 0;

  constructor(
    private _categorias: CategoriasService,
    public dialog: MatDialog,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormcategoriasComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._categorias.delete(obj).subscribe((res:any)=>{
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
    this._categorias.getAll(this.query)
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
  buscar() {
    this.loader = true;
    this.dataTable.dataRows = [];
    this.query = {};
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        cat_padre: null
      },
      limit: 100
    };
    if (this.datoBusqueda != '') {
      this.query.where.or = [
        {
          cat_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          cat_descripcion: {
            contains: this.datoBusqueda|| ''
          }
        },
      ];
    }
    this.cargarTodos();
  }

}
