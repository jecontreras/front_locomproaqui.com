import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormusuariosComponent } from '../../form/formusuarios/formusuarios.component';
import * as _ from 'lodash';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const swal: any;
declare const $: any;


@Component({
  selector: 'app-provedores',
  templateUrl: './provedores.component.html',
  styleUrls: ['./provedores.component.scss']
})
export class ProvedoresComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{
      rolName: "proveedor",
      estado: 1
    },
    page: 0
  };
  Header:any = [ 'Acciones','Nombre','Perfil','E-mail','Telefonos','Fecha Registro','Activo' ];
  $:any;
  public datoBusqueda = '';

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  count:number = 0;

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _usuarios: UsuariosService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.cargarTodos();
  }

  crear(obj:any){
    const dialogRef = this.dialog.open(FormusuariosComponent,{
      data: {datos: obj || {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  delete(obj:any, idx:any){
    this._usuarios.delete(obj).subscribe((res:any)=>{
      this.dataTable.dataRows.splice(idx, 1);
      this._tools.presentToast("Eliminado")
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor") })
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
   }
  pageEvent(ev: any) {
    this.query.page = ev.pageIndex;
    this.query.limit = ev.pageSize;
    this.cargarTodos();
  }

  cargarTodos() {
    this.spinner.show();
    this._usuarios.get(this.query)
    .subscribe(
      (response: any) => {
        this.count = response.count || 0;
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows.push(... response.data);
        this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], response.data, 'id');
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
  buscar() {
    this.loader = false;
    this.notscrolly = true 
    this.notEmptyPost = true;
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.dataTable.dataRows = [];
    if (this.datoBusqueda === '') {
      this.query = { where:{ estado: 1,rolName: "proveedor", },page: 0 };
    } else {
      this.query.page = 0;
      if( this.datoBusqueda === '0' || this.datoBusqueda === '1'){
        this.query.where.estado = Number( this.datoBusqueda );
      }else{
        this.query.where.or = [
          {
            usu_nombre: {
              contains: this.datoBusqueda|| ''
            }
          },
          {
            usu_email: {
              contains: this.datoBusqueda|| ''
            }
          },
          {
            usu_apellido: {
              contains: this.datoBusqueda|| ''
            }
          },
          {
            usu_telefono: {
              contains: this.datoBusqueda|| ''
            }
          },
        ];
      }
    }
    this.query.where.rolName = "proveedor";
    this.cargarTodos();
  }

}
