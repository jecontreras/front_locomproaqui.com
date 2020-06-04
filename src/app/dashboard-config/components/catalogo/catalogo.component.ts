import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { CatalogoService } from 'src/app/servicesComponents/catalogo.service';
import { FormcatalogoComponent } from '../../form/formcatalogo/formcatalogo.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  
  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{},
    limit: 100
  };
  Header:any = [ 'Acciones','Titulo','Estado','creado' ];
  $:any;
  public datoBusqueda = '';

  constructor(
    private _catalago: CatalogoService,
    public dialog: MatDialog,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormcatalogoComponent,{
      height:  '561px',
      width: '100%',
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._catalago.delete(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }
  
  cargarTodos() {
    this._catalago.get(this.query)
    .subscribe(
      (response: any) => {
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
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query.where = {};
    if (this.datoBusqueda === '') {
      this.cargarTodos();
    } else {
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
      this.cargarTodos();
    }
  }

}
