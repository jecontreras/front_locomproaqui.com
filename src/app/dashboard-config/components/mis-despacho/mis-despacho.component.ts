import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTable, STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-mis-despacho',
  templateUrl: './mis-despacho.component.html',
  styleUrls: ['./mis-despacho.component.scss']
})
export class MisDespachoComponent implements OnInit {

  dataTable: DataTable;
  pagina = 10;
  paginas = 0;
  loader = true;
  query:any = {
    where:{

    },
    page: 0,
    limit: 10
  };
  Header:any = [ 'Foto','Producto','Numero Guia', 'Logo', 'Cantidad', 'Precio Distribuidor', 'Talla', 'Color', 'Creado'];
  $:any;
  public datoBusqueda = '';
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  dataUser:any = {};
  rolName:string;

  constructor(
    public dialog: MatDialog,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private spinner: NgxSpinnerService,
    private _store: Store<STORAGES>
  ) { 
    this._store.subscribe( ( store: any ) => {
      store = store.name;
      if( !store ) return false;
      this.dataUser = store.user || {};
      try {
        this.rolName =  this.dataUser.usu_perfil.prf_descripcion;
      } catch (error) {}
    });
  }

  ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos();
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
    this._productos.getVenta( this.query )
    .subscribe(
      (response: any) => {
        console.log(response);
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
    this.dataTable.dataRows = [];
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    this.query = {
      where:{
        pro_activo: 0
      },
      limit: 10
    }
    if (this.datoBusqueda != '') {
      this.query.where.or = [
        {
          pro_nombre: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          pro_codigo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    if( this.rolName != 'administrador') this.query.where.creacion = this.dataUser.id;
    this.cargarTodos();
  }

}
